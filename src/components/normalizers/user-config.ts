/**
 * Normalize configuration given from user.
 *
 * @module
 */

import path from 'path';
import {isSet, isString} from '../../utilities/is';
import { IUserConfig } from '../dbtex';
import baseConfig from '../../config/app';
import nop from '../../utilities/nop';
import convertToBytes from '../../utilities/unit-converters';
import TFormat from '../dbtex/types/format';
import IDbTexConfig from '../dbtex/interfaces/dbtex-config';
import ITransformer from '../transformers/interfaces/transformer';
import CsvTransformer from '../transformers/csv';
import TsvTransformer from '../transformers/tsv';
import RecTransformer from '../transformers/rec';
import Encryptor from '../encryptors/encryptor';

/**
 * Normalize configuration.
 *
 * @param {IUserConfig} config - configuration given from user
 *
 * @return {IUserConfig} normalized configuration
 */
function normalize ( config: IUserConfig ): IDbTexConfig {
    const {
        name,
        location,
        fileSizeLimit,
        encrypt,
        encryptionKey,
        prefix,
        format,
        beforeInsert,
        afterInsert,
        beforeSelect,
        afterSelect,
        beforeUpdate,
        afterUpdate,
        beforeDelete,
        afterDelete
    } = config;
    const transformerMap: {[key: string]: () => ITransformer} = {
        csv: () => new CsvTransformer(),
        tsv: () => new TsvTransformer(),
        rec: () => new RecTransformer()
    };

    return {
        name,
        location: isSet(location) ? path.resolve(<string>location) : baseConfig.DATABASE_PATH,
        fileSizeLimit: convertToBytes(fileSizeLimit ?? baseConfig.FILE_SIZE_LIMIT),
        encrypt: encrypt ?? false,
        encryptor: encrypt ? new Encryptor(<string>encryptionKey) : null,
        prefix: isSet(prefix) ? isString(prefix) ? prefix : eval(<string>prefix) : '',
        transformer: transformerMap[format ?? <TFormat>baseConfig.DEFAULT_FORMAT](),
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
