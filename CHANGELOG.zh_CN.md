# 更新日志

## [v1.3.5](https://github.com/soybeanjs/soybean-admin/compare/v1.3.4...v1.3.5) (2024-09-07)

### &nbsp;&nbsp;&nbsp;🚀 新功能

- **packages**:
  - @sa/axios: 成功时将响应添加到 flatRequest &nbsp;-&nbsp; by @soybeanjs [<samp>(c4e16)</samp>](https://github.com/soybeanjs/soybean-admin/commit/c4e1610)
- **projects**:
  - README.zh_CN.md 添加合作推广 &nbsp;-&nbsp; by @PZ-18664918826 in https://github.com/soybeanjs/soybean-admin/issues/601 [<samp>(2fa40)</samp>](https://github.com/soybeanjs/soybean-admin/commit/2fa400b)
  - 根据 Apache 规范添加更多提交类型 &nbsp;-&nbsp; by @Azir-11 in https://github.com/soybeanjs/soybean-admin/issues/610 [<samp>(878d9)</samp>](https://github.com/soybeanjs/soybean-admin/commit/878d9c3)
  - 配置是否支持自动更新。关闭#612 &nbsp;-&nbsp; by @Azir-11 in https://github.com/soybeanjs/soybean-admin/issues/617 和 https://github.com/soybeanjs/soybean-admin/issues/612 [<samp>(4c9f4)</samp>](https://github.com/soybeanjs/soybean-admin/commit/4c9f4e0)
  - 添加应用错误处理程序。关闭 #587 &nbsp;-&nbsp; by @soybeanjs in https://github.com/soybeanjs/soybean-admin/issues/587 [<samp>(be855)</samp>](https://github.com/soybeanjs/soybean-admin/commit/be8556c)

### &nbsp;&nbsp;&nbsp;🐞 Bug 修复

- **deps**:
  - 将 json5 从 devDependencies 移到 dependencies 以支持生产环境使用 &nbsp;-&nbsp; by @mufeng889 in https://github.com/soybeanjs/soybean-admin/issues/618 [<samp>(7cb43)</samp>](https://github.com/soybeanjs/soybean-admin/commit/7cb43fc)
- **projects**:
  - 避免检索缓存的 HTML &nbsp;-&nbsp; by @Azir-11 in https://github.com/soybeanjs/soybean-admin/issues/605 [<samp>(ef6cf)</samp>](https://github.com/soybeanjs/soybean-admin/commit/ef6cf93)
  - 修复登录重定向 &nbsp;-&nbsp; by @soybeanjs [<samp>(3830e)</samp>](https://github.com/soybeanjs/soybean-admin/commit/3830ec7)
  - 修复侧边栏折叠时的 vertical-mix-menu。修复 #608 &nbsp;-&nbsp; by @soybeanjs in https://github.com/soybeanjs/soybean-admin/issues/608 [<samp>(c3f1f)</samp>](https://github.com/soybeanjs/soybean-admin/commit/c3f1f69)
  - 修复 activeMenu 为父菜单时的面包屑。修复 #589 &nbsp;-&nbsp; by @soybeanjs in https://github.com/soybeanjs/soybean-admin/issues/589 [<samp>(79b2a)</samp>](https://github.com/soybeanjs/soybean-admin/commit/79b2a28)
  - 修复遇到多请求时的刷新令牌。修复 #581 &nbsp;-&nbsp; by @soybeanjs in https://github.com/soybeanjs/soybean-admin/issues/581 [<samp>(27b52)</samp>](https://github.com/soybeanjs/soybean-admin/commit/27b5222)
- **types**:
  - 修复 TableApiFn 的类型 &nbsp;-&nbsp; by @Azir-11 in https://github.com/soybeanjs/soybean-admin/issues/599 [<samp>(26c93)</samp>](https://github.com/soybeanjs/soybean-admin/commit/26c93df)

### &nbsp;&nbsp;&nbsp;🛠 优化

- **projects**: 优化菜单 selectedKey &nbsp;-&nbsp; by @soybeanjs [<samp>(531bf)</samp>](https://github.com/soybeanjs/soybean-admin/commit/531bfaf)

### &nbsp;&nbsp;&nbsp;📖 文档

- **projects**:
  - 更新 README &nbsp;-&nbsp; by @mufeng889 in https://github.com/soybeanjs/soybean-admin/issues/594 [<samp>(a8f92)</samp>](https://github.com/soybeanjs/soybean-admin/commit/a8f923e)
  - 更新 README &nbsp;-&nbsp; by @soybeanjs [<samp>(e9a2e)</samp>](https://github.com/soybeanjs/soybean-admin/commit/e9a2ee4)
  - 更新 README &nbsp;-&nbsp; by @soybeanjs [<samp>(73e91)</samp>](https://github.com/soybeanjs/soybean-admin/commit/73e917a)
  - 更新文档中重要信息的位置 &nbsp;-&nbsp; by **Azir** [<samp>(9c012)</samp>](https://github.com/soybeanjs/soybean-admin/commit/9c012c7)

### &nbsp;&nbsp;&nbsp;🏡 杂项

- **deps**:
  - 更新依赖 &nbsp;-&nbsp; by @soybeanjs [<samp>(a1c14)</samp>](https://github.com/soybeanjs/soybean-admin/commit/a1c14a1)
  - 更新依赖 &nbsp;-&nbsp; by @soybeanjs [<samp>(7fa55)</samp>](https://github.com/soybeanjs/soybean-admin/commit/7fa5590)
  - 更新依赖 &nbsp;-&nbsp; by @soybeanjs [<samp>(a44ea)</samp>](https://github.com/soybeanjs/soybean-admin/commit/a44ea62)
- **projects**:
  - 使用 json5 解析环境变量 `VITE_OTHER_SERVICE_BASE_URL` 并修复代理启用 &nbsp;-&nbsp; by @soybeanjs [<samp>(b16a9)</samp>](https://github.com/soybeanjs/soybean-admin/commit/b16a963)

### &nbsp;&nbsp;&nbsp;🎨 样式

- **projects**: 将脚本 czh 重命名为 commit:zh &nbsp;-&nbsp; by @Azir-11 in https://github.com/soybeanjs/soybean-admin/issues/597 [<samp>(5094f)</samp>](https://github.com/soybeanjs/soybean-admin/commit/5094f0e)

### &nbsp;&nbsp;&nbsp;❤️ 贡献者

[![soybeanjs](https://github.com/soybeanjs.png?size=48)](https://github.com/soybeanjs)&nbsp;&nbsp;[![mufeng889](https://github.com/mufeng889.png?size=48)](https://github.com/mufeng889)&nbsp;&nbsp;[![Azir-11](https://github.com/Azir-11.png?size=48)](https://github.com/Azir-11)&nbsp;&nbsp;[![PZ-18664918826](https://github.com/PZ-18664918826.png?size=48)](https://github.com/PZ-18664918826)&nbsp;&nbsp;
[Azir](mailto:2075125282@qq.com),&nbsp;

## [v1.3.4](https://github.com/honghuangdc/soybean-admin/compare/v1.3.3...v1.3.4) (2024-08-01)

### &nbsp;&nbsp;&nbsp;🚨 重大变更

- **projects**: 当 vertical-mix 布局为 mixSiderFixed 时，不重置活动菜单 &nbsp;-&nbsp; by @honghuangdc [<samp>(939c5)</samp>](https://github.com/honghuangdc/soybean-admin/commit/939c512)

### &nbsp;&nbsp;&nbsp;🛠 优化

- **projects**: 优化代码 &nbsp;-&nbsp; by @honghuangdc [<samp>(cb1d4)</samp>](https://github.com/honghuangdc/soybean-admin/commit/cb1d445)

### &nbsp;&nbsp;&nbsp;🏡 杂项

- **projects**: 更新依赖并修复 vue-router 类型 &nbsp;-&nbsp; by @honghuangdc [<samp>(96837)</samp>](https://github.com/honghuangdc/soybean-admin/commit/968370b)

### &nbsp;&nbsp;&nbsp;❤️ 贡献者

[![honghuangdc](https://github.com/honghuangdc.png?size=48)](https://github.com/honghuangdc)&nbsp;&nbsp;

## [v1.3.3](https://github.com/honghuangdc/soybean-admin/compare/v1.3.2...v1.3.3) (2024-07-30)

### &nbsp;&nbsp;&nbsp;🐞 Bug 修复

- **projects**: 修复水印设置 &nbsp;-&nbsp; by @honghuangdc [<samp>(5646a)</samp>](https://github.com/honghuangdc/soybean-admin/commit/5646a50)

### &nbsp;&nbsp;&nbsp;📖 文档

- **projects**: 更新 CHANGELOG &nbsp;-&nbsp; by @honghuangdc [<samp>(ebc83)</samp>](https://github.com/honghuangdc/soybean-admin/commit/ebc838c)

### &nbsp;&nbsp;&nbsp;❤️ 贡献者

[![honghuangdc](https://github.com/honghuangdc.png?size=48)](https://github.com/honghuangdc)&nbsp;&nbsp;

## [v1.3.2](https://github.com/honghuangdc/soybean-admin/compare/v1.3.1...v1.3.2) (2024-07-30)

### &nbsp;&nbsp;&nbsp;🚀 新功能

- **项目**:
  - 添加颜色渐变模式。关闭 #567 &nbsp;-&nbsp; 由 @Azir-11 在 https://github.com/honghuangdc/soybean-admin/issues/569 和 https://github.com/honghuangdc/soybean-admin/issues/567 [<samp>(4dde4)</samp>](https://github.com/honghuangdc/soybean-admin/commit/4dde4c2)
  - 添加全屏水印。关闭 #571 &nbsp;-&nbsp; 由 @paynezhuang 在 https://github.com/honghuangdc/soybean-admin/issues/573 和 https://github.com/honghuangdc/soybean-admin/issues/571 [<samp>(ea8aa)</samp>](https://github.com/honghuangdc/soybean-admin/commit/ea8aa6c)

### &nbsp;&nbsp;&nbsp;🐞 Bug 修复

- **项目**: 修复 vertical-mix 菜单选中问题 &nbsp;-&nbsp; 由 @honghuangdc [<samp>(59f07)</samp>](https://github.com/honghuangdc/soybean-admin/commit/59f07d8)

### &nbsp;&nbsp;&nbsp;🛠 优化

- **项目**:
  - 添加类型 WatermarkProps &nbsp;-&nbsp; 由 @honghuangdc [<samp>(f26d0)</samp>](https://github.com/honghuangdc/soybean-admin/commit/f26d0a6)
  - 移除 home NAlert 可关闭 &nbsp;-&nbsp; 由 @honghuangdc [<samp>(98b75)</samp>](https://github.com/honghuangdc/soybean-admin/commit/98b75c2)
  - 优化响应代码比较 &nbsp;-&nbsp; 由 @honghuangdc [<samp>(cf67d)</samp>](https://github.com/honghuangdc/soybean-admin/commit/cf67d55)
- **类型**:
  - 移除无用类型。 &nbsp;-&nbsp; 由 **Azir** [<samp>(eed61)</samp>](https://github.com/honghuangdc/soybean-admin/commit/eed617f)

### &nbsp;&nbsp;&nbsp;📖 文档

- **项目**: 更新更新日志 &nbsp;-&nbsp; 由 @honghuangdc [<samp>(d3759)</samp>](https://github.com/honghuangdc/soybean-admin/commit/d37591d)

### &nbsp;&nbsp;&nbsp;🏡 杂项

- **依赖**: 更新依赖 &nbsp;-&nbsp; 由 @honghuangdc [<samp>(993e9)</samp>](https://github.com/honghuangdc/soybean-admin/commit/993e9ca)

### &nbsp;&nbsp;&nbsp;❤️ 贡献者

[![honghuangdc](https://github.com/honghuangdc.png?size=48)](https://github.com/honghuangdc)&nbsp;&nbsp;[![paynezhuang](https://github.com/paynezhuang.png?size=48)](https://github.com/paynezhuang)&nbsp;&nbsp;[![Azir-11](https://github.com/Azir-11.png?size=48)](https://github.com/Azir-11)&nbsp;&nbsp;
[Azir](mailto:2075125282@qq.com),&nbsp;

## [v1.3.1](https://github.com/honghuangdc/soybean-admin/compare/v1.3.0...v1.3.1) (2024-07-22)

### &nbsp;&nbsp;&nbsp;🐞 Bug 修复

- **项目**:
  - 修复顶部菜单混合和反向模式下侧边栏宽度异常的问题 &nbsp;-&nbsp; 由 @Azir-11 在 https://github.com/honghuangdc/soybean-admin/issues/562 修复 [<samp>(c4695)</samp>](https://github.com/honghuangdc/soybean-admin/commit/c469512)
  - 修复水平混合菜单反转问题。修复 #563 &nbsp;-&nbsp; 由 @honghuangdc 在 https://github.com/honghuangdc/soybean-admin/issues/563 修复 [<samp>(4e55b)</samp>](https://github.com/honghuangdc/soybean-admin/commit/4e55b0e)
  - 修复当布局来自移动端时垂直菜单不渲染的问题 &nbsp;-&nbsp; 由 @honghuangdc 修复 [<samp>(84027)</samp>](https://github.com/honghuangdc/soybean-admin/commit/8402734)

### &nbsp;&nbsp;&nbsp;📖 文档

- **项目**: 更新更新日志 &nbsp;-&nbsp; 由 @honghuangdc 更新 [<samp>(613c8)</samp>](https://github.com/honghuangdc/soybean-admin/commit/613c836)

### &nbsp;&nbsp;&nbsp;🎨 样式

- **其他**: 修改灰度模式的中文名称 &nbsp;-&nbsp; 由 **Azir** 修改 [<samp>(53770)</samp>](https://github.com/honghuangdc/soybean-admin/commit/5377002)

### &nbsp;&nbsp;&nbsp;❤️ 贡献者

[![honghuangdc](https://github.com/honghuangdc.png?size=48)](https://github.com/honghuangdc)&nbsp;&nbsp;[![Azir-11](https://github.com/Azir-11.png?size=48)](https://github.com/Azir-11)&nbsp;&nbsp;
[Azir](mailto:2075125282@qq.com),&nbsp;

## [v1.3.0](https://github.com/soybeanjs/soybean-admin/compare/v1.2.8...v1.3.0) (2024-07-22)

### &nbsp;&nbsp;&nbsp;🚨 破坏性变更

- **项目**: 重构全局菜单 & 支持 `reversed-horizontal-mix-menu`。关闭 #365 &nbsp;-&nbsp; 由 @honghuangdc 在 https://github.com/soybeanjs/soybean-admin/issues/365 提出 [<samp>(087e5)</samp>](https://github.com/soybeanjs/soybean-admin/commit/087e532)

### &nbsp;&nbsp;&nbsp;🚀 功能

- **包**:
  - `@sa/scripts`: 命令 `gitCommit` 支持中文 &nbsp;-&nbsp; 由 @mmdapl 在 https://github.com/soybeanjs/soybean-admin/issues/548 提出 [<samp>(06971)</samp>](https://github.com/soybeanjs/soybean-admin/commit/06971f3)
  - @sa/axios: 用 AbortController 替换 CancelTokenSource。关闭 #530, 关闭 #532 &nbsp;-&nbsp; 由 @honghuangdc 在 https://github.com/soybeanjs/soybean-admin/issues/530 和 https://github.com/soybeanjs/soybean-admin/issues/532 提出 [<samp>(527fd)</samp>](https://github.com/soybeanjs/soybean-admin/commit/527fd79)
  - @sa/scripts: 为命令 `gitCommitVerify` 添加忽略模式列表。关闭 #504 &nbsp;-&nbsp; 由 @honghuangdc 在 https://github.com/soybeanjs/soybean-admin/issues/504 提出 [<samp>(958d0)</samp>](https://github.com/soybeanjs/soybean-admin/commit/958d0ba)
- **项目**:
  - 使分支 `main` 更精简 & 修改请求重试次数为 0 &nbsp;-&nbsp; 由 @Azir-11 提出 [<samp>(793b1)</samp>](https://github.com/soybeanjs/soybean-admin/commit/793b16e)

### &nbsp;&nbsp;&nbsp;🐞 修复

- **钩子**: 当 pagesize 返回 0 时防止程序冻结 &nbsp;-&nbsp; 由 @Azir-11 在 https://github.com/soybeanjs/soybean-admin/issues/545 提出 [<samp>(f4eeb)</samp>](https://github.com/soybeanjs/soybean-admin/commit/f4eeb2e)

### &nbsp;&nbsp;&nbsp;💅 重构

- **项目**:
  - 合并 `theme tokens` 和 `theme settings`。关闭 #379 &nbsp;-&nbsp; 由 @honghuangdc 在 https://github.com/soybeanjs/soybean-admin/issues/379 提出 [<samp>(1d1b1)</samp>](https://github.com/soybeanjs/soybean-admin/commit/1d1b148)
  - 将 css 变量挂载到 root &nbsp;-&nbsp; 由 @honghuangdc 提出 [<samp>(00f41)</samp>](https://github.com/soybeanjs/soybean-admin/commit/00f41dd)

### &nbsp;&nbsp;&nbsp;📖 文档

- **项目**: 更新更新日志 &nbsp;-&nbsp; 由 @honghuangdc 提出 [<samp>(a0b76)</samp>](https://github.com/soybeanjs/soybean-admin/commit/a0b76da)

### &nbsp;&nbsp;&nbsp;🏡 杂务

- **依赖**: 更新依赖 &nbsp;-&nbsp; 由 @honghuangdc 提出 [<samp>(f6bd6)</samp>](https://github.com/soybeanjs/soybean-admin/commit/f6bd6b8)
- **项目**: 添加脚本 `czh` &nbsp;-&nbsp; 由 @honghuangdc 提出 [<samp>(02069)</samp>](https://github.com/soybeanjs/soybean-admin/commit/0206969)

### &nbsp;&nbsp;&nbsp;❤️ 贡献者

[![honghuangdc](https://github.com/honghuangdc.png?size=48)](https://github.com/honghuangdc)&nbsp;&nbsp;[![mmdapl](https://github.com/mmdapl.png?size=48)](https://github.com/mmdapl)&nbsp;&nbsp;[![Azir-11](https://github.com/Azir-11.png?size=48)](https://github.com/Azir-11)&nbsp;&nbsp;

## [v1.2.8](https://github.com/soybeanjs/soybean-admin/compare/v1.2.7...v1.2.8) (2024-07-20)

### &nbsp;&nbsp;&nbsp;🐞 修复

- **包**:
  - @sa/hooks: 修复 useHookTable 的 searchParams。修复了 #552 &nbsp;-&nbsp; 由 @honghuangdc 在 https://github.com/soybeanjs/soybean-admin/issues/552 提出 [<samp>(96c10)</samp>](https://github.com/soybeanjs/soybean-admin/commit/96c1044)
- **类型**:
  - 修复了引用类型错误 &nbsp;-&nbsp; 由 **dodu2014** 在 https://github.com/soybeanjs/soybean-admin/issues/551 提出 [<samp>(3e2a9)</samp>](https://github.com/soybeanjs/soybean-admin/commit/3e2a993)
  - 修复 useHookTable 的数据类型 &nbsp;-&nbsp; 由 @honghuangdc 提出 [<samp>(276ea)</samp>](https://github.com/soybeanjs/soybean-admin/commit/276ea7f)

### &nbsp;&nbsp;&nbsp;💅 重构

- **项目**: 用 `klona` 替换 `lodash-es` 的 `cloneDeep` &nbsp;-&nbsp; 由 @honghuangdc 提出 [<samp>(a9133)</samp>](https://github.com/soybeanjs/soybean-admin/commit/a91335d)

### &nbsp;&nbsp;&nbsp;📖 文档

- **项目**: 更新更新日志 &nbsp;-&nbsp; 由 @honghuangdc 提出 [<samp>(58fc0)</samp>](https://github.com/soybeanjs/soybean-admin/commit/58fc096)

### &nbsp;&nbsp;&nbsp;🏡 杂务

- **依赖**: 更新依赖 &nbsp;-&nbsp; 由 @honghuangdc 提出 [<samp>(cf019)</samp>](https://github.com/soybeanjs/soybean-admin/commit/cf0192a)

### &nbsp;&nbsp;&nbsp;❤️ 贡献者

[![honghuangdc](https://github.com/honghuangdc.png?size=48)](https://github.com/honghuangdc)&nbsp;&nbsp;
[dodu2014](mailto:dodu@live.cn)

## [v1.2.7](https://github.com/honghuangdc/soybean-admin/compare/v1.2.6...v1.2.7) (2024-07-12)

### &nbsp;&nbsp;&nbsp;🛠 优化

- **项目**: 支持自定义菜单图标大小 &nbsp;-&nbsp; 由 @wynn-w 在 https://github.com/honghuangdc/soybean-admin/issues/534 提出 [<samp>(e035e)</samp>](https://github.com/honghuangdc/soybean-admin/commit/e035eab)

### &nbsp;&nbsp;&nbsp;🏡 杂务

- **依赖**:
  - 更新依赖 &nbsp;-&nbsp; 由 @honghuangdc [<samp>(72ede)</samp>](https://github.com/honghuangdc/soybean-admin/commit/72ede8b)
  - 更新依赖 &nbsp;-&nbsp; 由 @honghuangdc [<samp>(be13c)</samp>](https://github.com/honghuangdc/soybean-admin/commit/be13ca2)
  - 更新依赖 &nbsp;-&nbsp; 由 @honghuangdc [<samp>(752ec)</samp>](https://github.com/honghuangdc/soybean-admin/commit/752ec1e)
- **项目**:
  - 修复已弃用的配置配置 &nbsp;-&nbsp; 由 @paynezhuang 在 https://github.com/honghuangdc/soybean-admin/issues/524 提出 [<samp>(0d20e)</samp>](https://github.com/honghuangdc/soybean-admin/commit/0d20e4c)

### &nbsp;&nbsp;&nbsp;❤️ 贡献者

[![honghuangdc](https://github.com/honghuangdc.png?size=48)](https://github.com/honghuangdc)&nbsp;&nbsp;[![wynn-w](https://github.com/wynn-w.png?size=48)](https://github.com/wynn-w)&nbsp;&nbsp;[![paynezhuang](https://github.com/paynezhuang.png?size=48)](https://github.com/paynezhuang)&nbsp;&nbsp;

## [v1.2.6](https://github.com/honghuangdc/soybean-admin/compare/v1.2.5...v1.2.6) (2024-06-21)

### &nbsp;&nbsp;&nbsp;🐞 修复

- **项目**:
  - 请求模态标题使用 i18n。修复 #507 &nbsp;-&nbsp; 由 @honghuangdc 在 https://github.com/honghuangdc/soybean-admin/issues/507 提出 [<samp>(f7de3)</samp>](https://github.com/honghuangdc/soybean-admin/commit/f7de3fd)
  - 为 `useTable` 添加 `getDataByPage`。修复 #499 &nbsp;-&nbsp; 由 @honghuangdc 在 https://github.com/honghuangdc/soybean-admin/issues/499 提出 [<samp>(425c6)</samp>](https://github.com/honghuangdc/soybean-admin/commit/425c69a)
  - 修复登录重定向到 routeHome 时，动态路由的 routeHome 与静态路由不同的问题。修复 #511 &nbsp;-&nbsp; 由 @honghuangdc 在 https://github.com/honghuangdc/soybean-admin/issues/511 提出 [<samp>(49f60)</samp>](https://github.com/honghuangdc/soybean-admin/commit/49f60b2)

### &nbsp;&nbsp;&nbsp;🛠 优化

- **项目**: 优化 `getRouteQueryOfLoginRoute` &nbsp;-&nbsp; 由 @honghuangdc [<samp>(693f7)</samp>](https://github.com/honghuangdc/soybean-admin/commit/693f704)

### &nbsp;&nbsp;&nbsp;📖 文档

- **项目**:
  - 更新更新日志 &nbsp;-&nbsp; 由 @honghuangdc [<samp>(5c67d)</samp>](https://github.com/honghuangdc/soybean-admin/commit/5c67d06)
  - 更新自述文件 &nbsp;-&nbsp; 由 @honghuangdc [<samp>(1e67a)</samp>](https://github.com/honghuangdc/soybean-admin/commit/1e67ae8)

### &nbsp;&nbsp;&nbsp;🏡 杂务

- **依赖**:
  - 更新依赖。关闭 #510 &nbsp;-&nbsp; 由 @honghuangdc 在 https://github.com/honghuangdc/soybean-admin/issues/510 提出 [<samp>(53143)</samp>](https://github.com/honghuangdc/soybean-admin/commit/531432d)
  - 更新依赖 &nbsp;-&nbsp; 由 @honghuangdc [<samp>(c7f6f)</samp>](https://github.com/honghuangdc/soybean-admin/commit/c7f6f2a)

### &nbsp;&nbsp;&nbsp;🤖 CI

- **项目**:
  - 添加 github 问题模板 &nbsp;-&nbsp; 由 @honghuangdc [<samp>(b5027)</samp>](https://github.com/honghuangdc/soybean-admin/commit/b5027c8)
  - 更新 github 问题模板 &nbsp;-&nbsp; 由 @honghuangdc [<samp>(ff1d5)</samp>](https://github.com/honghuangdc/soybean-admin/commit/ff1d504)

### &nbsp;&nbsp;&nbsp;❤️ 贡献者

[![honghuangdc](https://github.com/honghuangdc.png?size=48)](https://github.com/honghuangdc)&nbsp;&nbsp;

## [v1.2.5](https://github.com/soybeanjs/soybean-admin/compare/v1.2.4...v1.2.5) (2024-06-15)

### &nbsp;&nbsp;&nbsp;🐞 错误修复

- **项目**: 修复登出后标签页异常缓存的问题。已修复 #495 &nbsp;-&nbsp; 由 @Azir-11 在 https://github.com/soybeanjs/soybean-admin/issues/495 [<samp>(3eeac)</samp>](https://github.com/soybeanjs/soybean-admin/commit/3eeace9)

### &nbsp;&nbsp;&nbsp;🔥 性能

- **项目**: 初始化静态路由功能不需要异步 &nbsp;-&nbsp; 由 **CHENZL** 在 https://github.com/soybeanjs/soybean-admin/issues/493 [<samp>(2198b)</samp>](https://github.com/soybeanjs/soybean-admin/commit/2198b98)

### &nbsp;&nbsp;&nbsp;🛠 优化

- **项目**: 优化代码 &nbsp;-&nbsp; 由 @soybeanjs [<samp>(b94ba)</samp>](https://github.com/soybeanjs/soybean-admin/commit/b94baa1)
- **类型**: 提高全局类型的兼容性 &nbsp;-&nbsp; 由 @Azir-11 在 https://github.com/soybeanjs/soybean-admin/issues/494 [<samp>(cd9d5)</samp>](https://github.com/soybeanjs/soybean-admin/commit/cd9d58d)
- **工具**: 减少代码缩进，提高可读性 &nbsp;-&nbsp; 由 @Azir-11 在 https://github.com/soybeanjs/soybean-admin/issues/496 [<samp>(ad2f2)</samp>](https://github.com/soybeanjs/soybean-admin/commit/ad2f247)

### &nbsp;&nbsp;&nbsp;📖 文档

- **项目**: 更新CHANGELOG &nbsp;-&nbsp; 由 @soybeanjs [<samp>(f70d2)</samp>](https://github.com/soybeanjs/soybean-admin/commit/f70d29b)

### &nbsp;&nbsp;&nbsp;🏡 杂项

- **依赖**: 更新依赖 &nbsp;-&nbsp; 由 @soybeanjs [<samp>(b094d)</samp>](https://github.com/soybeanjs/soybean-admin/commit/b094d68)

### &nbsp;&nbsp;&nbsp;❤️ 贡献者

[![soybeanjs](https://github.com/soybeanjs.png?size=48)](https://github.com/soybeanjs)&nbsp;&nbsp;[![Azir-11](https://github.com/Azir-11.png?size=48)](https://github.com/Azir-11)&nbsp;&nbsp;
[CHENZL](mailto:zlong5568863@qq.com)

## [v1.2.4](https://github.com/soybeanjs/soybean-admin/compare/v1.2.3...v1.2.4) (2024-06-14)

### &nbsp;&nbsp;&nbsp;🛠 优化

- **项目**:
  - 优化 `setupAppVersionNotification` &nbsp;-&nbsp; 由 @soybeanjs 提交 [<samp>(b5a72)</samp>](https://github.com/soybeanjs/soybean-admin/commit/b5a723c)
  - 获取 'Asia/Shanghai' 时区的构建时间 &nbsp;-&nbsp; 由 @soybeanjs 提交 [<samp>(069fa)</samp>](https://github.com/soybeanjs/soybean-admin/commit/069fa8a)

### &nbsp;&nbsp;&nbsp;❤️ 贡献者

[![soybeanjs](https://github.com/soybeanjs.png?size=48)](https://github.com/soybeanjs)&nbsp;&nbsp;

## [v1.2.3](https://github.com/soybeanjs/soybean-admin/compare/v1.2.2...v1.2.3) (2024-06-13)

### &nbsp;&nbsp;&nbsp;🐞 修复错误

- **项目**:
  - 通过在index.html中添加color-scheme元标签修复移动浏览器主题问题 &nbsp;-&nbsp; 由 @KickCashew 在 https://github.com/soybeanjs/soybean-admin/issues/488 中提交 [<samp>(c2125)</samp>](https://github.com/soybeanjs/soybean-admin/commit/c212565)
  - 修复二级目录组件为空 &nbsp;-&nbsp; 由 @paynezhuang 在 https://github.com/soybeanjs/soybean-admin/issues/491 中提交 [<samp>(aabb2)</samp>](https://github.com/soybeanjs/soybean-admin/commit/aabb2a4)

### &nbsp;&nbsp;&nbsp;📖 文档

- **项目**:
  - 修复超链接指向错误 &nbsp;-&nbsp; 由 **Azir** 提交 [<samp>(20a81)</samp>](https://github.com/soybeanjs/soybean-admin/commit/20a8127)
  - 更新 README &nbsp;-&nbsp; 由 @soybeanjs 提交 [<samp>(70261)</samp>](https://github.com/soybeanjs/soybean-admin/commit/7026126)

### &nbsp;&nbsp;&nbsp;🏡 杂项

- **依赖**:
  - 更新依赖 &nbsp;-&nbsp; 由 @soybeanjs 提交 [<samp>(813d8)</samp>](https://github.com/soybeanjs/soybean-admin/commit/813d8ce)
  - 更新依赖 &nbsp;-&nbsp; 由 @soybeanjs 提交 [<samp>(bf718)</samp>](https://github.com/soybeanjs/soybean-admin/commit/bf71837)

### &nbsp;&nbsp;&nbsp;❤️ 贡献者

[![soybeanjs](https://github.com/soybeanjs.png?size=48)](https://github.com/soybeanjs)&nbsp;&nbsp;[![paynezhuang](https://github.com/paynezhuang.png?size=48)](https://github.com/paynezhuang)&nbsp;&nbsp;[![KickCashew](https://github.com/KickCashew.png?size=48)](https://github.com/KickCashew)&nbsp;&nbsp;
[Azir](mailto:2075125282@qq.com)

## [v1.2.2](https://github.com/honghuangdc/soybean-admin/compare/v1.2.1...v1.2.2) (2024-06-12)

### &nbsp;&nbsp;&nbsp;🚀 特性

- **项目**: 切换标签时重置滚动位置 &nbsp;-&nbsp; 由 @soybeanjs 提交 [<samp>(9094b)</samp>](https://github.com/honghuangdc/soybean-admin/commit/9094b21)

### &nbsp;&nbsp;&nbsp;🐞 修复错误

- **项目**:
  - 在DEV模式下隐藏AppVersionNotification &nbsp;-&nbsp; 由 @sigma-plus 在 https://github.com/honghuangdc/soybean-admin/issues/482 中提交 [<samp>(62592)</samp>](https://github.com/honghuangdc/soybean-admin/commit/6259287)
  - 修复在移动布局中隐藏menu-toggler。fixed #483 &nbsp;-&nbsp; 由 @soybeanjs 在 https://github.com/honghuangdc/soybean-admin/issues/483 中提交 [<samp>(4470c)</samp>](https://github.com/honghuangdc/soybean-admin/commit/4470cb4)

### &nbsp;&nbsp;&nbsp;📖 文档

- **项目**: 更新 README &nbsp;-&nbsp; 由 @soybeanjs 提交 [<samp>(8f9a7)</samp>](https://github.com/honghuangdc/soybean-admin/commit/8f9a705)

### &nbsp;&nbsp;&nbsp;❤️ 贡献者

[![soybeanjs](https://github.com/soybeanjs.png?size=48)](https://github.com/soybeanjs)&nbsp;&nbsp;[![sigma-plus](https://github.com/sigma-plus.png?size=48)](https://github.com/sigma-plus)&nbsp;&nbsp;

## [v1.2.1](https://github.com/honghuangdc/soybean-admin/compare/v1.2.0...v1.2.1) (2024-06-07)

### &nbsp;&nbsp;&nbsp;🐞 修复错误

- **项目**:
  - 修复页面重新加载时获取用户信息 &nbsp;-&nbsp; 由 @soybeanjs 提交 [<samp>(ff51b)</samp>](https://github.com/honghuangdc/soybean-admin/commit/ff51b72)
  - 修复setupAppVersionNotification渲染 &nbsp;-&nbsp; 由 @soybeanjs 提交 [<samp>(6a6eb)</samp>](https://github.com/honghuangdc/soybean-admin/commit/6a6eb9a)

### &nbsp;&nbsp;&nbsp;📖 文档

- **项目**: 更新CHANGELOG &nbsp;-&nbsp; 由 @soybeanjs [<samp>(fe06b)</samp>](https://github.com/honghuangdc/soybean-admin/commit/fe06b8c)完成

### &nbsp;&nbsp;&nbsp;🏡 日常任务

- **依赖**: 更新依赖 &nbsp;-&nbsp; 由 @soybeanjs [<samp>(08827)</samp>](https://github.com/honghuangdc/soybean-admin/commit/08827a4)完成

### &nbsp;&nbsp;&nbsp;❤️ 贡献者

[![soybeanjs](https://github.com/soybeanjs.png?size=48)](https://github.com/soybeanjs)&nbsp;&nbsp;

## [v1.2.0](https://github.com/soybeanjs/soybean-admin/compare/v1.1.5...v1.2.0) (2024-06-06)

### &nbsp;&nbsp;&nbsp;🚀 功能

- **项目**:
  - 支持系统新版本更新通知。关闭 #420 &nbsp;-&nbsp; 由 @soybeanjs 在 https://github.com/soybeanjs/soybean-admin/issues/420 [<samp>(584cd)</samp>](https://github.com/soybeanjs/soybean-admin/commit/584cd54)
  - 在路由守卫中获取用户信息并从localStorage中移除。关闭 #459 &nbsp;-&nbsp; 由 @soybeanjs 在 https://github.com/soybeanjs/soybean-admin/issues/459 [<samp>(5531a)</samp>](https://github.com/soybeanjs/soybean-admin/commit/5531a68)

### &nbsp;&nbsp;&nbsp;📖 文档

- **项目**: 更新CHANGELOG &nbsp;-&nbsp; 由 @soybeanjs [<samp>(2bec8)</samp>](https://github.com/soybeanjs/soybean-admin/commit/2bec899)

### &nbsp;&nbsp;&nbsp;❤️ 贡献者

[![soybeanjs](https://github.com/soybeanjs.png?size=48)](https://github.com/soybeanjs)&nbsp;&nbsp;

## [v1.1.5](https://github.com/soybeanjs/soybean-admin/compare/v1.1.4...v1.1.5) (2024-06-06)

### &nbsp;&nbsp;&nbsp;🐞 错误修复

- **项目**: 修复注册组件名，CodeLogin => Register &nbsp;-&nbsp; 由 @m-xlsea 在 https://github.com/soybeanjs/soybean-admin/issues/478 [<samp>(ddf38)</samp>](https://github.com/soybeanjs/soybean-admin/commit/ddf3823)

### &nbsp;&nbsp;&nbsp;🏡 杂务

- **依赖**: 更新依赖 &nbsp;-&nbsp; 由 @soybeanjs [<samp>(060c0)</samp>](https://github.com/soybeanjs/soybean-admin/commit/060c0a9)
- **项目**: 更新 vscode 设置: vue 官方 &nbsp;-&nbsp; 由 @soybeanjs [<samp>(76649)</samp>](https://github.com/soybeanjs/soybean-admin/commit/76649e2)

### &nbsp;&nbsp;&nbsp;❤️ 贡献者

[![soybeanjs](https://github.com/soybeanjs.png?size=48)](https://github.com/soybeanjs)&nbsp;&nbsp;[![m-xlsea](https://github.com/m-xlsea.png?size=48)](https://github.com/m-xlsea)&nbsp;&nbsp;

## [v1.1.4](https://github.com/honghuangdc/soybean-admin/compare/v1.1.3...v1.1.4) (2024-06-06)

### &nbsp;&nbsp;&nbsp;🐞 错误修复

- **utils**: 修复了按esc键时modalLogout的错误 &nbsp;-&nbsp; 由 @sigma-plus 在 https://github.com/honghuangdc/soybean-admin/issues/470 中提出 [<samp>(bd69c)</samp>](https://github.com/honghuangdc/soybean-admin/commit/bd69c00)

### &nbsp;&nbsp;&nbsp;🛠 优化

- **projects**: 优化了RouteMeta的备注 &nbsp;-&nbsp; 由 @soybeanjs 提出 [<samp>(ffb48)</samp>](https://github.com/honghuangdc/soybean-admin/commit/ffb48b1)

### &nbsp;&nbsp;&nbsp;📖 文档

- **projects**:
  - 更新了CHANGELOG &nbsp;-&nbsp; 由 @soybeanjs 提出 [<samp>(756f8)</samp>](https://github.com/honghuangdc/soybean-admin/commit/756f84a)
  - 更新了Node&pnpm版本 &nbsp;-&nbsp; 由 @Azir-11 在 https://github.com/honghuangdc/soybean-admin/issues/472 中提出 [<samp>(9b05d)</samp>](https://github.com/honghuangdc/soybean-admin/commit/9b05d73)

### &nbsp;&nbsp;&nbsp;🏡 杂项

- **deps**:
  - 更新了依赖 &nbsp;-&nbsp; 由 @soybeanjs 提出 [<samp>(d0380)</samp>](https://github.com/honghuangdc/soybean-admin/commit/d0380ce)
  - 更新了依赖 &nbsp;-&nbsp; 由 @soybeanjs 提出 [<samp>(1f464)</samp>](https://github.com/honghuangdc/soybean-admin/commit/1f4647b)
- **projects**:
  - 关闭了http代理 &nbsp;-&nbsp; 由 @soybeanjs 提出 [<samp>(d08a3)</samp>](https://github.com/honghuangdc/soybean-admin/commit/d08a381)
  - 更新了mock url &nbsp;-&nbsp; 由 @soybeanjs 提出 [<samp>(e6086)</samp>](https://github.com/honghuangdc/soybean-admin/commit/e6086f0)
  - 更新了vscode设置 &nbsp;-&nbsp; 由 @soybeanjs 提出 [<samp>(910df)</samp>](https://github.com/honghuangdc/soybean-admin/commit/910dfca)

### &nbsp;&nbsp;&nbsp;❤️ 贡献者

[![soybeanjs](https://github.com/soybeanjs.png?size=48)](https://github.com/soybeanjs)&nbsp;&nbsp;[![Azir-11](https://github.com/Azir-11.png?size=48)](https://github.com/Azir-11)&nbsp;&nbsp;[![sigma-plus](https://github.com/sigma-plus.png?size=48)](https://github.com/sigma-plus)&nbsp;&nbsp;

## [v1.1.3](https://github.com/soybeanjs/soybean-admin/compare/v1.1.2...v1.1.3) (2024-06-02)

### &nbsp;&nbsp;&nbsp;🐞 错误修复

- **组件**:
  - 修复了由于回车导致搜索框反复弹出的问题 &nbsp;-&nbsp; 由 @Azir-11 在 https://github.com/soybeanjs/soybean-admin/issues/468 中修复 [<samp>(5bd96)</samp>](https://github.com/soybeanjs/soybean-admin/commit/5bd96b8)
- **项目**:
  - 修复点击菜单搜索。修复了 #466，关闭 #467 &nbsp;-&nbsp; 由 @soybeanjs 在 https://github.com/soybeanjs/soybean-admin/issues/466 和 https://github.com/soybeanjs/soybean-admin/issues/467 中修复 [<samp>(8efdb)</samp>](https://github.com/soybeanjs/soybean-admin/commit/8efdb10)
  - 修复 reCacheRoute。修复了 #464 &nbsp;-&nbsp; 由 @soybeanjs 在 https://github.com/soybeanjs/soybean-admin/issues/464 中修复 [<samp>(59faf)</samp>](https://github.com/soybeanjs/soybean-admin/commit/59faf15)
- **样式**:
  - 修复 FirstLevelMenu 样式。修复了 #450 &nbsp;-&nbsp; 由 @soybeanjs 在 https://github.com/soybeanjs/soybean-admin/issues/450 中修复 [<samp>(db64b)</samp>](https://github.com/soybeanjs/soybean-admin/commit/db64b0e)
  - 修复 PinToggler 样式。修复了 #451 &nbsp;-&nbsp; 由 @soybeanjs 在 https://github.com/soybeanjs/soybean-admin/issues/451 中修复 [<samp>(42b12)</samp>](https://github.com/soybeanjs/soybean-admin/commit/42b121a)

### &nbsp;&nbsp;&nbsp;🛠 优化

- **组件**: 提高 TableColumnSetting 的拖动区域精度，带有动画 &nbsp;-&nbsp; 由 @orangelckc 在 https://github.com/soybeanjs/soybean-admin/issues/465 中优化 [<samp>(2aa85)</samp>](https://github.com/soybeanjs/soybean-admin/commit/2aa85c6)
- **项目**: unocss 边框快捷方式 &nbsp;-&nbsp; 由 @soybeanjs 优化 [<samp>(40d0f)</samp>](https://github.com/soybeanjs/soybean-admin/commit/40d0f8a)

### &nbsp;&nbsp;&nbsp;📖 文档

- **项目**: 更新 CHANGELOG &nbsp;-&nbsp; 由 @soybeanjs 更新 [<samp>(87b18)</samp>](https://github.com/soybeanjs/soybean-admin/commit/87b1838)

### &nbsp;&nbsp;&nbsp;🏡 杂项

- **其他**:
  - 纠正拼写错误 &nbsp;-&nbsp; 由 @orangelckc 在 https://github.com/soybeanjs/soybean-admin/issues/460 中纠正 [<samp>(086ba)</samp>](https://github.com/soybeanjs/soybean-admin/commit/086bad4)
  - 纠正拼写错误 &nbsp;-&nbsp; 由 @Azir-11 在 https://github.com/soybeanjs/soybean-admin/issues/462 中纠正 [<samp>(f1850)</samp>](https://github.com/soybeanjs/soybean-admin/commit/f185041)
- **项目**:
  - 更新 vscode launch.json &nbsp;-&nbsp; 由 @soybeanjs 更新 [<samp>(4c1c7)</samp>](https://github.com/soybeanjs/soybean-admin/commit/4c1c7e6)

### &nbsp;&nbsp;&nbsp;❤️ 贡献者

[![soybeanjs](https://github.com/soybeanjs.png?size=48)](https://github.com/soybeanjs)&nbsp;&nbsp;[![Azir-11](https://github.com/Azir-11.png?size=48)](https://github.com/Azir-11)&nbsp;&nbsp;[![orangelckc](https://github.com/orangelckc.png?size=48)](https://github.com/orangelckc)&nbsp;&nbsp;

## [v1.1.2](https://github.com/soybeanjs/soybean-admin/compare/v1.1.1...v1.1.2) (2024-05-24)

### &nbsp;&nbsp;&nbsp;🐞 错误修复

- **项目**:
  - 修复头部样式 & 修复点击全局标签时按钮高亮。修复了 #446 &nbsp;-&nbsp; 由 @honghuangdc 在 https://github.com/soybeanjs/soybean-admin/issues/446 [<samp>(64fc0)</samp>](https://github.com/soybeanjs/soybean-admin/commit/64fc099)
  - 修复多标签页只渲染一次。修复了 #441 &nbsp;-&nbsp; 由 @honghuangdc 在 https://github.com/soybeanjs/soybean-admin/issues/441 [<samp>(e379d)</samp>](https://github.com/soybeanjs/soybean-admin/commit/e379d6c)

### &nbsp;&nbsp;&nbsp;🛠 优化

- **项目**: 优化代码 &nbsp;-&nbsp; 由 @honghuangdc [<samp>(bc8dc)</samp>](https://github.com/soybeanjs/soybean-admin/commit/bc8dc47)

### &nbsp;&nbsp;&nbsp;❤️ 贡献者

[![honghuangdc](https://github.com/honghuangdc.png?size=48)](https://github.com/honghuangdc)&nbsp;&nbsp;

## [v1.1.1](https://github.com/soybeanjs/soybean-admin/compare/v1.1.0...v1.1.1) (2024-05-20)

### &nbsp;&nbsp;&nbsp;🚀 功能

- **hooks**: 为 useEcharts 添加 setOptions &nbsp;-&nbsp; 由 @honghuangdc 提交 [<samp>(e4d53)</samp>](https://github.com/soybeanjs/soybean-admin/commit/e4d53aa)

### &nbsp;&nbsp;&nbsp;🐞 修复错误

- **projects**:
  - 修复 useRouter。修复了 #436 &nbsp;-&nbsp; 由 @honghuangdc 在 https://github.com/soybeanjs/soybean-admin/issues/436 提交 [<samp>(0774a)</samp>](https://github.com/soybeanjs/soybean-admin/commit/0774a51)
  - 在动态路由模式下获取路由时添加错误处理。修复了 440 &nbsp;-&nbsp; 由 @honghuangdc 提交 [<samp>(57b4a)</samp>](https://github.com/soybeanjs/soybean-admin/commit/57b4a9d)
- **styles**:
  - 修复 useTable 类型 &nbsp;-&nbsp; 由 @honghuangdc 提交 [<samp>(07124)</samp>](https://github.com/soybeanjs/soybean-admin/commit/071241f)

### &nbsp;&nbsp;&nbsp;📖 文档

- **projects**:
  - 更新 CHANGELOG &nbsp;-&nbsp; 由 @honghuangdc 提交 [<samp>(19783)</samp>](https://github.com/soybeanjs/soybean-admin/commit/1978397)
  - 更新 README.md &nbsp;-&nbsp; 由 @honghuangdc 提交 [<samp>(fa56e)</samp>](https://github.com/soybeanjs/soybean-admin/commit/fa56e9c)
  - 更新 README.md &nbsp;-&nbsp; 由 @honghuangdc 提交 [<samp>(419ea)</samp>](https://github.com/soybeanjs/soybean-admin/commit/419ea42)

### &nbsp;&nbsp;&nbsp;🏡 杂项

- **projects**:
  - 更新依赖并修复 TS 错误 &nbsp;-&nbsp; 由 @honghuangdc 提交 [<samp>(4ea9c)</samp>](https://github.com/soybeanjs/soybean-admin/commit/4ea9c85)
  - 更新 eslint-config 并修复代码 &nbsp;-&nbsp; 由 @honghuangdc 提交 [<samp>(68ea9)</samp>](https://github.com/soybeanjs/soybean-admin/commit/68ea974)
  - 更新 @elegant-router/vue 并为 resolve route 添加错误处理。修复了 #442 &nbsp;-&nbsp; 由 @honghuangdc 在 https://github.com/soybeanjs/soybean-admin/issues/442 提交 [<samp>(24ff8)</samp>](https://github.com/soybeanjs/soybean-admin/commit/24ff852)

### &nbsp;&nbsp;&nbsp;❤️ 贡献者

[![honghuangdc](https://github.com/honghuangdc.png?size=48)](https://github.com/honghuangdc)&nbsp;&nbsp;

## [v1.1.0](https://github.com/honghuangdc/soybean-admin/compare/v1.0.9...v1.1.0) (2024-05-07)

### &nbsp;&nbsp;&nbsp;🚀 功能

- **项目**:
  - 支持灰度。修复了 #385 &nbsp;-&nbsp; 由 @honghuangdc 在 https://github.com/honghuangdc/soybean-admin/issues/385 [<samp>(d335d)</samp>](https://github.com/honghuangdc/soybean-admin/commit/d335df6)
  - 添加前缀到本地存储 &nbsp;-&nbsp; 由 **Azir** [<samp>(1fc34)</samp>](https://github.com/honghuangdc/soybean-admin/commit/1fc34cc)
  - 添加表格显示总数选项 &nbsp;-&nbsp; 由 **paynezhuang** [<samp>(3e61e)</samp>](https://github.com/honghuangdc/soybean-admin/commit/3e61eab)
  - 添加推荐颜色切换。关闭了 #388 &nbsp;-&nbsp; 由 @honghuangdc 在 https://github.com/honghuangdc/soybean-admin/issues/388 [<samp>(a1920)</samp>](https://github.com/honghuangdc/soybean-admin/commit/a1920fc)
  - 添加菜单路由字段 &nbsp;-&nbsp; 由 **paynezhuang** [<samp>(dbe31)</samp>](https://github.com/honghuangdc/soybean-admin/commit/dbe31eb)
  - 支持短时间内重复请求错误只出现一次。关闭了 #368, 关闭了 #369 &nbsp;-&nbsp; 由 @honghuangdc 在 https://github.com/honghuangdc/soybean-admin/issues/368 和 https://github.com/honghuangdc/soybean-admin/issues/369 [<samp>(e3bd3)</samp>](https://github.com/honghuangdc/soybean-admin/commit/e3bd397)
  - 通过鼠标滚轮按钮点击关闭标签 &nbsp;-&nbsp; 由 **JianJroh** [<samp>(d3849)</samp>](https://github.com/honghuangdc/soybean-admin/commit/d3849ba)
  - 页面：支持管理菜单更多选项。关闭了 #366 &nbsp;-&nbsp; 由 @honghuangdc 在 https://github.com/honghuangdc/soybean-admin/issues/366 [<samp>(c4b5c)</samp>](https://github.com/honghuangdc/soybean-admin/commit/c4b5c65)
  - useTable 添加展开显示 &nbsp;-&nbsp; 由 **paynezhuang** [<samp>(0a90d)</samp>](https://github.com/honghuangdc/soybean-admin/commit/0a90dd3)

### &nbsp;&nbsp;&nbsp;🐞 错误修复

- **项目**:
  - 菜单 fixedIndexInTab 默认为 null &nbsp;-&nbsp; 由 **paynezhuang** [<samp>(3d10e)</samp>](https://github.com/honghuangdc/soybean-admin/commit/3d10ef1)
  - 修复菜单切换器 zIndex &nbsp;-&nbsp; 由 @honghuangdc [<samp>(7bd43)</samp>](https://github.com/honghuangdc/soybean-admin/commit/7bd43df)
  - 修复管理菜单模态样式 &nbsp;-&nbsp; 由 @honghuangdc [<samp>(60f3b)</samp>](https://github.com/honghuangdc/soybean-admin/commit/60f3b14)
  - 当角色改变时修复菜单数据。修复了 #391 &nbsp;-&nbsp; 由 @honghuangdc 在 https://github.com/honghuangdc/soybean-admin/issues/391 [<samp>(3b47b)</samp>](https://github.com/honghuangdc/soybean-admin/commit/3b47b5a)

### &nbsp;&nbsp;&nbsp;🛠 优化

- **项目**: 移除废弃的代码 &nbsp;-&nbsp; 由 @honghuangdc [<samp>(72ccb)</samp>](https://github.com/honghuangdc/soybean-admin/commit/72ccb6b)

### &nbsp;&nbsp;&nbsp;💅 重构

- **项目**:
  - 重构 @sa/color-palette => @sa/color & 优化 @sa/utils 代码 &nbsp;-&nbsp; 由 @honghuangdc [<samp>(34999)</samp>](https://github.com/honghuangdc/soybean-admin/commit/3499997)
  - menu-operate-drawer => menu-operate-modal &nbsp;-&nbsp; 由 @honghuangdc [<samp>(003e1)</samp>](https://github.com/honghuangdc/soybean-admin/commit/003e145)

### &nbsp;&nbsp;&nbsp;📖 文档

- **项目**:
  - 添加 CHANGELOG.zh_CN.md &nbsp;-&nbsp; 由 @honghuangdc [<samp>(18b3f)</samp>](https://github.com/honghuangdc/soybean-admin/commit/18b3f05)
  - 更新 CHANGELOG &nbsp;-&nbsp; 由 @honghuangdc [<samp>(4d17c)</samp>](https://github.com/honghuangdc/soybean-admin/commit/4d17cfd)

### &nbsp;&nbsp;&nbsp;🏡 杂项

- **依赖**:
  - 更新依赖 &nbsp;-&nbsp; 由 @honghuangdc [<samp>(1cb38)</samp>](https://github.com/honghuangdc/soybean-admin/commit/1cb3816)
  - 更新依赖 &nbsp;-&nbsp; 由 @honghuangdc [<samp>(599b4)</samp>](https://github.com/honghuangdc/soybean-admin/commit/599b4e1)
- **项目**:
  - 合并 main 到 v1.1.0 &nbsp;-&nbsp; 由 @honghuangdc [<samp>(ebe55)</samp>](https://github.com/honghuangdc/soybean-admin/commit/ebe55af)

### &nbsp;&nbsp;&nbsp;❤️ 贡献者

[![honghuangdc](https://github.com/honghuangdc.png?size=48)](https://github.com/honghuangdc)&nbsp;&nbsp;
[paynezhuang](mailto:paynezhuang@gmail.com),&nbsp;[JianJroh](mailto:rhjian@foxmail.com),&nbsp;[Azir](mailto:2075125282@qq.com)

## [v1.1.0-beta.2](https://github.com/honghuangdc/soybean-admin/compare/v1.1.0-beta.1...v1.1.0-beta.2) (2024-05-07)

### &nbsp;&nbsp;&nbsp;🚀 特性

- **项目**: useTable添加展开以显示 &nbsp;-&nbsp; 由 **paynezhuang** [<samp>(0a90d)</samp>](https://github.com/honghuangdc/soybean-admin/commit/0a90dd3) 提供

### &nbsp;&nbsp;&nbsp;🐞 修复的错误

- **项目**:
  - 修复 manage_menu 模态样式 &nbsp;-&nbsp; 由 @honghuangdc [<samp>(60f3b)</samp>](https://github.com/honghuangdc/soybean-admin/commit/60f3b14) 提供
  - 当角色改变时修复菜单数据。修复了 #391 &nbsp;-&nbsp; 由 @honghuangdc 在 https://github.com/honghuangdc/soybean-admin/issues/391 [<samp>(3b47b)</samp>](https://github.com/honghuangdc/soybean-admin/commit/3b47b5a) 提供

### &nbsp;&nbsp;&nbsp;🛠 优化

- **项目**: 删除废弃的代码 &nbsp;-&nbsp; 由 @honghuangdc [<samp>(72ccb)</samp>](https://github.com/honghuangdc/soybean-admin/commit/72ccb6b) 提供

### &nbsp;&nbsp;&nbsp;📖 文档

- **项目**: 添加 CHANGELOG.zh_CN.md &nbsp;-&nbsp; 由 @honghuangdc [<samp>(18b3f)</samp>](https://github.com/honghuangdc/soybean-admin/commit/18b3f05) 提供

### &nbsp;&nbsp;&nbsp;❤️ 贡献者

[![honghuangdc](https://github.com/honghuangdc.png?size=48)](https://github.com/honghuangdc)&nbsp;&nbsp;
[paynezhuang](mailto:paynezhuang@gmail.com)

## [v1.1.0-beta.1](https://github.com/soybeanjs/soybean-admin/compare/v1.0.9...v1.1.0-beta.1) (2024-05-07)

### &nbsp;&nbsp;&nbsp;🚀 功能

- **项目**:
  - 支持灰度。修复了 #385 &nbsp;-&nbsp; 由 @honghuangdc 在 https://github.com/soybeanjs/soybean-admin/issues/385 [<samp>(d335d)</samp>](https://github.com/soybeanjs/soybean-admin/commit/d335df6)
  - 添加前缀到本地存储 &nbsp;-&nbsp; 由 **Azir** [<samp>(1fc34)</samp>](https://github.com/soybeanjs/soybean-admin/commit/1fc34cc)
  - 添加表格 showTotal 选项 &nbsp;-&nbsp; 由 **paynezhuang** [<samp>(3e61e)</samp>](https://github.com/soybeanjs/soybean-admin/commit/3e61eab)
  - 添加推荐颜色切换。关闭了 #388 &nbsp;-&nbsp; 由 @honghuangdc 在 https://github.com/soybeanjs/soybean-admin/issues/388 [<samp>(a1920)</samp>](https://github.com/soybeanjs/soybean-admin/commit/a1920fc)
  - 添加菜单路由字段 &nbsp;-&nbsp; 由 **paynezhuang** [<samp>(dbe31)</samp>](https://github.com/soybeanjs/soybean-admin/commit/dbe31eb)
  - 支持短时间内重复请求错误只发生一次。关闭了 #368, 关闭了 #369 &nbsp;-&nbsp; 由 @honghuangdc 在 https://github.com/soybeanjs/soybean-admin/issues/368 和 https://github.com/soybeanjs/soybean-admin/issues/369 [<samp>(e3bd3)</samp>](https://github.com/soybeanjs/soybean-admin/commit/e3bd397)
  - 通过鼠标滚轮按钮点击关闭标签 &nbsp;-&nbsp; 由 **JianJroh** [<samp>(d3849)</samp>](https://github.com/soybeanjs/soybean-admin/commit/d3849ba)
  - 页面：支持更多的 manage_menu 选项。关闭了 #366 &nbsp;-&nbsp; 由 @honghuangdc 在 https://github.com/soybeanjs/soybean-admin/issues/366 [<samp>(c4b5c)</samp>](https://github.com/soybeanjs/soybean-admin/commit/c4b5c65)

### &nbsp;&nbsp;&nbsp;🐞 错误修复

- **项目**:
  - 修复菜单 fixedIndexInTab 默认为 null &nbsp;-&nbsp; 由 **paynezhuang** [<samp>(3d10e)</samp>](https://github.com/soybeanjs/soybean-admin/commit/3d10ef1)完成
  - 修复菜单切换器 zIndex &nbsp;-&nbsp; 由 @honghuangdc [<samp>(7bd43)</samp>](https://github.com/soybeanjs/soybean-admin/commit/7bd43df)完成

### &nbsp;&nbsp;&nbsp;💅 重构

- **项目**:
  - 重构 @sa/color-palette => @sa/color & 性能优化 @sa/utils &nbsp;-&nbsp; 由 @honghuangdc [<samp>(34999)</samp>](https://github.com/soybeanjs/soybean-admin/commit/3499997)完成
  - menu-operate-drawer => menu-operate-modal &nbsp;-&nbsp; 由 @honghuangdc [<samp>(003e1)</samp>](https://github.com/soybeanjs/soybean-admin/commit/003e145)完成

### &nbsp;&nbsp;&nbsp;🏡 杂务

- **依赖**:
  - 更新依赖 &nbsp;-&nbsp; 由 @honghuangdc [<samp>(1cb38)</samp>](https://github.com/soybeanjs/soybean-admin/commit/1cb3816)完成
  - 更新依赖 &nbsp;-&nbsp; 由 @honghuangdc [<samp>(599b4)</samp>](https://github.com/soybeanjs/soybean-admin/commit/599b4e1)完成
- **项目**:
  - 合并主分支到 v1.1.0 &nbsp;-&nbsp; 由 @honghuangdc [<samp>(ebe55)</samp>](https://github.com/soybeanjs/soybean-admin/commit/ebe55af)完成

### &nbsp;&nbsp;&nbsp;❤️ 贡献者

[![honghuangdc](https://github.com/honghuangdc.png?size=48)](https://github.com/honghuangdc)&nbsp;&nbsp;
[JianJroh](mailto:rhjian@foxmail.com),&nbsp;[paynezhuang](mailto:paynezhuang@gmail.com),&nbsp;[Azir](mailto:2075125282@qq.com)
