// types
import { ExitCode } from './types/exit-code';
import { Schema } from './types/schema';


export interface Table {
    name: string,
    filesNumber: number,
    creationDate: number,
    lastUpdate: number,
    schema: Schema | null,
    // TODO: check signatures
    insert(): number | number[] | null,
    // TODO: {key: value}, {key <: value}, { key >: value}
    select(condition: {[key: string]: string | number}): string | string[],
    update(): number | number[] | null,
    delete(): number | null,
    deleteAll(): ExitCode
}
