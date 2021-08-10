import { dirname } from 'path';
import { fileURLToPath } from 'url';
import { DbTex } from '../build/index.js';


const dbTex = new DbTex({
    directory: dirname(fileURLToPath(import.meta.url)),
    name: 'test-db'
});
