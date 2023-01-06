/**
 * Create Function Composition.
 *
 * @see {@link https://en.wikipedia.org/wiki/Function_composition_(computer_science)}
 *
 * @example
 * const addEyes = part => ':' + part;
 * const addNose = part => '-' + part;
 * const addSmile = () => ')';
 *
 * compose(addEyes, addNose, addSmile)(); // :-)
 */
export function compose ( ...funcs: (() => unknown)[] ) {
    if ( !funcs.length ) {
        throw new SyntaxError('"compose" expected at least one argument, but got 0');
    }

    return function ( ...params: any ): any {
        // @ts-ignore
        let result: any = funcs.pop()(...params);

        while ( funcs.length ) {
            // @ts-ignore
            result = funcs.pop()(result);
        }

        return result;
    };
}
