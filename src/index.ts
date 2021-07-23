import path from 'path';
import fs from 'fs';
import { Config } from './interfaces/config';
import { Meta } from './interfaces/meta';
import { save } from './utilities/save';
import { log } from './utilities/log';
import { serialize, deserialize } from './utilities/serialize';
import { convertToBytes } from './utilities/unit-converters';
import { AccessError } from './errors/access';
import { EXIT_CODE_SUCCESS } from './constants/exit-codes';
import { META_INFO_FILE_NAME, DEFAULT_FILE_SIZE_LIMIT } from './constants/meta';
import { isFileStructureAccessable } from './utilities/file-stat';


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

            this._init(this._config = deserialize(meta) as Meta, true);
        } else {
            this._init(this._config = {...config, tables: []}, false);
        }
    }

    private _init ( config: Meta, exist: boolean ) {
        const { directory, name, fileSizeLimit = DEFAULT_FILE_SIZE_LIMIT, encrypt, tables } = config;

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
                throw new AccessError(config.directory);
            }
        }
    }

    /**
     * Check meta information file for validity.
     */
    static audit ( config: Meta ): number {
        log(config);

        return EXIT_CODE_SUCCESS;
    }

    createTable ( name: string ) {
        log('create table: ' + name);
    }

    dropTable ( name: string ) {
        const tablePath = path.join(this._dbPath, name);

        try {
            fs.unlinkSync(tablePath);
        } catch ( error ) {
            throw new AccessError(tablePath);
        }

        this._config.tables = this._config.tables.filter(table => table.name !== name);
        save(this._config, path.join(tablePath, META_INFO_FILE_NAME));
    }
}
