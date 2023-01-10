// components
import { DbTex } from '../components/dbtex/dbtex';

// types
import { Schema } from '../interfaces/types/schema.js';
import { ExitCode } from '../interfaces/types/exit-code.js';

// constants
import { EXIT_CODE_SUCCESS, EXIT_CODE_FAILURE } from '../constants/exit-codes';


export function validateSchema ( schema: Schema ): ExitCode {
    for ( const [attribute, value] of Object.entries(schema) ) {
        if ( attribute.trim().length === 0 || !Object.values(DbTex.types).includes((value as unknown) as symbol) ) {
            return EXIT_CODE_FAILURE;
        }
    }

    return EXIT_CODE_SUCCESS;
}
