export interface Table {
    name: string,
    files: number,
    creationDate: number,
    lastEntryDate?: number,
    schema: object
}
