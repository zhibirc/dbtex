import { AppConfig } from './app-config';


export type Meta = AppConfig & {
    driver: string,
    encrypt: boolean,
    encryptor: string,
    checksum: string | null,
    creationDate: number,
    lastUpdate: number,
    tables: string,
    beforeInsert: string,
    afterInsert: string,
    beforeSelect: string,
    afterSelect: string,
    beforeUpdate: string,
    afterUpdate: string,
    beforeDelete: string,
    afterDelete: string
}
