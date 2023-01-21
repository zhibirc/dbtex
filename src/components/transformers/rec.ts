import ITransformer from './interfaces/transformer';
import TFormat from '../dbtex/types/format';

class RecTransformer implements ITransformer {
    static format: TFormat = 'rec';

    get delimiter (): string {
        return '\n';
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

export default RecTransformer;
