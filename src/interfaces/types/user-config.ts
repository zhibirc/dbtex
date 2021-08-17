// built-ins
import path from 'path';
import fs from 'fs';

// interfaces
import { Encryptor } from '../encryptor';
import { Dsv } from '../dsv';

// types
import { Record } from './record';
import { ExitCode } from './exit-code';

// utilities
import { isObject } from '../../utilities/is.js';


export type UserConfig = {
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
     * Read/write driver or adapter to transform table schema data to low-level "delimiter-separated values" for storing as table records and vice versa.
     * It's possible to pass a custom driver which must to implement the Dsv interface/API.
     */
    driver?: Dsv,
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

    // hooks on INSERT
    beforeInsert?(record: Record): Record,
    afterInsert?(record: string): ExitCode,
    // hooks on SELECT
    beforeSelect?(): boolean,
    afterSelect?(record: string): ExitCode,
    // hooks on UPDATE
    beforeUpdate?(record: Record): Record,
    afterUpdate?(record: string): ExitCode,
    // hooks on DELETE
    beforeDelete?(record: Record): ExitCode,
    afterDelete?(record: string): ExitCode,

    /**
     * Specify file size limit for splitting large files, by default they are not split.
     *
     * @example
     * {
     *     fileSizeLimit: '1MB'
     * }
     */
    fileSizeLimit?: number | string
}

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export function isConfig(config: any): config is UserConfig {
    try {
        return isObject(config)
            && typeof config.directory === 'string'
            && fs.statSync(path.normalize(config.directory.trim())).isDirectory()
            && typeof config.name === 'string'
            && config.name.trim();
    } catch {
        return false;
    }
}
