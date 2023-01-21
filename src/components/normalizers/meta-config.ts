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
     * @return {IDbTexConfig} normalized configuration
     */
    normalize (): IDbTexConfig {
        // TODO
    }
}

export default NormalizerMetaConfig;
