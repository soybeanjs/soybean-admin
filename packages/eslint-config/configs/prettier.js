const prettierRules = require('../rules/prettier');

/**
 * @type {import('eslint').ESLint.ConfigData}
 */
module.exports = {
  extends: ['plugin:prettier/recommended'],
  rules: {
    'prettier/prettier': ['error', prettierRules]
  }
};
