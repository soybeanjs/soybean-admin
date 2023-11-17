/**
 * @type {import('eslint').ESLint.ConfigData}
 */
module.exports = {
  extends: [require.resolve('./ts.js'), require.resolve('./prettier.js')]
};
