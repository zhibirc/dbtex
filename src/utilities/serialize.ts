/**
 * Abstract methods for working with data serialization.
 */


export function serialize ( data: any[] | object ): string {
    return JSON.stringify(data);
}

export function deserialize ( data: string ): any[] | object {
    return JSON.parse(data);
}
