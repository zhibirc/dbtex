import fs from 'fs';
import { EXIT_CODE_SUCCESS, EXIT_CODE_FAILURE } from '../constants/exit-codes';


export function save ( what: any, where: string ): number {
    try {
        fs.writeFileSync(where, what, {flag: 'r+'});

        return EXIT_CODE_SUCCESS;
    } catch {
        return EXIT_CODE_FAILURE;
    }
}
