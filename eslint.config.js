import { defineConfig } from '@soybeanjs/eslint-config';

export default defineConfig(
  { vue: true },
  {
    rules: {
      'vue/multi-word-component-names': [
        'warn',
        {
          ignores: ['index', 'App', '[id]']
        }
      ]
    }
  }
);
