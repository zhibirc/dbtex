import ITransformer from './interfaces/transformer';

class CsvTransformer implements ITransformer {
    get delimiter (): string {
        return ',';
    }

    read ( data: string | string[] ): string[] | string[][] {
        if ( Array.isArray(data) ) {
            return data.map(chunk => chunk.split(this.delimiter));
        }

        return data.split(this.delimiter);
    }

    write ( data: string | string[] | string[][] ): string {
        if ( typeof data === 'string' ) {
            return data;
        }

        if ( Array.isArray(data[0]) ) {
            return data.map(chunk => (chunk as string[]).join(this.delimiter)).join('\n');
        }

        return data.join(this.delimiter);
    }
}

export default CsvTransformer;
