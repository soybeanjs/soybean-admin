/**
 * @type {import('eslint').ESLint.ConfigData}
 */
module.exports = {
  root: true,
  env: {
    browser: true,
    node: true,
    commonjs: true,
    es2024: true
  },
  parserOptions: {
    ecmaVersion: 2024,
    ecmaFeatures: {
      jsx: true
    },
    sourceType: 'module'
  },
  ignorePatterns: [
    'node_modules',
    '*.min.*',
    'CHANGELOG.md',
    'dist',
    'LICENSE*',
    'output',
    'coverage',
    'public',
    'temp',
    'package-lock.json',
    'pnpm-lock.yaml',
    'yarn.lock',
    '__snapshots__',
    '!.github',
    '!.vitepress',
    '!.vscode'
  ],
  plugins: ['n', 'promise'],
  extends: [require.resolve('../rules/all.js'), 'plugin:import/recommended'],
  rules: {
    // import
    'import/no-mutable-exports': 'error',
    'import/no-named-as-default': 'off'
  }
};
