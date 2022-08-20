// interfaces
import { Table as ITable } from '../interfaces/table.js';
import { Schema } from '../interfaces/types/schema.js';
import { Dsv } from '../interfaces/dsv';

// types
import { ExitCode } from '../interfaces/types/exit-code.js';
import { TableConfig } from '../interfaces/types/table-config';

// constants
import { EXIT_CODE_SUCCESS, EXIT_CODE_FAILURE } from '../constant/exit-codes.js';

// utilities
import { fs } from '../utility/fs.js';


export class Table implements ITable {
    // @ts-ignore
    #data: string[] = [];
    readonly #driver: Dsv;
    // @ts-ignore
    #buffer: string[] = [];
    readonly #title: string;
    readonly #location: string;

    public readonly name;
    public filesNumber;
    public readonly creationDate;
    public lastUpdate;
    public readonly schema: Schema | null;

    // TODO: work on table config as a set of required data from creator (DbTex)
    constructor ( config: TableConfig ) {
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
