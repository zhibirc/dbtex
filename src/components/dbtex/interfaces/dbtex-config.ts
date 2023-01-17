/**
 * Interface for database initial configuration (given from user on database creation).
 *
 * @interface
 */

import THook from '../types/hook';
import ITransformer from '../../transformers/interfaces/transformer';
import IEncryptor from '../../encryptors/interfaces/encryptor';

interface IDbTexConfig {
    name: string;
    location: string;
    fileSizeLimit: number;
    encrypt: boolean;
    encryptor: IEncryptor | null;
    prefix: string | (() => string);
    transformer: ITransformer;
    beforeInsert: THook;
    afterInsert: THook;
    beforeSelect: THook;
    afterSelect: THook;
    beforeUpdate: THook;
    afterUpdate: THook;
    beforeDelete: THook;
    afterDelete: THook;
    creationDate?: number;
    lastUpdate?: number;
    tables?: [],
    checksum?: string;
}

export default IDbTexConfig;
