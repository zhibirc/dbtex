// interfaces
import { Table as ITable } from '../interfaces/table.js';
import { Schema } from '../interfaces/types/schema.js';

// types
import { ExitCode } from '../interfaces/types/exit-code.js';

// constants
import { EXIT_CODE_SUCCESS, EXIT_CODE_FAILURE } from '../constants/exit-codes.js';

// utilities
import { fs } from '../utilities/fs.js';


export class Table implements ITable {
    // @ts-ignore
    #data: string[] = [];
    // @ts-ignore
    #buffer: string[] = [];
    readonly #title: string;
    readonly #location: string;

    public readonly name;
    public filesNumber;
    public readonly creationDate;
    public lastUpdate;
    public readonly schema: Schema | null;

    constructor ( name: string, schema: Schema | null, title: string, location: string ) {
        this.name = name;
        this.filesNumber = 1;
        this.creationDate = Date.now();
        this.lastUpdate = Date.now();
        this.schema     = schema;
        this.#title = title;
        this.#location = location;
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
        this.#buffer.length = 0;
        this.#data.length = 0;

        return fs.save(this.#location, this.#title, fs.modes.TRUNC) ? EXIT_CODE_FAILURE : EXIT_CODE_SUCCESS;
    }
}
