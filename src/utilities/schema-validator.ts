// constants
import { EXIT_CODE_SUCCESS, EXIT_CODE_FAILURE } from '../constants/exit-codes.js';


export function validateSchema ( schema: object ) {
    for ( const [attribute, value] of Object.entries(schema) ) {
        // TODO: do sone stuff
        // ...

        //return EXIT_CODE_FAILURE;
    }

    return EXIT_CODE_SUCCESS;
}
