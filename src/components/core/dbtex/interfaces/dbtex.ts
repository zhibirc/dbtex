/**
 * Interface for main DBTEX application module.
 *
 * @interface
 */

import { ITable } from '../../table/itable';

interface IDbtex {
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


export default IDbtex;
