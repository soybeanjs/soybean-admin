# 更新日志

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
