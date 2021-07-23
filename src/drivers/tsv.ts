// interfaces
import { Dsv } from '../interfaces/dsv';


export class DriverTsv implements Dsv {
    public readonly delimiter: string;

    constructor () {
        this.delimiter = '\t';
    }

    read () {}

    write () {}
}
