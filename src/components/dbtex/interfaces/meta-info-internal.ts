/**
 * Interface for meta-information database configuration file.
 *
 * @interface
 */

import THook from '../types/hook';
import TTransformer from '../types/transformer';

interface IMetaInfoInternal {
    name: string;
    location: string;
    prefix: string;
    fileSizeLimit: number;
    encrypt: boolean;
    encryptionKey: null;
    driver: TTransformer;
    beforeInsert(): THook;
    afterInsert(): THook;
    beforeSelect: THook;
    afterSelect: THook;
    beforeUpdate: THook;
    afterUpdate: THook;
    beforeDelete: THook;
    afterDelete: THook;
    creationDate: number;
    lastUpdate: number;
    checksum: string;
    tables: string[];
}

export default IMetaInfoInternal;
