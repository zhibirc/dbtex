/**
 * Interface for main Dbtex application module.
 * @interface
 */

import { Itable } from './itable';

export interface Idbtex {
    /**
     * Location for the created database. Usually, it's a local directory, but could be a remote resource too.
     * @readonly
     */
    readonly location: string;

    /**
     * Name for the created database.
     * @readonly
     */
    readonly name: string;

    createTable: (name: string, schema?: JSON) => Itable;

    dropTable: (name: string) => boolean | never;
}
