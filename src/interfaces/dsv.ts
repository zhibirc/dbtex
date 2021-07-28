export interface Dsv {
    readonly delimiter: string,
    read(data: string): object,
    write(data: object): string
}
