interface IMetaInfoExternal {
    /**
     * Database name.
     */
    name: string;

    /**
     * Database location.
     * An absolute path to local directory or remote resource URI.
     */
    location: string;
}

export default IMetaInfoExternal;
