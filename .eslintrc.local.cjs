'use strict'

module.exports = {
  overrides: [
    {
      files: ['bin/**'],
      rules: {
        'import/no-extraneous-dependencies': [
          'error',
          {
            devDependencies: false,
          },
        ],
        // Allow 'module' import in bin for createRequire
        'import/no-nodejs-modules': ['error', { allow: ['module'] }],
        strict: ['error', 'global'],
      },
    },
    {
      files: ['classes/**', 'functions/**', 'internal/**', 'ranges/**'],
      rules: {
        'import/no-extraneous-dependencies': [
          'error',
          {
            devDependencies: false,
          },
        ],
        'import/no-nodejs-modules': ['error'],
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
