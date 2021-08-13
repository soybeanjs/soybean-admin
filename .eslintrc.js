module.exports = {
  env: {
    browser: true,
    es2021: true
  },
  parser: 'vue-eslint-parser',
  parserOptions: {
    ecmaVersion: 12,
    parser: '@typescript-eslint/parser',
    sourceType: 'module'
  },
  plugins: ['vue', '@typescript-eslint'],
  extends: [
    'plugin:vue/vue3-recommended',
    'airbnb-base',
    '@vue/typescript/recommended',
    'plugin:prettier/recommended',
    '@vue/prettier/@typescript-eslint'
  ],
  rules: {
    'no-unused-vars': 'off',
    'import/extensions': ['error', 'never'],
    'import/no-extraneous-dependencies': [2, { devDependencies: true }],
    'import/no-unresolved': 0,
    'no-shadow': 0,
    'import/prefer-default-export': 0,
    '@typescript-eslint/no-explicit-any': 0,
    '@typescript-eslint/no-inferrable-types': 0,
    '@typescript-eslint/ban-ts-ignore': 'off',
    '@typescript-eslint/ban-types': 'off',
    '@typescript-eslint/no-var-requires': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/no-empty-function': 'off',
    '@typescript-eslint/no-non-null-assertion': 'off',
    '@typescript-eslint/no-unused-vars': ['warn', { ignoreRestSiblings: true }]
  }
};
