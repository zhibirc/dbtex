// built-ins
import path from 'path';
import fs from 'fs';

// components
import { Table } from './components/table.js';

// interfaces
import { Config } from './interfaces/config';
import { Meta } from './interfaces/meta';

// utilities
import { save } from './utilities/save.js';
import { log } from './utilities/log.js';
import { serialize, deserialize } from './utilities/serialize.js';
import { convertToBytes } from './utilities/unit-converters.js';
import { isFileStructureAccessable } from './utilities/file-stat.js';
import { validateSchema } from './utilities/schema-validator.js';

// errors
import { AccessError } from './errors/access.js';

// constants
import { EXIT_CODE_SUCCESS } from './constants/exit-codes.js';
import { META_INFO_FILE_NAME, DEFAULT_FILE_SIZE_LIMIT } from './constants/meta.js';


export class DbTex {
    private readonly _dbPath: string;
    private readonly _config: Meta;

    constructor ( config: Config ) {
        this._dbPath = path.join(config.directory, config.name);

        // try to use existent database from persistent storage instead of creating new instance
        if ( isFileStructureAccessable({
            [this._dbPath]: {
                [META_INFO_FILE_NAME]: null
            }
        }) ) {
            const meta: string = fs.readFileSync(path.join(this._dbPath, META_INFO_FILE_NAME), 'utf8');

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

    private _init ( exist: boolean ) {
        const { directory, name, fileSizeLimit = DEFAULT_FILE_SIZE_LIMIT, encrypt, tables } = this._config;


        if ( exist ) {

        } else {
            if ( isFileStructureAccessable(directory) ) {
                try {
                    fs.mkdirSync(this._dbPath);
                    fs.writeFileSync(
                        path.join(this._dbPath, META_INFO_FILE_NAME),
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

    /**
     * Check meta information file for validity.
     */
    static audit ( config: Meta ): number {
        log('audit proceed');
        log(config);

        return EXIT_CODE_SUCCESS;
    }

    createTable ( name: string, schema: object ) {
        name = name.trim();

        if ( this._config.tables.find(table => table.name === name ) ) {
            throw new ReferenceError(`Nothing to create -- table name "${name}" is already exists.`);
        }

        if ( validateSchema(schema) ) {
            try {
                // TODO: create table file with specific structure and report success
                // ...

                // @ts-ignore
                this._config.tables = this._config.tables.concat(new Table(name, schema));
            } catch ( error ) {
                throw new AccessError(path.join(this._dbPath, name));
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

        const tablePath = path.join(this._dbPath, name);

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
