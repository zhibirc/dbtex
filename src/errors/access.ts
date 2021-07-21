export class AccessError extends Error {
    constructor ( path: string ) {
        super();
        this.message = `Access to ${path} file system object for read-write is prohibited.`;
    }
}
