module.exports = {
    root: true,
    env: {
      node: true,
    },
    plugins: ['@typescript-eslint/eslint-plugin'],
    extends: [
      'plugin:@typescript-eslint/recommended',
    ],
    overrides: [
      {
        files: ['**/*.ts'],
        parser: '@typescript-eslint/parser',
        parserOptions: {
          project: 'tsconfig.json',
          sourceType: 'module',
        },
        rules: {
          '@typescript-eslint/interface-name-prefix': 'off',
          '@typescript-eslint/explicit-function-return-type': 'off',
          '@typescript-eslint/no-explicit-any': 'off',
          '@typescript-eslint/explicit-module-boundary-types': 'off',
          '@typescript-eslint/no-unused-vars': 'off',
          '@typescript-eslint/ban-types': 'off',
          '@typescript-eslint/no-array-constructor': 'off',
          "@typescript-eslint/quotes": [
            "error",
            "single",
            {
              "allowTemplateLiterals": true
            }
          ],
          "indent": "off",
          "@typescript-eslint/indent": [
            "error",
            2,
            {
              "SwitchCase": 1
            }
          ],
          "@typescript-eslint/no-this-alias": "off",
          "no-unused-vars": "off",
          "@typescript-eslint/no-unused-vars": ["error"]
        },
      },
      {
        files: ['**/*.test.ts', '**/server.ts'],
        parser: '@typescript-eslint/parser',
        parserOptions: {
          project: 'tsconfig.test.json',
          sourceType: 'module',
        },
        rules: {
          '@typescript-eslint/interface-name-prefix': 'off',
          '@typescript-eslint/explicit-function-return-type': 'off',
          '@typescript-eslint/no-explicit-any': 'off',
          '@typescript-eslint/explicit-module-boundary-types': 'off',
          '@typescript-eslint/no-unused-vars': 'off',
          '@typescript-eslint/ban-types': 'off',
          '@typescript-eslint/no-empty-function': 'off',
        },
      }
    ]
}
