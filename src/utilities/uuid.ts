import crypto from 'crypto';


// @ts-ignore
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function uuid ( algorithm?: string ): string {
    // 1 choice
    // TODO: move to constant
    // const buffer = Buffer.alloc(32);
    //
    // return crypto.randomFillSync(buffer).toString('hex');

    // 2 choice
    // use randomUUID() which is much faster than uuid() NPM package
    return crypto.randomUUID();
}
