/**
 * Interface for main DbTex application module.
 *
 * @interface
 */

import { ITable } from '../../table/itable';

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

    createTable: (name: string, schema?: JSON) => ITable;

    dropTable: (name: string) => boolean | never;
}


export default IDbTex;
