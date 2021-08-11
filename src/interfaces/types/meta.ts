import { Config } from './config';
import { Table } from '../table';


export type Meta = Config & {
    creationDate: number,
    lastUpdate: number,
    tables: Table[]
}
