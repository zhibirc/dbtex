/**
 * Check if the given value is strictly an Object.
 * @export
 * @param {*} value - value to test for
 *
 * @return {boolean} result
 */
export function isObject ( value: unknown ): boolean {
    return value !== null && typeof value === 'object';
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
