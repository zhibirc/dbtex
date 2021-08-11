// interfaces
import { Table } from './table';

// types
import { ExitCode } from './types/exit-code';
import { Record } from './types/record';
import { Schema } from './types/schema';


export interface DbTex {
    /** Absolute path to database directory (where meta-info and all tables data are stored). */
    location: string,
    /** Load data from meta-info file, verify all metrics being read, and compare with real database structure. */
    audit(): ExitCode,
    /** Create table in current database and update of database meta-info metrics. */
    createTable(name: string, schema: Schema): Table | never,
    /** Drop an existing table and update of database meta-info metrics. */
    dropTable(name: string): ExitCode | never,
    /** Get statistics about database: general metrics, tables, paths, disk utilization, etc. */
    getStats(): {[key: string]: string | number | any[]},
    /** Set (add new or update of existing) additional procedure as a middleware to the CRUD flow. */
    setHook(name: string, callback: (record?: Record) => unknown): ExitCode,
    /** Terminate database process gracefully. */
    shutdown(): ExitCode
}
