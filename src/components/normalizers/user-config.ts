/**
 * Normalize configuration given from user.
 * @module
 */

import path from 'path';
import { isSet } from '../../utilities/is';
import { UserConfig } from '../core/dbtex';
import baseConfig from '../../config/base';

interface IConfigResult extends UserConfig {
    location: string
}

/**
 * Normalize configuration.
 *
 * @param {UserConfig} config - configuration given from user
 *
 * @return {UserConfig} normalized configuration
 */
function normalize ( config: UserConfig ): IConfigResult {
    const { name, location, fileSizeLimit } = config;

    return {
        name,
        location: isSet(location) ? path.resolve(location as string) : baseConfig.DATABASE_PATH,
        fileSizeLimit: isSet(fileSizeLimit) ? Number(fileSizeLimit) : baseConfig.FILE_SIZE_LIMIT
    };
}


export default normalize;
