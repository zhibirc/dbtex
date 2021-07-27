/**
 * Create Curried Function.
 *
 * @see {@link https://en.wikipedia.org/wiki/Currying}
 *
 * @example
 * const drawFace = (eyes, nose, smile) => eyes + nose + smile;
 *
 * curry(drawFace)(':')('-')(')'); // :-)
 */
export function curry ( func: Function, argsLength?: number ): Function {
    argsLength = argsLength || func.length;

    if ( !argsLength ) {
        return func;
    }

    const allParams: any[] = [];

    return function curried ( ...params: any ): Function | any {
        if ( !params.length ) {
            return curried;
        }

        params = params.slice(0, argsLength);
        allParams.push(...params);

        return allParams.length < <number>argsLength ? curried : func(...allParams);
    };
}


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
export function compose ( ...funcs: Function[] ) {
    if ( !funcs.length ) {
        throw new SyntaxError('"compose" expected at least one argument, but got 0');
    }

    return function ( ...params: any ): any {
        let result: any = (funcs.pop() as Function)(...params);

        while ( funcs.length ) {
            result = (funcs.pop() as Function)(result);
        }

        return result;
    };
}
