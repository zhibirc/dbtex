type ExitCode = number;


export interface Table {
    name: string,
    filesNumber: number,
    creationDate: number,
    lastUpdate: number,
    schema: {[key: string]: string | number | boolean},
    // TODO: check signatures
    insert(): number | number[] | null,
    // TODO: {key: value}, {key <: value}, { key >: value}
    select(condition: {[key: string]: string | number}): string | string[],
    update(): number | number[] | null,
    delete(): number | null,
    deleteAll(): ExitCode
}
