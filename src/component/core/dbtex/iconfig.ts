/**
 * Interface for database initial configuration.
 *
 * @interface
 */


export default interface IConfig {
    /**
     * Location for database being created. Usually, it's a local directory, but could be a remote resource too.
     * It's an optional field, and if it's omitted, '/var/lib/dbtex' will be used as default.
     *
     * @readonly
     *
     * @example
     * './database/'
     */
    readonly location?: string;

    /**
     * Name for database being created.
     *
     * @readonly
     */
    readonly name: string;
}
