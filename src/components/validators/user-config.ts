/**
 * Validate configuration given from user.
 *
 * @module
 */

// TODO: check the order of imported members and support it in the future
import {
    isSet,
    isObject,
    isBoolean,
    isName,
    isPositiveNumber,
    isDirectory,
    isPrefix,
    isEncryptionKey
} from '../../utilities/is';
import hasFileAccess from '../../utilities/has-file-access';
import getType from '../../utilities/get-type';
import { IUserConfig } from '../dbtex';

type ValidationResult = {
    error: null | string
};

/**
 * Validate if passed data is a valid database init configuration.
 *
 * @param {*} value - data given from user as configuration
 *
 * @return {ValidationResult} validation result
 */
function validate ( value: IUserConfig ): ValidationResult {
    if ( !isObject(value) ) {
        return {
            error: `expect object, got ${getType(value)}`
        };
    }

    const {
        name,
        location,
        fileSizeLimit,
        encrypt,
        encryptionKey,
        prefix,
        transformer,
        beforeInsert,
        afterInsert,
        beforeSelect,
        afterSelect,
        beforeUpdate,
        afterUpdate,
        beforeDelete,
        afterDelete
    } = value;
    const errors = [];

    // TODO: improve error message
    isName(name) || errors.push(`"name" should be non-empty string consisted of [A-Za-z0-9_] only, got ${getType(name)}`);

    // location is optional, check only if it's set (as well as many other options)
    if ( isSet(location) ) {
        isDirectory(location)
            ? hasFileAccess(location as string) || errors.push(`write access is denied for "${location}"`)
            : errors.push(`"${location}" is invalid directory path`);
    }

    if ( isSet(fileSizeLimit) && !isPositiveNumber(fileSizeLimit) ) {
        errors.push('"fileSizeLimit" should be a positive number');
    }

    if ( isSet(encrypt) && !isBoolean(encrypt) ) {
        errors.push(`"encrypt" should be a boolean value, got ${getType(encrypt)}`);
    }

    if ( encrypt === true && !isEncryptionKey(encryptionKey) ) {
        errors.push('encryption key should be provided if encryption is enabled');
    }

    if ( isSet(prefix) && !isPrefix(prefix) ) {
        errors.push('"prefix" should be a non-empty string or a function returning a string');
    }

    return {
        error: errors.join(';\n')
    };
}


export default validate;
