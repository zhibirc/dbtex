/**
 * Interface for main DBTEX application module.
 *
 * @interface
 */

import { ITable } from '../table/itable';


export default interface IDbTex {
    /**
     * Database files location.
     *
     * @readonly
     */
    readonly location: string;

    /**
     * Database name.
     *
     * @readonly
     */
    readonly name: string;

    createTable: (name: string, schema?: JSON) => ITable;

    dropTable: (name: string) => boolean | never;
}
