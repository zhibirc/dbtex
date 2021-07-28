// interfaces
import { Table as TableInterface } from '../interfaces/table';


export class Table implements TableInterface {
    public readonly name;
    public filesNumber;
    public readonly creationDate;
    public lastUpdate;
    public readonly schema;

    constructor ( name: string, schema: object ) {
        this.name = name;
        this.filesNumber = 1;
        this.creationDate = Date.now();
        this.lastUpdate = Date.now();
        this.schema = schema;
    }
}
