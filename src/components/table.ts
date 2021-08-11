// interfaces
import { Table as ITable } from '../interfaces/table';
import { Schema } from '../interfaces/types/schema';

// types
import { ExitCode } from '../interfaces/types/exit-code';

// constants
import { EXIT_CODE_SUCCESS } from '../constants/exit-codes.js';


export class Table implements ITable {
    // @ts-ignore
    #data: string[] = [];
    // @ts-ignore
    #buffer: string[] = [];

    public readonly name;
    public filesNumber;
    public readonly creationDate;
    public lastUpdate;
    public readonly schema: Schema | null;

    constructor ( name: string, schema: Schema | null ) {
        this.name = name;
        this.filesNumber = 1;
        this.creationDate = Date.now();
        this.lastUpdate = Date.now();
        this.schema     = schema;
    }

    insert(): number | number[] | null {
        return null;
    }

    // TODO: {key: value}, {key <: value}, { key >: value}
    // @ts-ignore
    select(condition: {[key: string]: string | number}): string | string[] {
        return [];
    }

    update(): number | number[] | null {
        return null;
    }

    delete(): number | null {
        return null;
    }

    deleteAll(): ExitCode {
        return EXIT_CODE_SUCCESS;
    }
}
