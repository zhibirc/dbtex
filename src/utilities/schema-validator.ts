// components
import { DbTex } from '../components/dbtex';

// types
import { Schema } from '../interfaces/types/schema';
import { ExitCode } from '../interfaces/types/exit-code';

// constants
import { EXIT_CODE_SUCCESS, EXIT_CODE_FAILURE } from '../constants/exit-codes.js';


export function validateSchema ( schema: Schema ): ExitCode {
    for ( const [attribute, value] of Object.entries(schema) ) {
        if ( attribute.trim().length === 0 || !Object.values(DbTex.types).includes((value as unknown) as symbol) ) {
            return EXIT_CODE_FAILURE;
        }
    }

    return EXIT_CODE_SUCCESS;
}
