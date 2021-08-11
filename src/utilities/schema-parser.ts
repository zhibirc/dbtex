// types
import { Schema } from '../interfaces/types/schema';
import {DbTex} from '../components/dbtex';


export function parseSchema ( schema: Schema ): string[] {
    const result: string[] = [];

    for ( const [key, value] of Object.entries(schema) ) {
        // @ts-ignore
        result.push(`${key.trim()}(${Object.keys(DbTex.types).find(type => DbTex[type] === value)})`);
    }

    return result;
}
