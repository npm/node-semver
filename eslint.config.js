import globals from 'globals'
import pluginJs from '@eslint/js'
import tseslint from 'typescript-eslint'
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended'
import noOnlyTests from 'eslint-plugin-no-only-tests'

/**
 * List of files that must be ignored globally
 */
export const GLOBAL_IGNORE_LIST = [
  '.github/',
  '.husky/',
  '.vscode/',
  '.wireit/',
  'build/',
  'coverage/',
  'node_modules',
  '*.min.*',
  '*.d.ts',
  'CHANGELOG.md',
  'LICENSE*',
  'coverage/**',
  'package-lock.json',
]

/** @type {import('eslint').Linter.Config[]} */
export default [
  pluginJs.configs.recommended,
  ...tseslint.configs.strict,
  ...tseslint.configs.stylistic,
  // eslintConfigPrettier,
  eslintPluginPrettierRecommended,
  {
    files: ['**/*.ts'],
    languageOptions: {
      globals: {
        ...globals.browser,
      },
      sourceType: 'module',
    },
    rules: {
      'no-restricted-globals': [
        'error',
        ...Object.keys(globals.node).filter(
          // Disallow Node-specific globals (unless they are shared)
          (g) => !Object.prototype.hasOwnProperty.call(globals.browser, g)
        ),
      ],
      'max-len': [
        'error',
        {
          code: 120,
          comments: 120,
          ignoreUrls: true,
          ignoreTemplateLiterals: true,
        },
      ],
      'no-unreachable': ['error'],
      'no-multi-spaces': ['error'],
      'no-console': ['error'],
      'no-redeclare': ['error'],
      // This rule is the first one to go out
      '@typescript-eslint/no-non-null-assertion': 'off',
    },
  },
  {
    files: ['bin/*.ts', 'tasks/*.ts'],
    languageOptions: {
      globals: {
        ...globals.node, // Enable Node.js globals for these files
      },
    },
    rules: {
      'no-restricted-globals': [
        'error',
        ...Object.keys(globals.browser).filter(
          // Disallow Node-specific globals (unless they are shared)
          (g) => !Object.prototype.hasOwnProperty.call(globals.node, g)
        ),
      ],
    },
  },
  {
    files: ['tests/**/*.ts'],
    plugins: {
      'no-only-tests': noOnlyTests,
    },
    rules: {
      '@typescript-eslint/no-non-null-assertion': 'off',
      '@typescript-eslint/no-empty-function': 'off',
      'no-only-tests/no-only-tests': 'error',
    },
  },
  {
    ignores: GLOBAL_IGNORE_LIST,
  },
]
