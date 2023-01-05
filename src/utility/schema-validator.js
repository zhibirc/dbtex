// components
import { DbTex } from '../component/core/dbtex/dbtex.ts';

// types
import { Schema } from '../interfaces/types/schema.js';
import { ExitCode } from '../interfaces/types/exit-code.js';

// constants
import { EXIT_CODE_SUCCESS, EXIT_CODE_FAILURE } from '../constant/exit-codes.js';


export function validateSchema ( schema: Schema ): ExitCode {
    for ( const [attribute, value] of Object.entries(schema) ) {
        if ( attribute.trim().length === 0 || !Object.values(DbTex.types).includes((value as unknown) as symbol) ) {
            return EXIT_CODE_FAILURE;
        }
    }

    return EXIT_CODE_SUCCESS;
}
