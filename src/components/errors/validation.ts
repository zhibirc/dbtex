class ValidationError extends Error {
    constructor ( message: string ) {
        super();

        this.message = message;
    }
}

export default ValidationError;