import { ITransformer } from '../../transformers';
import { IUserConfig, IDbTexConfig, IMetaInfoInternal } from '../../dbtex';

interface INormalizer {
    transformerMap: {[key: string]: () => ITransformer};
    normalize?: (config: IUserConfig) => IDbTexConfig | ((metaConfig: IMetaInfoInternal, userConfig: IUserConfig) => IDbTexConfig);
}

export default INormalizer;

