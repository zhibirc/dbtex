/**
 * Interface for database initial configuration (given from user on database creation).
 *
 * @interface
 */

interface IUserConfig {
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

    /**
     * Should table files be encrypted or not.
     * This is about how data will be stored internally, user shouldn't care about this.
     *
     * @readonly
     */
    readonly encrypt?: boolean
}


export default IUserConfig;
