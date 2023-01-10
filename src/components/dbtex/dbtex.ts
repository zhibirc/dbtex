/**
 * Main application module.
 * @class
 */


import path from 'path';

import { Table } from '../table/table';
import CsvTransformer from '../transformers/csv';
import TsvTransformer from '../transformers/tsv';

import { fs } from '../../utilities/fs';
import { serialize, deserialize } from '../../utilities/serialize';
import { convertToBytes } from '../../utilities/unit-converters';
import { validateSchema } from '../../utilities/schema-validator';
import { parseSchema } from '../../utilities/schema-parser';
import { nop } from '../../utilities/nop';
import Encryptor from '../encryptors/encryptor';
import { Hasher } from '../../utilities/hasher';
import { isObject, isDriver, isEncryptor, isHook } from '../../utilities/is';

import { EXIT_CODE_SUCCESS, EXIT_CODE_FAILURE } from '../../constants/exit-codes';
import baseConfig from '../../config/base';
import validateUserConfig from '../validators/user-config';
import normalizeUserConfig from '../normalizers/user-config';
import hasFileAccess from '../../utilities/has-file-access';

import IDbTex from './interfaces/dbtex';
import IUserConfig from './interfaces/user-config';
import IMetaInfo from './interfaces/meta-info';
import { IConfigResult } from '../normalizers/user-config';


const hasher = new Hasher();


export default class DbTex implements IDbTex {
    #config!: IMetaInfo;
    // mapping of table proxy instances to corresponding revoke functions
    #revokes;

    constructor ( config: IUserConfig ) {
        const { error } = validateUserConfig(config);

        if ( error ) {
            throw new TypeError(`Invalid configuration: ${error}`);
        }

        const { name, location, fileSizeLimit, encrypt } = normalizeUserConfig(config);

        this.#revokes = new WeakMap();

        // try to use existent database from persistent storage instead of creating new instance
        if ( hasFileAccess({
            [path.join(location, name)]: [
                baseConfig.META_INFO_FILENAME
            ]
        }) ) {
            const { error, data: meta } = deserialize(fs.read(path.join(
                location,
                name,
                baseConfig.META_INFO_FILENAME
            )));

            if ( error ) {
                throw new SyntaxError(error);
            }

            const hash = (meta as IMetaInfo).checksum;

            delete meta.checksum;

            // verify checksum to ensure it makes sense for further initialization
            if ( !hash || !hasher.verify(serialize(meta), hash) ) {
                throw new Error('database metadata is corrupt, checksum mismatch');
            }

            this.#init(true, {
                ...meta,
                checksum: hash
            });
        } else {
            this.#init(false, {
                name,
                location,
                fileSizeLimit,
                encrypt
            });
        }
    }

    /**
     * Parse given config, analyze, merge with existing if any, and initialize inner structures.
     *
     * @private
     *
     * @param {boolean} isExist - is database already exist or new one should be created
     * @param {Object} config - initialization options for new database
     */
    #init ( isExist: boolean, config: IMetaInfo | IConfigResult ) {
        if ( isExist ) {
            const {
                driver,
                encrypt,
                encryptor
            } = this.#config;

            const throwConfigError = <T>(value: T): never => {
                throw new TypeError(`configuration error: ${value as T}`);
            };

            // if meta config says that databases uses custom driver,
            // then user should specify an appropriate API object for this in config
            if ( driver === FEATURE_TYPE_CUSTOM ) {
                isDriver(config.driver)
                    ? (this.#config.driver = new config.driver())
                    : throwConfigError(config);
            } else {
                this.#config.driver = driver === DriverCsv.name
                    ? new DriverCsv()
                    : driver === DriverTsv.name
                        ? new DriverTsv()
                        : throwConfigError({driver});
            }

            'log' in config && (this.#config.log = config.log === true);
            'report' in config && (this.#config.report = config.report === true);
            'encrypt' in config && (this.#config.encrypt = config.encrypt === true);

            const isUserEncryptor = isEncryptor(config.encryptor);

            if ( encrypt ) {
                if ( encryptor === FEATURE_TYPE_BOX ) {
                    this.#config.encryptor = new Encryptor();
                } else if ( encryptor === FEATURE_TYPE_CUSTOM ) {
                    isUserEncryptor
                        ? (this.#config.encryptor = new config.encryptor())
                        : throwConfigError(config);
                }
            } else { // in this case we can change encryptor engine
                isUserEncryptor && (this.#config.encryptor = new config.encryptor());
            }

            [
                'beforeInsert',
                'afterInsert',
                'beforeSelect',
                'afterSelect',
                'beforeUpdate',
                'afterUpdate',
                'beforeDelete',
                'afterDelete'
            ].forEach(name => (this.#config[name] = isHook(config[name]) ? config[name] : eval(this.#config[name])));

            // re-save configuration as meta data
            this.#save();
        } else {
            this.#config.name = config.name;
            this.#config.location = config.location;
            this.#config.fileSizeLimit = convertToBytes(config.fileSizeLimit);
            this.#config.encrypt = config.encrypt;
            this.#config.encryptor ??= new Encryptor();
            this.#config.creationDate = Date.now();
            this.#config.lastUpdate = Date.now();
            this.#config.tables = [];
            this.#config.driver = new DriverCsv();
            this.#config.beforeInsert ??= nop;
            this.#config.afterInsert ??= nop;
            this.#config.beforeSelect ??= nop;
            this.#config.afterSelect ??= nop;
            this.#config.beforeUpdate ??= nop;
            this.#config.afterUpdate ??= nop;
            this.#config.beforeDelete ??= nop;
            this.#config.afterDelete ??= nop;
            this.#config.log = config.log === true;
            this.#config.report = config.report === true;

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
        const driver = this.#config.driver;
        const meta: Meta = {
            directory: this.#config.directory,
            name: this.#config.name,
            prefix: <string>this.#config.prefix,
            fileSizeLimit: <number>this.#config.fileSizeLimit,
            encrypt: this.#config.encrypt,
            encryptor: this.#config.encryptor instanceof Encryptor ? FEATURE_TYPE_BOX : FEATURE_TYPE_CUSTOM,
            driver: driver instanceof DriverCsv || driver instanceof DriverTsv
                ? Object.getPrototypeOf(driver).constructor.name
                : FEATURE_TYPE_CUSTOM,
            beforeInsert: this.#config.beforeInsert.toString(),
            afterInsert:  this.#config.afterInsert.toString(),
            beforeSelect: this.#config.beforeSelect.toString(),
            afterSelect:  this.#config.afterSelect.toString(),
            beforeUpdate: this.#config.beforeUpdate.toString(),
            afterUpdate:  this.#config.afterUpdate.toString(),
            beforeDelete: this.#config.beforeDelete.toString(),
            afterDelete:  this.#config.afterDelete.toString(),
            creationDate: this.#config.creationDate,
            lastUpdate: this.#config.lastUpdate,
            tables: this.#config.tables,
            log: this.#config.log,
            report: this.#config.report
        };

        meta.checksum = hasher.hash(serialize(meta));

        try {
            fs.save(
                path.join(this.location, META_INFO_FILE_NAME),
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
    createTable ( name: string, schema?: JSON ): Table | never {
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
     * @return {boolean|} - true in case if success or an object with error reason on failure
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
