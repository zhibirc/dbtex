/**
 * Methods for working with data serialization/deserialization.
 *
 * @module
 */


/**
 *
 * @param data
 */
export function serialize ( data: any[] | {[key: string]: unknown} ): string {
    return JSON.stringify(data);
}

/**
 *
 * @param data
 */
export function deserialize ( data: string ): any[] | {[key: string]: unknown} {
    return JSON.parse(data);
}
