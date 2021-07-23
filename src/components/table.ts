// interfaces
import { Table } from '../interfaces/table';


export class Table {
    private readonly _meta: Table;

    constructor ( name: string, schema: object ) {
        this._meta = {
            name,
            files: 1,
            creationDate: Date.now(),
            lastEntryDate: null,
            schema
        };
    }
}
