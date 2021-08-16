import { dirname } from 'path';
import { fileURLToPath } from 'url';
import { DbTex } from '../build/index.js';


// create database
const dbTex = new DbTex({
    directory: dirname(fileURLToPath(import.meta.url)),
    name: 'test-db'
});

console.log(dbTex);

// create table "Customers"
dbTex.createTable('Customers');
