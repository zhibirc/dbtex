// built-ins
import path from 'path';
import fs from 'fs';

// components
import { Table } from './table.js';

// interfaces
import { DbTex as DbTexInterface } from '../interfaces/dbtex.js';
import { Config, isConfig } from '../interfaces/config.js';
import { Meta } from '../interfaces/meta.js';

// drivers
import { DriverCsv } from '../drivers/csv.js';
import { DriverTsv } from '../drivers/tsv.js';

// utilities
import { save } from '../utilities/save.js';
import { log } from '../utilities/log.js';
import { serialize, deserialize } from '../utilities/serialize.js';
import { convertToBytes } from '../utilities/unit-converters.js';
import { isFileStructureAccessable } from '../utilities/file-stat.js';
import { validateSchema } from '../utilities/schema-validator.js';
import { nop } from '../utilities/nop.js';
import { Encryptor } from '../utilities/encryptor.js';

// errors
import { AccessError } from '../errors/access.js';

// constants
import { ExitCode, EXIT_CODE_SUCCESS, EXIT_CODE_FAILURE } from '../constants/exit-codes.js';
import DataType from '../constants/data-types.js';
import {
    META_INFO_FILE_NAME,
    DEFAULT_FILE_SIZE_LIMIT,
    FEATURE_TYPE_BOX,
    FEATURE_TYPE_CUSTOM
} from '../constants/meta.js';


export class DbTex implements DbTexInterface {
    private readonly _config: Meta;
    public readonly location: string;

    constructor ( config: Config ) {
        config = this._sanitizeConfig(config);

        this.location = path.join(config.directory, config.name);

        // try to use existent database from persistent storage instead of creating new instance
        if ( isFileStructureAccessable({
            [this.location]: {
                [META_INFO_FILE_NAME]: null
            }
        }) ) {
            const meta: string = fs.readFileSync(path.join(this.location, META_INFO_FILE_NAME), 'utf8');

            this._config = deserialize(meta) as Meta;
            this._init(true);
        } else {
            this._config = {
                ...config,
                creationDate: Date.now(),
                lastUpdate: Date.now(),
                tables: []
            };
            this._init(false);
        }
    }

    private _init ( exist: boolean ): void | never {
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
        } = this._config;

        if ( exist ) {
            // TODO: this case is when configuration exists and we need to parse some fields only
        } else {
            if ( isFileStructureAccessable(directory) ) {
                try {
                    fs.mkdirSync(this.location);
                    fs.writeFileSync(
                        path.join(this.location, META_INFO_FILE_NAME),
                        serialize({
                            directory,
                            name,
                            prefix,
                            fileSizeLimit: convertToBytes(fileSizeLimit || DEFAULT_FILE_SIZE_LIMIT),
                            encrypt,
                            encryptor: encryptor instanceof Encryptor ? FEATURE_TYPE_BOX : FEATURE_TYPE_CUSTOM,
                            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
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

    private _sanitizeConfig ( config: Config ): Config {
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

    static audit ( config: Meta ): ExitCode {
        log('audit proceed');
        log(config);

        return EXIT_CODE_SUCCESS;
    }

    getStats () {
        // TODO: implement
        return {
            name: this._config.name
        };
    }

    setHook ( name: string, callback ): ExitCode {
        if ( typeof name === 'string' && name.trim() && typeof callback === 'function' ) {
            return EXIT_CODE_SUCCESS;
        }

        return EXIT_CODE_FAILURE;
    }

    createTable ( name: string, schema: {[key: string]: DataType} ): Table | never {
        name = this._config.prefix + name.trim();

        if ( this._config.tables.find(table => table.name === name ) ) {
            throw new ReferenceError(`Nothing to create -- table name "${name}" is already exists.`);
        }

        const columnTitleDataList: string[] = [];

        if ( schema ) {
            if ( validateSchema(schema) ) {
                try {
                    const tablePath: string = path.join(this.location, name);
                    const table: Table = new Table(name, schema);

                    fs.mkdirSync(tablePath);
                    fs.writeFileSync(
                        path.join(tablePath, `${table.filesNumber}_${Date.now()}.txt`),
                        // TODO: fix driver initialization and storing in meta-data (via constructor name)
                        this._config.driver.write(schema)
                    );
                    // @ts-ignore
                    this._config.tables = this._config.tables.concat(table);

                    return table;
                } catch ( error ) {
                    throw new AccessError(path.join(this.location, name));
                }
            } else {
                throw new SyntaxError('Given schema is incorrect.');
            }
        }



    }

    dropTable ( name: string ): ExitCode | never {
        name = name.trim();

        if ( !this._config.tables.find(table => table.name === name ) ) {
            throw new ReferenceError(`Nothing to drop -- table name "${name}" not found.`);
        }

        const tablePath = path.join(this.location, name);

        try {
            // all or nothing, emulate transaction approach
            fs.unlinkSync(tablePath);
            this._config.tables = this._config.tables.filter(table => table.name !== name);
            save(this._config, path.join(tablePath, META_INFO_FILE_NAME));

            return EXIT_CODE_SUCCESS;
        } catch ( error ) {
            throw new AccessError(tablePath);
        }
    }
}
