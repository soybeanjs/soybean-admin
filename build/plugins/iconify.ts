import Icons from 'unplugin-icons/vite'; // iconify图标
import IconsResolver from 'unplugin-icons/resolver';
import Components from 'unplugin-vue-components/vite'; // 从指定目录自动导入组件
import { FileSystemIconLoader } from 'unplugin-icons/loaders';

export default (srcPath: string) => {
  return [
    Icons({
      compiler: 'vue3',
      customCollections: {
        custom: FileSystemIconLoader(`${srcPath}/assets/svg`)
      },
      scale: 1,
      defaultClass: 'inline-block'
    }),
    Components({
      dts: false,
      resolvers: [IconsResolver({ customCollections: ['custom'], componentPrefix: 'icon' })]
    })
  ];
};
