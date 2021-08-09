/**
 * POSIX-compatible approach to indicate an exit status for operation.
 */


export const EXIT_CODE_SUCCESS = 0;
export const EXIT_CODE_FAILURE = 1;

enum _ExitCode {
    EXIT_CODE_SUCCESS,
    EXIT_CODE_FAILURE
}


export type ExitCode = _ExitCode;
