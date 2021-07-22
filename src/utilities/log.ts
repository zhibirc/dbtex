/**
 * Custom tiny logger configurable with four log-levels.
 * Add common useful info to debug messages.
 * Output debug info as a multiline dictionary form with meta-data.
 */

const format = (data: any): string => data;

log.INFO    = Symbol('log.INFO');
log.SUCCESS = Symbol('log.SUCCESS');
log.WARNING = Symbol('log.WARNING');
log.FAILURE = Symbol('log.FAILURE');


export function log ( data: any, level: Symbol = log.INFO ): void {
    const { INFO, SUCCESS, WARNING, FAILURE } = log;

    const levelsMap = {
        [INFO]: value => value,
        [SUCCESS]: value => value,
        [WARNING]: value => value,
        [FAILURE]: value => value
    };

    // @ts-ignore
    const value = levelsMap[level](format(data));

    console.log(value);
}
