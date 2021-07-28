import { Encryptor } from './encryptor';


export interface Config {
    /**
     * Absolute path to parent directory that will contain database subdirectory with all related structures.
     *
     * @example
     * {
     *     directory: path.join(__dirname, 'server')
     * }
     */
    directory: string,
    /**
     * Database name.
     */
    name: string,
    /**
     * Arbitrary identifier to distinguish of database tables, usually the application name.
     *
     * @example
     * {
     *     prefix: 'application_name'
     * }
     */
    prefix?: string,
    /**
     * Specify file size limit for splitting large files, by default they are not split.
     *
     * @example
     * {
     *     fileSizeLimit: '1MB'
     * }
     */
    fileSizeLimit?: number | string,
    /**
     * Specify should database files be encrypted on save or not.
     * By default encryption is not applied.
     *
     * @example
     * {
     *     encrypt: true
     * }
     */
    encrypt?: boolean,
    /**
     * Engine which should be used for encrypting of stored data in database tables.
     * If "encrypt" flag is set to "true" and no encryptor was passed, the default encryptor from package utilities will be used.
     * If "encrypt" flag is not set or is set to "false" this field will be ignored.
     * It's possible to pass a custom encryptor which must to implement the Encryptor interface/API.
     */
    encryptor?: Encryptor,
    // hooks on CREATE
    beforeCreate?(record: object): object,
    afterCreate?(record: string): boolean,
    // hooks on READ
    beforeRead?(): boolean,
    afterRead?(record: string): boolean,
    // hooks on UPDATE
    beforeUpdate?(record: object): object,
    afterUpdate?(record: string): boolean,
    // hooks on DELETE
    beforeDelete?(record: object): object,
    afterDelete?(record: string): boolean,
}
