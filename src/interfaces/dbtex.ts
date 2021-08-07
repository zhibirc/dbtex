// interfaces
import { Table } from './table';


export interface DbTex {
    location: string,
    audit(): boolean,
    createTable(): Table | never
    dropTable(): number | never,
    getStats(): {[key: string]: string | number | boolean}
}
