/**
 * Implement Data Encryption for database tables.
 * It's default encryption engine, which can be replaced with custom one.
 */

import crypto, { Cipher } from 'crypto';
import IEncryptor from './interfaces/encryptor';

class Encryptor implements IEncryptor {
    private readonly algorithm: string;
    private readonly secretKey: string;
    private readonly initVector: Buffer;

    constructor () {
        // relatively fast, because of using parallelization
        this.algorithm = 'aes-256-ctr';
        this.secretKey = 'fZp8FHoBKaSlFzbq2mJMyEjBQHL19gy2';
        this.initVector = crypto.randomBytes(16);
    }

    encrypt ( data: string ): string {
        const cipher: Cipher = crypto.createCipheriv(this.algorithm, this.secretKey, this.initVector);

        return cipher.update(data, 'utf8', 'hex') + cipher.final('hex');
    }

    decrypt ( data: string ): string {
        const decipher: Cipher = crypto.createDecipheriv(this.algorithm, this.secretKey, this.initVector);

        return decipher.update(data, 'hex', 'utf8') + decipher.final('utf8');
    }
}


export default Encryptor;
