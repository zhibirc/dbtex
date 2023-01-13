/**
 * Set of utility helper functions/checkers for application business logic.
 */

import fs from 'fs';
import baseConfig from '../config/base';

function isSet ( value: unknown ): boolean {
    return value != undefined;
}

/**
 * Check if the given value is strictly an Object.
 * @export
 * @param {*} value - value to test for
 *
 * @return {boolean} result
 */
function isObject ( value: unknown ): boolean {
    return Object.prototype.toString.call(value) === '[object Object]';
}

function isString ( value: unknown ): boolean {
    return typeof value === 'string';
}

function isBoolean ( value: unknown ): boolean {
    return value === true || value === false;
}

function isEncryptionKey ( value: unknown ): boolean {
    return isNonEmptyString(value)
        && (value as string).length >= baseConfig.ENCRYPTION_KEY_MIN_LENGTH
        && /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]+$/.test(value as string); // TODO: add special symbols
}

function isNonEmptyString ( value: unknown ): boolean {
    return isString(value) && (value as string).trim().length > 0;
}

function isPositiveNumber ( value: unknown ) {
    return typeof value === 'number' && !Number.isNaN(value) && value > 0;
}

function isLikeNumber ( value: unknown ): boolean {
    return Number.isFinite(parseFloat(<string>value));
}

function isName ( value: unknown ): boolean {
    return isNonEmptyString(value) && /^_{,2}(?=.*[a-z])(?=.*\d)[a-z\d]{2,63}_{,2}$/i.test(value as string);
}

function isPrefix ( value: unknown ): boolean {
    if ( isNonEmptyString(value) ) {
        return true;
    }

    if ( typeof value === 'function' ) {
        // it should return a string to be a valid table prefix "generator"
        return isNonEmptyString(value());
    }

    return false;
}

function isDirectory ( value: unknown ): boolean {
    if ( !isNonEmptyString(value) ) return false;

    const stats = fs.statSync(value as string);

    return stats.isDirectory();
}

function isHook ( value: unknown ): boolean {
    return typeof value === 'function';
}

function isDriver ( value: unknown ): boolean {
    return isObject(value) && typeof value.write === 'function' && typeof value.read === 'function';
}

export {
    // checks for primitives and nominal types
    isSet,
    isObject,
    isString,
    isBoolean,

    // composite checks for primitives and nominal types
    isNonEmptyString,
    isPositiveNumber,
    isLikeNumber,

    // domain-specific checks
    isName,
    isEncryptionKey,
    isPrefix,
    isDirectory,
    isHook,
    isDriver
};
