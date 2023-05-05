'use strict'

module.exports = {
  plugins: ['import'],
  rules: {
    'import/no-extraneous-dependencies': [
      'error',
      {
        devDependencies: false,
        optionalDependencies: false,
        peerDependencies: false,
        bundledDependencies: false,
        includeInternal: true,
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
