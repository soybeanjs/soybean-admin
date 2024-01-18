<div align="center">
	<img src="./public/favicon.svg" width="160" />
	<h1>Soybean Admin</h1>
  <span>English | <a href="./README.zh_CN.md">中文</a></span>
</div>
<br />

[![license](https://img.shields.io/badge/license-MIT-green.svg)](./LICENSE) ![](https://img.shields.io/github/stars/honghuangdc/soybean-admin) ![](https://img.shields.io/github/forks/honghuangdc/soybean-admin)

> [!NOTE]
> If you think `Soybean Admin` is helpful to you, or you like our project, please give us a ⭐️ on GitHub. Your support is the driving force for us to continue to improve and add new features! Thank you for your support!

>[!CAUTION]
> the old version of `Soybean Admin` is moved to branch [legacy](https://github.com/honghuangdc/soybean-admin/tree/legacy). It is recommended to use the latest version of `Soybean Admin`.
> the documents of new version is processing, please wait patiently.

<br />

[![Star History Chart](https://api.star-history.com/svg?repos=honghuangdc/soybean-admin&type=Date)](https://star-history.com/#honghuangdc/soybean-admin&Date)

## Introduction

[`Soybean Admin`](https://github.com/honghuangdc/soybean-admin) is an elegant and powerful admin template, based on the latest front-end technology stack, including Vue3, Vite5, TypeScript, Pinia and UnoCSS. It has built-in rich theme configuration and components, strict code specifications, and an automated file routing system. In addition, it also uses the online mock data solution based on ApiFox. `Soybean Admin` provides you with a one-stop admin solution, no additional configuration, and out of the box. It is also a best practice for learning cutting-edge technologies quickly.



## Features

- **Cutting-edge technology application**: using the latest popular technology stack such as Vue3, Vite5, TypeScript, Pinia and UnoCSS.
- **Clear project architecture**: using pnpm monorepo architecture, clear structure, elegant and easy to understand.
- **Strict code specifications**: follow the [SoybeanJS specification](https://docs.soybeanjs.cn/standard), integrate eslint, prettier and simple-git-hooks to ensure the code is standardized.
- **TypeScript**: support strict type checking to improve code maintainability.
- **Rich theme configuration**: built-in a variety of theme configurations, perfectly integrated with UnoCSS.
- **Built-in internationalization solution**: easily realize multi-language support.
- **Automated file routing system**: automatically generate route import, declaration and type. For more details, please refer to [Elegant Router](https://github.com/soybeanjs/elegant-router).
- **Flexible permission routing**: support both front-end static routing and back-end dynamic routing.
- **Rich page components**: built-in a variety of pages and components, including 403, 404, 500 pages, as well as layout components, tag components, theme configuration components, etc.
- **Command line tool**: built-in efficient command line tool, git commit, delete file, release, etc.
- **Mobile adaptation**: perfectly support mobile terminal to realize adaptive layout.


## Preview

- [NaiveUI](https://naive.soybeanjs.cn)
- [AntDesign Vue](https://antd.soybeanjs.cn)

## Documentation

- [Docs](https://docs.soybeanjs.cn)

## Repositories

| Repository | Github | Gitee | Preview |
| --- | --- | --- | --- |
| NaiveUI | [github](https://github.com/honghuangdc/soybean-admin) | [gitee](https://gitee.com/honghuangdc/soybean-admin) | [preview](https://naive.soybeanjs.cn) |
| AntDesign Vue | [github](https://github.com/soybeanjs/soybean-admin-antd) | [gitee](https://gitee.com/honghuangdc/soybean-admin-antd) | [preview](https://antd.soybeanjs.cn) |
| Documentation | [github](https://github.com/honghuangdc/soybean-admin-docs) | [gitee](https://gitee.com/honghuangdc/soybean-admin-docs) | [preview](https://docs.soybeanjs.cn) |

## Example Images

![](https://soybeanjs-1300612522.cos.ap-guangzhou.myqcloud.com/uPic/soybean-admin01.png)
![](https://soybeanjs-1300612522.cos.ap-guangzhou.myqcloud.com/uPic/soybean-admin02.png)
![](https://soybeanjs-1300612522.cos.ap-guangzhou.myqcloud.com/uPic/soybean-admin03.png)
![](https://soybeanjs-1300612522.cos.ap-guangzhou.myqcloud.com/uPic/soybean-admin04.png)
![](https://soybeanjs-1300612522.cos.ap-guangzhou.myqcloud.com/uPic/soybean-admin05.png)
![](https://soybeanjs-1300612522.cos.ap-guangzhou.myqcloud.com/uPic/soybean-admin06.png)
![](https://soybeanjs-1300612522.cos.ap-guangzhou.myqcloud.com/uPic/soybean-admin07.png)
![](https://soybeanjs-1300612522.cos.ap-guangzhou.myqcloud.com/uPic/soybean-admin08.png)


## Usage

**Environment Preparation**

Make sure your environment meets the following requirements:

- **git**: you need git to clone and manage project versions.
- **NodeJS**: >=18.0.0, recommended 18.19.0 or higher.
  > You can use [fnm](https://github.com/Schniz/fnm) to manage your NodeJS version, [installation tutorial](https://juejin.cn/post/7113462239734022158).
- **pnpm**: >= 8.0.0, recommended 8.14.0 or higher.

**Clone Project**

```bash
git clone https://github.com/honghuangdc/soybean-admin.git
```

**Install Dependencies**

```bash
pnpm i
```
> Since this project uses the pnpm monorepo management method, please do not use npm or yarn to install dependencies.

**Start Project**

```bash
pnpm dev
```

**Build Project**

```bash
pnpm build
```

## How to Contribute

We warmly welcome and appreciate all forms of contributions. If you have any ideas or suggestions, please feel free to share them by submitting [pull requests](https://github.com/honghuangdc/soybean-admin/pulls) or creating GitHub [issue](https://github.com/honghuangdc/soybean-admin/issues/new).

## Git Commit Guidelines

This project has built-in `commit` command, you can execute `pnpm commit` to generate commit information that conforms to [Conventional Commits](conventionalcommits) specification. When submitting PR, please be sure to use `commit` command to create commit information to ensure the standardization of information.

## Browser Support

It is recommended to use the latest version of Chrome in development for a better experience.

| [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/archive/internet-explorer_9-11/internet-explorer_9-11_48x48.png" alt="IE" width="24px" height="24px"  />](http://godban.github.io/browsers-support-badges/) | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/edge/edge_48x48.png" alt=" Edge" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/) | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/firefox/firefox_48x48.png" alt="Firefox" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/) | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/chrome/chrome_48x48.png" alt="Chrome" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/) | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/safari/safari_48x48.png" alt="Safari" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/) |
| --- | --- | --- | --- | --- |
| not support | last 2 versions | last 2 versions | last 2 versions | last 2 versions |

## OpenSource Author

[Soybean](https://github.com/honghuangdc)

## Communication

- [GitHub Issue](https://github.com/honghuangdc/soybean-admin/issues)
<br />

- QQ Group :

  <img src="https://soybeanjs-1300612522.cos.ap-guangzhou.myqcloud.com/uPic/qq.jpeg" style="width:200px" />
<br />

- Soybean's Wechat (Business Consultancy or Cooperation) :

  <img src="https://soybeanjs-1300612522.cos.ap-guangzhou.myqcloud.com/uPic/wechat.jpeg" style="width:200px" />

## Donate

If you think this project is helpful to you, you can buy Soybean a drink to show your support, Soybean open source power can not be separated from your support and encouragement.

![](https://soybeanjs-1300612522.cos.ap-guangzhou.myqcloud.com/uPic/donation.png)

## License

This project is based on the [MIT © 2021 Soybean](./LICENSE) protocol, for learning purposes only, please retain the author's copyright information for commercial use, the author does not guarantee and is not responsible for the software.
