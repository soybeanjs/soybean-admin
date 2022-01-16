import Icons from 'unplugin-icons/vite'; // iconify图标
import IconsResolver from 'unplugin-icons/resolver';
import Components from 'unplugin-vue-components/vite'; // 从指定目录自动导入组件

export default [
  Components({
    dts: false,
    resolvers: [IconsResolver({ componentPrefix: 'icon' })]
  }),
  Icons({ scale: 1, defaultClass: 'inline-block' })
];
