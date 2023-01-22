import INormalizer from './interfaces/normalizer';
import { ITransformer, CsvTransformer, TsvTransformer, RecTransformer }  from '../transformers';
import { IDbTexConfig } from '../dbtex';

abstract class Normalizer implements INormalizer {
    transformerMap: {[key: string]: () => ITransformer} = {
        csv: () => new CsvTransformer(),
        tsv: () => new TsvTransformer(),
        rec: () => new RecTransformer()
    };

    abstract normalize(): {config: IDbTexConfig, actions?: []};
}

export default Normalizer;
