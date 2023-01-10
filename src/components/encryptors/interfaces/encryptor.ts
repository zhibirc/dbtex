/**
 * Common interface for data encryptor.
 *
 * @interface
 */

interface IEncryptor {
    encrypt: ( data: string ) => string;

    decrypt: ( data: string ) => string;
}


export default IEncryptor;
