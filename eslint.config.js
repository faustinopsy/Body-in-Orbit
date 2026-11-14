import globals from 'globals';

export default [
  { ignores: ['dist/**', 'node_modules/**', 'public/**'] },
  {
    files: ['**/*.js'],
    languageOptions: { ecmaVersion: 2024, sourceType: 'module', globals: { ...globals.browser } },
    rules: {
      'max-lines': ['error', { max: 200, skipBlankLines: true }],
      'max-lines-per-function': ['error', { max: 60, skipBlankLines: true }],
      complexity: ['error', 10],
      'no-unused-vars': 'error',
      'no-undef': 'error',
      'prefer-const': 'error',
      eqeqeq: ['error', 'always', { null: 'ignore' }],
    },
  },
  {
    files: ['scripts/**/*.js', 'vite.config.js', 'eslint.config.js'],
    languageOptions: { globals: { ...globals.node } },
  },
];