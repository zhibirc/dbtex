export interface Config {
    /**
     * Absolute path to directory that will contain database files.
     * @example
     * {
     *     directory: path.join(__dirname, 'db')
     * }
     */
    directory: string,
    /**
     * Database name.
     */
    name: string,
    /**
     * Arbitrary identifier to distinguish of database tables, usually a table name.
     * @example
     * {
     *     prefix: 'customers'
     * }
     */
    prefix?: string,
    /**
     * Specify file size limit for splitting large files, by default they are not split.
     * @example
     * {
     *     fileSizeLimit: '1MB'
     * }
     */
    fileSizeLimit?: number | string,
    /**
     * Specify should database files be encrypted on save or not.
     * By default encryption is not applied.
     * @example
     * {
     *     encrypt: true
     * }
     */
    encrypt?: boolean,
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
