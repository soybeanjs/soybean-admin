<div align="center">
	<img src="./public/favicon.svg" width="160" />
	<h1>Soybean Admin</h1>
  <span><a href="./README.zh_CN.md">English</a> | 中文</span>
</div>

[![license](https://img.shields.io/badge/license-MIT-green.svg)](./LICENSE) ![](https://img.shields.io/github/stars/honghuangdc/soybean-admin) ![](https://img.shields.io/github/forks/honghuangdc/soybean-admin)

>[!IMPORTANT]
> 旧版本的 soybean-admin 已经移动到分支 [legacy](https://github.com/honghuangdc/soybean-admin/tree/legacy)。建议使用最新版本的 soybean-admin。
> 新版本的文档正在编写中，请耐心等待。


## 简介

[Soybean Admin](https://github.com/honghuangdc/soybean-admin) 是一个基于 Vue3、Vite5、TypeScript、NaiveUI、Pinia 和 UnoCSS 的清新优雅的后台管理模板。采用最新流行的前端技术栈，内置丰富的主题配置，代码规范性极高，拥有自动化、智能化的文件路由系统。使用 ApiFox 生成模拟数据，开箱即用的后台管理解决方案，也可用于学习参考。

## 特性

- **最新流行技术栈**：Vue3、Vite5、TypeScript、NaiveUI、Pinia 和 UnoCSS。
- **清晰的项目结构**：采用 pnpm monorepo，结构清晰优雅，易于维护。
- **TypeScript**：严格的类型检查，易于维护。
- **主题**：内置丰富的主题配置，轻松结合 UnoCSS。
- **文件路由系统**：自动化、智能化的文件路由系统。更多细节请查看 [Elegant Router](https://github.com/soybeanjs/elegant-router)。
- **权限路由**：支持前端静态路由和后端动态路由。
- **代码规范**：代码规范性极高。更多细节请查看 [SoybeanJS Code Standard]()。

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

- 环境准备

  - **NodeJS**: >= 18.0.0 (推荐 >=18.19.0)
  > 推荐使用 [fnm](https://github.com/Schniz/fnm) 管理NodeJS版本. [安装教程](https://juejin.cn/post/7113462239734022158)
  - **pnpm**: >= 8.0.0 (推荐 >=8.14.0)
  - **git**

- 克隆项目

```bash
git clone https://github.com/honghuangdc/soybean-admin.git
```

- 安装依赖

```bash
pnpm i
```
> 项目采用 pnpm monorepo，所以不能使用 npm 或 yarn 安装依赖。

- 启动项目

```bash
pnpm dev
```

- 构建项目

```bash
pnpm build
```

## 如何贡献

我们欢迎所有的贡献。您可以将任何想法提交为 [pull requests](https://github.com/honghuangdc/soybean-admin/pulls) 或 GitHub [issue](https://github.com/honghuangdc/soybean-admin/issues/new)。

## Git 提交规范

项目内置了 `commit` 命令，通过执行 `pnpm commit` 可以创建符合 [Conventional Commits](conventionalcommits) 的提交信息。

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

如果您认为本项目对您有所帮助，可以请 Soybean 喝杯咖啡以示支持，Soybean 的开源动力离不开您的支持和鼓励。

![](https://soybeanjs-1300612522.cos.ap-guangzhou.myqcloud.com/uPic/donation.png)

## 开源协议

项目基于 [MIT © 2021 Soybean](./LICENSE) 协议，仅供学习参考，商业使用请保留作者版权信息，作者不保证也不承担任何软件的使用风险。
