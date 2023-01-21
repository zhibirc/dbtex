/**
 * Interface for meta-information database configuration file.
 *
 * @interface
 */

import TFormat from '../types/format';

interface IMetaInfoInternal {
    name: string;
    location: string;
    prefix: string;
    fileSizeLimit: number;
    encrypt: boolean;
    encryptionKey: null;
    format: TFormat;
    creationDate: number;
    lastUpdate: number;
    checksum: string;
    tables: string[];
}

export default IMetaInfoInternal;
