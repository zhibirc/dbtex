function convertToBytes ( value: number | string): number {
    // TODO: make these checks stricter
    if ( typeof value === 'number' ) {
        return value;
    }

    if ( String(+value) === value ) {
        return +value;
    }

    const suffixMap = {
        KB: 10**3,
        KIB: 2**10,
        MB: 10**6,
        MIB: 2**20
    };

    const [, prefix, suffix] = value.trim().match(/^(\d+) *([^\W\d_]{2,3})$/);

    // if ( !prefix || !suffix ) {
    //     return null;
    // }

    return prefix * suffixMap[suffix];
}

export default convertToBytes;
