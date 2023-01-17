/**
 * Common interface for data transformer.
 *
 * @interface
 */

interface ITransformer {
    readonly delimiter: string;

    read: ( data: string | string[] ) => string[] | string[][];

    write: ( data: string | string[] ) => string;
}


export default ITransformer;
