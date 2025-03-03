import { defineConfig } from '@soybeanjs/eslint-config';

export default defineConfig(
  { vue: true, unocss: true },
  {
    rules: {
      'vue/multi-word-component-names': [
        'warn',
        {
          ignores: ['index', 'App', 'Register', '[id]', '[url]']
        }
      ],
      'vue/component-name-in-template-casing': [
        'warn',
        'PascalCase',
        {
          registeredComponentsOnly: false,
          ignores: [
            '/^icon-/',
            'uploader',
            'uploader-unsupport',
            'uploader-drop',
            'uploader-btn',
            'uploader-list',
            'uploader-file'
          ]
        }
      ],
      'unocss/order-attributify': 'off'
    }
  }
);
