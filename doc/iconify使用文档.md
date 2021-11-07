### iconify用法

#### 一、静态用法：直接用图标的组件名称

1. 安装vscode智能提示的插件: Iconify IntelliSense
2. 找图标：网址 https://icones.js.org/ 或者 vscode安装 icones插件
3. 确定图标名字：找到图标后复制名字 如：**'mdi:emoticon'** 组件为: `<icon-mdi:emoticon />`, icon-为设置的前缀
4. 设置样式：同html标签一样直接应用style属性或者class属性; 通过设置color和font-size属性设置对应的颜色和大小

#### 二、多个图标动态渲染

1. 确定图标名字，如：'mdi:emoticon'

2. 引入Icon组件：

   `import { Icon } from '@iconify/vue';`

3. 动态渲染

    `<Icon icon="mdi:emoticon" />`

*ps：Icon组件属性 https://docs.iconify.design/icon-components/vue/*

#### 三、结合naiveUI组件动态渲染

1. 确定图标名字，如：**'mdi:emoticon'**

2. 引入vue的h函数：

   `import { h } from 'vue';`

3. 引入Icon组件

   `import { Icon } from '@iconify/vue';`

4. 动态渲染

   `() => h(Icon, { icon: 'mdi:emoticon', style: { color: '#f00', fontSize: '16px' } })`

*ps：@/uitls已封装好了函数：iconifyRender*

