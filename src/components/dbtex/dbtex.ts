/**
 * Main application module.
 * @class
 */


import path from 'path';

import { Table } from '../table/table';
import CsvTransformer from '../transformers/csv';
import TsvTransformer from '../transformers/tsv';
import RecTransformer from '../transformers/rec';

import { fs } from '../../utilities/fs';
import { serialize, deserialize } from '../../utilities/serialize';
import { validateSchema } from '../../utilities/schema-validator';
import { parseSchema } from '../../utilities/schema-parser';

import { Hasher } from '../../utilities/hasher';
import {isObject, isDriver, isHook, isSet} from '../../utilities/is';

import { EXIT_CODE_SUCCESS, EXIT_CODE_FAILURE } from '../../constants/exit-codes';
import appConfig from '../../config/app';
import validateUserConfig from '../validators/user-config';
import normalizeUserConfig from '../normalizers/user-config';
import hasFileAccess from '../../utilities/has-file-access';

import IDbTex from './interfaces/dbtex';
import IUserConfig from './interfaces/user-config';
import IDbTexConfig from './interfaces/dbtex-config';
import IMetaInfoInternal from './interfaces/meta-info-internal';
import IMetaInfoExternal from './interfaces/meta-info-external';
import ITable from '../table/interfaces/table';

import frozenClass from '../../decorators/frozen-class';
import ITransformer from '../transformers/interfaces/transformer';
import DbtexConfig from './interfaces/dbtex-config';

const hasher = new Hasher();

@frozenClass
class DbTex implements IDbTex {
    #config!: IDbTexConfig;
    // mapping of table proxy instances to corresponding revoke functions
    #revokes;

