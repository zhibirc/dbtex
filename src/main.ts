/**
 * Main DBTEX application entry point.
 * @module
 */

import { DbTex as _DbTex, Dbtex, UserConfig } from './components/core/dbtex';


export function DbTex (config: UserConfig): Dbtex {
    return new _DbTex(config);
}
