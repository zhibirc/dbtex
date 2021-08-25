// built-ins
import path from 'path';

// components
import { Table } from './table.js';

// interfaces
import { DbTex as IDbTex } from '../interfaces/dbtex.js';

// types
import { UserConfig, isConfig } from '../interfaces/types/user-config.js';
import { AppConfig } from '../interfaces/types/app-config';
import { Meta } from '../interfaces/types/meta.js';
import { ExitCode } from '../interfaces/types/exit-code';
import { Schema } from '../interfaces/types/schema';

// drivers
import { DriverCsv } from '../drivers/csv.js';
import { DriverTsv } from '../drivers/tsv.js';

// utilities
import { fs } from '../utilities/fs.js';
import { serialize, deserialize } from '../utilities/serialize.js';
import { convertToBytes } from '../utilities/unit-converters.js';
import { isFileStructureAccessable } from '../utilities/file-stat.js';
import { validateSchema } from '../utilities/schema-validator.js';
import { parseSchema } from '../utilities/schema-parser.js';
import { nop } from '../utilities/nop.js';
import { Encryptor } from '../utilities/encryptor.js';
import { Hasher } from '../utilities/hasher.js';
import { isObject, isDriver, isEncryptor, isHook } from '../utilities/is.js';

// errors
import { AccessError } from '../errors/access.js';
import { ConfigError } from '../errors/config.js';

// constants
import { EXIT_CODE_SUCCESS, EXIT_CODE_FAILURE } from '../constants/exit-codes.js';
import {
    META_INFO_FILE_NAME,
    DEFAULT_FILE_SIZE_LIMIT,
    FEATURE_TYPE_BOX,
    FEATURE_TYPE_CUSTOM
} from '../constants/meta.js';


const hasher = new Hasher();


export class DbTex implements IDbTex {
    readonly #config: AppConfig;
    public readonly location: string;

