// interfaces
import { Table } from './table';

// constants
import DataType from '../constants/data-types';


export interface DbTex {
    /** Absolute path to database directory (where meta-info and all tables data are stored). */
    location: string,
    /** Load data from meta-info file, verify all metrics being read, and compare with real database structure. */
    audit(): boolean,
    /** Create table in current database and update of database meta-info metrics. */
    createTable(name: string, schema: {[key: string]: DataType}): Table | never,
    /** Drop an existing table and update of database meta-info metrics. */
    dropTable(name: string): number | never,
    /** Get statistics about database: general metrics, tables, paths, disk utilization, etc. */
    getStats(): {[key: string]: string | number | any[]},
    /** Set (add new or update of existing) additional procedure as a middleware to the CRUD flow. */
    setHook(name: string, callback: (record?: {[key: string]: string}) => {[key: string]: string}): number
}
