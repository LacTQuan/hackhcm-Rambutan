import globals from 'globals'
import pluginJs from '@eslint/js'
import tseslint from 'typescript-eslint'

export default [
    { languageOptions: { globals: globals.browser } },
    pluginJs.configs.recommended,
    ...tseslint.configs.recommended,
    {
        root: true,
        parserOptions: {
            ecmaVersion: 12,
            sourceType: 'module',
        },
        extends: ['eslint:recommended', 'prettier'],
        env: {
            es2021: true,
            node: true,
        },
        rules: {
            'no-console': 'error',
        },
    },
]
