import ITransformer from './interfaces/transformer';
import TFormat from '../dbtex/types/format';

class TsvTransformer implements ITransformer {
    static format: TFormat = 'tsv';

    get delimiter (): string {
        return '\t';
    }

    read ( data: string | string[] ) {
        // TODO: implement
        return [];
    }

    write ( data: string | string[] ) {
        // TODO: implement
        return '';
    }
}

export default TsvTransformer;
