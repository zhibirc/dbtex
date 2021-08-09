// utilities
import { log } from './log.js';

// constants
import {EXIT_CODE_SUCCESS, EXIT_CODE_FAILURE, ExitCode} from '../constants/exit-codes.js';


export function validateSchema ( schema: {[key: string]: string | number | boolean} ): ExitCode {
    for ( const [attribute, value] of Object.entries(schema) ) {
        // TODO: do sone stuff
        // ...
        log(attribute);
        log(value);

        return EXIT_CODE_FAILURE;
    }

    return EXIT_CODE_SUCCESS;
}
