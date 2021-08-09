// interfaces
import { Dsv } from '../interfaces/dsv';


// TODO: handle edge cases on read-write, think about better naming
export class DriverCsv implements Dsv {
    get delimiter (): string {
        return ',';
    }

    read ( data: string | string[] ): string[] | string[][] {
        if ( Array.isArray(data) ) {
            return data.map(chunk => chunk.split(this.delimiter));
        }

        return data.split(this.delimiter);
    }

    write ( data: string[] | string[][] ): string | string[] {
        if ( !Array.isArray(data) || data.length === 0 ) {
            // TODO: think about uniform errors
            throw new TypeError();
        }

        if ( Array.isArray(data[0]) ) {
            return data.map(chunk => (chunk as string[]).join(this.delimiter));
        }

        return data.join(this.delimiter);
    }
}
