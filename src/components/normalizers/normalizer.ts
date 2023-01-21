import INormalizer from './interfaces/normalizer';
import { ITransformer, CsvTransformer, TsvTransformer, RecTransformer }  from '../transformers';

class Normalizer implements INormalizer {
    transformerMap: {[key: string]: () => ITransformer} = {
        csv: () => new CsvTransformer(),
        tsv: () => new TsvTransformer(),
        rec: () => new RecTransformer()
    };
}

export default Normalizer;
