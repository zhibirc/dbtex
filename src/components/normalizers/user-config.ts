/**
 * Normalize configuration given from user.
 * @module
 */

import path from 'path';
import { isSet } from '../../utilities/is';
import { IUserConfig } from '../dbtex';
import baseConfig from '../../config/base';

interface IConfigResult extends IUserConfig {
    location: string;
    fileSizeLimit: number;
    encrypt: boolean;
}

/**
 * Normalize configuration.
 *
 * @param {IUserConfig} config - configuration given from user
 *
 * @return {IConfigResult} normalized configuration
 */
function normalize ( config: IUserConfig ): IConfigResult {
    const { name, location, fileSizeLimit, encrypt } = config;

    return {
        name,
        location: isSet(location) ? path.resolve(location as string) : baseConfig.DATABASE_PATH,
        fileSizeLimit: fileSizeLimit || baseConfig.FILE_SIZE_LIMIT,
        encrypt: encrypt ?? false
    };
}


export { IConfigResult };
export default normalize;
