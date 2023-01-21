/**
 * Interface for database initial configuration (given from user on database creation).
 *
 * @interface
 */

import THook from '../types/hook';
import TTransformer from '../types/transformer';

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
     * It's an optional field.
     *
     * @default '/var/lib/dbtex'
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
    readonly encrypt?: boolean;

    /**
     * Encryption key.
     * Required only in case "encrypt" option is `true`.
     * Isn't stored in database data, should be provided by user.
     *
     * @readonly
     */
    readonly encryptionKey?: string | null;

    /**
     * Prefix substring for table files being created.
     * Usually, it's additional meta-information or scope indication in some form.
     * Might be a static string or a function which return the desired value, for dynamic construction.
     *
     * @readonly
     */
    readonly prefix?: string | (() => string);

    /**
     * Format in which data will be stored.
     *
     * @default 'csv'
     *
     * @readonly
     */
    readonly format?: TTransformer;

    readonly beforeInsert?: THook;

    readonly afterInsert?: THook;

    readonly beforeSelect?: THook;

    readonly afterSelect?: THook;

    readonly beforeUpdate?: THook;

    readonly afterUpdate?: THook;

    readonly beforeDelete?: THook;

    readonly afterDelete?: THook;
}

export default IUserConfig;
