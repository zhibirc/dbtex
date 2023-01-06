import fs from 'fs';

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

function isNonEmptyString ( value: unknown ): boolean {
    return isString(value) && (value as string).trim().length > 0;
}

function isLikeNumber ( value: unknown ): boolean {
    return Number.isFinite(parseFloat(<string>value));
}

function isDirectory ( value: unknown ): boolean {
    if ( !isNonEmptyString(value) ) return false;

    const stats = fs.statSync(value as string);

    return stats.isDirectory();
}

function isHook ( value: unknown ): boolean {
    return typeof value === 'function';
}

function isEncryptor (value: unknown): boolean {
    return isObject(value) && typeof value.encrypt === 'function' && typeof value.decrypt === 'function';
}

function isDriver ( value: unknown ): boolean {
    return isObject(value) && typeof value.write === 'function' && typeof value.read === 'function';
}


export {
    isSet,
    isObject,
    isString,
    isNonEmptyString,
    isLikeNumber,
    isDirectory,
    isHook,
    isEncryptor,
    isDriver
};
