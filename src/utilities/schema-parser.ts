import {Schema} from '../interfaces/schema';


export function parseSchema ( schema: Schema ): string[] {
    const result: string[] = [];

    for ( const [key, value] of Object.entries(schema) ) {
        result.push(`${key}(${value})`);
    }

    return result;
}
