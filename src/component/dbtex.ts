// built-ins
import path from 'path';

// components
import { Table } from './table';

// drivers
import { DriverCsv } from '../driver/csv.js';
import { DriverTsv } from '../driver/tsv.js';

// utilities
import { fs } from '../utility/fs.js';
import { serialize, deserialize } from '../utility/serialize.js';
import { convertToBytes } from '../utility/unit-converters.js';
import { isFileStructureAccessable } from '../utility/file-stat.js';
import { validateSchema } from '../utility/schema-validator.js';
import { parseSchema } from '../utility/schema-parser.js';
import { nop } from '../utility/nop.js';
import { Encryptor } from '../utility/encryptor.js';
import { Hasher } from '../utility/hasher.js';
import { isObject, isDriver, isEncryptor, isHook } from '../utility/is.js';

// errors
import { AccessError } from '../error/access.js';
import { ConfigError } from '../error/config.js';

// constants
import { EXIT_CODE_SUCCESS, EXIT_CODE_FAILURE } from '../constant/exit-codes.js';
import {
    META_INFO_FILE_NAME,
    DEFAULT_FILE_SIZE_LIMIT,
    FEATURE_TYPE_BOX,
    FEATURE_TYPE_CUSTOM
} from '../constant/meta.js';


const hasher = new Hasher();


export class DbTex {
    // main application config
    #config;
    // mapping of table proxy instances to corresponding revoke functions
    #revokes;

    #sanitizeConfig(config) {
        return undefined;
    }

    constructor ( config ) {
        config = this.#sanitizeConfig(config);

        // database location in a file system
        this.location = path.join(config.directory, config.name);
        this.#revokes = new WeakMap();

        // try to use existent database from persistent storage instead of creating new instance
        if ( isFileStructureAccessable({
            [this.location]: {
                [META_INFO_FILE_NAME]: null
            }
        }) ) {
            const meta = deserialize(fs.read(path.join(this.location, META_INFO_FILE_NAME)));
            const hash = meta.checksum;

            delete meta.checksum;

            // merge configs in case we want to update something, may be dangerous
            // @ts-ignore
            this.#config = {
                ...meta,
                directory: config.directory,
                name: config.name
            };

            // verify checksum to ensure it's make sense for further initialization
            if ( !hash || !hasher.verify(serialize(meta), hash) ) {
                throw new Error('Database metadata is corrupt.');
            }

            this.#init(true, config);
        } else {
            // @ts-ignore
            this.#config = {
                ...config,
                creationDate: Date.now(),
                lastUpdate: Date.now(),
                tables: []
            };
            this.#init(false, config);
        }
    }

    /**
     * Parse given config, analyze, merge with existing if any, and initialize inner structures.
     * @private
     */
    #init ( exist, userConfig ) {
        if ( exist ) {
            const {
                driver,
                encrypt,
                encryptor
            } = this.#config;

            const throwConfigError = value => {
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

            // re-save configuration as meta data
            this.#save();
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
                fs.make(this.location, fs.types.DIRECTORY);
                this.#save();
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
    #sanitizeConfig ( config) {
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

    /**
     * Save database configuration and state to meta file with checksum.
     * @private
     */
    #save () {
        const driver = this.#config.driver;
        const meta: Meta = {
            directory: this.#config.directory,
            name: this.#config.name,
            prefix: <string>this.#config.prefix,
            fileSizeLimit: <number>this.#config.fileSizeLimit,
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
            tables: this.#config.tables,
            log: this.#config.log,
            report: this.#config.report
        };

        meta.checksum = hasher.hash(serialize(meta));

        try {
            fs.save(
                path.join(this.location, META_INFO_FILE_NAME),
                serialize(meta)
            );

            return EXIT_CODE_SUCCESS;
        } catch ( exception ) {
            return EXIT_CODE_FAILURE;
        }
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
            // TODO: implement traps, also think to use revocable proxy for table drop
            const _table = new Proxy(table, {
                // implement
            });
            const { proxy, revoke } = Proxy.revocable(_table, {});
            this.#revokes.set(proxy, revoke);

            fs
                .make(tablePath, fs.types.DIRECTORY)
                .save(path.join(tablePath, `${table.filesNumber}_${Date.now()}.txt`), columnTitleRow);

            this.#config.tables.push(<Table>proxy);

            // TODO: save table data to meta info

            return proxy;
        } catch ( error ) {
            throw new AccessError(path.join(this.location, name));
        }
    }

    dropTable ( table: Table | string ): ExitCode | never {
        const name = typeof table === 'string' ? table.trim() : table?.name.trim();
        const _table = typeof table === 'string'
            ? this.#config.tables.find(item => item.name === name)
            : this.#config.tables.find(item => item === table);

        if ( !_table ) {
            throw new ReferenceError(`Nothing to drop -- table name "${name}" not found.`);
        }

        const tablePath = path.join(this.location, name);

        try {
            // all or nothing, emulate transaction approach
            fs.delete(tablePath);
            this.#config.tables = this.#config.tables.filter(item => item !== _table);
            // @ts-ignore
            this.#revokes.get(<Table>_table)();
            this.#save();

            return EXIT_CODE_SUCCESS;
        } catch ( error ) {
            throw new AccessError(tablePath);
        }
    }

    shutdown(): ExitCode {
        return this.#save();
    }
}
