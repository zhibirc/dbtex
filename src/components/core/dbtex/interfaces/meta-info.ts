/**
 * Interface for meta-information database configuration file.
 *
 * @interface
 */

type TEncryptor = 'box';
type TDriver = 'csv' | 'tsv';
type THook = (value: unknown) => unknown;

interface IMetaInfo {
    location: string,
    name: string,
    prefix: string,
    fileSizeLimit: number,
    encrypt: boolean,
    encryptor: TEncryptor,
    driver: TDriver,
    beforeInsert(): THook,
    afterInsert(): THook,
    beforeSelect: THook,
    afterSelect: THook,
    beforeUpdate: THook,
    afterUpdate: THook,
    beforeDelete: THook,
    afterDelete: THook,
    creationDate: number,
    lastUpdate: number,
    checksum: string,
    tables: string[]
}


export default IMetaInfo;
