/**
 * Validate configuration given from user.
 *
 * @module
 */

import { isObject, isSet, isNonEmptyString, isLikeNumber, isDirectory } from '../../utilities/is';
import hasFileAccess from '../../utilities/has-file-access';
import getType from '../../utilities/get-type';
import { UserConfig } from '../core/dbtex';

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
function validate ( value: unknown ): ValidationResult {
    if ( !isObject(value) ) {
        return {
            error: `expect object, got ${getType(value)}`
        };
    }

    const { name, location, fileSizeLimit } = value as UserConfig;
    const errors = [];

    isNonEmptyString(name) || errors.push(`name should be non-empty string, got ${getType(name)}`);

    // location is optional, check only if it's set
    if ( isSet(location) ) {
        isDirectory(location)
            ? hasFileAccess(location as string) || errors.push(`write access is denied for "${location}"`)
            : errors.push(`"${location}" is invalid directory path`);
    }

    if ( isSet(fileSizeLimit) ) {
        if ( !isLikeNumber(fileSizeLimit) || Number(fileSizeLimit) <= 0 ) {
            errors.push('"fileSizeLimit" property should be a positive number');
        }
    }

    return {
        error: errors.join(';\n')
    };
}


export default validate;
