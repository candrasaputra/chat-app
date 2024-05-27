module.exports = {
    parser: '@typescript-eslint/parser', // Specifies the ESLint parser
    extends: [
        'airbnb-typescript/base',
        'plugin:import/errors',
        'plugin:import/warnings',
        'plugin:import/typescript',
        'plugin:jest/recommended',
        'plugin:@typescript-eslint/recommended',
        'plugin:prettier/recommended' // Enables eslint-plugin-prettier and displays prettier errors as ESLint errors. Make sure this is always the last configuration in the extends array.
    ],
    plugins: ['filenames'],
    parserOptions: {
        project: './tsconfig.json',
        ecmaVersion: 2018, // Allows for the parsing of modern ECMAScript features
        sourceType: 'module' // Allows for the use of imports
    },
    rules: {
        // Place to specify ESLint rules. Can be used to overwrite rules specified from the extended configs
        'import/no-default-export': 'off',
        'import/prefer-default-export': 'off',
        '@typescript-eslint/explicit-function-return-type': 'off',
        '@typescript-eslint/interface-name-prefix': 'off',
        'class-methods-use-this': 'warn',
        'filenames/match-regex': [2, '^[0-9a-z-.]+$', true],
        'no-process-env': 'off',
        '@typescript-eslint/indent': ['error', 4],
        '@typescript-eslint/no-throw-literal': 'off',
        'consistent-return': 'off',
        'import/no-cycle': 'off',
        'no-param-reassign': 'off',
        'class-methods-use-this': 'off',
        '@typescript-eslint/no-var-requires': 'off',
        'import/namespace': 'off',
        '@typescript-eslint/no-explicit-any': 'off',
        '@typescript-eslint/explicit-module-boundary-types': 'off',
        'eslint-disable-next-line no-await-in-loop': 'off',
        'no-plusplus': 'off'
    },
    env: {
        'jest/globals': true
    },
    settings: {
        'import/resolver': {
            alias: {
                map: [['src/*', './src/']],
                extensions: ['.ts', '.js', '.json']
            }
        }
    }
};