    constructor ( config: IUserConfig ) {
        const { error } = validateUserConfig(config);

        if ( error ) {
            throw new TypeError(`Invalid configuration: ${error}`);
        }

        const normalizedConfig: IDbTexConfig = normalizeUserConfig(config);
        const { name, location } = normalizedConfig;

        this.#revokes = new WeakMap();

        // try to use existent database from persistent storage instead of creating new instance
        if ( hasFileAccess({
            [path.join(<string>location, name)]: [
                appConfig.META_INFO_FILENAME
            ]
        }) ) {
            const { error, data: meta } = deserialize(fs.read(path.join(
                <string>location,
                name,
                appConfig.META_INFO_FILENAME
            )));

            if ( error ) {
                throw new SyntaxError(`config cannot be read or deserialize: ${error}`);
            }

            const hash = (meta as IMetaInfoInternal).checksum;

            delete meta.checksum;

            // verify checksum to ensure it makes sense for further initialization
            if ( !hash || !hasher.verify(serialize(meta), hash) ) {
                throw new Error('database metadata is corrupt, checksum mismatch');
            }

            this.#init(
                true,
                {...meta, checksum: hash},
                config,
                normalizedConfig
            );
        } else {
            this.#init(false, normalizedConfig);
        }
    }

    /**
     * Parse given config, analyze, merge with existing if any, and initialize inner structures.
     *
     * @private
     *
     * @param {boolean} isExist - is database already exist or new one should be created
     * @param {IUserConfig|IMetaInfoInternal} baseConfig - initialization options for new database or existing configuration
     * @param {IUserConfig} [rawUserConfig] - original user config, needed in case of database exists
     * @param {IDbTexConfig} [normalizedConfig] - normalized user config
     */
    #init (
        isExist: boolean,
        baseConfig: IDbTexConfig | IMetaInfoInternal,
        rawUserConfig?: IUserConfig,
        normalizedConfig?: IDbTexConfig
    ) {
        if ( isExist ) {
            const { prefix, fileSizeLimit, format, encrypt, encryptionKey } = rawUserConfig as Partial<IUserConfig>;

            // settings which could be alternate in existing database: prefix, fileSizeLimit, format, encrypt
            const preparedConfig = {
                name: baseConfig.name,
                location: baseConfig.location,
                fileSizeLimit: fileSizeLimit ? normalizedConfig?.fileSizeLimit : baseConfig.fileSizeLimit,
                prefix: isSet(prefix) ? normalizedConfig?.prefix : baseConfig.prefix,
                // TODO
            };

            // do some required transformations if any
            // TODO

            // re-save configuration as meta data
            this.#save();
        } else {
            this.#config = {
                ...baseConfig,
                creationDate: Date.now(),
                lastUpdate: Date.now(),
                tables: []
            } as Required<IDbTexConfig>;

            try {
                fs.make(path.join(this.#config.location, this.#config.name), fs.types.DIRECTORY);
                this.#save();
            } catch {
                throw new Error(this.#config.location);
            }
        }
    }

    /**
     * Save database configuration and state to meta file with checksum.
     * @private
     */
    #save () {
        const driver = this.#config.transformer;
        const meta: IMetaInfoInternal = {
            location: this.#config.location,
            name: this.#config.name,
            prefix: <string>this.#config.prefix,
            fileSizeLimit: <number>this.#config.fileSizeLimit,
            encrypt: this.#config.encrypt,
            transformer: Object.getPrototypeOf(driver).constructor.name,
            creationDate: this.#config.creationDate,
            lastUpdate: this.#config.lastUpdate,
            tables: this.#config.tables
        };

        meta.checksum = hasher.hash(serialize(meta));

        try {
            fs.save(
                path.join(this.#config.location, appConfig.META_INFO_FILENAME),
                serialize(meta)
            );

            return EXIT_CODE_SUCCESS;
        } catch ( exception ) {
            return EXIT_CODE_FAILURE;
        }
    }

    static types = {
        /** Numeric values including integers and floats. */
        NUMBER:  Symbol('NUMBER'),
        /** String values of any length. */
        TEXT:    Symbol('TEXT'),
        /** Boolean values either true, false or unknown (represented by the null value). */
        BOOLEAN: Symbol('BOOLEAN'),
        /** Non-primitive object-like values which can be serialized. */
        STRUCT:  Symbol('STRUCT'),
        /** Binary string values. */
        BINARY:  Symbol('BINARY'),
        /**
         * Store the Universally Unique Identifiers (UUID).
         * If payload for this field is omitted then new random UUID is generated.
         * In this case it's possible to retrieve it by using hooks.
         */
        UUID: Symbol('UUID')
    };

    /**
     * Get database meta information.
     *
     * @return {IMetaInfoExternal} object containing meta information.
     */
    getMetaInfo (): IMetaInfoExternal {
        return {
            name: this.#config.name,
            location: this.#config.location
        };
    }

    audit (): ExitCode {
        // stub
        return EXIT_CODE_SUCCESS;
    }

    getStats (): {[key: string]: string | number | any[]} {
        return {
            name: this.#config.name,
            location: this.location,
            tables: this.#config.tables.map(table => ({
                name: table.name,
                creationDate: table.creationDate,
                lastUpdate: table.lastUpdate,
                filesNumber: table.filesNumber
            }))
        };
    }

    // TODO: fix callback type
    setHook ( name: string, callback: () => unknown ): ExitCode {
        if ( typeof name === 'string' && name.trim() && typeof callback === 'function' ) {
            return EXIT_CODE_SUCCESS;
        }

        return EXIT_CODE_FAILURE;
    }

    /**
     * Create table in particular database.
     *
     * @param {string} name - name for the created table
     * @param {JSON} [schema] - JSON schema for the created table
     */
    createTable ( name: string, schema?: JSON ): ITable | never {
        name = this.#config.prefix + name.trim();

        if ( this.#config.tables.find(table => table.name === name ) ) {
            throw new ReferenceError(`Nothing to create -- table name "${name}" is already exists.`);
        }

        let columnTitleData: string | string[] = '';

        if ( schema != null ) {
            if ( isObject(schema) && validateSchema(schema) ) {
                columnTitleData = parseSchema(schema);
            } else {
                throw new SyntaxError('Given schema is incorrect.');
            }
        }

        try {
            const tablePath: string = path.join(this.location, name);
            const columnTitleRow: string = this.#config.driver!.write(columnTitleData);
            const table: Table = new Table(name, schema || null, columnTitleRow, tablePath);
            // TODO: implement traps, also think to use revocable proxy for table drop
            const _table = new Proxy(table, {
                // implement
            });
            const { proxy, revoke } = Proxy.revocable(_table, {});
            this.#revokes.set(proxy, revoke);

            fs
                .make(tablePath, fs.types.DIRECTORY)
                .save(path.join(tablePath, `${table.filesNumber}_${Date.now()}.txt`), columnTitleRow);

            this.#config.tables.push(<Table>proxy);

            // TODO: save table data to meta info

            return proxy;
        } catch ( error ) {
            throw new AccessError(path.join(this.location, name));
        }
    }

    /**
     * Drop/delete of given table.
     *
     * @param {string} name - name of the table to drop
     *
     * @return {boolean|Object} - true in case if success or an object with error reason on failure
     * @throws {ReferenceError}
     * @throws {AccessError}
     */
    dropTable ( name: string ) {
        const tableIndex = this.#config.tables.findIndex((item: Itable) => item.name === name);

        if ( tableIndex === -1 ) {
            throw new ReferenceError(`Nothing to drop, table name "${name}" not found in database.`);
        }

        const tablePath = path.join(this.location, name);

        try {
            fs.delete(tablePath);
            this.#config.tables.splice(tableIndex, 1);
            // this.#revokes.get(<Table>_table)();
            this.#save();

            return true;
        } catch ( exception: unknown ) {
            const reason = `Error on access to ${tablePath}.`;

            if ( exception instanceof Error ) {
                exception.message += `. ${reason}`;
                throw exception;
            }

            throw new Error(reason);
        }
    }

    // shutdown(): ExitCode {
    //     return this.#save();
    // }
}

export default DbTex;
