import ITransformer from './interfaces/transformer';
import TFormat from '../dbtex/types/format';

class CsvTransformer implements ITransformer {
    static format: TFormat = 'csv';

    get delimiter (): string {
        return ',';
    }

    read ( data: string | string[] ): string[] | string[][] {
        if ( Array.isArray(data) ) {
            return data.map(chunk => chunk.split(this.delimiter));
        }

        return data.split(this.delimiter);
    }

    write ( data: string | string[] ): string {
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
