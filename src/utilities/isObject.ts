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
