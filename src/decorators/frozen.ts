function frozen ( constructorFn: Function ): void {
    Object.freeze(constructorFn);
    Object.freeze(constructorFn.prototype);
}

export default frozen;
