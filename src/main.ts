/**
 * Main DBTEX application entry point.
 * @module
 */

import { DbTex as _DbTex, IDbTex, IConfig } from './components/core/dbtex';


export function DbTex (config: IConfig): IDbTex {
    return new _DbTex(config);
}
