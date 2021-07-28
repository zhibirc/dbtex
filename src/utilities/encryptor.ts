// built-ins
import crypto from 'crypto';

// interfaces
import { Encryptor as EncryptorInterface } from '../interfaces/encryptor';


export class Encryptor implements EncryptorInterface {
    private readonly secretKey: string;

    encrypt ( data: string ): string {
        return data;
    }

    decrypt ( data: string ): string {
        return data;
    }
}
