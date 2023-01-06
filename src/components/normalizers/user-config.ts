/**
 * Normalize configuration given from user.
 * @module
 */

import path from 'path';
import { isDirectory } from '../../utilities/is';
import { IConfig } from '../core/dbtex';
import baseConfig from '../../config/base';

interface IConfigResult extends IConfig {
    location: string
}

/**
 * Normalize configuration.
 *
 * @param {IConfig} config - configuration given from user
 *
 * @return {IConfig} normalized configuration
 */
function normalize ( config: IConfig ): IConfigResult {
    const { name, location } = config;

    return {
        name,
        location: isDirectory(location)
            ? path.join(location as string, name)
            : path.join(baseConfig.DATABASE_PATH, name)
    };
}


export default normalize;
