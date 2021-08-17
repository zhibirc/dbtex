import { Table } from '../table';


export type Meta = {
    directory: string,
    name: string,
    prefix: string,

    driver: string,
    encrypt: boolean,
    encryptor: string,
    tables: Table[],

    beforeInsert: string,
    afterInsert: string,
    beforeSelect: string,
    afterSelect: string,
    beforeUpdate: string,
    afterUpdate: string,
    beforeDelete: string,
    afterDelete: string,

    fileSizeLimit: number,
    creationDate: number,
    lastUpdate: number,
    checksum: string | null
}
