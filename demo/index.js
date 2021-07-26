import path from 'path';
import { DbTex } from '../build/index.js';

const dbTex = new DbTex({
    directory: path.dirname(import.meta.url).replace('file://', ''),
    name: 'test-db'
});
