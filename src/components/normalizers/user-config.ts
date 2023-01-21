/**
 * Normalize configuration given from user.
 *
 * @module
 */

import path from 'path';
import {isSet, isString} from '../../utilities/is';
import { IUserConfig, IDbTexConfig } from '../dbtex';
import appConfig from '../../config/app';
import nop from '../../utilities/nop';
import convertToBytes from '../../utilities/unit-converters';
import TFormat from '../dbtex/types/format';
import Encryptor from '../encryptors/encryptor';
import Normalizer from './normalizer';

class NormalizerUserConfig extends Normalizer {
    readonly #config: IUserConfig;

    /**
     * @constructor
     * @param {IUserConfig} config - configuration given from user
     */
    constructor ( config: IUserConfig ) {
        super();
        this.#config = config;
    }

    /**
     * Normalize configuration.
     *
     * @return {IDbTexConfig} normalized configuration
     */
    normalize (): IDbTexConfig {
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
        } = this.#config;

        return {
            name,
            location: isSet(location) ? path.resolve(<string>location) : appConfig.DATABASE_PATH,
            fileSizeLimit: convertToBytes(fileSizeLimit ?? appConfig.FILE_SIZE_LIMIT),
            encrypt: encrypt ?? false,
            encryptor: encrypt ? new Encryptor(<string>encryptionKey) : null,
            prefix: isSet(prefix) ? isString(prefix) ? prefix : eval(<string>prefix) : '',
            transformer: this.transformerMap[format ?? <TFormat>appConfig.DEFAULT_FORMAT](),
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
}

export default NormalizerUserConfig;
