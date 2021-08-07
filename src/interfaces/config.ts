// built-ins
import path from 'path';
import fs from 'fs';

// interfaces
import { Encryptor } from './encryptor';
import { Dsv } from './dsv';


export interface Config {
    /**
     * Absolute path to parent directory that will contain database subdirectory with all related structures (i.e., the "base" directory).
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
    /**
     * Read/write driver or adapter to transform table schema data to low-level "delimiter-separated values" for storing as table records and vice versa.
     * It's possible to pass a custom driver which must to implement the Dsv interface/API.
     */
    driver?: Dsv,
    // hooks on INSERT
    beforeInsert?(record: {[key: string]: string}): {[key: string]: string},
    afterInsert?(record: string): boolean,
    // hooks on SELECT
    beforeSelect?(): boolean,
    afterSelect?(record: string): boolean,
    // hooks on UPDATE
    beforeUpdate?(record: {[key: string]: string}): {[key: string]: string},
    afterUpdate?(record: string): boolean,
    // hooks on DELETE
    beforeDelete?(record: {[key: string]: string}): {[key: string]: string},
    afterDelete?(record: string): boolean
}

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export function isConfig(config: any): config is Config {
    try {
        return Object.prototype.toString.call(config) === '[object Object]'
            && typeof config.directory === 'string'
            && fs.statSync(path.normalize(config.directory.trim())).isDirectory()
            && typeof config.name === 'string'
            && config.name.trim();
    } catch {
        return false;
    }
}
