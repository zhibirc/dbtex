import { ITransformer } from '../../transformers';
import { IUserConfig, IDbTexConfig, IMetaInfoInternal } from '../../dbtex';

interface INormalizer {
    transformerMap: {[key: string]: () => ITransformer};
    normalize(): {config: IDbTexConfig, actions?: Function[]}
}

export default INormalizer;

