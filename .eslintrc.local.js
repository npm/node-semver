'use strict'

module.exports = {
  overrides: [
    {
      files: ['bin/**', 'classes/**', 'functions/**', 'internal/**', 'ranges/**'],
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
  ],
}
