export class ConfigError extends Error {
    constructor ( value: unknown ) {
        super();

        this.message = `${value} is not a valid database configuration`;
    }
}
