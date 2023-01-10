/**
 * Interface for database initial configuration (given from user on database creation).
 *
 * @interface
 */

import ITransformer from '../../transformers/interfaces/transformer';
import IEncryptor from '../../encryptors/interfaces/encryptor';

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
    readonly encrypt?: boolean;

    /**
     * Prefix substring for table files being created.
     * Usually, it's additional meta-information or scope indication in some form.
     * Might be a static string or a function which return the desired value, for dynamic construction.
     *
     * @readonly
     */
    readonly prefix?: string | (() => string);

    /**
     * Custom encryptor.
     * In essence, this should be an object implemented IEncryptor interface.
     *
     * @readonly
     */
    readonly encryptor?: IEncryptor;

    /**
     * Custom data transformer.
     * In essence, this should be an object implemented ITransformer interface.
     *
     * @readonly
     */
    transformer?: ITransformer,

    beforeInsert: THook,
    afterInsert(): THook,
    beforeSelect: THook,
    afterSelect: THook,
    beforeUpdate: THook,
    afterUpdate: THook,
    beforeDelete: THook,
    afterDelete: THook,
}


export default IUserConfig;
