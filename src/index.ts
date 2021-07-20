import { Config } from './interfaces/config';
import { EXIT_CODE_SUCCESS, EXIT_CODE_FAILURE } from './constants/exit-codes';
import { META_DB_PREFIX } from './constants/meta';
import { isFileStructureAccessable } from './utilities/file-stat';


export class DbTex {
    private config: Config;
    private tables: string[];

    constructor ( config: Config ) {
        this.config = config;
    }

    /**
     * Use existent database from persistent storage instead of creating new instance.
     * Engine should validate given database firstly and exit with appropriate status.
     */
    static use ( name: string ): number {
        if ( /*
            1) directory of given database is exists.
            2) directory of given database contains meta information file.
            3) if success initialize inner structures with database info.
        */ ) {
            return EXIT_CODE_SUCCESS;
        }

        return EXIT_CODE_FAILURE;
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
        this.tables = this.tables.filter(table => table !== name);
    }
}
