'use strict'

module.exports = {
  overrides: [
    {
      files: ['bin/**'],
      parserOptions: {
        ecmaVersion: 2022,
        sourceType: 'module',
      },
      rules: {
        'import/no-extraneous-dependencies': [
          'error',
          {
            devDependencies: false,
          },
        ],
        // Allow 'module' import in bin for createRequire
        'import/no-nodejs-modules': ['error', { allow: ['module'] }],
        // Imports are hoisted in ESM, so ignore use-before-define for them
        'no-use-before-define': ['error', { functions: false, classes: false, variables: false }],
        strict: ['error', 'global'],
      },
    },
    {
      files: ['classes/**', 'functions/**', 'internal/**', 'ranges/**'],
      parserOptions: {
        ecmaVersion: 2022,
        sourceType: 'module',
      },
      rules: {
        'import/no-extraneous-dependencies': [
          'error',
          {
            devDependencies: false,
          },
        ],
        'import/no-nodejs-modules': ['error'],
        // Imports are hoisted in ESM, so ignore use-before-define for them
        'no-use-before-define': ['error', { functions: false, classes: false, variables: false }],
        strict: ['error', 'global'],
      },
    },
    {
      files: ['test/**', 'scripts/**'],
      rules: {
        // Test and script files can import devDependencies and the package itself
        'import/no-extraneous-dependencies': 'off',
      },
    },
  ],
}
