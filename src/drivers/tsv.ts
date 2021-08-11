// interfaces
import { Dsv } from '../interfaces/dsv';


export class DriverTsv implements Dsv {
    get delimiter (): string {
        return '\t';
    }


    // @ts-ignore
    read ( data: string | string[] ): string[] | string[][] {
        // TODO: implement
        return [];
    }

    // @ts-ignore
    write ( data: string | string[] | string[][] ): string {
        // TODO: implement
        return '';
    }
}
