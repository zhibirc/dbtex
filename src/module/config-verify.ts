/**
 * Verify if given config is an appropriate configuration object.
 */

import {ConfigError} from '../error/config-error';
import {isDirectory, isNonEmptyString, isObject} from '../utility/is';

const errors = {
    NOT_OBJECT: 'Configuration file should be an object',
    INVALID_NAME: 'Database name should be non-empty string',
    INVALID_LOCATION: 'Database location should be a valid directory path'
};

function verifyConfig ( config: unknown ): never | void {
    if ( !isObject(config) ) throw new ConfigError(errors.NOT_OBJECT);

    const reportList = [];
    const {name, location} = config as {[key: string]: unknown};

    isNonEmptyString(name) || reportList.push(errors.INVALID_NAME);
    isDirectory(location) || reportList.push(errors.INVALID_LOCATION);

    if ( reportList.length > 0 ) {
        throw new ConfigError(reportList.join('\n'));
    }
}

export { verifyConfig };
