<div align="center">
	<img src="./public/favicon.svg" width="160" />
	<h1>Soybean Admin</h1>
  <span>English | <a href="./README.zh_CN.md">中文</a></span>
</div>
<br />

[![license](https://img.shields.io/badge/license-MIT-green.svg)](./LICENSE) ![](https://img.shields.io/github/stars/soybeanjs/soybean-admin) ![](https://img.shields.io/github/forks/soybeanjs/soybean-admin)


>[!CAUTION]
> the old version of `Soybean Admin` is moved to branch [legacy](https://github.com/soybeanjs/soybean-admin/tree/legacy). It is recommended to use the latest version of `Soybean Admin`.

> [!NOTE]
> If you think `Soybean Admin` is helpful to you, or you like our project, please give us a ⭐️ on GitHub. Your support is the driving force for us to continue to improve and add new features! Thank you for your support!

## Introduction

[`Soybean Admin`](https://github.com/soybeanjs/soybean-admin) is a clean, elegant, beautiful and powerful admin template, based on the latest front-end technology stack, including Vue3, Vite5, TypeScript, Pinia and UnoCSS. It has built-in rich theme configuration and components, strict code specifications, and an automated file routing system. In addition, it also uses the online mock data solution based on ApiFox. `Soybean Admin` provides you with a one-stop admin solution, no additional configuration, and out of the box. It is also a best practice for learning cutting-edge technologies quickly.


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


## Version

- **NaiveUI Version:**
  - [Preview Link](https://naive.soybeanjs.cn/)
  - [Github Repository](https://github.com/soybeanjs/soybean-admin)
  - [Gitee Repository](https://gitee.com/honghuangdc/soybean-admin)

- **AntDesignVue Version:**
  - [Preview Link](https://antd.soybeanjs.cn/)
  - [Github Repository](https://github.com/soybeanjs/soybean-admin-antd)
  - [Gitee Repository](https://gitee.com/honghuangdc/soybean-admin-antd)

- **Legacy Version:**
  - [Preview Link](https://legacy.soybeanjs.cn/)
  - [Github Repository](https://github.com/soybeanjs/soybean-admin/tree/legacy)


## Documentation

- [Link](https://docs.soybeanjs.cn)
- [Legacy Docs](https://legacy-docs.soybeanjs.cn)

## Example Images

![](https://soybeanjs-1300612522.cos.ap-guangzhou.myqcloud.com/uPic/soybean-admin-v1-01.png)
![](https://soybeanjs-1300612522.cos.ap-guangzhou.myqcloud.com/uPic/soybean-admin-v1-02.png)
![](https://soybeanjs-1300612522.cos.ap-guangzhou.myqcloud.com/uPic/soybean-admin-v1-03.png)
![](https://soybeanjs-1300612522.cos.ap-guangzhou.myqcloud.com/uPic/soybean-admin-v1-04.png)
![](https://soybeanjs-1300612522.cos.ap-guangzhou.myqcloud.com/uPic/soybean-admin-v1-05.png)
![](https://soybeanjs-1300612522.cos.ap-guangzhou.myqcloud.com/uPic/soybean-admin-v1-06.png)
![](https://soybeanjs-1300612522.cos.ap-guangzhou.myqcloud.com/uPic/soybean-admin-v1-07.png)
![](https://soybeanjs-1300612522.cos.ap-guangzhou.myqcloud.com/uPic/soybean-admin-v1-08.png)
![](https://soybeanjs-1300612522.cos.ap-guangzhou.myqcloud.com/uPic/soybean-admin-v1-09.png)
![](https://soybeanjs-1300612522.cos.ap-guangzhou.myqcloud.com/uPic/soybean-admin-v1-10.png)
![](https://soybeanjs-1300612522.cos.ap-guangzhou.myqcloud.com/uPic/soybean-admin-v1-mobile.png)


## Usage

**Environment Preparation**

Make sure your environment meets the following requirements:

- **git**: you need git to clone and manage project versions.
- **NodeJS**: >=18.0.0, recommended 18.19.0 or higher.
  > You can use [fnm](https://github.com/Schniz/fnm) to manage your NodeJS version, [installation tutorial](https://juejin.cn/post/7113462239734022158).
- **pnpm**: >= 8.0.0, recommended 8.14.0 or higher.

**Clone Project**

```bash
git clone https://github.com/soybeanjs/soybean-admin.git
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

We warmly welcome and appreciate all forms of contributions. If you have any ideas or suggestions, please feel free to share them by submitting [pull requests](https://github.com/soybeanjs/soybean-admin/pulls) or creating GitHub [issue](https://github.com/soybeanjs/soybean-admin/issues/new).

## Git Commit Guidelines

This project has built-in `commit` command, you can execute `pnpm commit` to generate commit information that conforms to [Conventional Commits](conventionalcommits) specification. When submitting PR, please be sure to use `commit` command to create commit information to ensure the standardization of information.

## Browser Support

It is recommended to use the latest version of Chrome in development for a better experience.

| [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/archive/internet-explorer_9-11/internet-explorer_9-11_48x48.png" alt="IE" width="24px" height="24px"  />](http://godban.github.io/browsers-support-badges/) | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/edge/edge_48x48.png" alt=" Edge" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/) | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/firefox/firefox_48x48.png" alt="Firefox" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/) | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/chrome/chrome_48x48.png" alt="Chrome" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/) | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/safari/safari_48x48.png" alt="Safari" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/) |
| --- | --- | --- | --- | --- |
| not support | last 2 versions | last 2 versions | last 2 versions | last 2 versions |

## OpenSource Author

[Soybean](https://github.com/honghuangdc)

## Contributors

Thanks the following people for their contributions. If you want to contribute to this project, please refer to [How to Contribute](#how-to-contribute).

<a href="https://github.com/soybeanjs/soybean-admin/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=soybeanjs/soybean-admin" />
</a>

## Communication

`Soybean Admin` is a completely open source and free project, helping developers to develop medium and large-scale management systems more conveniently. It also provides WeChat and QQ communication groups. If you have any questions, please feel free to ask in the group.

  <div>
  	<p>QQ Group</p>
    <img src="https://soybeanjs-1300612522.cos.ap-guangzhou.myqcloud.com/uPic/qq-soybean-admin-2.jpg" style="width:200px" />
  </div>
	<div>
		<p>WeChat Group</p>
		<img src="https://soybeanjs-1300612522.cos.ap-guangzhou.myqcloud.com/uPic/wechat-0402.jpg" style="width:200px" />
	</div>
	<!-- <div>
		<p>add the following WeChat to invite to the WeChat group</p>
		<img src="https://soybeanjs-1300612522.cos.ap-guangzhou.myqcloud.com/uPic/wechat-soybeanjs.jpg" style="width:200px" />
	</div> -->
  <div>
    <p>Add Soybean's WeChat for business consultation, cooperation, project architecture, one-on-one guidance, etc.</p>
    <img src="https://soybeanjs-1300612522.cos.ap-guangzhou.myqcloud.com/uPic/wechat-soybean.jpg" style="width:200px" />
  </div>

## Star Trend

[![Star History Chart](https://api.star-history.com/svg?repos=soybeanjs/soybean-admin&type=Date)](https://star-history.com/#soybeanjs/soybean-admin&Date)

## License

This project is based on the [MIT © 2021 Soybean](./LICENSE) protocol, for learning purposes only, please retain the author's copyright information for commercial use, the author does not guarantee and is not responsible for the software.
