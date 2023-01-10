// components
import { DbTex } from '../components/dbtex/dbtex.ts';


export function parseSchema ( schema ) {
    const result: string[] = [];

    for ( const [key, value] of Object.entries(schema) ) {
        result.push(`${key.trim()}(${Object.keys(DbTex.types).find(type => DbTex[type] === value)})`);
    }

    return result;
}
