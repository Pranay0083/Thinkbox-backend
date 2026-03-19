const js = require('@eslint/js');
const globals = require('globals');

module.exports = [
  {
    ignores: ['node_modules/**', 'coverage/**'],
  },
  {
    files: ['**/*.js'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'script',
      globals: { ...globals.node },
    },
    rules: {
      ...js.configs.recommended.rules,
      // This project currently logs to console in several places.
      'no-console': 'off',
    },
  },
  {
    files: ['**/*.test.js'],
    languageOptions: {
      globals: { ...globals.node, ...globals.jest },
    },
  },
];

