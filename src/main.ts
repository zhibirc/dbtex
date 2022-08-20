/**
 * Main DBTEX entry point.
 */

// components
import { DbTex as _DbTex } from './module/dbtex';

// interfaces
import { DbTex as IDbTex } from './interfaces/dbtex.js';

// types
import { UserConfig } from './interfaces/types/user-config.js';


export function DbTex (config: UserConfig): IDbTex {
    return new _DbTex(config);
}
