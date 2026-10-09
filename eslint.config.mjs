import { defineConfig } from '@soybeanjs/eslint-config-vue';

export default defineConfig({
  overrides: {
    'vue/component-name-in-template-casing': [
      'warn',
      'PascalCase',
      {
        registeredComponentsOnly: false,
        ignores: ['/^icon-/']
      }
    ]
  }
});
