// interfaces
import { Dsv } from '../interfaces/dsv';


export class DriverTsv implements Dsv {
    get delimiter (): string {
        return '\t';
    }

    read ( data: string | string[] ): string[] | string[][] {
        return data;
    }

    write ( data: string[] | string[][] ): string {
        return data;
    }
}
