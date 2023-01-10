/**
 * Common interface for data transformer.
 *
 * @interface
 */

interface ITransformer {
    readonly delimiter: string;

    read: () => string[];

    write: () => string;
}


export default ITransformer;
