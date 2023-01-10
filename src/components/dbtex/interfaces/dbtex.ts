/**
 * Interface for main DbTex application module.
 *
 * @interface
 */

import { Table } from '../../table/interfaces/table';

interface IDbTex {
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

    createTable: (name: string, schema?: JSON) => Table;

    dropTable: (name: string) => boolean | never;
}


export default IDbTex;
