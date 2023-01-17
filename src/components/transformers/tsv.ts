import ITransformer from './interfaces/transformer';

class TsvTransformer implements ITransformer {
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
