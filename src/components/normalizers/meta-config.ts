/**
 *
 *
 * @module
 */

import path from 'path';
import {isSet, isString} from '../../utilities/is';
import { IUserConfig, IDbTexConfig, IMetaInfoInternal } from '../dbtex';
import appConfig from '../../config/app';
import nop from '../../utilities/nop';
import convertToBytes from '../../utilities/unit-converters';
import TFormat from '../dbtex/types/format';
import Encryptor from '../encryptors/encryptor';
import Normalizer from './normalizer';

class NormalizerMetaConfig extends Normalizer {
    readonly #metaConfig: IMetaInfoInternal;
    readonly #userConfig: IUserConfig;

    /**
     * @constructor
     * @param {IMetaInfoInternal} metaConfig - meta info stored internally
     * @param {IUserConfig} userConfig - configuration given from user
     */
    constructor (metaConfig: IMetaInfoInternal, userConfig: IUserConfig) {
        super();
        this.#metaConfig = metaConfig;
        this.#userConfig = userConfig;
    }

    /**
     * Normalize configuration.
     *
     * @return {Object} normalized configuration
     */
    normalize (): {config: IDbTexConfig, actions: []} {
        const actions: Function[] = [];
        const { prefix, fileSizeLimit, format, encrypt, encryptionKey } = rawUserConfig as Partial<IUserConfig>;
        const tmpConfig = {};
        // settings which could be alternate in existing database: prefix, fileSizeLimit, format, encrypt
        const preparedConfig = {
            name: baseConfig.name,
            location: baseConfig.location,
            fileSizeLimit: fileSizeLimit ? normalizedConfig?.fileSizeLimit : baseConfig.fileSizeLimit,
            encrypt: isSet(encrypt) ? encrypt : baseConfig.encrypt,
            prefix: isSet(prefix) ? normalizedConfig?.prefix : baseConfig.prefix,
            transformer: isSet(format) ? normalizedConfig?.transformer : (tmpConfig.format = <IMetaInfoInternal>baseConfig.format)
        };

        if (
            // if we should continue to encrypt
            preparedConfig.encrypt
            // we should either decrypt all or encrypt
            || (isSet(encrypt) && baseConfig.encrypt !== encrypt)
        ) {
            // so, we need an encryption key
            if ( !isSet(encryptionKey) ) {
                throw new ValidationError('');
            }
            tmpConfig.encrypt = true;
            tmpConfig.encryptionKey = encryptionKey;
        }


        // check if new format is set, different from the config
        if ( baseConfig.format !== preparedConfig.transformer.format ) {

        }

        return {
            config: {},
            actions
        };
    }
}

export default NormalizerMetaConfig;
