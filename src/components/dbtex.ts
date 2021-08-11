// built-ins
import path from 'path';

// components
import { Table } from './table.js';

// interfaces
import { DbTex as IDbTex } from '../interfaces/dbtex.js';
import { Config, isConfig } from '../interfaces/types/config.js';
import { Meta } from '../interfaces/types/meta.js';

// types
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
import { isObject } from '../utilities/isObject';

// errors
import { AccessError } from '../errors/access.js';

// constants
import { EXIT_CODE_SUCCESS, EXIT_CODE_FAILURE } from '../constants/exit-codes.js';
import {
    META_INFO_FILE_NAME,
    DEFAULT_FILE_SIZE_LIMIT,
    FEATURE_TYPE_BOX,
    FEATURE_TYPE_CUSTOM
} from '../constants/meta.js';


export class DbTex implements IDbTex {
    readonly #config: Meta;
    public readonly location: string;

    constructor ( config: Config ) {
        config = this.#sanitizeConfig(config);

        this.location = path.join(config.directory, config.name);

        // try to use existent database from persistent storage instead of creating new instance
        if ( isFileStructureAccessable({
            [this.location]: {
                [META_INFO_FILE_NAME]: null
            }
        }) ) {
            const meta: string = fs.read(path.join(this.location, META_INFO_FILE_NAME));

            this.#config = deserialize(meta) as Meta;
            this.#init(true);
        } else {
            this.#config = {
                ...config,
                creationDate: Date.now(),
                lastUpdate: Date.now(),
                tables: []
            };
            this.#init(false);
        }
    }

    #init ( exist: boolean ): void | never {
        const {
            directory,
            name,
            prefix,
            fileSizeLimit,
            encrypt,
            encryptor,
            driver,
            beforeInsert,
            afterInsert,
            beforeSelect,
            afterSelect,
            beforeUpdate,
            afterUpdate,
            beforeDelete,
            afterDelete,
            tables
        } = this.#config;

        if ( exist ) {
            // TODO: this case is when configuration exists and we need to parse some fields only
        } else {
            if ( isFileStructureAccessable(directory) ) {
                try {
                    fs.make(this.location, fs.types.DIRECTORY);
                    fs.save(
                        path.join(this.location, META_INFO_FILE_NAME),
                        serialize({
                            directory,
                            name,
                            prefix,
                            fileSizeLimit: convertToBytes(fileSizeLimit || DEFAULT_FILE_SIZE_LIMIT),
                            encrypt,
                            encryptor: encryptor instanceof Encryptor ? FEATURE_TYPE_BOX : FEATURE_TYPE_CUSTOM,
                            // @ts-ignore
                            driver: driver instanceof DriverCsv || driver instanceof DriverTsv ? driver.prototype.constructor.name : FEATURE_TYPE_CUSTOM,
                            beforeInsert: beforeInsert!.toString(),
                            afterInsert:  afterInsert!.toString(),
                            beforeSelect: beforeSelect!.toString(),
                            afterSelect:  afterSelect!.toString(),
                            beforeUpdate: beforeUpdate!.toString(),
                            afterUpdate:  afterUpdate!.toString(),
                            beforeDelete: beforeDelete!.toString(),
                            afterDelete:  afterDelete!.toString(),
                            tables
                        })
                    );
                } catch ( error ) {
                    throw new Error(error.message);
                }
            } else {
                throw new AccessError(directory);
            }
        }
    }

    #sanitizeConfig ( config: Config ): Config {
        if ( isConfig(config) ) {
            const {
                directory,
                name,
                prefix,
                fileSizeLimit = DEFAULT_FILE_SIZE_LIMIT,
                encrypt,
                encryptor = new Encryptor(),
                driver = new DriverCsv(),
                beforeInsert = nop,
                afterInsert  = nop,
                beforeSelect = nop,
                afterSelect  = nop,
                beforeUpdate = nop,
                afterUpdate  = nop,
                beforeDelete = nop,
                afterDelete  = nop
            } = config;

            return {
                directory: path.normalize(directory.trim()),
                name: name.trim(),
                prefix: typeof prefix === 'string' ? prefix.trim() : '',
                fileSizeLimit,
                encrypt: encrypt === true,
                // type guards for encryptor and driver are not so strict, keep it in mind
                encryptor,
                driver,
                beforeInsert,
                afterInsert,
                beforeSelect,
                afterSelect,
                beforeUpdate,
                afterUpdate,
                beforeDelete,
                afterDelete
            };
        }

        return config;
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
            fs.save(path.join(tablePath, META_INFO_FILE_NAME), serialize(this.#config));

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
