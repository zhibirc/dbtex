import { UserConfig } from './user-config.js';
import { Table } from '../table.js';
import { Dsv } from '../dsv.js';
import { Encryptor } from '../encryptor.js';
import { Record } from './record.js';
import { ExitCode } from './exit-code.js';


export type AppConfig = UserConfig & {
    driver: Dsv,
    encrypt: boolean,
    encryptor: Encryptor,
    checksum: string | null,
    creationDate: number,
    lastUpdate: number,
    beforeInsert(record: Record): Record,
    afterInsert(record: string): ExitCode,
    beforeSelect(): boolean,
    afterSelect(record: string): ExitCode,
    beforeUpdate(record: Record): Record,
    afterUpdate(record: string): ExitCode,
    beforeDelete(record: Record): ExitCode,
    afterDelete(record: string): ExitCode
    tables: Table[]
}
