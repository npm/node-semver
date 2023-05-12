'use strict'

module.exports = {
  rules: {
    'import/no-extraneous-dependencies': [
      'error',
      {
        devDependencies: false,
      },
    ],
    'import/no-nodejs-modules': ['error'],
  },
  overrides: [
    {
      files: ['**/test/**', '.eslintrc.js', '.eslintrc.local.js'],
      rules: {
        'import/no-extraneous-dependencies': 0,
        'import/no-nodejs-modules': 0,
      },
    },
  ],
}
