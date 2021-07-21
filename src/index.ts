import path from 'path';
import fs from 'fs';
import { Config } from './interfaces/config';
import { Meta } from './interfaces/meta';
import { Table } from './interfaces/table';
import { serialize, deserialize } from './utilities/serialize';
import { convertToBytes } from './utilities/unit-converters';
import { AccessError } from './errors/access';
import { META_INFO_FILE_NAME, DEFAULT_FILE_SIZE_LIMIT } from './constants/meta';
import { isFileStructureAccessable } from './utilities/file-stat';


export class DbTex {
    private _config: Config;
    private _tables: Table[];

    constructor ( config: Config ) {
        this._config = config;

        const fullPath = path.join(config.directory, config.name);

        // try to use existent database from persistent storage instead of creating new instance
        if ( isFileStructureAccessable({
            [fullPath]: {
                [META_INFO_FILE_NAME]: null
            }
        }) ) {
            const meta: string = fs.readFileSync(path.join(fullPath, META_INFO_FILE_NAME), 'utf8');

            this._init(deserialize(meta) as Meta, true);
        } else {
            this._init(config, false);
        }
    }

    private _init ( config: Meta | Config, exist: boolean ) {
        const { directory, name, fileSizeLimit = DEFAULT_FILE_SIZE_LIMIT, encrypt, tables } = config;
        if ( exist ) {
            // @ts-ignore
            this._tables.concat(tables || []);
        } else {
            if ( isFileStructureAccessable(directory) ) {
                try {
                    fs.mkdirSync(path.join(directory, name));
                    fs.writeFileSync(
                        path.join(directory, name, META_INFO_FILE_NAME),
                        serialize({
                            directory,
                            name,
                            fileSizeLimit: convertToBytes(fileSizeLimit),
                            encrypt,
                            tables: []
                        })
                    );
                } catch ( error ) {

                }
            } else {
                throw new AccessError(config.directory);
            }
        }
    }

    /**
     * Check meta information file for validity.
     */
    static audit ( config: Meta ) {}

    createTable ( name: string ) {}

    dropTable ( name: string ) {
        /*
            There are 3 steps here:

            1) Delete corresponding file/files (depending on if there is one file or not).
            2) Remove entry from meta-information about database.
            3) Remove entry from 'tables' private field.
        */
        // 1

        // 2

        // 3
        this._tables = this._tables.filter(table => table.name !== name);
    }
}
