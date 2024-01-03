<div align="center">
	<img src="./public/favicon.svg" style="width: 160px;"/>
	<h1>Soybean Admin</h1>
</div>

[![license](https://img.shields.io/badge/license-MIT-green.svg)](./LICENSE) ![](https://img.shields.io/github/stars/honghuangdc/soybean-admin) ![](https://img.shields.io/github/forks/honghuangdc/soybean-admin)

## 注意 SoybeanAdmin 正在重构，全新 1.0 即将发布

Soybean Admin v1.0 :

- [x] 采用基于 pnpm 的 monorepo 管理项目
- [x] 第三方 soybeanjs 的工具库直接抽离到项目中(ElegantRouter除外)，不再作为依赖
- [x] 采用全新的路由插件 ElegantRouter
- [x] 使用基于 ApiFox 的远程 mock 代替本地 mock
- [x] 基于现有路由插件迁移至新路由插件的指南
- [x] 代码实现遵循 SoybeanJS 的代码规范
- [ ] 项目的 main 分支保留系统核心部分，示例页面和无关核心的插件移至 example 分支
- [ ] 完整 1.0 版本的文档

  1.0 源代码：[v1.0-beta](https://github.com/honghuangdc/soybean-admin/tree/v1.0-beta)

> 同时推出开源的 [AntDesignVue 版本](https://github.com/soybeanjs/soybean-admin-antd) 和 ElementPlus 版本



## 简介

[Soybean Admin](https://github.com/honghuangdc/soybean-admin) 是一个基于 Vue3、Vite3、TypeScript、NaiveUI、Pinia 和 UnoCSS 的清新优雅的中后台模版，它使用了最新流行的前端技术栈，内置丰富的主题配置，有着极高的代码规范，基于文件的路由系统以及基于 Mock 的动态权限路由，开箱即用的中后台前端解决方案，也可用于学习参考。

## 特性

- **最新流行技术栈**：使用 Vue3/Vite 等前端前沿技术开发, 使用高效率的 npm 包管理器 pnpm
- **TypeScript**: 应用程序级 JavaScript 的语言
- **主题**：丰富可配置的主题、暗黑模式，基于原子 css 框架 - UnoCss 的动态主题颜色
- **代码规范**：丰富的规范插件及极高的代码规范
- **文件路由系统**：基于文件的路由系统，根据页面文件自动生成路由声明、路由导入和路由模块
- **权限路由**：提供前端静态和后端动态两种路由模式，基于 mock 的动态路由能快速实现后端动态路由
- **请求函数**：基于 axios 的完善的请求函数封装，提供 Promise 和 hooks 两种请求函数，加入请求结果数据转换的适配器

## SoybeanJS 工具库

- [@soybeanjs/cli](https://github.com/soybeanjs/cli): SoybeanJS 命令行工具，包含发布、git 和依赖等相关的实用命令
- [@soybeanjs/changelog](https://github.com/soybeanjs/changelog): 根据 git tags 和 commits 生成 changelog [示例](./CHANGELOG.md)
- [eslint-config-soybeanjs](https://github.com/soybeanjs/eslint-config): SoybeanJS 的 eslint 预设配置
- [@soybeanjs/materials](https://github.com/soybeanjs/materials): SoybeanJS 的物料仓库
- [@soybeanjs/vite-plugin-vue-page-route](https://github.com/soybeanjs/vite-plugin-vue-page-route): SoybeanAdmin 的路由插件

## 基于 SoybeanAdmin 二次开发的项目

- [electron-mock-admin](https://github.com/lixin59/electron-mock-api): 一个 Mock Api 管理系统，帮助前端开发伙伴快速实现接口的 mock。
- [T-Shell](https://github.com/TheBlindM/T-Shell): 是一个可配置命令提示的终端模拟器和 SSH 客户端。

## 在线预览

- [Soybean Admin 预览地址](https://admin.soybeanjs.cn/)

## 文档

- [项目文档预览地址](https://admin-docs.soybeanjs.cn/)

## 代码仓库

| 仓库           | GitHub 地址                                                                   | gitee 镜像                                                                   | 预览                                                      |
| -------------- | ----------------------------------------------------------------------------- | ---------------------------------------------------------------------------- | --------------------------------------------------------- |
| soybean-admin  | [GitHub](https://github.com/honghuangdc/soybean-admin)                        | [gitee](https://gitee.com/honghuangdc/soybean-admin)                         | [预览](https://admin.soybeanjs.cn/)                       |
| tauri 版       | [tauri 版](https://github.com/honghuangdc/soybean-admin/tree/tauri)           | [tauri 版](https://gitee.com/honghuangdc/soybean-admin/tree/tauri)           |                                                           |
| 精简版         | [精简版](https://github.com/honghuangdc/soybean-admin/tree/thin)              | [精简版](https://gitee.com/honghuangdc/soybean-admin/tree/thin)              |                                                           |
| 集成 fast-crud | [集成 fast-crud](https://github.com/honghuangdc/soybean-admin/tree/fast-crud) | [集成 fast-crud](https://gitee.com/honghuangdc/soybean-admin/tree/fast-crud) | [预览](http://fast-crud.docmirror.cn/soybean/#/crud/demo) |

## 更新日志

[CHANGELOG](./CHANGELOG.md)

## 后端服务

- [soybean-admin-java](https://github.com/honghuangdc/soybean-admin-java)

## 项目示例图

![](https://s2.loli.net/2022/05/16/keOtgFH27r9nqYS.png)

![](https://s2.loli.net/2022/05/18/bW7mftiQexkvSTG.png)

![](https://s2.loli.net/2022/05/16/uV5nzjb3gYptAEl.png)

![](https://s2.loli.net/2022/05/16/rSnNHLdpuvkKxWq.png)

![](https://s2.loli.net/2023/06/07/O39EKNa675FZIuS.png)

![](https://s2.loli.net/2022/05/18/Mt6YZqmDxO8v4uR.png)

![](https://s2.loli.net/2023/06/07/zhmWnFlPTfDpot8.png)

![](https://s2.loli.net/2022/05/16/VPl6Ru1iCAhLcS4.png)

![](https://s2.loli.net/2023/06/07/n6Dy1HXBvuPc9oT.png)

![](https://s2.loli.net/2022/06/07/rY8TyAftM5dxspv.png)

![](https://s2.loli.net/2022/06/07/5GNBAd31IzQVjLP.png)

![](https://s2.loli.net/2022/06/07/rRSG6mEZpujOACT.png)

<div align="center">
	<img style="width:380px;margin-right:18px;border:1px solid #dedede;" src="https://s2.loli.net/2023/06/07/A5Nonc9vI6pB1lr.png" />
	&nbsp;
	<img style="width:380px;border:1px solid #dedede;" src="https://s2.loli.net/2023/06/07/VwBjqEhTke3OxXF.png" />
</div>

## 安装使用

- 环境配置
  **本地环境需要安装 pnpm 7.x 、Node.js 14.18+ 和 Git**

- 克隆代码

```bash
git clone https://github.com/honghuangdc/soybean-admin.git
```

- 安装依赖

```bash
pnpm i
```

- 运行

```bash
pnpm dev
```

- 打包

```bash
pnpm build
```

## Docker 部署

- Docker 部署 Soybean

```bash
docker build -t soybean-admin-image -f docker/Dockerfile .
docker run -d -p 80:80 soybean-admin-image
```

- 访问 SoybeanAdmin

打开本地浏览器访问`http://localhost`

## 如何贡献

非常欢迎您的加入！[提一个 Issue](https://github.com/honghuangdc/soybean-admin/issues/new) 或者提交一个 Pull Request。

## Git 贡献提交规范

项目已经内置 Angular 提交规范，直接执行 commit 命令即可生成符合 Angular 提交规范的 commit。

项目已用 simple-git-hooks 代替了 husky, 旧版本用了 husky，执行 pnpm soy init-simple-git-hooks 进行初始化配置

## 浏览器支持

本地开发推荐使用`Chrome 90+` 浏览器

支持现代浏览器, 不支持 IE

| [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/archive/internet-explorer_9-11/internet-explorer_9-11_48x48.png" alt="IE" width="24px" height="24px"  />](http://godban.github.io/browsers-support-badges/)IE | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/edge/edge_48x48.png" alt=" Edge" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)Edge | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/firefox/firefox_48x48.png" alt="Firefox" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)Firefox | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/chrome/chrome_48x48.png" alt="Chrome" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)Chrome | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/safari/safari_48x48.png" alt="Safari" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)Safari |
| :---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------: | :-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------: | :----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------: | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------: | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------: |
|                                                                                                                not support                                                                                                                |                                                                                          last 2 versions                                                                                          |                                                                                               last 2 versions                                                                                                |                                                                                             last 2 versions                                                                                              |                                                                                             last 2 versions                                                                                              |

## 开源作者

[@Soybean](https://github.com/honghuangdc)

## 交流

`Soybean Admin` 是完全开源免费的项目，在帮助开发者更方便地进行中大型管理系统开发，同时也提供微信和 QQ 交流群，使用问题欢迎在群内提问。

  <div style="display:flex;">
  	<div style="padding-right:24px;">
  		<p>QQ交流群</p>
      <img src="https://i.loli.net/2021/11/24/1J6REWXiHomU2kM.jpg" style="width:200px" />
  	</div>
		<div>
			<p>添加本人微信，欢迎来业务咨询(技术交流请加QQ群)</p>
			<img src="https://s2.loli.net/2023/06/07/sVyCUFBvzQ9f5b7.jpg" style="width:200px" />
		</div>
  </div>

## 捐赠

如果你觉得这个项目对你有帮助，可以请 Soybean 喝杯饮料表示支持，Soybean 开源的动力离不开各位的支持和鼓励。

![赞助](https://s2.loli.net/2022/01/24/i9cpq7lTCrKUoFf.png)

## License

本项目基于[MIT © Soybean-2021](./LICENSE) 协议，仅供参考学习，商用时请保留作者的版权信息，作者不对软件做担保和负责。
