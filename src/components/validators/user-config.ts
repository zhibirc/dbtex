import {IConfig} from '../core/dbtex';
import { isObject, isString, isDirectory } from '../../utilities/is';
import getType from '../../utilities/get-type';

type ValidationResult = {
    error: null | string
};

/**
 *
 * @param {*} value
 *
 * @return {ValidationResult} validation result
 */
function validate ( value: unknown ): ValidationResult {
    let error = null;

    if ( !isObject(value) ) {
        error = `expect object, got ${getType(value)}`;
    } else {
        const { location, name } = value as IConfig;

        if ( !isDirectory(location) ) {
            error = '"location" is invalid directory path';
        }

        if ( !isString(name) ) {
            error += `; "name" should be of type string, got ${getType(name)}`;
        }
    }

    return {
        error
    };
}


export default validate;
