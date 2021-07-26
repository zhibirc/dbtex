import { Config } from './config';
import { Table } from './table';


export interface Meta extends Config {
    creationDate: number,
    lastUpdate: number,
    tables: Table[]
}
