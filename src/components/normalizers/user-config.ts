/**
 * Normalize configuration given from user.
 * @module
 */

import path from 'path';
import { isSet } from '../../utilities/is';
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
    const { name, location, fileSizeLimit } = config;

    return {
        name,
        location: isSet(location) ? path.resolve(location as string) : baseConfig.DATABASE_PATH,
        fileSizeLimit: isSet(fileSizeLimit) ? Number(fileSizeLimit) : baseConfig.FILE_SIZE_LIMIT
    };
}


export default normalize;
