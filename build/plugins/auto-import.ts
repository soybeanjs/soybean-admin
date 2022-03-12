import Icons from 'unplugin-icons/vite';
import IconsResolver from 'unplugin-icons/resolver';
import Components from 'unplugin-vue-components/vite';
import { FileSystemIconLoader } from 'unplugin-icons/loaders';

export default (srcPath: string) => {
  return [
    Icons({
      compiler: 'vue3',
      customCollections: {
        custom: FileSystemIconLoader(`${srcPath}/assets/svg`),
      },
      scale: 1,
      defaultClass: 'inline-block',
    }),
    Components({
      dts: true,
      resolvers: [IconsResolver({ customCollections: ['custom'], componentPrefix: 'icon' })],
    }),
  ];
};
