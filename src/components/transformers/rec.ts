import ITransformer from './interfaces/transformer';

class RecTransformer implements ITransformer {
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
