import Icons from 'unplugin-icons/vite'; // iconify图标
import IconsResolver from 'unplugin-icons/resolver';
import Components from 'unplugin-vue-components/vite'; // 从指定目录自动导入组件

export default [
  Components({
    resolvers: [IconsResolver({ componentPrefix: 'icon' })]
  }),
  Icons()
];

/**
 * iconify用法(安装对应的vscode智能提示的插件: Iconify IntelliSense)
 * 找图标：网址 https://icones.js.org/ 或者 vscode安装 icones插件
 * 确定图标名字：找到图标后复制名字 如：mdi:ab-testing 组件为: <icon-mdi:ab-testing />
 * 样式：同html标签一样直接应用style属性或者class属性; 通过设置color和font-size属性设置对应的颜色和大小
 */
