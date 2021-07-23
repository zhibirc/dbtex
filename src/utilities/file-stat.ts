import path from 'path';
import fs, { PathLike } from 'fs';

/**
 * Determine if given file/folder structure exists and allows access for read/write.
 * @example
 * '/home/zhibirc/projects/app/db/users'
 *
 * @example
 * [
 *     '/home/zhibirc/projects/app/db/shop/meta.json',
 *     '/home/zhibirc/projects/app/db/shop/customers',
 *     '/home/zhibirc/projects/app/db/shop/products'
 * ]
 *
 * @example
 * {
 *     '/home/zhibirc/projects/app/db/shop': {
 *         'meta.json': null
 *     }
 * }
 *
 * @example
 * {
 *     '/home/zhibirc/projects/app/db/shop': [
 *         'meta.json',
 *         'customers',
 *         'products'
 *     ]
 * }
 */
export function isFileStructureAccessable ( struct: string | string[] | object ): boolean {
    const paths: string[] = typeof struct === 'string'
        ? [struct]
        : Array.isArray(struct)
            ? struct
            : ((): string[] => {
                const result: string[] = [];
                const root = Object.keys(struct)[0];
                const current = Object.values(struct)[0];

                if ( !root ) {
                    return result;
                }

                if ( !current ) {
                    return result.concat(root);
                }

                Array.isArray(current)
                    ? current.forEach(entry => result.push(path.join(root, entry)))
                    : Object.keys(current).forEach(entry => result.push(path.join(root, entry)));

                return result;
            })();

    for ( let index = 0; index < paths.length; ++index ) {
        try {
            fs.accessSync(paths[index] as PathLike, fs.constants.W_OK);
        } catch {
            return false;
        }
    }

    return true;
}
