/**
 * Interface for database initial configuration (given from user on database creation).
 *
 * @interface
 */

interface IConfig {
    /**
     * Name for database being created.
     *
     * @readonly
     */
    readonly name: string;

    /**
     * Location for database being created. Usually, it's a local directory, but could be a remote resource too.
     * Could be relative or absolute path.
     * It's an optional field, and if it's omitted, '/var/lib/dbtex' will be used as default.
     *
     * @readonly
     */
    readonly location?: string;

    /**
     * Size limit for database table files.
     *
     * @readonly
     */
    readonly fileSizeLimit?: number;
}


export default IConfig;
