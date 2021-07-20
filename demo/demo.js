import path from 'path';
import { DbTex } from '../src';

const dbTex = new DbTex({
    directory: path.join(__dirname, 'db')
});

// TODO
