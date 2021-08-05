export interface Table {
    name: string,
    filesNumber: number,
    creationDate: number,
    lastUpdate: number,
    schema?: {[key: string]: string | number | boolean},
    // TODO: check signatures
    insert(): number | number[] | null,
    select(): string | string[],
    update(): number | number[] | null,
    delete(): number | null,
}
