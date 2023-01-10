/**
 * Interface for meta-information database configuration file.
 *
 * @interface
 */

import THook from '../types/hook';

type TDriver = 'csv' | 'tsv';

interface IMetaInfo {
    location: string;
    name: string;
    prefix: string;
    fileSizeLimit: number;
    encrypt: boolean;
    driver: TDriver;
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


export default IMetaInfo;
