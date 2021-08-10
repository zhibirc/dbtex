// interfaces
import { Table as TableInterface } from '../interfaces/table';
import { Schema } from '../interfaces/schema';

// constants
import { ExitCode, EXIT_CODE_SUCCESS } from '../constants/exit-codes.js';


export class Table implements TableInterface {
    public readonly name;
    public filesNumber;
    public readonly creationDate;
    public lastUpdate;
    public readonly schema: Schema;

    constructor ( name: string, schema: Schema ) {
        this.name = name;
        this.filesNumber = 1;
        this.creationDate = Date.now();
        this.lastUpdate = Date.now();
        this.schema = schema;
    }

    insert(): number | number[] | null {}

    // TODO: {key: value}, {key <: value}, { key >: value}
    select(condition: {[key: string]: string | number}): string | string[] {}

    update(): number | number[] | null {}

    delete(): number | null {}

    deleteAll(): ExitCode {
        return EXIT_CODE_SUCCESS;
    }
}
