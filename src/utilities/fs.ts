// built-ins
import * as native from 'fs';

// types
import { ExitCode } from '../interfaces/types/exit-code.js';

// constants
import { EXIT_CODE_FAILURE, EXIT_CODE_SUCCESS } from '../constants/exit-codes.js';


const fileAccessModes = {
    APPEND: 'a',
    TRUNC:  'w'
};

const types = {
    FILE: Symbol('FILE'),
    DIRECTORY: Symbol('DIRECTORY')
};

const defaultEncoding = 'utf8';


export const fs = {
    types,

    modes: fileAccessModes,

    make ( path: string, type: symbol ) {
        if ( type === types.DIRECTORY ) {
            native.mkdirSync(path);
        }

        return fs;
    },

    read ( path: string, encoding: BufferEncoding = defaultEncoding): string {
        return native.readFileSync(path, {encoding});
    },

    save ( where: string, what: string, flag: string = fileAccessModes.APPEND ): ExitCode {
        try {
            native.writeFileSync(where, what, {flag});

            return EXIT_CODE_SUCCESS;
        } catch {
            return EXIT_CODE_FAILURE;
        }
    },

    delete ( path: string ): ExitCode {
        native.unlinkSync(path);

        // TODO: think about better error handling for methods which return void
        return EXIT_CODE_SUCCESS;
    }
};