    constructor ( config: UserConfig ) {
        config = this.#sanitizeConfig(config);

        this.location = path.join(config.directory, config.name);

        // try to use existent database from persistent storage instead of creating new instance
        if ( isFileStructureAccessable({
            [this.location]: {
                [META_INFO_FILE_NAME]: null
            }
        }) ) {
            const meta: string = fs.read(path.join(this.location, META_INFO_FILE_NAME));

            // merge configs in case we want to update something, may be dangerous
            // @ts-ignore
            this.#config = {
                ...deserialize(meta) as Meta,
                directory: config.directory,
                name: config.name
            };

            // verify checksum to ensure it's make sense for further initialization
            if ( !this.#config.checksum || !hasher.verify(meta, this.#config.checksum) ) {
                throw new Error('Database metadata is corrupt.');
            }

            this.#init(true, config);
        } else {
            // @ts-ignore
            this.#config = {
                ...config,
                creationDate: Date.now(),
                lastUpdate: Date.now(),
                // TODO: implement
                checksum: null,
                tables: []
            };
            this.#init(false, config);
        }
    }

    #init ( exist: boolean, userConfig: UserConfig ): void | never {
        const prepareToSerialize = (): Meta => {
            const driver = this.#config.driver;

            return {
                directory: this.#config.directory,
                name: this.#config.name,
                prefix: this.#config.prefix as string,
                fileSizeLimit: this.#config.fileSizeLimit as number,
                encrypt: this.#config.encrypt,
                encryptor: this.#config.encryptor instanceof Encryptor ? FEATURE_TYPE_BOX : FEATURE_TYPE_CUSTOM,
                driver: driver instanceof DriverCsv || driver instanceof DriverTsv
                    ? Object.getPrototypeOf(driver).constructor.name
                    : FEATURE_TYPE_CUSTOM,
                beforeInsert: this.#config.beforeInsert.toString(),
                afterInsert:  this.#config.afterInsert.toString(),
                beforeSelect: this.#config.beforeSelect.toString(),
                afterSelect:  this.#config.afterSelect.toString(),
                beforeUpdate: this.#config.beforeUpdate.toString(),
                afterUpdate:  this.#config.afterUpdate.toString(),
                beforeDelete: this.#config.beforeDelete.toString(),
                afterDelete:  this.#config.afterDelete.toString(),
                creationDate: this.#config.creationDate,
                lastUpdate: this.#config.lastUpdate,
                checksum: this.#config.checksum,
                tables: this.#config.tables,
                log: this.#config.log,
                report: this.#config.report
            };
        };

        if ( exist ) {
            const {
                driver,
                encrypt,
                encryptor
            } = this.#config as unknown as Meta;

            const throwConfigError = (value: unknown) => {
                throw new ConfigError(value);
            };

            // if meta config says that databases uses custom driver,
            // then user should specify an appropriate API object for this in config
            if ( driver === FEATURE_TYPE_CUSTOM ) {
                isDriver(userConfig.driver)
                    // @ts-ignore
                    ? (this.#config.driver = new userConfig.driver())
                    : throwConfigError(userConfig);
            } else {
                this.#config.driver = driver === DriverCsv.name
                    ? new DriverCsv()
                    : driver === DriverTsv.name
                        ? new DriverTsv()
                        : throwConfigError({driver});
            }

            'log' in userConfig && (this.#config.log = userConfig.log === true);
            'report' in userConfig && (this.#config.report = userConfig.report === true);
            'encrypt' in userConfig && (this.#config.encrypt = userConfig.encrypt === true);

            const isUserEncryptor = isEncryptor(userConfig.encryptor);

            if ( encrypt ) {
                if ( encryptor === FEATURE_TYPE_BOX ) {
                    this.#config.encryptor = new Encryptor();
                } else if ( encryptor === FEATURE_TYPE_CUSTOM ) {
                    isUserEncryptor
                        // @ts-ignore
                        ? (this.#config.encryptor = new userConfig.encryptor())
                        : throwConfigError(userConfig);
                }
            } else { // in this case we can change encryptor engine
                // @ts-ignore
                isUserEncryptor && (this.#config.encryptor = new userConfig.encryptor());
            }

            [
                'beforeInsert',
                'afterInsert',
                'beforeSelect',
                'afterSelect',
                'beforeUpdate',
                'afterUpdate',
                'beforeDelete',
                'afterDelete'
            ].forEach(name => (this.#config[name] = isHook(userConfig[name]) ? userConfig[name] : eval(this.#config[name])));
        } else {
            this.#config.fileSizeLimit = convertToBytes(this.#config.fileSizeLimit || DEFAULT_FILE_SIZE_LIMIT);
            this.#config.driver ??= new DriverCsv();
            this.#config.encrypt = userConfig.encrypt === true;
            this.#config.encryptor ??= new Encryptor();
            this.#config.beforeInsert ??= nop;
            this.#config.afterInsert ??= nop;
            this.#config.beforeSelect ??= nop;
            this.#config.afterSelect ??= nop;
            this.#config.beforeUpdate ??= nop;
            this.#config.afterUpdate ??= nop;
            this.#config.beforeDelete ??= nop;
            this.#config.afterDelete ??= nop;
            this.#config.log = userConfig.log === true;
            this.#config.report = userConfig.report === true;

            try {
                fs
                    .make(this.location, fs.types.DIRECTORY)
                    .save(
                        path.join(this.location, META_INFO_FILE_NAME),
                        serialize(prepareToSerialize())
                    );
            } catch {
                throw new AccessError(this.location);
            }
        }
    }

    /**
     * User/external configuration sanitizer.
     *
     * 1) Check if config is something appropriate to use as a database configuration.
     * It must be an object and has two valid key properties: "directory" and "name".
     * Throw ConfigError if config is not "minimal-suitable".
     * @see {@link isConfig} for further information.
     *
     * 2) Normalize "directory" and "name" property values for further usage.
     *
     * 3) Assign an exhaustive property list to result object with their initial values (including undefined).
     * Thus filter any other possible properties which are non-compliant with Config public interface.
     *
     * @param {UserConfig} config - given user configuration "as is"
     * @private
     *
     * @return {UserConfig} configuration prepared for further initialization
     */
    #sanitizeConfig ( config: UserConfig ): UserConfig | never {
        if ( isConfig(config) ) {
            return {
                directory:     path.normalize(config.directory.trim()),
                name:          config.name.trim(),
                prefix:        typeof config.prefix === 'string' ? config.prefix.trim() : '',
                encrypt:       config.encrypt,
                encryptor:     config.encryptor,
                driver:        config.driver,
                beforeInsert:  config.beforeInsert,
                afterInsert:   config.afterInsert,
                beforeSelect:  config.beforeSelect,
                afterSelect:   config.afterSelect,
                beforeUpdate:  config.beforeUpdate,
                afterUpdate:   config.afterUpdate,
                beforeDelete:  config.beforeDelete,
                afterDelete:   config.afterDelete,
                fileSizeLimit: config.fileSizeLimit,
                log:           config.log,
                report:        config.report
            };
        }

        throw new ConfigError(config);
    }

    static types = {
        /** Numeric values including integers and floats. */
        NUMBER:  Symbol('NUMBER'),
        /** String values of any length. */
        TEXT:    Symbol('TEXT'),
        /** Boolean values either true, false or unknown (represented by the null value). */
        BOOLEAN: Symbol('BOOLEAN'),
        /** Non-primitive object-like values which can be serialized. */
        STRUCT:  Symbol('STRUCT'),
        /** Binary string values. */
        BINARY:  Symbol('BINARY'),
        /**
         * Store the Universally Unique Identifiers (UUID).
         * If payload for this field is omitted then new random UUID is generated.
         * In this case it's possible to retrieve it by using hooks.
         */
        UUID: Symbol('UUID')
    };

    audit (): ExitCode {
        // stub
        return EXIT_CODE_SUCCESS;
    }

    getStats (): {[key: string]: string | number | any[]} {
        return {
            name: this.#config.name,
            location: this.location,
            tables: this.#config.tables.map(table => ({
                name: table.name,
                creationDate: table.creationDate,
                lastUpdate: table.lastUpdate,
                filesNumber: table.filesNumber
            }))
        };
    }

    // TODO: fix callback type
    setHook ( name: string, callback: () => unknown ): ExitCode {
        if ( typeof name === 'string' && name.trim() && typeof callback === 'function' ) {
            return EXIT_CODE_SUCCESS;
        }

        return EXIT_CODE_FAILURE;
    }

    createTable ( name: string, schema?: Schema ): Table | never {
        name = this.#config.prefix + name.trim();

        if ( this.#config.tables.find(table => table.name === name ) ) {
            throw new ReferenceError(`Nothing to create -- table name "${name}" is already exists.`);
        }

        let columnTitleData: string | string[] = '';

        if ( schema != null ) {
            if ( isObject(schema) && validateSchema(schema) ) {
                columnTitleData = parseSchema(schema);
            } else {
                throw new SyntaxError('Given schema is incorrect.');
            }
        }

        try {
            const tablePath: string = path.join(this.location, name);
            const columnTitleRow: string = this.#config.driver!.write(columnTitleData);
            const table: Table = new Table(name, schema || null, columnTitleRow, tablePath);

            fs
                .make(tablePath, fs.types.DIRECTORY)
                .save(path.join(tablePath, `${table.filesNumber}_${Date.now()}.txt`), columnTitleRow);

            this.#config.tables.push(table as Table);

            // TODO: save table data to meta info

            return table;
        } catch ( error ) {
            throw new AccessError(path.join(this.location, name));
        }
    }

    dropTable ( name: string ): ExitCode | never {
        name = name.trim();

        if ( !this.#config.tables.find(table => table.name === name ) ) {
            throw new ReferenceError(`Nothing to drop -- table name "${name}" not found.`);
        }

        const tablePath = path.join(this.location, name);

        try {
            // all or nothing, emulate transaction approach
            fs.delete(tablePath);
            this.#config.tables = this.#config.tables.filter(table => table.name !== name);
            fs.save(path.join(this.location, META_INFO_FILE_NAME), serialize(this.#config));

            return EXIT_CODE_SUCCESS;
        } catch ( error ) {
            throw new AccessError(tablePath);
        }
    }

    shutdown(): ExitCode {
        // stub
        return EXIT_CODE_SUCCESS;
    }
}
