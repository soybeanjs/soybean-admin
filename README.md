<div align="center">
  <a href="https://github.com/honghuangdc/soybean-admin">
    <img alt="SoybeanAdmin Logo" width="200" height="200" src="https://s3.bmp.ovh/imgs/2021/09/088571214c76b1e5.png">
  </a>
	<br />
	<br />
	<h1>Soybean Admin</h1>
  <br />
</div>



## 简介

Soybean Admin 是一个基于 Vue3、Vite、Naive UI、TypeScript 的中后台解决方案，它使用了最新的前端技术栈，并提炼了典型的业务模型，页面，包括二次封装组件、动态菜单、权限校验、粒子化权限控制等功能，它可以帮助你快速搭建企业级中后台项目，相信不管是从新技术使用还是其他方面，都能帮助到你。

## 特性

- **最新技术栈**：使用 Vue3/vite2 等前端前沿技术开发, 使用高效率的npm包管理器pnpm
- **TypeScript**: 应用程序级 JavaScript 的语言
- **主题**：可配置的主题
- **代码规范**：丰富的规范插件及极高规范的代码组织

## 预览

- [soybean-admin](https://soybean.pro/) - 站点


## 目录规范

```javascript
soybean-admin
├── build                      //vite构建相关配置和插件
│   ├── define                 //定义的全局常量，通过vite构建时注入
│   ├── env                    //.env环境文件内容加载插件
│   └── plugins                //构建插件
│       ├── html.ts            //html插件(注入变量，压缩代码等)
│       ├── iconify.ts         //iconify图标插件
│       ├── visualizer.ts      //构建的依赖大小占比分析插件
│       ├── vue.ts             //vue相关vite插件
│       └── windicss.ts        //css框架插件
├── doc                        //项目相关说明文档
├── public                     //公共目录
│   ├── resource               //资源文件夹(不会被打包)
│   └── favicon.ico
├── src
│   ├── assets                 //静态资源
│   ├── components             //全局组件
│   │   ├── business           //业务相关组件
│   │   ├── common             //公共组件
│   │   └── custom             //自定义组件
│   ├── context                //全局上下文(通过provide和inject实现)
│   │   ├── app                //从app.vue注入的上下文
│   │   └── part               //局部组件注入的上下文
│   ├── enum                   //TS枚举
│   │   ├── animate.ts         //动画枚举
│   │   ├── business.ts        //业务相关枚举
│   │   ├── common.ts          //通用枚举
│   │   ├── route.ts           //路由相关枚举
│   │   ├── storage.ts           //存储相关枚举
│   │   └── theme.ts           //系统主题配置相关枚举
│   ├── hooks                  //组合式的钩子函数hooks
│   │   ├── business           //业务相关hooks
│   │   └── common             //通用hooks
│   ├── interface              //TS类型接口
│   │   ├── business.ts        //业务相关类型接口
│   │   ├── common.ts          //通用类型接口
│   │   └── theme.ts           //系统主题配置相关类型接口
│   ├── layouts                //布局组件
│   │   ├── BasicLayout        //基本布局组件(包含全局头部、侧边栏、底部等)
│   │   └── BlankLayout        //空白布局组件
│   ├── plugins                //插件
│   │   └── dark-mode.ts       //windicss暗黑模式插件
│   ├── router                 //vue路由
│   │   ├── cache.ts           //缓存的路由
│   │   ├── components.ts      //缓存的路由对应的组件
│   │   ├── helpers.ts         //工具函数
│   │   ├── menus.ts           //菜单
│   │   ├── permission.ts      //路由守卫相关函数
│   │   └── routes.ts          //声明的路由
│   ├── service                //网络请求
│   │   ├── api                //请求接口
│   │   ├── middleware         //请求结果的处理中间件
│   │   ├── request            //封装的请求函数
│   │   └── utils              //请求相关工具函数
│   ├── settings               //项目初始配置
│   │   └── theme.ts           //项目主题初始配置
│   ├── store                  //状态管理
│   │   └── modules            //状态管理划分的模块
│   ├── styles                 //样式
│   ├── typings                //TS类型声明文件(*.d.ts)
│   ├── utils                  //全局工具函数
│   │   ├── auth
│   │   ├── common
│   │   ├── package
│   │   ├── router
│   │   └── storage
│   ├── views                  //页面
│   │   ├── about
│   │   ├── component
│   │   ├── dashboard
│   │   ├── document
│   │   ├── multi-menu
│   │   └── system
│   ├── App.vue                //vue文件入口
│   ├── AppProvider.vue        //配置naive UI的vue文件(国际化,loadingBar、message等组件)
│   └── main.ts                //项目入口ts文件
├── .cz-config.js              //git cz提交配置
├── .editorconfig              //统一编辑器配置
├── .env                       //环境文件
├── .env.development           //环境文件(开发模式)
├── .env.production            //环境文件(生产模式)
├── .env.staging               //环境文件(自定义staging模式)
├── .eslintignore              //忽略eslint检查的配置文件
├── .eslintrc.js               //eslint配置文件
├── .gitignore                 //忽略git提交的配置文件
├── .husky                     //git commit提交钩子，提交前检查代码格式和提交commit内容的格式
├── .prettierrc.js             //prettier代码格式插件配置
├── commitlint.config.js       //commitlint提交规范插件配置
├── index.html
├── package.json
├── pnpm-lock.yaml             //npm包管理器pnpm依赖锁定文件
├── README.md                  //项目介绍文档
├── tsconfig.json              //TS配置
├── vite.config.ts             //vite配置
└── windi.config.ts            //windicss框架配置
```
