const OFF = 0;
const ERROR = 2;

module.exports = {
    env: {
        es2021: true,
        node: true
    },
    extends: [
        'eslint:recommended',
        'plugin:@typescript-eslint/recommended'
    ],
    overrides: [],
    parser: '@typescript-eslint/parser',
    parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module'
    },
    plugins: [
        '@typescript-eslint'
    ],
    rules: {
        indent: [ERROR, 4],
        'linebreak-style': [ERROR, 'unix'],
        quotes: [ERROR, 'single'],
        semi: OFF,
        "@typescript-eslint/semi": [ERROR],
        "@typescript-eslint/ban-types": [ERROR,
            {
                types: {
                    Function: false
                },
                extendDefaults: true
            }
        ]
    }
};
