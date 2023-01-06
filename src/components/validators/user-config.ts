/**
 * Validate configuration given from user.
 *
 * @module
 */

import { isObject, isSet, isNonEmptyString, isDirectory } from '../../utilities/is';
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
    const errors = [];

    if ( !isObject(value) ) {
        errors.push(`expect object, got ${getType(value)}`);
    } else {
        const { name, location } = value as IConfig;

        if ( isSet(location) && !isDirectory(location) ) {
            errors.push('"location" is invalid directory path');
        }

        if ( !isNonEmptyString(name) ) {
            errors.push(`"name" should be non-empty string, got ${getType(name)}`);
        }
    }

    return {
        error: errors.join('; ')
    };
}


export default validate;
