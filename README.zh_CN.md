<div align="center">
	<img src="./public/favicon.svg" width="160" />
	<h1>Soybean Admin</h1>
  <span><a href="./README.zh_CN.md">English</a> | 中文</span>
</div>
<br />

[![license](https://img.shields.io/badge/license-MIT-green.svg)](./LICENSE) ![](https://img.shields.io/github/stars/honghuangdc/soybean-admin) ![](https://img.shields.io/github/forks/honghuangdc/soybean-admin)

>[!IMPORTANT]
> 旧版本的 `Soybean Admin` 已经移动到分支 [legacy](https://github.com/honghuangdc/soybean-admin/tree/legacy)。建议使用最新版本的 `Soybean Admin`。
> 新版本的文档正在编写中，请耐心等待。

> [!TIP]
> 如果您觉得 `Soybean Admin`对您有所帮助，或者您喜欢我们的项目，请在 GitHub 上给我们一个 ⭐️。您的支持是我们持续改进和增加新功能的动力！感谢您的支持！

<br />

[![Star History Chart](https://api.star-history.com/svg?repos=honghuangdc/soybean-admin&type=Date)](https://star-history.com/#honghuangdc/soybean-admin&Date)


## 简介

[`Soybean Admin`](https://github.com/honghuangdc/soybean-admin) 是一个优雅且功能强大的后台管理模板，基于最新的前端技术栈，包括 Vue3, Vite5, TypeScript, Pinia 和 UnoCSS。它内置了丰富的主题配置和组件，代码规范严谨，实现了自动化的文件路由系统。此外，它还采用了基于 ApiFox 的在线Mock数据方案。`Soybean Admin` 为您提供了一站式的后台管理解决方案，无需额外配置，开箱即用。同样是一个快速学习新技术的最佳实践。

## 特性

- **前沿技术应用**：采用 Vue3, Vite5, TypeScript, Pinia 和 UnoCSS 等最新流行的技术栈。
- **清晰的项目架构**：采用 pnpm monorepo 架构，结构清晰，优雅易懂。
- **严格的代码规范**：遵循 [SoybeanJS 规范](https://docs.soybeanjs.cn/zh/standard)，集成了eslint, prettier 和 simple-git-hooks，保证代码的规范性。
- **TypeScript**： 支持严格的类型检查，提高代码的可维护性。
- **丰富的主题配置**：内置多样的主题配置，与 UnoCSS 完美结合。
- **内置国际化方案**：轻松实现多语言支持。
- **自动化文件路由系统**：自动生成路由导入、声明和类型。更多细节请查看 [Elegant Router](https://github.com/soybeanjs/elegant-router)。
- **灵活的权限路由**：同时支持前端静态路由和后端动态路由。
- **丰富的页面组件**：内置多样页面和组件，包括403、404、500页面，以及布局组件、标签组件、主题配置组件等。
- **命令行工具**：内置高效的命令行工具，git提交、删除文件、发布等。
- **移动端适配**：完美支持移动端，实现自适应布局。


## 预览

- [NaiveUI](https://admin.soybeanjs.cn)
- [AntDesign Vue](https://antd.soybeanjs.cn)

## 文档

- [Docs](https://docs.soybeanjs.cn)

## 仓库

| 仓库 | Github | Gitee | 预览 |
| --- | --- | --- | --- |
| NaiveUI | [github](https://github.com/honghuangdc/soybean-admin) | [gitee](https://gitee.com/honghuangdc/soybean-admin) | [preview](https://admin.soybeanjs.cn) |
| AntDesign Vue | [github](https://github.com/soybeanjs/soybean-admin-antd) | [gitee](https://gitee.com/honghuangdc/soybean-admin-antd) | [preview](https://antd.soybeanjs.cn) |
| 文档 | [github](https://github.com/honghuangdc/soybean-admin-docs) | [gitee](https://gitee.com/honghuangdc/soybean-admin-docs) | [preview](https://docs.soybeanjs.cn) |

## 示例图片

![](https://soybeanjs-1300612522.cos.ap-guangzhou.myqcloud.com/uPic/soybean-admin01.png)
![](https://soybeanjs-1300612522.cos.ap-guangzhou.myqcloud.com/uPic/soybean-admin02.png)
![](https://soybeanjs-1300612522.cos.ap-guangzhou.myqcloud.com/uPic/soybean-admin03.png)
![](https://soybeanjs-1300612522.cos.ap-guangzhou.myqcloud.com/uPic/soybean-admin04.png)
![](https://soybeanjs-1300612522.cos.ap-guangzhou.myqcloud.com/uPic/soybean-admin05.png)
![](https://soybeanjs-1300612522.cos.ap-guangzhou.myqcloud.com/uPic/soybean-admin06.png)
![](https://soybeanjs-1300612522.cos.ap-guangzhou.myqcloud.com/uPic/soybean-admin07.png)
![](https://soybeanjs-1300612522.cos.ap-guangzhou.myqcloud.com/uPic/soybean-admin08.png)


## 使用

**环境准备**

确保你的环境满足以下要求：

- **git**: 你需要git来克隆和管理项目版本。
- **NodeJS**: >=18.0.0，推荐 18.19.0 或更高。
  > 你可以使用 [fnm](https://github.com/Schniz/fnm) 来管理你的NodeJS版本，[安装教程](https://juejin.cn/post/7113462239734022158)。
- **pnpm**: >= 8.0.0，推荐 8.14.0 或更高。

**克隆项目**

```bash
git clone https://github.com/honghuangdc/soybean-admin.git
```

**安装依赖**

```bash
pnpm i
```
> 由于本项目采用了 pnpm monorepo 的管理方式，因此请不要使用 npm 或 yarn 来安装依赖。

**启动项目**

```bash
pnpm dev
```

**构建项目**

```bash
pnpm build
```

## 如何贡献

我们热烈欢迎并感谢所有形式的贡献。如果您有任何想法或建议，欢迎通过提交 [pull requests](https://github.com/honghuangdc/soybean-admin/pulls) 或创建 GitHub [issue](https://github.com/honghuangdc/soybean-admin/issues/new) 来分享。

## Git 提交规范

本项目已内置 `commit` 命令，您可以通过执行 `pnpm commit` 来生成符合 [Conventional Commits](conventionalcommits) 规范的提交信息。在提交PR时，请务必使用 `commit` 命令来创建提交信息，以确保信息的规范性。


## 浏览器支持

推荐使用最新版的 Chrome 浏览器进行开发，以获得更好的体验。

| [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/archive/internet-explorer_9-11/internet-explorer_9-11_48x48.png" alt="IE" width="24px" height="24px"  />](http://godban.github.io/browsers-support-badges/) | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/edge/edge_48x48.png" alt=" Edge" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/) | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/firefox/firefox_48x48.png" alt="Firefox" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/) | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/chrome/chrome_48x48.png" alt="Chrome" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/) | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/safari/safari_48x48.png" alt="Safari" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/) |
| --- | --- | --- | --- | --- |
| not support | last 2 versions | last 2 versions | last 2 versions | last 2 versions |

## 开源作者

[Soybean](https://github.com/honghuangdc)

## 交流

- [GitHub Issue](https://github.com/honghuangdc/soybean-admin/issues)
<br />

- QQ 群 :

  <img src="https://soybeanjs-1300612522.cos.ap-guangzhou.myqcloud.com/uPic/qq.jpeg" style="width:200px" />
<br />

- Soybean's 微信 (业务咨询或合作) :

  <img src="https://soybeanjs-1300612522.cos.ap-guangzhou.myqcloud.com/uPic/wechat.jpeg" style="width:200px" />

## 捐赠

如果您觉得本项目对您有所帮助，欢迎您以买杯咖啡的方式来支持 Soybean。您的支持和鼓励是 Soybean 持续开源的重要动力。

![](https://soybeanjs-1300612522.cos.ap-guangzhou.myqcloud.com/uPic/donation.png)

## 开源协议

项目基于 [MIT © 2021 Soybean](./LICENSE) 协议，仅供学习参考，商业使用请保留作者版权信息，作者不保证也不承担任何软件的使用风险。
