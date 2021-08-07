// built-ins
import path from 'path';
import fs from 'fs';

// components
import { Table } from './table.js';

// interfaces
import { DbTex as DbTexInterface } from '../interfaces/dbtex';
import { Config } from '../interfaces/config';
import { Meta } from '../interfaces/meta';

// drivers
import { DriverCsv } from '../drivers/csv.js';

// utilities
import { save } from '../utilities/save.js';
import { log } from '../utilities/log.js';
import { serialize, deserialize } from '../utilities/serialize.js';
import { convertToBytes } from '../utilities/unit-converters.js';
import { isFileStructureAccessable } from '../utilities/file-stat.js';
import { validateSchema } from '../utilities/schema-validator.js';

// errors
import { AccessError } from '../errors/access.js';

// constants
import { EXIT_CODE_SUCCESS } from '../constants/exit-codes.js';
import { META_INFO_FILE_NAME, DEFAULT_FILE_SIZE_LIMIT } from '../constants/meta.js';


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
                driver: config.driver || new DriverCsv(),
                tables: []
            };
            this._init(false);
        }
    }

    private _init ( exist: boolean ) {
        const { directory, name, fileSizeLimit = DEFAULT_FILE_SIZE_LIMIT, encrypt, tables } = this._config;


        if ( exist ) {

        } else {
            if ( isFileStructureAccessable(directory) ) {
                try {
                    fs.mkdirSync(this.location);
                    fs.writeFileSync(
                        path.join(this.location, META_INFO_FILE_NAME),
                        serialize({
                            directory,
                            name,
                            fileSizeLimit: convertToBytes(fileSizeLimit),
                            encrypt,
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
        /* TODO
         * - trim all string values
         * - normalize paths
         * - check all values are of expected types
         * - throw error if some from above is impossible
         */
        return config;
    }

    /** Check meta information file for validity. */
    static audit ( config: Meta ): number {
        log('audit proceed');
        log(config);

        return EXIT_CODE_SUCCESS;
    }

    /** Get statistics about database: general metrics, tables, paths, disk utilization, etc. */
    getStats () {
        // TODO: implement
        return {
            name: this._config.name
        };
    }

    createTable ( name: string, schema: object ): Table | never {
        name = this._config.prefix + name.trim();

        if ( this._config.tables.find(table => table.name === name ) ) {
            throw new ReferenceError(`Nothing to create -- table name "${name}" is already exists.`);
        }

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

    dropTable ( name: string ) {
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
