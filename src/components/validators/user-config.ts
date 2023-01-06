/**
 * Validate configuration given from user.
 *
 * @module
 */

import { isObject, isSet, isNonEmptyString, isDirectory } from '../../utilities/is';
import hasFileAccess from '../../utilities/has-file-access';
import getType from '../../utilities/get-type';
import { IConfig } from '../core/dbtex';

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

    const { name, location } = value as IConfig;
    const errors = [];

    // location is optional, check only if it's set
    if ( isSet(location) ) {
        isDirectory(location)
            ? hasFileAccess(location as string) || errors.push(`write access is denied for "${location}"`)
            : errors.push(`"${location}" is invalid directory path`);
    }

    isNonEmptyString(name) || errors.push(`name should be non-empty string, got ${getType(name)}`);

    return {
        error: errors.join('; ')
    };
}


export default validate;
