/**
 * Main DBTEX entry point.
 */

// built-ins
import path from 'path';

// components
import { DbTex as _DbTex } from './components/dbtex.js';

// interfaces
import { DbTex as IDbTex } from './interfaces/dbtex.js';

// types
import { UserConfig, isConfig } from './interfaces/types/user-config.js';

// utilities
import { log } from './utilities/log.js';


export function DbTex (this: unknown,  config: UserConfig): IDbTex {
    if ( isConfig(config) ) {
        const { directory, name, report } = config;

        if ( report === true ) {
            // database root, near meta-information file
            process.report!.directory = path.join(directory, name);
            // trigger diagnostic reporting for both internal errors and uncaught exceptions, explicitly disable for signals
            process.report!.reportOnFatalError = true;
            process.report!.reportOnSignal = false;
            process.report!.reportOnUncaughtException = true;
        }
    }

    return new _DbTex(config);
}


process.on('uncaughtException', (error: Error) => {
    if ( error?.stack?.includes(DbTex.name.toLowerCase()) ) {
        // TODO: possibly handling better
        log(error.message);
        process.exit(1);
    }

    // if error belongs to other application parts -- throw it further
    throw error;
});


