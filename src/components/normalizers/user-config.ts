/**
 * Normalize configuration given from user.
 *
 * @module
 */

import path from 'path';
import { isSet } from '../../utilities/is';
import { IUserConfig } from '../dbtex';
import baseConfig from '../../config/base';
import nop from '../../utilities/nop';
import TTransformer from '../dbtex/types/transformer';

/**
 * Normalize configuration.
 *
 * @param {IUserConfig} config - configuration given from user
 *
 * @return {IUserConfig} normalized configuration
 */
function normalize ( config: IUserConfig ): IUserConfig {
    const {
        name,
        location,
        fileSizeLimit,
        encrypt,
        encryptionKey,
        prefix,
        transformer,
        beforeInsert,
        afterInsert,
        beforeSelect,
        afterSelect,
        beforeUpdate,
        afterUpdate,
        beforeDelete,
        afterDelete
    } = config;

    return {
        name,
        location: isSet(location) ? path.resolve(<string>location) : baseConfig.DATABASE_PATH,
        fileSizeLimit: fileSizeLimit ?? baseConfig.FILE_SIZE_LIMIT,
        encrypt: encrypt ?? false,
        encryptionKey: encryptionKey ?? null,
        prefix: prefix ?? '',
        transformer: transformer ?? <TTransformer>baseConfig.TRANSFORMER,
        beforeInsert: beforeInsert ?? nop,
        afterInsert: afterInsert ?? nop,
        beforeSelect: beforeSelect ?? nop,
        afterSelect: afterSelect ?? nop,
        beforeUpdate: beforeUpdate ?? nop,
        afterUpdate: afterUpdate ?? nop,
        beforeDelete: beforeDelete ?? nop,
        afterDelete: afterDelete ?? nop
    };
}

export default normalize;
