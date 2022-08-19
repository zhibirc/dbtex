import fs from 'fs';


export class AccessError extends Error {
    public readonly message: string;

    constructor ( path: string ) {
        super();

        this.message = `access to ${fs.statSync(path).isFile() ? 'file' : 'directory'} ${path} is prohibited`;
    }
}
