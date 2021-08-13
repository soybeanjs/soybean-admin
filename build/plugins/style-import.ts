import styleImport from 'vite-plugin-style-import'; // 按需加载UI框架的组件样式

export default [
  styleImport({
    libs: [
      {
        libraryName: 'element-plus',
        esModule: true,
        ensureStyleFile: true,
        resolveStyle: name => {
          const formatName = name.slice(3);
          return `element-plus/packages/theme-chalk/src/${formatName}.scss`;
        },
        resolveComponent: name => {
          return `element-plus/lib/${name}`;
        }
      }
    ]
  })
];
