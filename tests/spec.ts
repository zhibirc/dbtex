// external
import { expect } from 'chai';

// classes
import { DbTex } from '../src';
import { Table } from '../src/components/table';
import { DriverCsv } from '../src/drivers/csv';
import { DriverTsv } from '../src/drivers/tsv';
import { Encryptor } from '../src/utilities/encryptor';


function isClass ( value: unknown ): boolean {
    return typeof value === 'function'
        && /^class\s/.test(Function.prototype.toString.call(value));
}

describe('Component classes availability:', () => {
    expect(isClass(DbTex), 'DbTex is a root class for constructing databases.').to.be.true;
    expect(isClass(Table), 'Table is a class for constructing database tables.').to.be.true;
    expect(isClass(DriverCsv), 'DriverCsv is a class for translate data in according to CSV format.').to.be.true;
    expect(isClass(DriverTsv), 'DriverTsv is a class for translate data in according to TSV format.').to.be.true;
    expect(isClass(Encryptor), 'Encryptor is a class for encrypt/decrypt data stored in tables.').to.be.true;
});

describe('New DBTEX instance creation', () => {/**/});
describe('Manipulation with tables', () => {/**/});
