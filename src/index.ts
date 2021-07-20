import path from 'path';
import fs from 'fs';
import { Config } from './interfaces/config';
import { EXIT_CODE_SUCCESS, EXIT_CODE_FAILURE } from './constants/exit-codes';
import { META_INFO_FILE_NAME } from './constants/meta';
import { isFileStructureAccessable } from './utilities/file-stat';


export class DbTex {
    private _config: Config;
    private _tables: string[];

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

            this._init(JSON.parse(meta));
        } else {
            this._init(config);
        }
    }

    private _init ( metaInfo: object ) {
        this._tables.concat(metaInfo.tables || []);
    }

    static audit ( metaInfo ) {

    }

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
        this._tables = this._tables.filter(table => table !== name);
    }
}
