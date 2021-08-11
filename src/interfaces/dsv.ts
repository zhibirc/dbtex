export interface Dsv {
    readonly delimiter: string,
    read ( data: string | string[] ): string[] | string[][],
    write ( data: string | string[] | string[][] ): string
}
