import ITransformer from './interfaces/transformer';

class RecTransformer implements ITransformer {
    get delimiter (): string {
        return '\n';
    }

    read ( data: string | string[] ): string[] | string[][] {}

    write ( data: string | string[] | string[][] ): string {}
}

export default RecTransformer;
