// interfaces
import { Dsv } from '../interfaces/dsv';


export class DriverCsv implements Dsv {
    public readonly delimiter: string;

    constructor () {
        this.delimiter = ',';
    }

    read () {}

    write () {}
}
