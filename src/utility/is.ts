import fs from 'fs';

/**
 * Check if the given value is strictly an Object.
 * @export
 * @param {*} value - value to test for
 *
 * @return {boolean} result
 */
export function isObject ( value: unknown ): boolean {
    return Object.prototype.toString.call(value) === '[object Object]';
}

export function isString ( value: unknown ): boolean {
    return typeof value === 'string';
}

export function isNonEmptyString ( value: unknown ): boolean {
    return isString(value) && (value as string).trim().length > 0;
}

export function isDirectory ( value: unknown ): boolean {
    if ( !isNonEmptyString(value) ) return false;

    const stats = fs.statSync(value as string);

    return stats.isDirectory();
}

export function isHook ( value: unknown ): boolean {
    return typeof value === 'function';
}

export function isEncryptor (value: unknown): boolean {
    // @ts-ignore
    return isObject(value) && typeof value.encrypt === 'function' && typeof value.decrypt === 'function';
}

export function isDriver ( value: unknown ): boolean {
    // @ts-ignore
    return isObject(value) && typeof value.write === 'function' && typeof value.read === 'function';
}
