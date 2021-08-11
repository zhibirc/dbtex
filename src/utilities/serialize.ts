/**
 * Abstract methods for working with data serialization.
 */


export function serialize ( data: any[] | {[key: string]: unknown} ): string {
    return JSON.stringify(data);
}

export function deserialize ( data: string ): any[] | {[key: string]: unknown} {
    return JSON.parse(data);
}
