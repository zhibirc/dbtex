/**
 * Methods for working with data serialization/deserialization.
 *
 * @module
 */

type TDeserializeResult = {
    error?: string,
    data?: any
};

/**
 *
 * @param data
 */
export function serialize ( data: unknown[] | {[key: string]: unknown} ): string {
    return JSON.stringify(data);
}

/**
 *
 * @param data
 */
export function deserialize ( data: string ): TDeserializeResult {
    try {
        return { data: JSON.parse(data) };
    } catch ( error ) {
        return {
            error: 'error parsing data'
        };
    }
}
