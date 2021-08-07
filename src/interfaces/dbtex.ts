// interfaces
import { Table } from './table';


export interface DbTex {
    audit(): boolean,
    createTable(): Table | never
    dropTable(): number | never,
    getStats(): {[key: string]: string | number | boolean}
}
