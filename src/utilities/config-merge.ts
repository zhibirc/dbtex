/**
 * Merge of given configuration entities.
 * Usually, this action is required for user defined config and basic system config.
 */

type TConfigList = {[key: string]: unknown}[];

function mergeConfigs ( ...configList: TConfigList ) {
    return configList.reduce((result, item) => ({...result, ...item}), {});
}

export { mergeConfigs };
