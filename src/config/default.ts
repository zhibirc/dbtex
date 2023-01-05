/**
 * Base/root configuration file with all required options and default presets.
 */

const options = {
    DATABASE_PATH: '/var/lib/dbtex',
    META_INFO_FILENAME: 'meta.json',
    FILE_SIZE_LIMIT: 2 ** 10 * 100,
    FEATURE_TYPE_BOX: 'box',
    FEATURE_TYPE_CUSTOM: 'custom',
};


export default Object.freeze(options);