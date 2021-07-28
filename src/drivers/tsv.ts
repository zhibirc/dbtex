// interfaces
import { Dsv } from '../interfaces/dsv';


export class DriverTsv implements Dsv {
    public readonly delimiter: string;

    constructor () {
        this.delimiter = '\t';
    }

    read ( data: string ): object {
        return data;
    }

    write ( data: object ): string {
        return data;
    }
}
