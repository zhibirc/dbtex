/**
 * Implement hashing for database meta information.
 *
 * Use dynamic salt for hashing. Actually, salt is building with three steps:
 * 1) There is a fixed static random sequence of pattern /^\S{20,}$/i as a base salt.
 * 2) Each "non-word" character is replaced by other character based on its UTF code multiplied by 2.
 * 3) Given salt is concatenated with the sum of all character codes in input text.
 */

// built-ins
import crypto from 'crypto';


const getCharCodesSum = (text: string) => [...text].reduce((result, char) => result + char.charCodeAt(0), 0);


export class Hasher {
    #salt: string;

    constructor () {
        // TODO: implement reading from local config file or through setup configuration
        this.#salt = 's(IsCt--ZnXwcaH2CshnaTa8UB?6thbPCxNFDkt5rKKyhwG4ztIMq6!x1A6>'.replace(/\W/g, char => String.fromCharCode(char.charCodeAt(0) * 2));
    }

    // TODO: probably, implement PBKDF specification algorithm
    hash ( text: string ): string {
        this.#salt += getCharCodesSum(text);

        const hash = crypto.createHash('sha256');

        hash.update(this.#salt.slice(0, this.#salt.length / 2) + text + this.#salt.slice(this.#salt.length / 2));

        return hash.digest('hex');
    }

    verify ( text: string, hash: string ): boolean {
        this.#salt += getCharCodesSum(text);

        return this.hash(this.#salt.slice(0, this.#salt.length / 2) + text + this.#salt.slice(this.#salt.length / 2)) === hash;
    }
}
