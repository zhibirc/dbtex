/**
 * Base/root configuration file with all required options and default presets.
 */

const options = {
    DATABASE_PATH: '/var/lib/dbtex',
    META_INFO_FILENAME: 'meta.json',
    FILE_SIZE_LIMIT: 2 ** 10 * 100,
    ENCRYPTION_KEY_MIN_LENGTH: 40,
    FORMAT_SUPPORT_LIST: ['csv', 'tsv', 'rec'],
    DEFAULT_FORMAT: 'csv'
};


export default Object.freeze(options);
