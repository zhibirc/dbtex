/**
 * Main DbTex application entry point.
 *
 * @module
 */

import { DbTex as _DbTex, IDbTex, IUserConfig } from './components/dbtex';


export function DbTex (config: IUserConfig): IDbTex {
    return new _DbTex(config);
}
