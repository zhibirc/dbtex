// interfaces
import { Table } from './table';


export interface DbTex {
    /** Absolute path to database directory (where meta-info and all tables data are stored). */
    location: string,
    /** Load data from meta-info file, verify all metrics being read, and compare with real database structure. */
    audit(): boolean,
    /** Create table in current database and update of database meta-info metrics. */
    createTable(): Table | never,
    /** Drop an existing table and update of database meta-info metrics. */
    dropTable(): number | never,
    /** Get statistics about database: general metrics, tables, paths, disk utilization, etc. */
    getStats(): {[key: string]: string | number | boolean},
    /** Set (add new or update of existing) additional procedure as a middleware to the CRUD flow. */
    setHook(name: string, callback: (record?: {[key: string]: string}) => {[key: string]: string}): number
}
