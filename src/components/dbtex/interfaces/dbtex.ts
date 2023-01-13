/**
 * Interface for main DbTex application module.
 *
 * @interface
 */

import ITable from '../../table/interfaces/table';
import IMetaInfoExternal from './meta-info-external';

interface IDbTex {
    getMetaInfo: () => IMetaInfoExternal;

    createTable: (name: string, schema?: JSON) => ITable;

    dropTable: (name: string) => boolean | never;
}

export default IDbTex;
