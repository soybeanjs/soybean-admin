/**
 * @type {import('eslint').ESLint.ConfigData}
 */
module.exports = {
  extends: ['plugin:vue/vue3-recommended', require.resolve('./base.js')],
  overrides: [
    {
      files: ['*.vue'],
      parser: 'vue-eslint-parser',
      parserOptions: {
        parser: {
          js: 'espree',
          jsx: 'espree',
          ts: '@typescript-eslint/parser',
          tsx: '@typescript-eslint/parser'
        },
        extraFileExtensions: ['.vue'],
        ecmaFeatures: {
          jsx: true
        }
      },
      rules: {
        'no-undef': 'off' // TS will check un declared variables, if the script code is is in a .vue file, this rule should not disabled
      }
    }
  ],
  rules: {
    'vue/multi-word-component-names': 'off'
  }
};
