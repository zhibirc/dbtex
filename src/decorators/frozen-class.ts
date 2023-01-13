function frozenClass ( constructorFn: Function ): void {
    Object.freeze(constructorFn);
    Object.freeze(constructorFn.prototype);
}

export default frozenClass;
