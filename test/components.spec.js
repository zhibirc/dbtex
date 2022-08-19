import { expect } from 'chai';

import { DbTex } from '../src/component/dbtex.ts';
import { Table } from '../src/component/table.ts';
import { DriverCsv } from '../src/driver/csv.js';
import { DriverTsv } from '../src/driver/tsv.js';
import { Encryptor } from '../src/utility/encryptor.js';


function isClass ( value ) {
    return typeof value === 'function'
        && /^class\s/.test(Function.prototype.toString.call(value));
}

describe('Base component classes', () => {
    it('DbTex is a root class for constructing databases.', () => expect(isClass(DbTex)).to.be.true);
    it('Table is a class for constructing database tables.', () => expect(isClass(Table)).to.be.true);
    it('DriverCsv is a class for translate data in according to CSV format.', () => expect(isClass(DriverCsv)).to.be.true);
    it('DriverTsv is a class for translate data in according to TSV format.', () => expect(isClass(DriverTsv)).to.be.true);
    it('Encryptor is a class for encrypt/decrypt data stored in tables.', () => expect(isClass(Encryptor)).to.be.true);
});

describe('New DBTEX instance creation', () => {/**/});
describe('Manipulation with tables', () => {/**/});
