# Changelog


## [v1.3.8](https://github.com/soybeanjs/soybean-admin/compare/v1.3.7...v1.3.8) (2024-10-25)

### &nbsp;&nbsp;&nbsp;🚨 Breaking Changes

- **projects**: refactor route cache & support reset route cache strategy &nbsp;-&nbsp; by @soybeanjs [<samp>(b667e)</samp>](https://github.com/soybeanjs/soybean-admin/commit/b667eab)

### &nbsp;&nbsp;&nbsp;🚀 Features

- **packages**:
  - add subpackage `@sa/alova` &nbsp;-&nbsp; by @JOU-amjs in https://github.com/soybeanjs/soybean-admin/issues/640 [<samp>(2072f)</samp>](https://github.com/soybeanjs/soybean-admin/commit/2072f58)
  - optimistic subpackage `@sa/alova` &nbsp;-&nbsp; by @JOU-amjs in https://github.com/soybeanjs/soybean-admin/issues/646 [<samp>(4b3ac)</samp>](https://github.com/soybeanjs/soybean-admin/commit/4b3ac11)
- **projects**:
  - login supports accessible operation. &nbsp;-&nbsp; by @Azir-11 in https://github.com/soybeanjs/soybean-admin/issues/637 [<samp>(cfaab)</samp>](https://github.com/soybeanjs/soybean-admin/commit/cfaab85)

### &nbsp;&nbsp;&nbsp;🐞 Bug Fixes

- **utils**: fix `isPC`. fixed #644 &nbsp;-&nbsp; by @soybeanjs in https://github.com/soybeanjs/soybean-admin/issues/644 [<samp>(47264)</samp>](https://github.com/soybeanjs/soybean-admin/commit/4726498)

### &nbsp;&nbsp;&nbsp;🏡 Chore

- **deps**:
  - update deps &nbsp;-&nbsp; by @soybeanjs [<samp>(8dcda)</samp>](https://github.com/soybeanjs/soybean-admin/commit/8dcda38)
- **projects**:
  - update vscode extensions &nbsp;-&nbsp; by @soybeanjs [<samp>(24bb6)</samp>](https://github.com/soybeanjs/soybean-admin/commit/24bb6d9)
  - update deps & fix sass usage &nbsp;-&nbsp; by @soybeanjs [<samp>(71e63)</samp>](https://github.com/soybeanjs/soybean-admin/commit/71e6307)
- **types**:
  - remove type declaration for document.startViewTransition (TypeScript 5.6 includes it) &nbsp;-&nbsp; by @NHZEX in https://github.com/soybeanjs/soybean-admin/issues/633 [<samp>(83ba7)</samp>](https://github.com/soybeanjs/soybean-admin/commit/83ba798)

### &nbsp;&nbsp;&nbsp;🎨 Styles

- **projects**: reduce ambiguity in theme configuration instructions. &nbsp;-&nbsp; by @Azir-11 [<samp>(75cbf)</samp>](https://github.com/soybeanjs/soybean-admin/commit/75cbfbb)

### &nbsp;&nbsp;&nbsp;❤️ Contributors

[![soybeanjs](https://github.com/soybeanjs.png?size=48)](https://github.com/soybeanjs)&nbsp;&nbsp;[![JOU-amjs](https://github.com/JOU-amjs.png?size=48)](https://github.com/JOU-amjs)&nbsp;&nbsp;[![Azir-11](https://github.com/Azir-11.png?size=48)](https://github.com/Azir-11)&nbsp;&nbsp;[![NHZEX](https://github.com/NHZEX.png?size=48)](https://github.com/NHZEX)&nbsp;&nbsp;

## [v1.3.7](https://github.com/soybeanjs/soybean-admin/compare/v1.3.6...v1.3.7) (2024-09-21)

### &nbsp;&nbsp;&nbsp;🚨 Breaking Changes

- **projects**: update scss config &nbsp;-&nbsp; by @soybeanjs [<samp>(24e9e)</samp>](https://github.com/soybeanjs/soybean-admin/commit/24e9e57)

### &nbsp;&nbsp;&nbsp;🐞 Bug Fixes

- **projects**: fix global-tab click conflict with contextmenu &nbsp;-&nbsp; by @soybeanjs [<samp>(3e72c)</samp>](https://github.com/soybeanjs/soybean-admin/commit/3e72c3b)

### &nbsp;&nbsp;&nbsp;💅 Refactors

- **packages**: @sa/materials: remove tab close shortcut by mouse &nbsp;-&nbsp; by @soybeanjs [<samp>(4da58)</samp>](https://github.com/soybeanjs/soybean-admin/commit/4da588c)

### &nbsp;&nbsp;&nbsp;🏡 Chore

- **deps**: update deps &nbsp;-&nbsp; by @soybeanjs [<samp>(baefd)</samp>](https://github.com/soybeanjs/soybean-admin/commit/baefdfd)

### &nbsp;&nbsp;&nbsp;❤️ Contributors

[![soybeanjs](https://github.com/soybeanjs.png?size=48)](https://github.com/soybeanjs)&nbsp;&nbsp;

## [v1.3.6](https://github.com/soybeanjs/soybean-admin/compare/v1.3.5...v1.3.6) (2024-09-20)

### &nbsp;&nbsp;&nbsp;🐞 Bug Fixes

- **components**:
  - fix VerticalMixMenu name &nbsp;-&nbsp; by @soybeanjs [<samp>(20f8e)</samp>](https://github.com/soybeanjs/soybean-admin/commit/20f8ed3)
- **projects**:
  - fix click global-tab in iPad. fixed #624 &nbsp;-&nbsp; by @soybeanjs in https://github.com/soybeanjs/soybean-admin/issues/624 [<samp>(04d05)</samp>](https://github.com/soybeanjs/soybean-admin/commit/04d0564)
  - when the roles filter submenu is empty, the parent menu is not excluded. fixed #621. &nbsp;-&nbsp; by @Azir-11 in https://github.com/soybeanjs/soybean-admin/issues/626 and https://github.com/soybeanjs/soybean-admin/issues/621 [<samp>(0ac95)</samp>](https://github.com/soybeanjs/soybean-admin/commit/0ac95bd)

### &nbsp;&nbsp;&nbsp;🛠 Optimizations

- **projects**:
  - optimize code &nbsp;-&nbsp; by @soybeanjs [<samp>(6561f)</samp>](https://github.com/soybeanjs/soybean-admin/commit/6561f0b)
  - optimize code &nbsp;-&nbsp; by @soybeanjs [<samp>(38eeb)</samp>](https://github.com/soybeanjs/soybean-admin/commit/38eeb67)
  - remove defineModel setting，enabled by default &nbsp;-&nbsp; by @yanbowe in https://github.com/soybeanjs/soybean-admin/issues/620 [<samp>(60bbd)</samp>](https://github.com/soybeanjs/soybean-admin/commit/60bbd2d)

### &nbsp;&nbsp;&nbsp;📖 Documentation

- **projects**: update CHANGELOG &nbsp;-&nbsp; by @soybeanjs [<samp>(5baf1)</samp>](https://github.com/soybeanjs/soybean-admin/commit/5baf19d)

### &nbsp;&nbsp;&nbsp;🏡 Chore

- **deps**:
  - update deps &nbsp;-&nbsp; by @soybeanjs [<samp>(207d6)</samp>](https://github.com/soybeanjs/soybean-admin/commit/207d6eb)
  - update deps &nbsp;-&nbsp; by @soybeanjs [<samp>(f3562)</samp>](https://github.com/soybeanjs/soybean-admin/commit/f35627e)

### &nbsp;&nbsp;&nbsp;❤️ Contributors

[![soybeanjs](https://github.com/soybeanjs.png?size=48)](https://github.com/soybeanjs)&nbsp;&nbsp;[![Azir-11](https://github.com/Azir-11.png?size=48)](https://github.com/Azir-11)&nbsp;&nbsp;[![yanbowe](https://github.com/yanbowe.png?size=48)](https://github.com/yanbowe)&nbsp;&nbsp;

## [v1.3.5](https://github.com/soybeanjs/soybean-admin/compare/v1.3.4...v1.3.5) (2024-09-07)

### &nbsp;&nbsp;&nbsp;🚀 Features

- **packages**:
  - @sa/axios: add response to flatRequest when success &nbsp;-&nbsp; by @soybeanjs [<samp>(c4e16)</samp>](https://github.com/soybeanjs/soybean-admin/commit/c4e1610)
- **projects**:
  - README.zh_CN.md 添加合作推广 &nbsp;-&nbsp; by @PZ-18664918826 in https://github.com/soybeanjs/soybean-admin/issues/601 [<samp>(2fa40)</samp>](https://github.com/soybeanjs/soybean-admin/commit/2fa400b)
  - Add more commit types according to Apache specifications &nbsp;-&nbsp; by @Azir-11 in https://github.com/soybeanjs/soybean-admin/issues/610 [<samp>(878d9)</samp>](https://github.com/soybeanjs/soybean-admin/commit/878d9c3)
  - does the configuration support automatic updates. close#612 &nbsp;-&nbsp; by @Azir-11 in https://github.com/soybeanjs/soybean-admin/issues/617 and https://github.com/soybeanjs/soybean-admin/issues/612 [<samp>(4c9f4)</samp>](https://github.com/soybeanjs/soybean-admin/commit/4c9f4e0)
  - add app error handler. close #587 &nbsp;-&nbsp; by @soybeanjs in https://github.com/soybeanjs/soybean-admin/issues/587 [<samp>(be855)</samp>](https://github.com/soybeanjs/soybean-admin/commit/be8556c)

### &nbsp;&nbsp;&nbsp;🐞 Bug Fixes

- **deps**:
  - move json5 from devDependencies to dependencies to support production usage &nbsp;-&nbsp; by @mufeng889 in https://github.com/soybeanjs/soybean-admin/issues/618 [<samp>(7cb43)</samp>](https://github.com/soybeanjs/soybean-admin/commit/7cb43fc)
- **projects**:
  - avoid retrieving cached HTML &nbsp;-&nbsp; by @Azir-11 in https://github.com/soybeanjs/soybean-admin/issues/605 [<samp>(ef6cf)</samp>](https://github.com/soybeanjs/soybean-admin/commit/ef6cf93)
  - fix login redirect &nbsp;-&nbsp; by @soybeanjs [<samp>(3830e)</samp>](https://github.com/soybeanjs/soybean-admin/commit/3830ec7)
  - fix vertical-mix-menu when sider collapse. fixed #608 &nbsp;-&nbsp; by @soybeanjs in https://github.com/soybeanjs/soybean-admin/issues/608 [<samp>(c3f1f)</samp>](https://github.com/soybeanjs/soybean-admin/commit/c3f1f69)
  - fix breadcrumb when activeMenu is parent menu. fixed #589 &nbsp;-&nbsp; by @soybeanjs in https://github.com/soybeanjs/soybean-admin/issues/589 [<samp>(79b2a)</samp>](https://github.com/soybeanjs/soybean-admin/commit/79b2a28)
  - fix refresh token when meet multi requests. fixed #581 &nbsp;-&nbsp; by @soybeanjs in https://github.com/soybeanjs/soybean-admin/issues/581 [<samp>(27b52)</samp>](https://github.com/soybeanjs/soybean-admin/commit/27b5222)
- **types**:
  - fix the type of TableApiFn &nbsp;-&nbsp; by @Azir-11 in https://github.com/soybeanjs/soybean-admin/issues/599 [<samp>(26c93)</samp>](https://github.com/soybeanjs/soybean-admin/commit/26c93df)

### &nbsp;&nbsp;&nbsp;🛠 Optimizations

- **projects**: optimize menu selectedKey &nbsp;-&nbsp; by @soybeanjs [<samp>(531bf)</samp>](https://github.com/soybeanjs/soybean-admin/commit/531bfaf)

### &nbsp;&nbsp;&nbsp;📖 Documentation

- **projects**:
  - update README &nbsp;-&nbsp; by @mufeng889 in https://github.com/soybeanjs/soybean-admin/issues/594 [<samp>(a8f92)</samp>](https://github.com/soybeanjs/soybean-admin/commit/a8f923e)
  - update README &nbsp;-&nbsp; by @soybeanjs [<samp>(e9a2e)</samp>](https://github.com/soybeanjs/soybean-admin/commit/e9a2ee4)
  - update README &nbsp;-&nbsp; by @soybeanjs [<samp>(73e91)</samp>](https://github.com/soybeanjs/soybean-admin/commit/73e917a)
  - update the location of important information in the document &nbsp;-&nbsp; by **Azir** [<samp>(9c012)</samp>](https://github.com/soybeanjs/soybean-admin/commit/9c012c7)

### &nbsp;&nbsp;&nbsp;🏡 Chore

- **deps**:
  - update deps &nbsp;-&nbsp; by @soybeanjs [<samp>(a1c14)</samp>](https://github.com/soybeanjs/soybean-admin/commit/a1c14a1)
  - update deps &nbsp;-&nbsp; by @soybeanjs [<samp>(7fa55)</samp>](https://github.com/soybeanjs/soybean-admin/commit/7fa5590)
  - update deps &nbsp;-&nbsp; by @soybeanjs [<samp>(a44ea)</samp>](https://github.com/soybeanjs/soybean-admin/commit/a44ea62)
- **projects**:
  - use json5 resolve env `VITE_OTHER_SERVICE_BASE_URL` & fix proxy enable &nbsp;-&nbsp; by @soybeanjs [<samp>(b16a9)</samp>](https://github.com/soybeanjs/soybean-admin/commit/b16a963)

### &nbsp;&nbsp;&nbsp;🎨 Styles

- **projects**: rename script czh to commit:zh &nbsp;-&nbsp; by @Azir-11 in https://github.com/soybeanjs/soybean-admin/issues/597 [<samp>(5094f)</samp>](https://github.com/soybeanjs/soybean-admin/commit/5094f0e)

### &nbsp;&nbsp;&nbsp;❤️ Contributors

[![soybeanjs](https://github.com/soybeanjs.png?size=48)](https://github.com/soybeanjs)&nbsp;&nbsp;[![mufeng889](https://github.com/mufeng889.png?size=48)](https://github.com/mufeng889)&nbsp;&nbsp;[![Azir-11](https://github.com/Azir-11.png?size=48)](https://github.com/Azir-11)&nbsp;&nbsp;[![PZ-18664918826](https://github.com/PZ-18664918826.png?size=48)](https://github.com/PZ-18664918826)&nbsp;&nbsp;
[Azir](mailto:2075125282@qq.com),&nbsp;

## [v1.3.4](https://github.com/honghuangdc/soybean-admin/compare/v1.3.3...v1.3.4) (2024-08-01)

### &nbsp;&nbsp;&nbsp;🚨 Breaking Changes

- **projects**: don't reset active menu of vertical-mix layout when it is mixSiderFixed &nbsp;-&nbsp; by @honghuangdc [<samp>(939c5)</samp>](https://github.com/honghuangdc/soybean-admin/commit/939c512)

### &nbsp;&nbsp;&nbsp;🛠 Optimizations

- **projects**: optimize code &nbsp;-&nbsp; by @honghuangdc [<samp>(cb1d4)</samp>](https://github.com/honghuangdc/soybean-admin/commit/cb1d445)

### &nbsp;&nbsp;&nbsp;🏡 Chore

- **projects**: update deps & fix vue-router type &nbsp;-&nbsp; by @honghuangdc [<samp>(96837)</samp>](https://github.com/honghuangdc/soybean-admin/commit/968370b)

### &nbsp;&nbsp;&nbsp;❤️ Contributors

[![honghuangdc](https://github.com/honghuangdc.png?size=48)](https://github.com/honghuangdc)&nbsp;&nbsp;

## [v1.3.3](https://github.com/honghuangdc/soybean-admin/compare/v1.3.2...v1.3.3) (2024-07-30)

### &nbsp;&nbsp;&nbsp;🐞 Bug Fixes

- **projects**: fix watermark settings &nbsp;-&nbsp; by @honghuangdc [<samp>(5646a)</samp>](https://github.com/honghuangdc/soybean-admin/commit/5646a50)

### &nbsp;&nbsp;&nbsp;📖 Documentation

- **projects**: update CHANGELOG &nbsp;-&nbsp; by @honghuangdc [<samp>(ebc83)</samp>](https://github.com/honghuangdc/soybean-admin/commit/ebc838c)

### &nbsp;&nbsp;&nbsp;❤️ Contributors

[![honghuangdc](https://github.com/honghuangdc.png?size=48)](https://github.com/honghuangdc)&nbsp;&nbsp;

## [v1.3.2](https://github.com/honghuangdc/soybean-admin/compare/v1.3.1...v1.3.2) (2024-07-30)

### &nbsp;&nbsp;&nbsp;🚀 Features

- **projects**:
  - add color fading mode.close #567 &nbsp;-&nbsp; by @Azir-11 in https://github.com/honghuangdc/soybean-admin/issues/569 and https://github.com/honghuangdc/soybean-admin/issues/567 [<samp>(4dde4)</samp>](https://github.com/honghuangdc/soybean-admin/commit/4dde4c2)
  - add full screen watermark. close#571 &nbsp;-&nbsp; by @paynezhuang in https://github.com/honghuangdc/soybean-admin/issues/573 and https://github.com/honghuangdc/soybean-admin/issues/571 [<samp>(ea8aa)</samp>](https://github.com/honghuangdc/soybean-admin/commit/ea8aa6c)

### &nbsp;&nbsp;&nbsp;🐞 Bug Fixes

- **projects**: fix vertical-mix menu selected &nbsp;-&nbsp; by @honghuangdc [<samp>(59f07)</samp>](https://github.com/honghuangdc/soybean-admin/commit/59f07d8)

### &nbsp;&nbsp;&nbsp;🛠 Optimizations

- **projects**:
  - add type WatermarkProps &nbsp;-&nbsp; by @honghuangdc [<samp>(f26d0)</samp>](https://github.com/honghuangdc/soybean-admin/commit/f26d0a6)
  - remove home NAlert closable &nbsp;-&nbsp; by @honghuangdc [<samp>(98b75)</samp>](https://github.com/honghuangdc/soybean-admin/commit/98b75c2)
  - optimize response code comparison &nbsp;-&nbsp; by @honghuangdc [<samp>(cf67d)</samp>](https://github.com/honghuangdc/soybean-admin/commit/cf67d55)
- **types**:
  - remove useless types. &nbsp;-&nbsp; by **Azir** [<samp>(eed61)</samp>](https://github.com/honghuangdc/soybean-admin/commit/eed617f)

### &nbsp;&nbsp;&nbsp;📖 Documentation

- **projects**: update CHANGELOG &nbsp;-&nbsp; by @honghuangdc [<samp>(d3759)</samp>](https://github.com/honghuangdc/soybean-admin/commit/d37591d)

### &nbsp;&nbsp;&nbsp;🏡 Chore

- **deps**: update deps &nbsp;-&nbsp; by @honghuangdc [<samp>(993e9)</samp>](https://github.com/honghuangdc/soybean-admin/commit/993e9ca)

### &nbsp;&nbsp;&nbsp;❤️ Contributors

[![honghuangdc](https://github.com/honghuangdc.png?size=48)](https://github.com/honghuangdc)&nbsp;&nbsp;[![paynezhuang](https://github.com/paynezhuang.png?size=48)](https://github.com/paynezhuang)&nbsp;&nbsp;[![Azir-11](https://github.com/Azir-11.png?size=48)](https://github.com/Azir-11)&nbsp;&nbsp;
[Azir](mailto:2075125282@qq.com),&nbsp;

## [v1.3.1](https://github.com/honghuangdc/soybean-admin/compare/v1.3.0...v1.3.1) (2024-07-22)

### &nbsp;&nbsp;&nbsp;🐞 Bug Fixes

- **projects**:
  - fix the issue of abnormal width of the sidebar in the top menu mix and reverse mode &nbsp;-&nbsp; by @Azir-11 in https://github.com/honghuangdc/soybean-admin/issues/562 [<samp>(c4695)</samp>](https://github.com/honghuangdc/soybean-admin/commit/c469512)
  - fix HorizontalMixMenu inverted. fixed #563 &nbsp;-&nbsp; by @honghuangdc in https://github.com/honghuangdc/soybean-admin/issues/563 [<samp>(4e55b)</samp>](https://github.com/honghuangdc/soybean-admin/commit/4e55b0e)
  - fix vertical-menu will not render when the layout is from mobile &nbsp;-&nbsp; by @honghuangdc [<samp>(84027)</samp>](https://github.com/honghuangdc/soybean-admin/commit/8402734)

### &nbsp;&nbsp;&nbsp;📖 Documentation

- **projects**: update CHANGELOG &nbsp;-&nbsp; by @honghuangdc [<samp>(613c8)</samp>](https://github.com/honghuangdc/soybean-admin/commit/613c836)

### &nbsp;&nbsp;&nbsp;🎨 Styles

- **other**: modify the Chinese name of the grayscale mode &nbsp;-&nbsp; by **Azir** [<samp>(53770)</samp>](https://github.com/honghuangdc/soybean-admin/commit/5377002)

### &nbsp;&nbsp;&nbsp;❤️ Contributors

[![honghuangdc](https://github.com/honghuangdc.png?size=48)](https://github.com/honghuangdc)&nbsp;&nbsp;[![Azir-11](https://github.com/Azir-11.png?size=48)](https://github.com/Azir-11)&nbsp;&nbsp;
[Azir](mailto:2075125282@qq.com),&nbsp;

## [v1.3.0](https://github.com/soybeanjs/soybean-admin/compare/v1.2.8...v1.3.0) (2024-07-22)

### &nbsp;&nbsp;&nbsp;🚨 Breaking Changes

- **projects**: refactor global menu & support `reversed-horizontal-mix-menu`. close #365 &nbsp;-&nbsp; by @honghuangdc in https://github.com/soybeanjs/soybean-admin/issues/365 [<samp>(087e5)</samp>](https://github.com/soybeanjs/soybean-admin/commit/087e532)

### &nbsp;&nbsp;&nbsp;🚀 Features

- **packages**:
  - `@sa/scripts`: command `gitCommit` support chinese &nbsp;-&nbsp; by @mmdapl in https://github.com/soybeanjs/soybean-admin/issues/548 [<samp>(06971)</samp>](https://github.com/soybeanjs/soybean-admin/commit/06971f3)
  - @sa/axios: replace CancelTokenSource by AbortController. close #530, close #532 &nbsp;-&nbsp; by @honghuangdc in https://github.com/soybeanjs/soybean-admin/issues/530 and https://github.com/soybeanjs/soybean-admin/issues/532 [<samp>(527fd)</samp>](https://github.com/soybeanjs/soybean-admin/commit/527fd79)
  - @sa/scripts: add ignore pattern list for command `gitCommitVerify`. close #504 &nbsp;-&nbsp; by @honghuangdc in https://github.com/soybeanjs/soybean-admin/issues/504 [<samp>(958d0)</samp>](https://github.com/soybeanjs/soybean-admin/commit/958d0ba)
- **projects**:
  - make branch `main` tiny & modify request retry times to 0 &nbsp;-&nbsp; by @Azir-11 [<samp>(793b1)</samp>](https://github.com/soybeanjs/soybean-admin/commit/793b16e)

### &nbsp;&nbsp;&nbsp;🐞 Bug Fixes

- **hooks**: prevent program freezing when pagesize returns 0 &nbsp;-&nbsp; by @Azir-11 in https://github.com/soybeanjs/soybean-admin/issues/545 [<samp>(f4eeb)</samp>](https://github.com/soybeanjs/soybean-admin/commit/f4eeb2e)

### &nbsp;&nbsp;&nbsp;💅 Refactors

- **projects**:
  - combine `theme tokens` and `theme settings`. close #379 &nbsp;-&nbsp; by @honghuangdc in https://github.com/soybeanjs/soybean-admin/issues/379 [<samp>(1d1b1)</samp>](https://github.com/soybeanjs/soybean-admin/commit/1d1b148)
  - change css vars mount to root &nbsp;-&nbsp; by @honghuangdc [<samp>(00f41)</samp>](https://github.com/soybeanjs/soybean-admin/commit/00f41dd)

### &nbsp;&nbsp;&nbsp;📖 Documentation

- **projects**: update CHANGELOG &nbsp;-&nbsp; by @honghuangdc [<samp>(a0b76)</samp>](https://github.com/soybeanjs/soybean-admin/commit/a0b76da)

### &nbsp;&nbsp;&nbsp;🏡 Chore

- **deps**: update deps &nbsp;-&nbsp; by @honghuangdc [<samp>(f6bd6)</samp>](https://github.com/soybeanjs/soybean-admin/commit/f6bd6b8)
- **projects**: add script `czh` &nbsp;-&nbsp; by @honghuangdc [<samp>(02069)</samp>](https://github.com/soybeanjs/soybean-admin/commit/0206969)

### &nbsp;&nbsp;&nbsp;❤️ Contributors

[![honghuangdc](https://github.com/honghuangdc.png?size=48)](https://github.com/honghuangdc)&nbsp;&nbsp;[![mmdapl](https://github.com/mmdapl.png?size=48)](https://github.com/mmdapl)&nbsp;&nbsp;[![Azir-11](https://github.com/Azir-11.png?size=48)](https://github.com/Azir-11)&nbsp;&nbsp;

## [v1.2.8](https://github.com/soybeanjs/soybean-admin/compare/v1.2.7...v1.2.8) (2024-07-20)

### &nbsp;&nbsp;&nbsp;🐞 Bug Fixes

- **packages**:
  - @sa/hooks: fix searchParams of useHookTable. fixed #552 &nbsp;-&nbsp; by @honghuangdc in https://github.com/soybeanjs/soybean-admin/issues/552 [<samp>(96c10)</samp>](https://github.com/soybeanjs/soybean-admin/commit/96c1044)
- **types**:
  - Fixed the reference type error &nbsp;-&nbsp; by **dodu2014** in https://github.com/soybeanjs/soybean-admin/issues/551 [<samp>(3e2a9)</samp>](https://github.com/soybeanjs/soybean-admin/commit/3e2a993)
  - fix data type of useHookTable &nbsp;-&nbsp; by @honghuangdc [<samp>(276ea)</samp>](https://github.com/soybeanjs/soybean-admin/commit/276ea7f)

### &nbsp;&nbsp;&nbsp;💅 Refactors

- **projects**: replace `cloneDeep` of `lodash-es` with `klona` &nbsp;-&nbsp; by @honghuangdc [<samp>(a9133)</samp>](https://github.com/soybeanjs/soybean-admin/commit/a91335d)

### &nbsp;&nbsp;&nbsp;📖 Documentation

- **projects**: update CHANGELOG &nbsp;-&nbsp; by @honghuangdc [<samp>(58fc0)</samp>](https://github.com/soybeanjs/soybean-admin/commit/58fc096)

### &nbsp;&nbsp;&nbsp;🏡 Chore

- **deps**: update deps &nbsp;-&nbsp; by @honghuangdc [<samp>(cf019)</samp>](https://github.com/soybeanjs/soybean-admin/commit/cf0192a)

### &nbsp;&nbsp;&nbsp;❤️ Contributors

[![honghuangdc](https://github.com/honghuangdc.png?size=48)](https://github.com/honghuangdc)&nbsp;&nbsp;
[dodu2014](mailto:dodu@live.cn)

## [v1.2.7](https://github.com/honghuangdc/soybean-admin/compare/v1.2.6...v1.2.7) (2024-07-12)

### &nbsp;&nbsp;&nbsp;🛠 Optimizations

- **projects**: supports custom menu icon sizes &nbsp;-&nbsp; by @wynn-w in https://github.com/honghuangdc/soybean-admin/issues/534 [<samp>(e035e)</samp>](https://github.com/honghuangdc/soybean-admin/commit/e035eab)

### &nbsp;&nbsp;&nbsp;🏡 Chore

- **deps**:
  - update deps &nbsp;-&nbsp; by @honghuangdc [<samp>(72ede)</samp>](https://github.com/honghuangdc/soybean-admin/commit/72ede8b)
  - update deps &nbsp;-&nbsp; by @honghuangdc [<samp>(be13c)</samp>](https://github.com/honghuangdc/soybean-admin/commit/be13ca2)
  - update deps &nbsp;-&nbsp; by @honghuangdc [<samp>(752ec)</samp>](https://github.com/honghuangdc/soybean-admin/commit/752ec1e)
- **projects**:
  - Fix deprecated configuration config &nbsp;-&nbsp; by @paynezhuang in https://github.com/honghuangdc/soybean-admin/issues/524 [<samp>(0d20e)</samp>](https://github.com/honghuangdc/soybean-admin/commit/0d20e4c)

### &nbsp;&nbsp;&nbsp;❤️ Contributors

[![honghuangdc](https://github.com/honghuangdc.png?size=48)](https://github.com/honghuangdc)&nbsp;&nbsp;[![wynn-w](https://github.com/wynn-w.png?size=48)](https://github.com/wynn-w)&nbsp;&nbsp;[![paynezhuang](https://github.com/paynezhuang.png?size=48)](https://github.com/paynezhuang)&nbsp;&nbsp;

## [v1.2.6](https://github.com/honghuangdc/soybean-admin/compare/v1.2.5...v1.2.6) (2024-06-21)

### &nbsp;&nbsp;&nbsp;🐞 Bug Fixes

- **projects**:
  - request modal title use i18n. fixed #507 &nbsp;-&nbsp; by @honghuangdc in https://github.com/honghuangdc/soybean-admin/issues/507 [<samp>(f7de3)</samp>](https://github.com/honghuangdc/soybean-admin/commit/f7de3fd)
  - add `getDataByPage` for `useTable`. fixed #499 &nbsp;-&nbsp; by @honghuangdc in https://github.com/honghuangdc/soybean-admin/issues/499 [<samp>(425c6)</samp>](https://github.com/honghuangdc/soybean-admin/commit/425c69a)
  - fix login redirect to routeHome when routeHome of dynamic route is not same as static route. fixed #511 &nbsp;-&nbsp; by @honghuangdc in https://github.com/honghuangdc/soybean-admin/issues/511 [<samp>(49f60)</samp>](https://github.com/honghuangdc/soybean-admin/commit/49f60b2)

### &nbsp;&nbsp;&nbsp;🛠 Optimizations

- **projects**: optimize `getRouteQueryOfLoginRoute` &nbsp;-&nbsp; by @honghuangdc [<samp>(693f7)</samp>](https://github.com/honghuangdc/soybean-admin/commit/693f704)

### &nbsp;&nbsp;&nbsp;📖 Documentation

- **projects**:
  - update CHANGELOG &nbsp;-&nbsp; by @honghuangdc [<samp>(5c67d)</samp>](https://github.com/honghuangdc/soybean-admin/commit/5c67d06)
  - update README &nbsp;-&nbsp; by @honghuangdc [<samp>(1e67a)</samp>](https://github.com/honghuangdc/soybean-admin/commit/1e67ae8)

### &nbsp;&nbsp;&nbsp;🏡 Chore

- **deps**:
  - update deps. close #510 &nbsp;-&nbsp; by @honghuangdc in https://github.com/honghuangdc/soybean-admin/issues/510 [<samp>(53143)</samp>](https://github.com/honghuangdc/soybean-admin/commit/531432d)
  - update deps &nbsp;-&nbsp; by @honghuangdc [<samp>(c7f6f)</samp>](https://github.com/honghuangdc/soybean-admin/commit/c7f6f2a)

### &nbsp;&nbsp;&nbsp;🤖 CI

- **projects**:
  - add github issues template &nbsp;-&nbsp; by @honghuangdc [<samp>(b5027)</samp>](https://github.com/honghuangdc/soybean-admin/commit/b5027c8)
  - update github issues template &nbsp;-&nbsp; by @honghuangdc [<samp>(ff1d5)</samp>](https://github.com/honghuangdc/soybean-admin/commit/ff1d504)

### &nbsp;&nbsp;&nbsp;❤️ Contributors

[![honghuangdc](https://github.com/honghuangdc.png?size=48)](https://github.com/honghuangdc)&nbsp;&nbsp;

## [v1.2.5](https://github.com/soybeanjs/soybean-admin/compare/v1.2.4...v1.2.5) (2024-06-15)

### &nbsp;&nbsp;&nbsp;🐞 Bug Fixes

- **projects**: Fix the issue of abnormal tab caching after logout. fixed #495 &nbsp;-&nbsp; by @Azir-11 in https://github.com/soybeanjs/soybean-admin/issues/495 [<samp>(3eeac)</samp>](https://github.com/soybeanjs/soybean-admin/commit/3eeace9)

### &nbsp;&nbsp;&nbsp;🔥 Performance

- **project**: Initializing the static routing function does not require asynchronization &nbsp;-&nbsp; by **CHENZL** in https://github.com/soybeanjs/soybean-admin/issues/493 [<samp>(2198b)</samp>](https://github.com/soybeanjs/soybean-admin/commit/2198b98)

### &nbsp;&nbsp;&nbsp;🛠 Optimizations

- **projects**: optimize code &nbsp;-&nbsp; by @soybeanjs [<samp>(b94ba)</samp>](https://github.com/soybeanjs/soybean-admin/commit/b94baa1)
- **types**: Enhance compatibility of global types &nbsp;-&nbsp; by @Azir-11 in https://github.com/soybeanjs/soybean-admin/issues/494 [<samp>(cd9d5)</samp>](https://github.com/soybeanjs/soybean-admin/commit/cd9d58d)
- **utils**: Reduce code indentation and improve readability &nbsp;-&nbsp; by @Azir-11 in https://github.com/soybeanjs/soybean-admin/issues/496 [<samp>(ad2f2)</samp>](https://github.com/soybeanjs/soybean-admin/commit/ad2f247)

### &nbsp;&nbsp;&nbsp;📖 Documentation

- **projects**: update CHANGELOG &nbsp;-&nbsp; by @soybeanjs [<samp>(b3368)</samp>](https://github.com/soybeanjs/soybean-admin/commit/b336841)

### &nbsp;&nbsp;&nbsp;🏡 Chore

- **deps**: update deps &nbsp;-&nbsp; by @soybeanjs [<samp>(b094d)</samp>](https://github.com/soybeanjs/soybean-admin/commit/b094d68)

### &nbsp;&nbsp;&nbsp;❤️ Contributors

[![soybeanjs](https://github.com/soybeanjs.png?size=48)](https://github.com/soybeanjs)&nbsp;&nbsp;[![Azir-11](https://github.com/Azir-11.png?size=48)](https://github.com/Azir-11)&nbsp;&nbsp;
[CHENZL](mailto:zlong5568863@qq.com)

## [v1.2.4](https://github.com/soybeanjs/soybean-admin/compare/v1.2.3...v1.2.4) (2024-06-14)

### &nbsp;&nbsp;&nbsp;🛠 Optimizations

- **projects**:
  - optimize `setupAppVersionNotification` &nbsp;-&nbsp; by @soybeanjs [<samp>(b5a72)</samp>](https://github.com/soybeanjs/soybean-admin/commit/b5a723c)
  - get buildTime with timezone 'Asia/Shanghai' &nbsp;-&nbsp; by @soybeanjs [<samp>(069fa)</samp>](https://github.com/soybeanjs/soybean-admin/commit/069fa8a)

### &nbsp;&nbsp;&nbsp;❤️ Contributors

[![soybeanjs](https://github.com/soybeanjs.png?size=48)](https://github.com/soybeanjs)&nbsp;&nbsp;

## [v1.2.3](https://github.com/soybeanjs/soybean-admin/compare/v1.2.2...v1.2.3) (2024-06-13)

### &nbsp;&nbsp;&nbsp;🐞 Bug Fixes

- **projects**:
  - fix mobile browser theme issue by adding color-scheme meta tag to index.html &nbsp;-&nbsp; by @KickCashew in https://github.com/soybeanjs/soybean-admin/issues/488 [<samp>(c2125)</samp>](https://github.com/soybeanjs/soybean-admin/commit/c212565)
  - Fix secondary directory components is empty &nbsp;-&nbsp; by @paynezhuang in https://github.com/soybeanjs/soybean-admin/issues/491 [<samp>(aabb2)</samp>](https://github.com/soybeanjs/soybean-admin/commit/aabb2a4)

### &nbsp;&nbsp;&nbsp;📖 Documentation

- **projects**:
  - Fixed the hyperlink pointing error &nbsp;-&nbsp; by **Azir** [<samp>(20a81)</samp>](https://github.com/soybeanjs/soybean-admin/commit/20a8127)
  - update README &nbsp;-&nbsp; by @soybeanjs [<samp>(70261)</samp>](https://github.com/soybeanjs/soybean-admin/commit/7026126)

### &nbsp;&nbsp;&nbsp;🏡 Chore

- **deps**:
  - update deps &nbsp;-&nbsp; by @soybeanjs [<samp>(813d8)</samp>](https://github.com/soybeanjs/soybean-admin/commit/813d8ce)
  - update deps &nbsp;-&nbsp; by @soybeanjs [<samp>(bf718)</samp>](https://github.com/soybeanjs/soybean-admin/commit/bf71837)

### &nbsp;&nbsp;&nbsp;❤️ Contributors

[![soybeanjs](https://github.com/soybeanjs.png?size=48)](https://github.com/soybeanjs)&nbsp;&nbsp;[![paynezhuang](https://github.com/paynezhuang.png?size=48)](https://github.com/paynezhuang)&nbsp;&nbsp;[![KickCashew](https://github.com/KickCashew.png?size=48)](https://github.com/KickCashew)&nbsp;&nbsp;
[Azir](mailto:2075125282@qq.com)

## [v1.2.2](https://github.com/honghuangdc/soybean-admin/compare/v1.2.1...v1.2.2) (2024-06-12)

### &nbsp;&nbsp;&nbsp;🚀 Features

- **projects**: reset scroll position when tab change &nbsp;-&nbsp; by @soybeanjs [<samp>(9094b)</samp>](https://github.com/honghuangdc/soybean-admin/commit/9094b21)

### &nbsp;&nbsp;&nbsp;🐞 Bug Fixes

- **projects**:
  - hide AppVersionNotification in DEV mode &nbsp;-&nbsp; by @sigma-plus in https://github.com/honghuangdc/soybean-admin/issues/482 [<samp>(62592)</samp>](https://github.com/honghuangdc/soybean-admin/commit/6259287)
  - fix menu-toggler hidden in mobile layout. fixed #483 &nbsp;-&nbsp; by @soybeanjs in https://github.com/honghuangdc/soybean-admin/issues/483 [<samp>(4470c)</samp>](https://github.com/honghuangdc/soybean-admin/commit/4470cb4)

### &nbsp;&nbsp;&nbsp;📖 Documentation

- **projects**: update README &nbsp;-&nbsp; by @soybeanjs [<samp>(8f9a7)</samp>](https://github.com/honghuangdc/soybean-admin/commit/8f9a705)

### &nbsp;&nbsp;&nbsp;❤️ Contributors

[![soybeanjs](https://github.com/soybeanjs.png?size=48)](https://github.com/soybeanjs)&nbsp;&nbsp;[![sigma-plus](https://github.com/sigma-plus.png?size=48)](https://github.com/sigma-plus)&nbsp;&nbsp;

## [v1.2.1](https://github.com/honghuangdc/soybean-admin/compare/v1.2.0...v1.2.1) (2024-06-07)

### &nbsp;&nbsp;&nbsp;🐞 Bug Fixes

- **projects**:
  - fix get user info when page reload &nbsp;-&nbsp; by @soybeanjs [<samp>(ff51b)</samp>](https://github.com/honghuangdc/soybean-admin/commit/ff51b72)
  - fix setupAppVersionNotification render &nbsp;-&nbsp; by @soybeanjs [<samp>(6a6eb)</samp>](https://github.com/honghuangdc/soybean-admin/commit/6a6eb9a)

### &nbsp;&nbsp;&nbsp;📖 Documentation

- **projects**: update CHANGELOG &nbsp;-&nbsp; by @soybeanjs [<samp>(fe06b)</samp>](https://github.com/honghuangdc/soybean-admin/commit/fe06b8c)

### &nbsp;&nbsp;&nbsp;🏡 Chore

- **deps**: update deps &nbsp;-&nbsp; by @soybeanjs [<samp>(08827)</samp>](https://github.com/honghuangdc/soybean-admin/commit/08827a4)

### &nbsp;&nbsp;&nbsp;❤️ Contributors

[![soybeanjs](https://github.com/soybeanjs.png?size=48)](https://github.com/soybeanjs)&nbsp;&nbsp;

## [v1.2.0](https://github.com/soybeanjs/soybean-admin/compare/v1.1.5...v1.2.0) (2024-06-06)

### &nbsp;&nbsp;&nbsp;🚀 Features

- **projects**:
  - support system new version update notification. close #420 &nbsp;-&nbsp; by @soybeanjs in https://github.com/soybeanjs/soybean-admin/issues/420 [<samp>(584cd)</samp>](https://github.com/soybeanjs/soybean-admin/commit/584cd54)
  - get user info in router guard and remove in localStorage. close #459 &nbsp;-&nbsp; by @soybeanjs in https://github.com/soybeanjs/soybean-admin/issues/459 [<samp>(5531a)</samp>](https://github.com/soybeanjs/soybean-admin/commit/5531a68)

### &nbsp;&nbsp;&nbsp;📖 Documentation

- **projects**: update CHANGELOG &nbsp;-&nbsp; by @soybeanjs [<samp>(2bec8)</samp>](https://github.com/soybeanjs/soybean-admin/commit/2bec899)

### &nbsp;&nbsp;&nbsp;❤️ Contributors

[![soybeanjs](https://github.com/soybeanjs.png?size=48)](https://github.com/soybeanjs)&nbsp;&nbsp;

## [v1.1.5](https://github.com/soybeanjs/soybean-admin/compare/v1.1.4...v1.1.5) (2024-06-06)

### &nbsp;&nbsp;&nbsp;🐞 Bug Fixes

- **projects**: fix register name, CodeLogin => Register &nbsp;-&nbsp; by @m-xlsea in https://github.com/soybeanjs/soybean-admin/issues/478 [<samp>(ddf38)</samp>](https://github.com/soybeanjs/soybean-admin/commit/ddf3823)

### &nbsp;&nbsp;&nbsp;🏡 Chore

- **deps**: update deps &nbsp;-&nbsp; by @soybeanjs [<samp>(060c0)</samp>](https://github.com/soybeanjs/soybean-admin/commit/060c0a9)
- **projects**: update vscode settings: vue official &nbsp;-&nbsp; by @soybeanjs [<samp>(76649)</samp>](https://github.com/soybeanjs/soybean-admin/commit/76649e2)

### &nbsp;&nbsp;&nbsp;❤️ Contributors

[![soybeanjs](https://github.com/soybeanjs.png?size=48)](https://github.com/soybeanjs)&nbsp;&nbsp;[![m-xlsea](https://github.com/m-xlsea.png?size=48)](https://github.com/m-xlsea)&nbsp;&nbsp;

## [v1.1.4](https://github.com/honghuangdc/soybean-admin/compare/v1.1.3...v1.1.4) (2024-06-06)

### &nbsp;&nbsp;&nbsp;🐞 Bug Fixes

- **utils**: modalLogout bug when esc is pressed &nbsp;-&nbsp; by @sigma-plus in https://github.com/honghuangdc/soybean-admin/issues/470 [<samp>(bd69c)</samp>](https://github.com/honghuangdc/soybean-admin/commit/bd69c00)

### &nbsp;&nbsp;&nbsp;🛠 Optimizations

- **projects**: optimize RouteMeta remarks &nbsp;-&nbsp; by @soybeanjs [<samp>(ffb48)</samp>](https://github.com/honghuangdc/soybean-admin/commit/ffb48b1)

### &nbsp;&nbsp;&nbsp;📖 Documentation

- **projects**:
  - update CHANGELOG &nbsp;-&nbsp; by @soybeanjs [<samp>(756f8)</samp>](https://github.com/honghuangdc/soybean-admin/commit/756f84a)
  - update Node&pnpm version &nbsp;-&nbsp; by @Azir-11 in https://github.com/honghuangdc/soybean-admin/issues/472 [<samp>(9b05d)</samp>](https://github.com/honghuangdc/soybean-admin/commit/9b05d73)

### &nbsp;&nbsp;&nbsp;🏡 Chore

- **deps**:
  - update deps &nbsp;-&nbsp; by @soybeanjs [<samp>(d0380)</samp>](https://github.com/honghuangdc/soybean-admin/commit/d0380ce)
  - update deps &nbsp;-&nbsp; by @soybeanjs [<samp>(1f464)</samp>](https://github.com/honghuangdc/soybean-admin/commit/1f4647b)
- **projects**:
  - close http proxy &nbsp;-&nbsp; by @soybeanjs [<samp>(d08a3)</samp>](https://github.com/honghuangdc/soybean-admin/commit/d08a381)
  - update mock url &nbsp;-&nbsp; by @soybeanjs [<samp>(e6086)</samp>](https://github.com/honghuangdc/soybean-admin/commit/e6086f0)
  - update vscode settings &nbsp;-&nbsp; by @soybeanjs [<samp>(910df)</samp>](https://github.com/honghuangdc/soybean-admin/commit/910dfca)

### &nbsp;&nbsp;&nbsp;❤️ Contributors

[![soybeanjs](https://github.com/soybeanjs.png?size=48)](https://github.com/soybeanjs)&nbsp;&nbsp;[![Azir-11](https://github.com/Azir-11.png?size=48)](https://github.com/Azir-11)&nbsp;&nbsp;[![sigma-plus](https://github.com/sigma-plus.png?size=48)](https://github.com/sigma-plus)&nbsp;&nbsp;

## [v1.1.3](https://github.com/soybeanjs/soybean-admin/compare/v1.1.2...v1.1.3) (2024-06-02)

### &nbsp;&nbsp;&nbsp;🐞 Bug Fixes

- **components**:
  - Fix the issue of search box popping up repeatedly due to carriage return &nbsp;-&nbsp; by @Azir-11 in https://github.com/soybeanjs/soybean-admin/issues/468 [<samp>(5bd96)</samp>](https://github.com/soybeanjs/soybean-admin/commit/5bd96b8)
- **projects**:
  - fix click menu search. fixed #466, close #467 &nbsp;-&nbsp; by @soybeanjs in https://github.com/soybeanjs/soybean-admin/issues/466 and https://github.com/soybeanjs/soybean-admin/issues/467 [<samp>(8efdb)</samp>](https://github.com/soybeanjs/soybean-admin/commit/8efdb10)
  - fix reCacheRoute. fixed #464 &nbsp;-&nbsp; by @soybeanjs in https://github.com/soybeanjs/soybean-admin/issues/464 [<samp>(59faf)</samp>](https://github.com/soybeanjs/soybean-admin/commit/59faf15)
- **styles**:
  - fix FirstLevelMenu style. fixed #450 &nbsp;-&nbsp; by @soybeanjs in https://github.com/soybeanjs/soybean-admin/issues/450 [<samp>(db64b)</samp>](https://github.com/soybeanjs/soybean-admin/commit/db64b0e)
  - fix PinToggler style. fixed #451 &nbsp;-&nbsp; by @soybeanjs in https://github.com/soybeanjs/soybean-admin/issues/451 [<samp>(42b12)</samp>](https://github.com/soybeanjs/soybean-admin/commit/42b121a)

### &nbsp;&nbsp;&nbsp;🛠 Optimizations

- **components**: accuracy draggable area for TableColumnSetting with animation &nbsp;-&nbsp; by @orangelckc in https://github.com/soybeanjs/soybean-admin/issues/465 [<samp>(2aa85)</samp>](https://github.com/soybeanjs/soybean-admin/commit/2aa85c6)
- **projects**: unocss border shortcut &nbsp;-&nbsp; by @soybeanjs [<samp>(40d0f)</samp>](https://github.com/soybeanjs/soybean-admin/commit/40d0f8a)

### &nbsp;&nbsp;&nbsp;📖 Documentation

- **projects**: update CHANGELOG &nbsp;-&nbsp; by @soybeanjs [<samp>(87b18)</samp>](https://github.com/soybeanjs/soybean-admin/commit/87b1838)

### &nbsp;&nbsp;&nbsp;🏡 Chore

- **other**:
  - correct spell mistake &nbsp;-&nbsp; by @orangelckc in https://github.com/soybeanjs/soybean-admin/issues/460 [<samp>(086ba)</samp>](https://github.com/soybeanjs/soybean-admin/commit/086bad4)
  - correct spell mistake &nbsp;-&nbsp; by @Azir-11 in https://github.com/soybeanjs/soybean-admin/issues/462 [<samp>(f1850)</samp>](https://github.com/soybeanjs/soybean-admin/commit/f185041)
- **projects**:
  - update vscode launch.json &nbsp;-&nbsp; by @soybeanjs [<samp>(4c1c7)</samp>](https://github.com/soybeanjs/soybean-admin/commit/4c1c7e6)

### &nbsp;&nbsp;&nbsp;❤️ Contributors

[![soybeanjs](https://github.com/soybeanjs.png?size=48)](https://github.com/soybeanjs)&nbsp;&nbsp;[![Azir-11](https://github.com/Azir-11.png?size=48)](https://github.com/Azir-11)&nbsp;&nbsp;[![orangelckc](https://github.com/orangelckc.png?size=48)](https://github.com/orangelckc)&nbsp;&nbsp;

## [v1.1.2](https://github.com/soybeanjs/soybean-admin/compare/v1.1.1...v1.1.2) (2024-05-24)

### &nbsp;&nbsp;&nbsp;🐞 Bug Fixes

- **projects**:
  - fix header style & fix button highlight when click global-tab. fixed #446 &nbsp;-&nbsp; by @honghuangdc in https://github.com/soybeanjs/soybean-admin/issues/446 [<samp>(64fc0)</samp>](https://github.com/soybeanjs/soybean-admin/commit/64fc099)
  - fix multi tab page only render once. fixed #441 &nbsp;-&nbsp; by @honghuangdc in https://github.com/soybeanjs/soybean-admin/issues/441 [<samp>(e379d)</samp>](https://github.com/soybeanjs/soybean-admin/commit/e379d6c)

### &nbsp;&nbsp;&nbsp;🛠 Optimizations

- **projects**: optimize code &nbsp;-&nbsp; by @honghuangdc [<samp>(bc8dc)</samp>](https://github.com/soybeanjs/soybean-admin/commit/bc8dc47)

### &nbsp;&nbsp;&nbsp;❤️ Contributors

[![honghuangdc](https://github.com/honghuangdc.png?size=48)](https://github.com/honghuangdc)&nbsp;&nbsp;

## [v1.1.1](https://github.com/soybeanjs/soybean-admin/compare/v1.1.0...v1.1.1) (2024-05-20)

### &nbsp;&nbsp;&nbsp;🚀 Features

- **hooks**: add setOptions for useEcharts &nbsp;-&nbsp; by @honghuangdc [<samp>(e4d53)</samp>](https://github.com/soybeanjs/soybean-admin/commit/e4d53aa)

### &nbsp;&nbsp;&nbsp;🐞 Bug Fixes

- **projects**:
  - fix useRouter. fixed #436 &nbsp;-&nbsp; by @honghuangdc in https://github.com/soybeanjs/soybean-admin/issues/436 [<samp>(0774a)</samp>](https://github.com/soybeanjs/soybean-admin/commit/0774a51)
  - add error handle when get routes in dynamic route mode. fixed 440 &nbsp;-&nbsp; by @honghuangdc [<samp>(57b4a)</samp>](https://github.com/soybeanjs/soybean-admin/commit/57b4a9d)
- **styles**:
  - fix useTable type &nbsp;-&nbsp; by @honghuangdc [<samp>(07124)</samp>](https://github.com/soybeanjs/soybean-admin/commit/071241f)

### &nbsp;&nbsp;&nbsp;📖 Documentation

- **projects**:
  - update CHANGELOG &nbsp;-&nbsp; by @honghuangdc [<samp>(19783)</samp>](https://github.com/soybeanjs/soybean-admin/commit/1978397)
  - update README.md &nbsp;-&nbsp; by @honghuangdc [<samp>(fa56e)</samp>](https://github.com/soybeanjs/soybean-admin/commit/fa56e9c)
  - update README.md &nbsp;-&nbsp; by @honghuangdc [<samp>(419ea)</samp>](https://github.com/soybeanjs/soybean-admin/commit/419ea42)

### &nbsp;&nbsp;&nbsp;🏡 Chore

- **projects**:
  - update deps & fix TS error &nbsp;-&nbsp; by @honghuangdc [<samp>(4ea9c)</samp>](https://github.com/soybeanjs/soybean-admin/commit/4ea9c85)
  - update eslint-config & fix code &nbsp;-&nbsp; by @honghuangdc [<samp>(68ea9)</samp>](https://github.com/soybeanjs/soybean-admin/commit/68ea974)
  - update @elegant-router/vue & add error handle for resolve route. fixed #442 &nbsp;-&nbsp; by @honghuangdc in https://github.com/soybeanjs/soybean-admin/issues/442 [<samp>(24ff8)</samp>](https://github.com/soybeanjs/soybean-admin/commit/24ff852)

### &nbsp;&nbsp;&nbsp;❤️ Contributors

[![honghuangdc](https://github.com/honghuangdc.png?size=48)](https://github.com/honghuangdc)&nbsp;&nbsp;

## [v1.1.0](https://github.com/honghuangdc/soybean-admin/compare/v1.0.9...v1.1.0) (2024-05-07)

### &nbsp;&nbsp;&nbsp;🚀 Features

- **projects**:
  - support grayscale. fixed #385 &nbsp;-&nbsp; by @honghuangdc in https://github.com/honghuangdc/soybean-admin/issues/385 [<samp>(d335d)</samp>](https://github.com/honghuangdc/soybean-admin/commit/d335df6)
  - Add prefix to local storage &nbsp;-&nbsp; by **Azir** [<samp>(1fc34)</samp>](https://github.com/honghuangdc/soybean-admin/commit/1fc34cc)
  - add table showTotal options &nbsp;-&nbsp; by **paynezhuang** [<samp>(3e61e)</samp>](https://github.com/honghuangdc/soybean-admin/commit/3e61eab)
  - add recommend color switch. closed #388 &nbsp;-&nbsp; by @honghuangdc in https://github.com/honghuangdc/soybean-admin/issues/388 [<samp>(a1920)</samp>](https://github.com/honghuangdc/soybean-admin/commit/a1920fc)
  - add menu route field &nbsp;-&nbsp; by **paynezhuang** [<samp>(dbe31)</samp>](https://github.com/honghuangdc/soybean-admin/commit/dbe31eb)
  - support repeated request errors occur once in a short time. close #368, close #369 &nbsp;-&nbsp; by @honghuangdc in https://github.com/honghuangdc/soybean-admin/issues/368 and https://github.com/honghuangdc/soybean-admin/issues/369 [<samp>(e3bd3)</samp>](https://github.com/honghuangdc/soybean-admin/commit/e3bd397)
  - close tab by mouse wheel button click &nbsp;-&nbsp; by **JianJroh** [<samp>(d3849)</samp>](https://github.com/honghuangdc/soybean-admin/commit/d3849ba)
  - page: support manage_menu more options. close #366 &nbsp;-&nbsp; by @honghuangdc in https://github.com/honghuangdc/soybean-admin/issues/366 [<samp>(c4b5c)</samp>](https://github.com/honghuangdc/soybean-admin/commit/c4b5c65)
  - useTable adds expand to display &nbsp;-&nbsp; by **paynezhuang** [<samp>(0a90d)</samp>](https://github.com/honghuangdc/soybean-admin/commit/0a90dd3)

### &nbsp;&nbsp;&nbsp;🐞 Bug Fixes

- **projects**:
  - menu fixedIndexInTab default null &nbsp;-&nbsp; by **paynezhuang** [<samp>(3d10e)</samp>](https://github.com/honghuangdc/soybean-admin/commit/3d10ef1)
  - fix menu-toggler zIndex &nbsp;-&nbsp; by @honghuangdc [<samp>(7bd43)</samp>](https://github.com/honghuangdc/soybean-admin/commit/7bd43df)
  - fix manage_menu modal style &nbsp;-&nbsp; by @honghuangdc [<samp>(60f3b)</samp>](https://github.com/honghuangdc/soybean-admin/commit/60f3b14)
  - fix menu data when role is changed. fixed #391 &nbsp;-&nbsp; by @honghuangdc in https://github.com/honghuangdc/soybean-admin/issues/391 [<samp>(3b47b)</samp>](https://github.com/honghuangdc/soybean-admin/commit/3b47b5a)

### &nbsp;&nbsp;&nbsp;🛠 Optimizations

- **projects**: remove deprecated code &nbsp;-&nbsp; by @honghuangdc [<samp>(72ccb)</samp>](https://github.com/honghuangdc/soybean-admin/commit/72ccb6b)

### &nbsp;&nbsp;&nbsp;💅 Refactors

- **projects**:
  - refactor @sa/color-palette => @sa/color & perf @sa/utils &nbsp;-&nbsp; by @honghuangdc [<samp>(34999)</samp>](https://github.com/honghuangdc/soybean-admin/commit/3499997)
  - menu-operate-drawer => menu-operate-modal &nbsp;-&nbsp; by @honghuangdc [<samp>(003e1)</samp>](https://github.com/honghuangdc/soybean-admin/commit/003e145)

### &nbsp;&nbsp;&nbsp;📖 Documentation

- **projects**:
  - add CHANGELOG.zh_CN.md &nbsp;-&nbsp; by @honghuangdc [<samp>(18b3f)</samp>](https://github.com/honghuangdc/soybean-admin/commit/18b3f05)
  - update CHANGELOG &nbsp;-&nbsp; by @honghuangdc [<samp>(4d17c)</samp>](https://github.com/honghuangdc/soybean-admin/commit/4d17cfd)

### &nbsp;&nbsp;&nbsp;🏡 Chore

- **deps**:
  - update deps &nbsp;-&nbsp; by @honghuangdc [<samp>(1cb38)</samp>](https://github.com/honghuangdc/soybean-admin/commit/1cb3816)
  - update deps &nbsp;-&nbsp; by @honghuangdc [<samp>(599b4)</samp>](https://github.com/honghuangdc/soybean-admin/commit/599b4e1)
- **projects**:
  - merge main to v1.1.0 &nbsp;-&nbsp; by @honghuangdc [<samp>(ebe55)</samp>](https://github.com/honghuangdc/soybean-admin/commit/ebe55af)

### &nbsp;&nbsp;&nbsp;❤️ Contributors

[![honghuangdc](https://github.com/honghuangdc.png?size=48)](https://github.com/honghuangdc)&nbsp;&nbsp;
[paynezhuang](mailto:paynezhuang@gmail.com),&nbsp;[JianJroh](mailto:rhjian@foxmail.com),&nbsp;[Azir](mailto:2075125282@qq.com)

## [v1.1.0-beta.2](https://github.com/honghuangdc/soybean-admin/compare/v1.1.0-beta.1...v1.1.0-beta.2) (2024-05-07)

### &nbsp;&nbsp;&nbsp;🚀 Features

- **projects**: useTable adds expand to display &nbsp;-&nbsp; by **paynezhuang** [<samp>(0a90d)</samp>](https://github.com/honghuangdc/soybean-admin/commit/0a90dd3)

### &nbsp;&nbsp;&nbsp;🐞 Bug Fixes

- **projects**:
  - fix manage_menu modal style &nbsp;-&nbsp; by @honghuangdc [<samp>(60f3b)</samp>](https://github.com/honghuangdc/soybean-admin/commit/60f3b14)
  - fix menu data when role is changed. fixed #391 &nbsp;-&nbsp; by @honghuangdc in https://github.com/honghuangdc/soybean-admin/issues/391 [<samp>(3b47b)</samp>](https://github.com/honghuangdc/soybean-admin/commit/3b47b5a)

### &nbsp;&nbsp;&nbsp;🛠 Optimizations

- **projects**: remove deprecated code &nbsp;-&nbsp; by @honghuangdc [<samp>(72ccb)</samp>](https://github.com/honghuangdc/soybean-admin/commit/72ccb6b)

### &nbsp;&nbsp;&nbsp;📖 Documentation

- **projects**: add CHANGELOG.zh_CN.md &nbsp;-&nbsp; by @honghuangdc [<samp>(18b3f)</samp>](https://github.com/honghuangdc/soybean-admin/commit/18b3f05)

### &nbsp;&nbsp;&nbsp;❤️ Contributors

[![honghuangdc](https://github.com/honghuangdc.png?size=48)](https://github.com/honghuangdc)&nbsp;&nbsp;
[paynezhuang](mailto:paynezhuang@gmail.com)

## [v1.1.0-beta.1](https://github.com/soybeanjs/soybean-admin/compare/v1.0.9...v1.1.0-beta.1) (2024-05-07)

### &nbsp;&nbsp;&nbsp;🚀 Features

- **projects**:
  - support grayscale. fixed #385 &nbsp;-&nbsp; by @honghuangdc in https://github.com/soybeanjs/soybean-admin/issues/385 [<samp>(d335d)</samp>](https://github.com/soybeanjs/soybean-admin/commit/d335df6)
  - Add prefix to local storage &nbsp;-&nbsp; by **Azir** [<samp>(1fc34)</samp>](https://github.com/soybeanjs/soybean-admin/commit/1fc34cc)
  - add table showTotal options &nbsp;-&nbsp; by **paynezhuang** [<samp>(3e61e)</samp>](https://github.com/soybeanjs/soybean-admin/commit/3e61eab)
  - add recommend color switch. closed #388 &nbsp;-&nbsp; by @honghuangdc in https://github.com/soybeanjs/soybean-admin/issues/388 [<samp>(a1920)</samp>](https://github.com/soybeanjs/soybean-admin/commit/a1920fc)
  - add menu route field &nbsp;-&nbsp; by **paynezhuang** [<samp>(dbe31)</samp>](https://github.com/soybeanjs/soybean-admin/commit/dbe31eb)
  - support repeated request errors occur once in a short time. close #368, close #369 &nbsp;-&nbsp; by @honghuangdc in https://github.com/soybeanjs/soybean-admin/issues/368 and https://github.com/soybeanjs/soybean-admin/issues/369 [<samp>(e3bd3)</samp>](https://github.com/soybeanjs/soybean-admin/commit/e3bd397)
  - close tab by mouse wheel button click &nbsp;-&nbsp; by **JianJroh** [<samp>(d3849)</samp>](https://github.com/soybeanjs/soybean-admin/commit/d3849ba)
  - page: support manage_menu more options. close #366 &nbsp;-&nbsp; by @honghuangdc in https://github.com/soybeanjs/soybean-admin/issues/366 [<samp>(c4b5c)</samp>](https://github.com/soybeanjs/soybean-admin/commit/c4b5c65)

### &nbsp;&nbsp;&nbsp;🐞 Bug Fixes

- **projects**:
  - menu fixedIndexInTab default null &nbsp;-&nbsp; by **paynezhuang** [<samp>(3d10e)</samp>](https://github.com/soybeanjs/soybean-admin/commit/3d10ef1)
  - fix menu-toggler zIndex &nbsp;-&nbsp; by @honghuangdc [<samp>(7bd43)</samp>](https://github.com/soybeanjs/soybean-admin/commit/7bd43df)

### &nbsp;&nbsp;&nbsp;💅 Refactors

- **projects**:
  - refactor @sa/color-palette => @sa/color & perf @sa/utils &nbsp;-&nbsp; by @honghuangdc [<samp>(34999)</samp>](https://github.com/soybeanjs/soybean-admin/commit/3499997)
  - menu-operate-drawer => menu-operate-modal &nbsp;-&nbsp; by @honghuangdc [<samp>(003e1)</samp>](https://github.com/soybeanjs/soybean-admin/commit/003e145)

### &nbsp;&nbsp;&nbsp;🏡 Chore

- **deps**:
  - update deps &nbsp;-&nbsp; by @honghuangdc [<samp>(1cb38)</samp>](https://github.com/soybeanjs/soybean-admin/commit/1cb3816)
  - update deps &nbsp;-&nbsp; by @honghuangdc [<samp>(599b4)</samp>](https://github.com/soybeanjs/soybean-admin/commit/599b4e1)
- **projects**:
  - merge main to v1.1.0 &nbsp;-&nbsp; by @honghuangdc [<samp>(ebe55)</samp>](https://github.com/soybeanjs/soybean-admin/commit/ebe55af)

### &nbsp;&nbsp;&nbsp;❤️ Contributors

[![honghuangdc](https://github.com/honghuangdc.png?size=48)](https://github.com/honghuangdc)&nbsp;&nbsp;
[JianJroh](mailto:rhjian@foxmail.com),&nbsp;[paynezhuang](mailto:paynezhuang@gmail.com),&nbsp;[Azir](mailto:2075125282@qq.com)

## [v1.0.9](https://github.com/soybeanjs/soybean-admin/compare/v1.0.8...v1.0.9) (2024-05-05)

### &nbsp;&nbsp;&nbsp;🚀 Features

- **packages**: @sa/scripts: add new commit type `optimize` and commit scope `packages` &nbsp;-&nbsp; by @honghuangdc [<samp>(fbc2e)</samp>](https://github.com/soybeanjs/soybean-admin/commit/fbc2e61)

### &nbsp;&nbsp;&nbsp;🐞 Bug Fixes

- **projects**: fix manage page drawer operate about data reset. fixed #415, fixed #417 &nbsp;-&nbsp; by @honghuangdc in https://github.com/soybeanjs/soybean-admin/issues/415 and https://github.com/soybeanjs/soybean-admin/issues/417 [<samp>(f4513)</samp>](https://github.com/soybeanjs/soybean-admin/commit/f4513e1)

### &nbsp;&nbsp;&nbsp;📖 Documentation

- **projects**:
  - add ecosystem to README.md &nbsp;-&nbsp; by @honghuangdc [<samp>(d0f17)</samp>](https://github.com/soybeanjs/soybean-admin/commit/d0f17a4)
  - add PanisAdmin to README &nbsp;-&nbsp; by **paynezhuang** [<samp>(ce2a7)</samp>](https://github.com/soybeanjs/soybean-admin/commit/ce2a75b)

### &nbsp;&nbsp;&nbsp;🏡 Chore

- **deps**:
  - update deps &nbsp;-&nbsp; by @honghuangdc [<samp>(413a8)</samp>](https://github.com/soybeanjs/soybean-admin/commit/413a8b2)
  - update deps &nbsp;-&nbsp; by @honghuangdc [<samp>(734ef)</samp>](https://github.com/soybeanjs/soybean-admin/commit/734ef98)
- **projects**:
  - update .npmrc &nbsp;-&nbsp; by @honghuangdc [<samp>(52188)</samp>](https://github.com/soybeanjs/soybean-admin/commit/52188d8)
  - update vscode settings &nbsp;-&nbsp; by @honghuangdc [<samp>(c137b)</samp>](https://github.com/soybeanjs/soybean-admin/commit/c137b97)

### &nbsp;&nbsp;&nbsp;❤️ Contributors

[![honghuangdc](https://github.com/honghuangdc.png?size=48)](https://github.com/honghuangdc)&nbsp;&nbsp;
[paynezhuang](mailto:paynezhuang@gmail.com)

## [v1.0.8](https://github.com/soybeanjs/soybean-admin/compare/v1.0.7...v1.0.8) (2024-04-27)

### &nbsp;&nbsp;&nbsp;🐞 Bug Fixes

- **components**:
  - fix PinToggler label. fixed #407 &nbsp;-&nbsp; by @honghuangdc in https://github.com/soybeanjs/soybean-admin/issues/407 [<samp>(c0ed1)</samp>](https://github.com/soybeanjs/soybean-admin/commit/c0ed1f2)
- **projects**:
  - text level low. #409 &nbsp;-&nbsp; by **alleycharming** in https://github.com/soybeanjs/soybean-admin/issues/409 [<samp>(3ddb1)</samp>](https://github.com/soybeanjs/soybean-admin/commit/3ddb17a)
  - fix tab fixedIndex as null case &nbsp;-&nbsp; by **paynezhuang** [<samp>(4708e)</samp>](https://github.com/soybeanjs/soybean-admin/commit/4708ede)
  - recovery the layout config before is mobile. fixed #408, fixed #361 &nbsp;-&nbsp; by @honghuangdc in https://github.com/soybeanjs/soybean-admin/issues/408 and https://github.com/soybeanjs/soybean-admin/issues/361 [<samp>(dae2a)</samp>](https://github.com/soybeanjs/soybean-admin/commit/dae2aa5)

### &nbsp;&nbsp;&nbsp;🔥 Performance

- **projects**: perf judgement the fixed tab &nbsp;-&nbsp; by @honghuangdc [<samp>(b3e9b)</samp>](https://github.com/soybeanjs/soybean-admin/commit/b3e9bba)

### &nbsp;&nbsp;&nbsp;💅 Refactors

- **projects**: `Soybean Admin` to `SoybeanAdmin` &nbsp;-&nbsp; by @honghuangdc [<samp>(a8dbc)</samp>](https://github.com/soybeanjs/soybean-admin/commit/a8dbc03)

### &nbsp;&nbsp;&nbsp;❤️ Contributors

[![honghuangdc](https://github.com/honghuangdc.png?size=48)](https://github.com/honghuangdc)&nbsp;&nbsp;
[paynezhuang](mailto:paynezhuang@gmail.com),&nbsp;[alleycharming](mailto:alleycharming@gmail.com)

## [v1.0.7](https://github.com/soybeanjs/soybean-admin/compare/v1.0.6...v1.0.7) (2024-04-25)

### &nbsp;&nbsp;&nbsp;🚀 Features

- **projects**: support iframe page with diffrent url of custom route &nbsp;-&nbsp; by @honghuangdc [<samp>(da12d)</samp>](https://github.com/soybeanjs/soybean-admin/commit/da12d4a)

### &nbsp;&nbsp;&nbsp;🏡 Chore

- **deps**: update deps &nbsp;-&nbsp; by @honghuangdc [<samp>(fbd80)</samp>](https://github.com/soybeanjs/soybean-admin/commit/fbd80c2)

### &nbsp;&nbsp;&nbsp;❤️ Contributors

[![honghuangdc](https://github.com/honghuangdc.png?size=48)](https://github.com/honghuangdc)&nbsp;&nbsp;

## [v1.0.6](https://github.com/soybeanjs/soybean-admin/compare/v1.0.5...v1.0.6) (2024-04-25)

### &nbsp;&nbsp;&nbsp;🚀 Features

- **hooks**: add state hooks: useRef, useState, useSignal &nbsp;-&nbsp; by @honghuangdc [<samp>(09f64)</samp>](https://github.com/soybeanjs/soybean-admin/commit/09f6464)

### &nbsp;&nbsp;&nbsp;🐞 Bug Fixes

- **projects**:
  - added responseType judgment. #396 &nbsp;-&nbsp; by **alleycharming** in https://github.com/soybeanjs/soybean-admin/issues/396 [<samp>(82eab)</samp>](https://github.com/soybeanjs/soybean-admin/commit/82eabab)
  - supply $t import statement &nbsp;-&nbsp; by @honghuangdc [<samp>(b2660)</samp>](https://github.com/soybeanjs/soybean-admin/commit/b266035)
  - fix mix-menu blank. fixed #389 & cache mixMenuFixed &nbsp;-&nbsp; by @honghuangdc in https://github.com/soybeanjs/soybean-admin/issues/389 [<samp>(93c7f)</samp>](https://github.com/soybeanjs/soybean-admin/commit/93c7ff7)

### &nbsp;&nbsp;&nbsp;🔥 Performance

- **hooks**:
  - perf useSignal &nbsp;-&nbsp; by @honghuangdc [<samp>(5d45c)</samp>](https://github.com/soybeanjs/soybean-admin/commit/5d45cef)
- **projects**:
  - remove useless prop `title` of `NDrawer` &nbsp;-&nbsp; by @honghuangdc [<samp>(fdde6)</samp>](https://github.com/soybeanjs/soybean-admin/commit/fdde679)
  - add tsconfig.json for @sa/color-palette &nbsp;-&nbsp; by @honghuangdc [<samp>(d460e)</samp>](https://github.com/soybeanjs/soybean-admin/commit/d460e5c)

### &nbsp;&nbsp;&nbsp;💅 Refactors

- **hooks**: refactor useSignal, useComputed &nbsp;-&nbsp; by @honghuangdc [<samp>(3b5e4)</samp>](https://github.com/soybeanjs/soybean-admin/commit/3b5e4b3)
- **projects**: useMixMenuContext replace useMixMenu &nbsp;-&nbsp; by @honghuangdc [<samp>(1e142)</samp>](https://github.com/soybeanjs/soybean-admin/commit/1e14293)

### &nbsp;&nbsp;&nbsp;🏡 Chore

- **deps**:
  - update deps &nbsp;-&nbsp; by @honghuangdc [<samp>(e57bf)</samp>](https://github.com/soybeanjs/soybean-admin/commit/e57bf0b)
- **projects**:
  - use `engines` replace `packageManager` &nbsp;-&nbsp; by @honghuangdc [<samp>(dcd51)</samp>](https://github.com/soybeanjs/soybean-admin/commit/dcd51f4)
  - update pnpm version requirement &nbsp;-&nbsp; by @honghuangdc [<samp>(19e65)</samp>](https://github.com/soybeanjs/soybean-admin/commit/19e65c1)

### &nbsp;&nbsp;&nbsp;❤️ Contributors

[![honghuangdc](https://github.com/honghuangdc.png?size=48)](https://github.com/honghuangdc)&nbsp;&nbsp;
[alleycharming](mailto:alleycharming@gmail.com)

## [v1.0.5](https://github.com/honghuangdc/soybean-admin/compare/v1.0.4...v1.0.5) (2024-04-24)

### &nbsp;&nbsp;&nbsp;📖 Documentation

- **projects**: update CHANGELOG.md &nbsp;-&nbsp; by @honghuangdc [<samp>(cf5bc)</samp>](https://github.com/honghuangdc/soybean-admin/commit/cf5bc88)

### &nbsp;&nbsp;&nbsp;🏡 Chore

- **projects**:
  - lower vue version to 3.4.23 &nbsp;-&nbsp; by @honghuangdc [<samp>(b5243)</samp>](https://github.com/honghuangdc/soybean-admin/commit/b52432a)
  - update pnpm-lock.yaml &nbsp;-&nbsp; by @honghuangdc [<samp>(516f4)</samp>](https://github.com/honghuangdc/soybean-admin/commit/516f46a)

### &nbsp;&nbsp;&nbsp;❤️ Contributors

[![honghuangdc](https://github.com/honghuangdc.png?size=48)](https://github.com/honghuangdc)&nbsp;&nbsp;

## [v1.0.4](https://github.com/soybeanjs/soybean-admin/compare/v1.0.3...v1.0.4) (2024-04-24)

### &nbsp;&nbsp;&nbsp;🐞 Bug Fixes

- **projects**:
  - fix CHANGELOG versions &nbsp;-&nbsp; by @honghuangdc [<samp>(d9af5)</samp>](https://github.com/soybeanjs/soybean-admin/commit/d9af5aa)
  - fix disabled page animate &nbsp;-&nbsp; by @honghuangdc [<samp>(23f28)</samp>](https://github.com/soybeanjs/soybean-admin/commit/23f283a)
  - fix routes data when role is change. fixed #391 &nbsp;-&nbsp; by @honghuangdc in https://github.com/soybeanjs/soybean-admin/issues/391 [<samp>(cb83d)</samp>](https://github.com/soybeanjs/soybean-admin/commit/cb83d6d)
  - fix tabs data when role is change. fixed #392 &nbsp;-&nbsp; by @honghuangdc in https://github.com/soybeanjs/soybean-admin/issues/392 [<samp>(04aa0)</samp>](https://github.com/soybeanjs/soybean-admin/commit/04aa097)
  - recovery pnpm-lock.yaml &nbsp;-&nbsp; by @honghuangdc [<samp>(c6952)</samp>](https://github.com/soybeanjs/soybean-admin/commit/c695208)

### &nbsp;&nbsp;&nbsp;💅 Refactors

- **hooks**: refactor @sa/color &nbsp;-&nbsp; by @honghuangdc [<samp>(93191)</samp>](https://github.com/soybeanjs/soybean-admin/commit/9319173)

### &nbsp;&nbsp;&nbsp;📖 Documentation

- **projects**:
  - update README.md &nbsp;-&nbsp; by @honghuangdc [<samp>(5a523)</samp>](https://github.com/soybeanjs/soybean-admin/commit/5a5232b)
  - update README.md &nbsp;-&nbsp; by @honghuangdc [<samp>(79d9c)</samp>](https://github.com/soybeanjs/soybean-admin/commit/79d9c51)

### &nbsp;&nbsp;&nbsp;🏡 Chore

- **deps**:
  - update deps &nbsp;-&nbsp; by @honghuangdc [<samp>(ac928)</samp>](https://github.com/soybeanjs/soybean-admin/commit/ac92817)
  - update deps &nbsp;-&nbsp; by @honghuangdc [<samp>(3ceeb)</samp>](https://github.com/soybeanjs/soybean-admin/commit/3ceeb6f)
  - update deps &nbsp;-&nbsp; by @honghuangdc [<samp>(9a669)</samp>](https://github.com/soybeanjs/soybean-admin/commit/9a66979)
- **projects**:
  - update pnpm version &nbsp;-&nbsp; by @honghuangdc [<samp>(42e16)</samp>](https://github.com/soybeanjs/soybean-admin/commit/42e16a0)
  - update deps & update pnpm version & update eslint config &nbsp;-&nbsp; by @honghuangdc [<samp>(7392b)</samp>](https://github.com/soybeanjs/soybean-admin/commit/7392beb)

### &nbsp;&nbsp;&nbsp;❤️ Contributors

[![honghuangdc](https://github.com/honghuangdc.png?size=48)](https://github.com/honghuangdc)&nbsp;&nbsp;

## [v1.0.3](https://github.com/soybeanjs/soybean-admin/compare/v1.0.2...v1.0.3) (2024-04-16)

### &nbsp;&nbsp;&nbsp;🚀 Features

- **hooks**: deleting the route export of useRoutePush, use vue-router &nbsp;-&nbsp; by **paynezhuang** [<samp>(c6648)</samp>](https://github.com/soybeanjs/soybean-admin/commit/c6648b6)

### &nbsp;&nbsp;&nbsp;🐞 Bug Fixes

- **projects**:
  - fix menu edit rules &nbsp;-&nbsp; by **paynezhuang** [<samp>(00105)</samp>](https://github.com/soybeanjs/soybean-admin/commit/001059c)
  - fix SvgIcon inheritAttrs warning &nbsp;-&nbsp; by @honghuangdc [<samp>(efc0e)</samp>](https://github.com/soybeanjs/soybean-admin/commit/efc0e25)
  - fix axios createRequest: add default state &nbsp;-&nbsp; by @honghuangdc [<samp>(d6eda)</samp>](https://github.com/soybeanjs/soybean-admin/commit/d6eda8f)
  - update union-key.d.ts &nbsp;-&nbsp; by @honghuangdc [<samp>(60bef)</samp>](https://github.com/soybeanjs/soybean-admin/commit/60beff7)
  - fix update theme color &nbsp;-&nbsp; by @honghuangdc [<samp>(27c53)</samp>](https://github.com/soybeanjs/soybean-admin/commit/27c53cd)

### &nbsp;&nbsp;&nbsp;🔥 Performance

- **projects**: perf code &nbsp;-&nbsp; by @honghuangdc [<samp>(b7f07)</samp>](https://github.com/soybeanjs/soybean-admin/commit/b7f0749)

### &nbsp;&nbsp;&nbsp;💅 Refactors

- **projects**: update naive-ui.d.ts &nbsp;-&nbsp; by @honghuangdc [<samp>(bb74d)</samp>](https://github.com/soybeanjs/soybean-admin/commit/bb74d99)

### &nbsp;&nbsp;&nbsp;📖 Documentation

- **projects**: update README.md &nbsp;-&nbsp; by @honghuangdc [<samp>(f4a9c)</samp>](https://github.com/soybeanjs/soybean-admin/commit/f4a9cf8)

### &nbsp;&nbsp;&nbsp;❤️ Contributors

[![honghuangdc](https://github.com/honghuangdc.png?size=48)](https://github.com/honghuangdc)&nbsp;&nbsp;
[paynezhuang](mailto:paynezhuang@gmail.com)

## [v1.0.2](https://github.com/soybeanjs/soybean-admin/compare/v1.0.1...v1.0.2) (2024-04-08)

### &nbsp;&nbsp;&nbsp;🐞 Bug Fixes

- **projects**: unify border-radius of Tag. fixed #378 &nbsp;-&nbsp; by @honghuangdc in https://github.com/soybeanjs/soybean-admin/issues/378 [<samp>(2f15a)</samp>](https://github.com/soybeanjs/soybean-admin/commit/2f15a2a)
- **styles**: fix css var is inserted repeatedly &nbsp;-&nbsp; by **燕博文** [<samp>(769d8)</samp>](https://github.com/soybeanjs/soybean-admin/commit/769d84a)

### &nbsp;&nbsp;&nbsp;💅 Refactors

- **projects**: refactor addThemeVarsToHtml &nbsp;-&nbsp; by @honghuangdc [<samp>(41e47)</samp>](https://github.com/soybeanjs/soybean-admin/commit/41e470e)

### &nbsp;&nbsp;&nbsp;🏡 Chore

- **deps**: update deps &nbsp;-&nbsp; by @honghuangdc [<samp>(a1b48)</samp>](https://github.com/soybeanjs/soybean-admin/commit/a1b484a)
- **projects**: disabled unocss eslint rule: order-attributify &nbsp;-&nbsp; by @honghuangdc [<samp>(1c72d)</samp>](https://github.com/soybeanjs/soybean-admin/commit/1c72dc7)

### &nbsp;&nbsp;&nbsp;❤️ Contributors

[![honghuangdc](https://github.com/honghuangdc.png?size=48)](https://github.com/honghuangdc)&nbsp;&nbsp;
[燕博文](mailto:349952469@qq.com)

## [v1.0.1](https://github.com/soybeanjs/soybean-admin/compare/v1.0.0...v1.0.1) (2024-04-03)

### &nbsp;&nbsp;&nbsp;🐞 Bug Fixes

- **projects**:
  - fix flatRequest error type. fixed #376 &nbsp;-&nbsp; by @honghuangdc in https://github.com/soybeanjs/soybean-admin/issues/376 [<samp>(1ec5e)</samp>](https://github.com/soybeanjs/soybean-admin/commit/1ec5ea0)
  - add maxWidth for GlobalTab to fix bg with gap. fixed #350 &nbsp;-&nbsp; by @honghuangdc in https://github.com/soybeanjs/soybean-admin/issues/350 [<samp>(cc539)</samp>](https://github.com/soybeanjs/soybean-admin/commit/cc53997)

### &nbsp;&nbsp;&nbsp;📖 Documentation

- **projects**: update README.md &nbsp;-&nbsp; by @honghuangdc [<samp>(76011)</samp>](https://github.com/soybeanjs/soybean-admin/commit/76011af)

### &nbsp;&nbsp;&nbsp;🏡 Chore

- **projects**:
  - update deps &nbsp;-&nbsp; by @honghuangdc [<samp>(4babb)</samp>](https://github.com/soybeanjs/soybean-admin/commit/4babbe1)
  - update pnpm version &nbsp;-&nbsp; by @honghuangdc [<samp>(9125c)</samp>](https://github.com/soybeanjs/soybean-admin/commit/9125cc9)

### &nbsp;&nbsp;&nbsp;❤️ Contributors

[![honghuangdc](https://github.com/honghuangdc.png?size=48)](https://github.com/honghuangdc)&nbsp;&nbsp;

## [v1.0.0](https://github.com/soybeanjs/soybean-admin/compare/v0.10.4...v1.0.0) (2024-03-31)

### &nbsp;&nbsp;&nbsp;🚀 Features

- internationalized menu search &nbsp;-&nbsp; by **Kori** [<samp>(9e115)</samp>](https://github.com/soybeanjs/soybean-admin/commit/9e115da)
- **components**:
  - enhance the custom strength of the 'TableHeaderOperation' component &nbsp;-&nbsp; by **tnt group** [<samp>(fdf64)</samp>](https://github.com/soybeanjs/soybean-admin/commit/fdf64f7)
  - add GlobalSearch components &nbsp;-&nbsp; by **燕博文** [<samp>(9ea87)</samp>](https://github.com/soybeanjs/soybean-admin/commit/9ea8789)
- **hooks**:
  - add use-echarts &nbsp;-&nbsp; by @honghuangdc [<samp>(726ab)</samp>](https://github.com/soybeanjs/soybean-admin/commit/726abe4)
- **projects**:
  - 1.0 beta &nbsp;-&nbsp; by @honghuangdc [<samp>(e918a)</samp>](https://github.com/soybeanjs/soybean-admin/commit/e918a2c)
  - support Vite5 &nbsp;-&nbsp; by @honghuangdc [<samp>(96e4a)</samp>](https://github.com/soybeanjs/soybean-admin/commit/96e4aff)
  - @sa/axios: createRequest, createFlatRequest, createHookRequest &nbsp;-&nbsp; by @honghuangdc [<samp>(bac16)</samp>](https://github.com/soybeanjs/soybean-admin/commit/bac1632)
  - add app loading &nbsp;-&nbsp; by @honghuangdc [<samp>(c6545)</samp>](https://github.com/soybeanjs/soybean-admin/commit/c65451b)
  - add copyright, unocss shortcut: card-wrapper, update package.json &nbsp;-&nbsp; by @honghuangdc [<samp>(affcc)</samp>](https://github.com/soybeanjs/soybean-admin/commit/affcc26)
  - add page: about &nbsp;-&nbsp; by @honghuangdc [<samp>(4955f)</samp>](https://github.com/soybeanjs/soybean-admin/commit/4955f1a)
  - add custom route exception &nbsp;-&nbsp; by @honghuangdc [<samp>(b43c9)</samp>](https://github.com/soybeanjs/soybean-admin/commit/b43c925)
  - filter tabs which are not in routes &nbsp;-&nbsp; by @honghuangdc [<samp>(f59f3)</samp>](https://github.com/soybeanjs/soybean-admin/commit/f59f348)
  - packages/scripts: add command changelog,release &nbsp;-&nbsp; by @honghuangdc [<samp>(dafb6)</samp>](https://github.com/soybeanjs/soybean-admin/commit/dafb6fa)
  - add script: gen-route &nbsp;-&nbsp; by @honghuangdc [<samp>(697c1)</samp>](https://github.com/soybeanjs/soybean-admin/commit/697c1b6)
  - @sa/axios: add qs stringify for params &nbsp;-&nbsp; by @honghuangdc [<samp>(2400c)</samp>](https://github.com/soybeanjs/soybean-admin/commit/2400c02)
  - page home & perf useEcharts &nbsp;-&nbsp; by @honghuangdc [<samp>(62e4d)</samp>](https://github.com/soybeanjs/soybean-admin/commit/62e4da0)
  - finish page home &nbsp;-&nbsp; by @honghuangdc [<samp>(7bd1e)</samp>](https://github.com/soybeanjs/soybean-admin/commit/7bd1e47)
  - add page function_tab &nbsp;-&nbsp; by @honghuangdc [<samp>(6ff86)</samp>](https://github.com/soybeanjs/soybean-admin/commit/6ff86e7)
  - page manage_role &nbsp;-&nbsp; by @honghuangdc [<samp>(237c6)</samp>](https://github.com/soybeanjs/soybean-admin/commit/237c6d2)
  - page manage_user &nbsp;-&nbsp; by @honghuangdc [<samp>(8a170)</samp>](https://github.com/soybeanjs/soybean-admin/commit/8a170ee)
  - page manage_menu &nbsp;-&nbsp; by @honghuangdc [<samp>(87d65)</samp>](https://github.com/soybeanjs/soybean-admin/commit/87d65d3)
  - page manage_menu operateDrawer &nbsp;-&nbsp; by @honghuangdc [<samp>(db17c)</samp>](https://github.com/soybeanjs/soybean-admin/commit/db17c91)
  - Add type to TabRoute: matched &nbsp;-&nbsp; by @Azir-11 [<samp>(2d102)</samp>](https://github.com/soybeanjs/soybean-admin/commit/2d102a0)
  - support directory menu hide all child menus. fixed #325 &nbsp;-&nbsp; by @honghuangdc in https://github.com/soybeanjs/soybean-admin/issues/325 [<samp>(7256a)</samp>](https://github.com/soybeanjs/soybean-admin/commit/7256ad4)
  - mock manage list data with pagination &nbsp;-&nbsp; by @honghuangdc [<samp>(1a6be)</samp>](https://github.com/soybeanjs/soybean-admin/commit/1a6be00)
  - globalSearch add i18n &nbsp;-&nbsp; by **燕博文** [<samp>(0126d)</samp>](https://github.com/soybeanjs/soybean-admin/commit/0126da4)
  - Add route meta parameter:fixedQuery &nbsp;-&nbsp; by @Azir-11 [<samp>(874aa)</samp>](https://github.com/soybeanjs/soybean-admin/commit/874aaca)
  - update &nbsp;-&nbsp; by @honghuangdc [<samp>(4158a)</samp>](https://github.com/soybeanjs/soybean-admin/commit/4158a72)
  - change borderRadius to 6px of naiveUI &nbsp;-&nbsp; by @honghuangdc [<samp>(49558)</samp>](https://github.com/soybeanjs/soybean-admin/commit/49558ca)
  - pef manage role &nbsp;-&nbsp; by @honghuangdc [<samp>(18709)</samp>](https://github.com/soybeanjs/soybean-admin/commit/1870981)
  - login page: code-login &nbsp;-&nbsp; by @honghuangdc [<samp>(c91dd)</samp>](https://github.com/soybeanjs/soybean-admin/commit/c91dd28)
  - login page: register &nbsp;-&nbsp; by @honghuangdc [<samp>(1ed33)</samp>](https://github.com/soybeanjs/soybean-admin/commit/1ed33dc)
  - add request refresh token & logout &nbsp;-&nbsp; by @honghuangdc [<samp>(11a6a)</samp>](https://github.com/soybeanjs/soybean-admin/commit/11a6a3b)
  - add request exception example page &nbsp;-&nbsp; by @honghuangdc [<samp>(41e8b)</samp>](https://github.com/soybeanjs/soybean-admin/commit/41e8bc4)
  - add auth example &nbsp;-&nbsp; by @honghuangdc [<samp>(c11d5)</samp>](https://github.com/soybeanjs/soybean-admin/commit/c11d56d)
- **router**:
  - add sortRoutesByOrder function &nbsp;-&nbsp; by @Azir-11 [<samp>(0cf09)</samp>](https://github.com/soybeanjs/soybean-admin/commit/0cf09ba)

### &nbsp;&nbsp;&nbsp;🐞 Bug Fixes

- **components**:
  - fix tooltip zIndex of ButtonIcon &nbsp;-&nbsp; by @honghuangdc [<samp>(99097)</samp>](https://github.com/soybeanjs/soybean-admin/commit/99097b4)
  - supplement the `NaiveUI` type &nbsp;-&nbsp; by **tnt group** [<samp>(ccc2b)</samp>](https://github.com/soybeanjs/soybean-admin/commit/ccc2b67)
  - fix homeTab closeRight and disable colseLeft &nbsp;-&nbsp; by **~li** [<samp>(d28bf)</samp>](https://github.com/soybeanjs/soybean-admin/commit/d28bf52)
- **hooks**:
  - Fix Naive Pagination's outdated API &nbsp;-&nbsp; by **tnt group** [<samp>(37436)</samp>](https://github.com/soybeanjs/soybean-admin/commit/3743612)
- **projects**:
  - 修复路由命名为包含关系时导致导航数据出错的问题 &nbsp;-&nbsp; by @Particaly [<samp>(76636)</samp>](https://github.com/soybeanjs/soybean-admin/commit/766369f)
  - rename zh-ch &nbsp;-&nbsp; by @honghuangdc [<samp>(a8a77)</samp>](https://github.com/soybeanjs/soybean-admin/commit/a8a77ea)
  - Fix welcome notification not closing &nbsp;-&nbsp; by @Azir-11 [<samp>(748cf)</samp>](https://github.com/soybeanjs/soybean-admin/commit/748cfa2)
  - fix i18n vscode settings &nbsp;-&nbsp; by @honghuangdc [<samp>(fbf4c)</samp>](https://github.com/soybeanjs/soybean-admin/commit/fbf4cc4)
  - add duration of login success notification &nbsp;-&nbsp; by @honghuangdc [<samp>(1335d)</samp>](https://github.com/soybeanjs/soybean-admin/commit/1335d47)
  - fix menu indent &nbsp;-&nbsp; by @honghuangdc [<samp>(87143)</samp>](https://github.com/soybeanjs/soybean-admin/commit/8714317)
  - fix theme mode segment &nbsp;-&nbsp; by @honghuangdc [<samp>(2372d)</samp>](https://github.com/soybeanjs/soybean-admin/commit/2372dc9)
  - fix app loading theme color &nbsp;-&nbsp; by @honghuangdc [<samp>(0ba19)</samp>](https://github.com/soybeanjs/soybean-admin/commit/0ba19d5)
  - fix page about style in mobile &nbsp;-&nbsp; by @honghuangdc [<samp>(8b6de)</samp>](https://github.com/soybeanjs/soybean-admin/commit/8b6de48)
  - fix themeDrawer darkMode segement &nbsp;-&nbsp; by @honghuangdc [<samp>(1b5ca)</samp>](https://github.com/soybeanjs/soybean-admin/commit/1b5caa0)
  - fix themeDrawer copy &nbsp;-&nbsp; by @honghuangdc [<samp>(b3779)</samp>](https://github.com/soybeanjs/soybean-admin/commit/b3779a6)
  - remove space in tab content &nbsp;-&nbsp; by @honghuangdc [<samp>(4aae6)</samp>](https://github.com/soybeanjs/soybean-admin/commit/4aae6a5)
  - fix horizontal menu &nbsp;-&nbsp; by @honghuangdc [<samp>(d886e)</samp>](https://github.com/soybeanjs/soybean-admin/commit/d886e50)
  - perf card style &nbsp;-&nbsp; by @honghuangdc [<samp>(c1afb)</samp>](https://github.com/soybeanjs/soybean-admin/commit/c1afb9d)
  - fix manage_user title &nbsp;-&nbsp; by @honghuangdc [<samp>(7770b)</samp>](https://github.com/soybeanjs/soybean-admin/commit/7770b37)
  - default proxy prefix &nbsp;-&nbsp; by @smileluck [<samp>(da246)</samp>](https://github.com/soybeanjs/soybean-admin/commit/da24642)
  - fix request msg &nbsp;-&nbsp; by @honghuangdc [<samp>(ae6b6)</samp>](https://github.com/soybeanjs/soybean-admin/commit/ae6b613)
  - Fix the issue of tab error displaying parent localIcon &nbsp;-&nbsp; by @Azir-11 [<samp>(a9c98)</samp>](https://github.com/soybeanjs/soybean-admin/commit/a9c98d9)
  - The matched value of TabRoute should be optional &nbsp;-&nbsp; by @Azir-11 [<samp>(e6fed)</samp>](https://github.com/soybeanjs/soybean-admin/commit/e6fed1f)
  - fix build [unocss]: build failed to load icon "close", fixed #319 &nbsp;-&nbsp; by @honghuangdc in https://github.com/soybeanjs/soybean-admin/issues/319 [<samp>(c18d8)</samp>](https://github.com/soybeanjs/soybean-admin/commit/c18d82f)
  - fix resolve alias &nbsp;-&nbsp; by @honghuangdc [<samp>(3bdcb)</samp>](https://github.com/soybeanjs/soybean-admin/commit/3bdcbc7)
  - Missing default value for tab icon &nbsp;-&nbsp; by @Azir-11 [<samp>(72a46)</samp>](https://github.com/soybeanjs/soybean-admin/commit/72a4679)
  - add route icon: fucntion_hide-child &nbsp;-&nbsp; by @honghuangdc [<samp>(0a3ef)</samp>](https://github.com/soybeanjs/soybean-admin/commit/0a3efe3)
  - fix table x-scroll. fixed #324 &nbsp;-&nbsp; by @honghuangdc in https://github.com/soybeanjs/soybean-admin/issues/324 [<samp>(c7e2c)</samp>](https://github.com/soybeanjs/soybean-admin/commit/c7e2c55)
  - Fix the logic of root route redirection to home &nbsp;-&nbsp; by **恕瑞玛的皇帝** [<samp>(0123c)</samp>](https://github.com/soybeanjs/soybean-admin/commit/0123c37)
  - Fix homepage mount error under dynamic routing &nbsp;-&nbsp; by **恕瑞玛的皇帝** [<samp>(9cf2a)</samp>](https://github.com/soybeanjs/soybean-admin/commit/9cf2a51)
  - fix repeat home tab &nbsp;-&nbsp; by @honghuangdc [<samp>(bccd6)</samp>](https://github.com/soybeanjs/soybean-admin/commit/bccd6cb)
  - fix proxy config &nbsp;-&nbsp; by @honghuangdc [<samp>(c8019)</samp>](https://github.com/soybeanjs/soybean-admin/commit/c8019c4)
  - fix proxy config &nbsp;-&nbsp; by @honghuangdc [<samp>(ffc95)</samp>](https://github.com/soybeanjs/soybean-admin/commit/ffc95d2)
  - fix table row-key ts type &nbsp;-&nbsp; by @honghuangdc [<samp>(0cc8f)</samp>](https://github.com/soybeanjs/soybean-admin/commit/0cc8f05)
  - fix class name conflict with unocss icon &nbsp;-&nbsp; by @honghuangdc [<samp>(455e4)</samp>](https://github.com/soybeanjs/soybean-admin/commit/455e48f)
  - fix repeat routes &nbsp;-&nbsp; by @honghuangdc [<samp>(2c543)</samp>](https://github.com/soybeanjs/soybean-admin/commit/2c543f1)
  - fix route init &nbsp;-&nbsp; by @honghuangdc [<samp>(23a40)</samp>](https://github.com/soybeanjs/soybean-admin/commit/23a4098)
  - fix pin-toggler toolTip zIndex &nbsp;-&nbsp; by @honghuangdc [<samp>(f89e6)</samp>](https://github.com/soybeanjs/soybean-admin/commit/f89e6c0)

### &nbsp;&nbsp;&nbsp;🔥 Performance

- **components**:
  - Optimize internationalized menu search code &nbsp;-&nbsp; by **燕博文** [<samp>(8c1ef)</samp>](https://github.com/soybeanjs/soybean-admin/commit/8c1ef4b)
  - Optimize menu search code &nbsp;-&nbsp; by **燕博文** [<samp>(296a2)</samp>](https://github.com/soybeanjs/soybean-admin/commit/296a2d2)
  - perf count-to &nbsp;-&nbsp; by @honghuangdc [<samp>(b2c61)</samp>](https://github.com/soybeanjs/soybean-admin/commit/b2c61f0)
  - components  name is converted to uppercase &nbsp;-&nbsp; by **燕博文** [<samp>(04aa1)</samp>](https://github.com/soybeanjs/soybean-admin/commit/04aa10b)
  - perf global-search &nbsp;-&nbsp; by @honghuangdc [<samp>(72745)</samp>](https://github.com/soybeanjs/soybean-admin/commit/7274522)
- **projects**:
  - perf code &nbsp;-&nbsp; by @honghuangdc [<samp>(8081e)</samp>](https://github.com/soybeanjs/soybean-admin/commit/8081e19)
  - env config &nbsp;-&nbsp; by @honghuangdc [<samp>(1bac3)</samp>](https://github.com/soybeanjs/soybean-admin/commit/1bac3b7)
  - add detailed annotations for route role &nbsp;-&nbsp; by @honghuangdc [<samp>(f6bab)</samp>](https://github.com/soybeanjs/soybean-admin/commit/f6bab0c)
  - perf code &nbsp;-&nbsp; by @honghuangdc [<samp>(5c49d)</samp>](https://github.com/soybeanjs/soybean-admin/commit/5c49d24)
  - remove useless file &nbsp;-&nbsp; by @honghuangdc [<samp>(c624f)</samp>](https://github.com/soybeanjs/soybean-admin/commit/c624f32)
  - remove @soybeanjs/cli &nbsp;-&nbsp; by @honghuangdc [<samp>(41349)</samp>](https://github.com/soybeanjs/soybean-admin/commit/4134955)
  - echarts loading style &nbsp;-&nbsp; by @honghuangdc [<samp>(456c3)</samp>](https://github.com/soybeanjs/soybean-admin/commit/456c318)
  - perf page manage_role, useTable &nbsp;-&nbsp; by @honghuangdc [<samp>(39aa7)</samp>](https://github.com/soybeanjs/soybean-admin/commit/39aa7aa)
  - perf table columns style &nbsp;-&nbsp; by @honghuangdc [<samp>(babdb)</samp>](https://github.com/soybeanjs/soybean-admin/commit/babdb5d)
  - perf page manage_menu style &nbsp;-&nbsp; by @honghuangdc [<samp>(0aa75)</samp>](https://github.com/soybeanjs/soybean-admin/commit/0aa75c0)
  - perf code &nbsp;-&nbsp; by @honghuangdc [<samp>(7fa87)</samp>](https://github.com/soybeanjs/soybean-admin/commit/7fa87f5)
  - perf code &nbsp;-&nbsp; by @honghuangdc [<samp>(05db8)</samp>](https://github.com/soybeanjs/soybean-admin/commit/05db8c0)
  - perf code &nbsp;-&nbsp; by @honghuangdc [<samp>(dc24a)</samp>](https://github.com/soybeanjs/soybean-admin/commit/dc24a36)
  - perf manage page style &nbsp;-&nbsp; by @honghuangdc [<samp>(779ba)</samp>](https://github.com/soybeanjs/soybean-admin/commit/779ba4e)
  - perf manage menu &nbsp;-&nbsp; by @honghuangdc [<samp>(71f2c)</samp>](https://github.com/soybeanjs/soybean-admin/commit/71f2c55)
  - manage menu: add transform to component &nbsp;-&nbsp; by @honghuangdc [<samp>(0abbf)</samp>](https://github.com/soybeanjs/soybean-admin/commit/0abbfa5)
  - perf code &nbsp;-&nbsp; by @honghuangdc [<samp>(a0bad)</samp>](https://github.com/soybeanjs/soybean-admin/commit/a0bad57)

### &nbsp;&nbsp;&nbsp;💅 Refactors

- **projects**:
  - remove plugin-web-update-notification &nbsp;-&nbsp; by @honghuangdc [<samp>(f6c6d)</samp>](https://github.com/soybeanjs/soybean-admin/commit/f6c6dbd)
  - fix conflict with locale file &nbsp;-&nbsp; by @honghuangdc [<samp>(3346b)</samp>](https://github.com/soybeanjs/soybean-admin/commit/3346bcd)
  - refactor app-loading &nbsp;-&nbsp; by @honghuangdc [<samp>(b4f3d)</samp>](https://github.com/soybeanjs/soybean-admin/commit/b4f3dd2)
  - use naive-ui color-picker &nbsp;-&nbsp; by @honghuangdc [<samp>(b5551)</samp>](https://github.com/soybeanjs/soybean-admin/commit/b5551d6)
  - perf page home &nbsp;-&nbsp; by @honghuangdc [<samp>(4c61c)</samp>](https://github.com/soybeanjs/soybean-admin/commit/4c61c6f)
  - login components => modules &nbsp;-&nbsp; by @honghuangdc [<samp>(59bec)</samp>](https://github.com/soybeanjs/soybean-admin/commit/59bec2d)
  - perf page function_tab &nbsp;-&nbsp; by @honghuangdc [<samp>(b5477)</samp>](https://github.com/soybeanjs/soybean-admin/commit/b5477e8)
  - update mock api &nbsp;-&nbsp; by @honghuangdc [<samp>(27241)</samp>](https://github.com/soybeanjs/soybean-admin/commit/2724169)
  - page manage_role: extract module &nbsp;-&nbsp; by @honghuangdc [<samp>(0e9e2)</samp>](https://github.com/soybeanjs/soybean-admin/commit/0e9e2e1)
  - perf page manage_role &nbsp;-&nbsp; by @honghuangdc [<samp>(a19f8)</samp>](https://github.com/soybeanjs/soybean-admin/commit/a19f895)
  - manage_route => manage_menu &nbsp;-&nbsp; by @honghuangdc [<samp>(f8467)</samp>](https://github.com/soybeanjs/soybean-admin/commit/f8467ce)
  - refactor service env config &nbsp;-&nbsp; by @honghuangdc [<samp>(43193)</samp>](https://github.com/soybeanjs/soybean-admin/commit/43193e2)
  - refactor unocss shortcuts: wh-full => size-full &nbsp;-&nbsp; by @honghuangdc [<samp>(b4c00)</samp>](https://github.com/soybeanjs/soybean-admin/commit/b4c00ce)
  - use enquirer replace prompts &nbsp;-&nbsp; by @honghuangdc [<samp>(b546f)</samp>](https://github.com/soybeanjs/soybean-admin/commit/b546ff8)
  - refactor useTable &nbsp;-&nbsp; by @honghuangdc [<samp>(c3efa)</samp>](https://github.com/soybeanjs/soybean-admin/commit/c3efa1b)
  - finish refactor useTable &nbsp;-&nbsp; by @honghuangdc [<samp>(86301)</samp>](https://github.com/soybeanjs/soybean-admin/commit/8630175)
  - finish refactor useTable and apply &nbsp;-&nbsp; by @honghuangdc [<samp>(3fd15)</samp>](https://github.com/soybeanjs/soybean-admin/commit/3fd15e5)
  - perf code &nbsp;-&nbsp; by @honghuangdc [<samp>(f91ef)</samp>](https://github.com/soybeanjs/soybean-admin/commit/f91ef30)
  - new route guard &nbsp;-&nbsp; by @honghuangdc [<samp>(37d20)</samp>](https://github.com/soybeanjs/soybean-admin/commit/37d20b8)

### &nbsp;&nbsp;&nbsp;📖 Documentation

- **projects**:
  - update README.md &nbsp;-&nbsp; by @honghuangdc [<samp>(78364)</samp>](https://github.com/soybeanjs/soybean-admin/commit/783648f)
  - update README.md &nbsp;-&nbsp; by @honghuangdc [<samp>(1ea48)</samp>](https://github.com/soybeanjs/soybean-admin/commit/1ea4817)
  - add README &nbsp;-&nbsp; by @honghuangdc [<samp>(2371b)</samp>](https://github.com/soybeanjs/soybean-admin/commit/2371ba8)
  - update README &nbsp;-&nbsp; by @honghuangdc [<samp>(d16a9)</samp>](https://github.com/soybeanjs/soybean-admin/commit/d16a9d5)
  - update README.md &nbsp;-&nbsp; by @honghuangdc [<samp>(6a771)</samp>](https://github.com/soybeanjs/soybean-admin/commit/6a771ea)
  - update README.md &nbsp;-&nbsp; by @honghuangdc [<samp>(57b6d)</samp>](https://github.com/soybeanjs/soybean-admin/commit/57b6d8a)
  - update README.md &nbsp;-&nbsp; by @honghuangdc [<samp>(b30c0)</samp>](https://github.com/soybeanjs/soybean-admin/commit/b30c035)
  - update README.md &nbsp;-&nbsp; by @honghuangdc [<samp>(c260f)</samp>](https://github.com/soybeanjs/soybean-admin/commit/c260fe2)
  - update README.md &nbsp;-&nbsp; by @honghuangdc [<samp>(03c42)</samp>](https://github.com/soybeanjs/soybean-admin/commit/03c42aa)
  - update README.md &nbsp;-&nbsp; by @honghuangdc [<samp>(0fae9)</samp>](https://github.com/soybeanjs/soybean-admin/commit/0fae993)
  - update README.md &nbsp;-&nbsp; by @honghuangdc [<samp>(4e4d2)</samp>](https://github.com/soybeanjs/soybean-admin/commit/4e4d2de)
  - update README.md &nbsp;-&nbsp; by @honghuangdc [<samp>(86b44)</samp>](https://github.com/soybeanjs/soybean-admin/commit/86b445c)
  - update README.md &nbsp;-&nbsp; by @honghuangdc [<samp>(e2085)</samp>](https://github.com/soybeanjs/soybean-admin/commit/e2085e0)
  - update README.md &nbsp;-&nbsp; by @honghuangdc [<samp>(6ea9b)</samp>](https://github.com/soybeanjs/soybean-admin/commit/6ea9b85)
  - update README.md &nbsp;-&nbsp; by @honghuangdc [<samp>(ef4af)</samp>](https://github.com/soybeanjs/soybean-admin/commit/ef4af79)
  - update README.md &nbsp;-&nbsp; by @honghuangdc [<samp>(41830)</samp>](https://github.com/soybeanjs/soybean-admin/commit/418302a)
  - add CHANGELOG.md &nbsp;-&nbsp; by @honghuangdc [<samp>(46b61)</samp>](https://github.com/soybeanjs/soybean-admin/commit/46b6156)
  - add communication &nbsp;-&nbsp; by @honghuangdc [<samp>(8c7ea)</samp>](https://github.com/soybeanjs/soybean-admin/commit/8c7ea23)
  - update README.md &nbsp;-&nbsp; by @honghuangdc [<samp>(07d8d)</samp>](https://github.com/soybeanjs/soybean-admin/commit/07d8d25)
  - update README.md &nbsp;-&nbsp; by @honghuangdc [<samp>(1a707)</samp>](https://github.com/soybeanjs/soybean-admin/commit/1a7070f)
  - update README.md &nbsp;-&nbsp; by @honghuangdc [<samp>(f69e1)</samp>](https://github.com/soybeanjs/soybean-admin/commit/f69e152)

### &nbsp;&nbsp;&nbsp;🏡 Chore

- **deps**:
  - update deps &nbsp;-&nbsp; by @honghuangdc [<samp>(3eaf0)</samp>](https://github.com/soybeanjs/soybean-admin/commit/3eaf05b)
  - update deps &nbsp;-&nbsp; by @honghuangdc [<samp>(36fe1)</samp>](https://github.com/soybeanjs/soybean-admin/commit/36fe1da)
  - update deps &nbsp;-&nbsp; by @honghuangdc [<samp>(55342)</samp>](https://github.com/soybeanjs/soybean-admin/commit/5534294)
  - update deps &nbsp;-&nbsp; by @honghuangdc [<samp>(f1b86)</samp>](https://github.com/soybeanjs/soybean-admin/commit/f1b86cc)
  - update deps &nbsp;-&nbsp; by @honghuangdc [<samp>(840e7)</samp>](https://github.com/soybeanjs/soybean-admin/commit/840e7f9)
  - update deps &nbsp;-&nbsp; by @honghuangdc [<samp>(6114b)</samp>](https://github.com/soybeanjs/soybean-admin/commit/6114b9f)
  - update deps &nbsp;-&nbsp; by @honghuangdc [<samp>(9cc7e)</samp>](https://github.com/soybeanjs/soybean-admin/commit/9cc7ee5)
  - update deps &nbsp;-&nbsp; by @honghuangdc [<samp>(9c4ba)</samp>](https://github.com/soybeanjs/soybean-admin/commit/9c4ba66)
  - update deps &nbsp;-&nbsp; by @honghuangdc [<samp>(fb3b9)</samp>](https://github.com/soybeanjs/soybean-admin/commit/fb3b94b)
  - update deps &nbsp;-&nbsp; by @honghuangdc [<samp>(14aa8)</samp>](https://github.com/soybeanjs/soybean-admin/commit/14aa856)
  - update deps &nbsp;-&nbsp; by @honghuangdc [<samp>(02d4b)</samp>](https://github.com/soybeanjs/soybean-admin/commit/02d4b0a)
  - update deps &nbsp;-&nbsp; by @honghuangdc [<samp>(b2ee9)</samp>](https://github.com/soybeanjs/soybean-admin/commit/b2ee9ee)
  - update deps &nbsp;-&nbsp; by @honghuangdc [<samp>(0fee1)</samp>](https://github.com/soybeanjs/soybean-admin/commit/0fee104)
  - update deps &nbsp;-&nbsp; by @honghuangdc [<samp>(c0a65)</samp>](https://github.com/soybeanjs/soybean-admin/commit/c0a65a1)
  - update deps &nbsp;-&nbsp; by @honghuangdc [<samp>(6b513)</samp>](https://github.com/soybeanjs/soybean-admin/commit/6b5132c)
  - update deps &nbsp;-&nbsp; by @honghuangdc [<samp>(82b53)</samp>](https://github.com/soybeanjs/soybean-admin/commit/82b53d7)
- **project**:
  - delete src/locales/lang/zh-CN.ts &nbsp;-&nbsp; by @honghuangdc [<samp>(377db)</samp>](https://github.com/soybeanjs/soybean-admin/commit/377db82)
- **projects**:
  - use eslint flat config & update config &nbsp;-&nbsp; by @honghuangdc [<samp>(a176d)</samp>](https://github.com/soybeanjs/soybean-admin/commit/a176dc4)
  - update @sa/scripts &nbsp;-&nbsp; by @honghuangdc [<samp>(d7785)</samp>](https://github.com/soybeanjs/soybean-admin/commit/d778560)
  - update pnpm version &nbsp;-&nbsp; by @honghuangdc [<samp>(55f76)</samp>](https://github.com/soybeanjs/soybean-admin/commit/55f7638)
  - update eslint config &nbsp;-&nbsp; by @honghuangdc [<samp>(5023f)</samp>](https://github.com/soybeanjs/soybean-admin/commit/5023f37)
  - lock deps versions &nbsp;-&nbsp; by @honghuangdc [<samp>(a24f9)</samp>](https://github.com/soybeanjs/soybean-admin/commit/a24f963)
  - update pnpm version &nbsp;-&nbsp; by @honghuangdc [<samp>(ea02b)</samp>](https://github.com/soybeanjs/soybean-admin/commit/ea02b23)
  - remove @simonwep/pickr &nbsp;-&nbsp; by @honghuangdc [<samp>(502a4)</samp>](https://github.com/soybeanjs/soybean-admin/commit/502a4d2)
  - remove soybean.svg &nbsp;-&nbsp; by @honghuangdc [<samp>(4031f)</samp>](https://github.com/soybeanjs/soybean-admin/commit/4031faf)
  - update pnpm version &nbsp;-&nbsp; by @honghuangdc [<samp>(adec0)</samp>](https://github.com/soybeanjs/soybean-admin/commit/adec0d7)
  - update deps & fix keep-alive &nbsp;-&nbsp; by @honghuangdc [<samp>(13001)</samp>](https://github.com/soybeanjs/soybean-admin/commit/13001bc)
  - update @elegant-router/vue, fix inject name in windows &nbsp;-&nbsp; by @honghuangdc [<samp>(0b56e)</samp>](https://github.com/soybeanjs/soybean-admin/commit/0b56e44)
  - add dev and build command with service env &nbsp;-&nbsp; by @honghuangdc [<samp>(ebb15)</samp>](https://github.com/soybeanjs/soybean-admin/commit/ebb1548)
  - update deps & remove packages docs &nbsp;-&nbsp; by @honghuangdc [<samp>(57963)</samp>](https://github.com/soybeanjs/soybean-admin/commit/579636b)
  - update pnpm-lock.yaml &nbsp;-&nbsp; by @honghuangdc [<samp>(147f6)</samp>](https://github.com/soybeanjs/soybean-admin/commit/147f60d)
  - update repository url &nbsp;-&nbsp; by @honghuangdc [<samp>(806a1)</samp>](https://github.com/soybeanjs/soybean-admin/commit/806a1cb)
  - update deps & update pnpm version &nbsp;-&nbsp; by @honghuangdc [<samp>(9772a)</samp>](https://github.com/soybeanjs/soybean-admin/commit/9772aec)
  - add unocss eslint config &nbsp;-&nbsp; by @honghuangdc [<samp>(40635)</samp>](https://github.com/soybeanjs/soybean-admin/commit/4063529)
  - update launch.json &nbsp;-&nbsp; by @honghuangdc [<samp>(3db82)</samp>](https://github.com/soybeanjs/soybean-admin/commit/3db82ac)
  - update vscode extensions.json &nbsp;-&nbsp; by @honghuangdc [<samp>(4e29a)</samp>](https://github.com/soybeanjs/soybean-admin/commit/4e29aca)
  - update pnpm version &nbsp;-&nbsp; by @honghuangdc [<samp>(7065f)</samp>](https://github.com/soybeanjs/soybean-admin/commit/7065f6f)
  - update deps & fix eslint vue rule &nbsp;-&nbsp; by @honghuangdc [<samp>(8143b)</samp>](https://github.com/soybeanjs/soybean-admin/commit/8143b00)
  - update pnpm version &nbsp;-&nbsp; by @honghuangdc [<samp>(6ad51)</samp>](https://github.com/soybeanjs/soybean-admin/commit/6ad51e9)
  - add .gitattributes &nbsp;-&nbsp; by @honghuangdc [<samp>(c0009)</samp>](https://github.com/soybeanjs/soybean-admin/commit/c000920)

### &nbsp;&nbsp;&nbsp;🎨 Styles

- **components**:
  - Uniform icon size for header &nbsp;-&nbsp; by @Azir-11 [<samp>(b37c1)</samp>](https://github.com/soybeanjs/soybean-admin/commit/b37c1e9)
- **projects**:
  - format code &nbsp;-&nbsp; by @honghuangdc [<samp>(a7481)</samp>](https://github.com/soybeanjs/soybean-admin/commit/a748166)
  - update theme mode segment height &nbsp;-&nbsp; by @honghuangdc [<samp>(4d846)</samp>](https://github.com/soybeanjs/soybean-admin/commit/4d8469e)
  - fix tooltip zIndex of ButtonIcon &nbsp;-&nbsp; by @honghuangdc [<samp>(db747)</samp>](https://github.com/soybeanjs/soybean-admin/commit/db747c4)
  - sort defineProps, defineEmits with TS type &nbsp;-&nbsp; by @honghuangdc [<samp>(123fd)</samp>](https://github.com/soybeanjs/soybean-admin/commit/123fd4f)

### &nbsp;&nbsp;&nbsp;🤖 CI

- **projects**:
  - add github actions config &nbsp;-&nbsp; by @honghuangdc [<samp>(4cb17)</samp>](https://github.com/soybeanjs/soybean-admin/commit/4cb17c7)
  - update release.yml &nbsp;-&nbsp; by @honghuangdc [<samp>(7b298)</samp>](https://github.com/soybeanjs/soybean-admin/commit/7b298c6)
  - add issue template &nbsp;-&nbsp; by @honghuangdc [<samp>(06e20)</samp>](https://github.com/soybeanjs/soybean-admin/commit/06e204a)

### &nbsp;&nbsp;&nbsp;❤️ Contributors

[![honghuangdc](https://github.com/honghuangdc.png?size=48)](https://github.com/honghuangdc)&nbsp;&nbsp;[![Azir-11](https://github.com/Azir-11.png?size=48)](https://github.com/Azir-11)&nbsp;&nbsp;[![smileluck](https://github.com/smileluck.png?size=48)](https://github.com/smileluck)&nbsp;&nbsp;[![Particaly](https://github.com/Particaly.png?size=48)](https://github.com/Particaly)&nbsp;&nbsp;
[~li](mailto:miciili-02@outlook.com),&nbsp;[Azir-11](mailto:2075125282@qq.com),&nbsp;[燕博文](mailto:349952469@qq.com),&nbsp;[tnt group](mailto:dodu@live.cn),&nbsp;[Kori](mailto:kexin@korix.top),&nbsp;

## [v1.0.0-beta.3](https://github.com/soybeanjs/soybean-admin/compare/v1.0.0-beta.2...v1.0.0-beta.3) (2024-03-31)

### &nbsp;&nbsp;&nbsp;📖 Documentation

- **projects**: update README.md &nbsp;-&nbsp; by @honghuangdc [<samp>(f69e1)</samp>](https://github.com/soybeanjs/soybean-admin/commit/f69e152)

### &nbsp;&nbsp;&nbsp;🏡 Chore

- **deps**: update deps &nbsp;-&nbsp; by @honghuangdc [<samp>(82b53)</samp>](https://github.com/soybeanjs/soybean-admin/commit/82b53d7)
- **projects**: add .gitattributes &nbsp;-&nbsp; by @honghuangdc [<samp>(c0009)</samp>](https://github.com/soybeanjs/soybean-admin/commit/c000920)

### &nbsp;&nbsp;&nbsp;❤️ Contributors

[![honghuangdc](https://github.com/honghuangdc.png?size=48)](https://github.com/honghuangdc)&nbsp;&nbsp;

## [v1.0.0-beta.2](https://github.com/soybeanjs/soybean-admin/compare/v1.0.0-beta.1...v1.0.0-beta.2) (2024-03-27)

### &nbsp;&nbsp;&nbsp;🐞 Bug Fixes

- **projects**: fix pin-toggler toolTip zIndex &nbsp;-&nbsp; by @honghuangdc [<samp>(f89e6)</samp>](https://github.com/soybeanjs/soybean-admin/commit/f89e6c0)

### &nbsp;&nbsp;&nbsp;🔥 Performance

- **projects**: perf code &nbsp;-&nbsp; by @honghuangdc [<samp>(a0bad)</samp>](https://github.com/soybeanjs/soybean-admin/commit/a0bad57)

### &nbsp;&nbsp;&nbsp;📖 Documentation

- **projects**:
  - add communication &nbsp;-&nbsp; by @honghuangdc [<samp>(8c7ea)</samp>](https://github.com/soybeanjs/soybean-admin/commit/8c7ea23)
  - update README.md &nbsp;-&nbsp; by @honghuangdc [<samp>(07d8d)</samp>](https://github.com/soybeanjs/soybean-admin/commit/07d8d25)
  - update README.md &nbsp;-&nbsp; by @honghuangdc [<samp>(1a707)</samp>](https://github.com/soybeanjs/soybean-admin/commit/1a7070f)

### &nbsp;&nbsp;&nbsp;🏡 Chore

- **deps**: update deps &nbsp;-&nbsp; by @honghuangdc [<samp>(6b513)</samp>](https://github.com/soybeanjs/soybean-admin/commit/6b5132c)

### &nbsp;&nbsp;&nbsp;🤖 CI

- **projects**:
  - update release.yml &nbsp;-&nbsp; by @honghuangdc [<samp>(7b298)</samp>](https://github.com/soybeanjs/soybean-admin/commit/7b298c6)
  - add issue template &nbsp;-&nbsp; by @honghuangdc [<samp>(06e20)</samp>](https://github.com/soybeanjs/soybean-admin/commit/06e204a)

### &nbsp;&nbsp;&nbsp;❤️ Contributors

[![honghuangdc](https://github.com/honghuangdc.png?size=48)](https://github.com/honghuangdc)&nbsp;&nbsp;

## [v1.0.0-beta.1](https://github.com/soybeanjs/soybean-admin/compare/v0.10.4...v1.0.0-beta.1) (2024-03-25)

### &nbsp;&nbsp;&nbsp;🚀 Features

- internationalized menu search &nbsp;-&nbsp; by **Kori** [<samp>(9e115)</samp>](https://github.com/soybeanjs/soybean-admin/commit/9e115da)
- **components**:
  - enhance the custom strength of the 'TableHeaderOperation' component &nbsp;-&nbsp; by **tnt group** [<samp>(fdf64)</samp>](https://github.com/soybeanjs/soybean-admin/commit/fdf64f7)
  - add GlobalSearch components &nbsp;-&nbsp; by **燕博文** [<samp>(9ea87)</samp>](https://github.com/soybeanjs/soybean-admin/commit/9ea8789)
- **hooks**:
  - add use-echarts &nbsp;-&nbsp; by @honghuangdc [<samp>(726ab)</samp>](https://github.com/soybeanjs/soybean-admin/commit/726abe4)
- **projects**:
  - 1.0 beta &nbsp;-&nbsp; by @honghuangdc [<samp>(e918a)</samp>](https://github.com/soybeanjs/soybean-admin/commit/e918a2c)
  - support Vite5 &nbsp;-&nbsp; by @honghuangdc [<samp>(96e4a)</samp>](https://github.com/soybeanjs/soybean-admin/commit/96e4aff)
  - @sa/axios: createRequest, createFlatRequest, createHookRequest &nbsp;-&nbsp; by @honghuangdc [<samp>(bac16)</samp>](https://github.com/soybeanjs/soybean-admin/commit/bac1632)
  - add app loading &nbsp;-&nbsp; by @honghuangdc [<samp>(c6545)</samp>](https://github.com/soybeanjs/soybean-admin/commit/c65451b)
  - add copyright, unocss shortcut: card-wrapper, update package.json &nbsp;-&nbsp; by @honghuangdc [<samp>(affcc)</samp>](https://github.com/soybeanjs/soybean-admin/commit/affcc26)
  - add page: about &nbsp;-&nbsp; by @honghuangdc [<samp>(4955f)</samp>](https://github.com/soybeanjs/soybean-admin/commit/4955f1a)
  - add custom route exception &nbsp;-&nbsp; by @honghuangdc [<samp>(b43c9)</samp>](https://github.com/soybeanjs/soybean-admin/commit/b43c925)
  - filter tabs which are not in routes &nbsp;-&nbsp; by @honghuangdc [<samp>(f59f3)</samp>](https://github.com/soybeanjs/soybean-admin/commit/f59f348)
  - packages/scripts: add command changelog,release &nbsp;-&nbsp; by @honghuangdc [<samp>(dafb6)</samp>](https://github.com/soybeanjs/soybean-admin/commit/dafb6fa)
  - add script: gen-route &nbsp;-&nbsp; by @honghuangdc [<samp>(697c1)</samp>](https://github.com/soybeanjs/soybean-admin/commit/697c1b6)
  - @sa/axios: add qs stringify for params &nbsp;-&nbsp; by @honghuangdc [<samp>(2400c)</samp>](https://github.com/soybeanjs/soybean-admin/commit/2400c02)
  - page home & perf useEcharts &nbsp;-&nbsp; by @honghuangdc [<samp>(62e4d)</samp>](https://github.com/soybeanjs/soybean-admin/commit/62e4da0)
  - finish page home &nbsp;-&nbsp; by @honghuangdc [<samp>(7bd1e)</samp>](https://github.com/soybeanjs/soybean-admin/commit/7bd1e47)
  - add page function_tab &nbsp;-&nbsp; by @honghuangdc [<samp>(6ff86)</samp>](https://github.com/soybeanjs/soybean-admin/commit/6ff86e7)
  - page manage_role &nbsp;-&nbsp; by @honghuangdc [<samp>(237c6)</samp>](https://github.com/soybeanjs/soybean-admin/commit/237c6d2)
  - page manage_user &nbsp;-&nbsp; by @honghuangdc [<samp>(8a170)</samp>](https://github.com/soybeanjs/soybean-admin/commit/8a170ee)
  - page manage_menu &nbsp;-&nbsp; by @honghuangdc [<samp>(87d65)</samp>](https://github.com/soybeanjs/soybean-admin/commit/87d65d3)
  - page manage_menu operateDrawer &nbsp;-&nbsp; by @honghuangdc [<samp>(db17c)</samp>](https://github.com/soybeanjs/soybean-admin/commit/db17c91)
  - Add type to TabRoute: matched &nbsp;-&nbsp; by @Azir-11 [<samp>(2d102)</samp>](https://github.com/soybeanjs/soybean-admin/commit/2d102a0)
  - support directory menu hide all child menus. fixed #325 &nbsp;-&nbsp; by @honghuangdc in https://github.com/soybeanjs/soybean-admin/issues/325 [<samp>(7256a)</samp>](https://github.com/soybeanjs/soybean-admin/commit/7256ad4)
  - mock manage list data with pagination &nbsp;-&nbsp; by @honghuangdc [<samp>(1a6be)</samp>](https://github.com/soybeanjs/soybean-admin/commit/1a6be00)
  - globalSearch add i18n &nbsp;-&nbsp; by **燕博文** [<samp>(0126d)</samp>](https://github.com/soybeanjs/soybean-admin/commit/0126da4)
  - Add route meta parameter:fixedQuery &nbsp;-&nbsp; by @Azir-11 [<samp>(874aa)</samp>](https://github.com/soybeanjs/soybean-admin/commit/874aaca)
  - update &nbsp;-&nbsp; by @honghuangdc [<samp>(4158a)</samp>](https://github.com/soybeanjs/soybean-admin/commit/4158a72)
  - change borderRadius to 6px of naiveUI &nbsp;-&nbsp; by @honghuangdc [<samp>(49558)</samp>](https://github.com/soybeanjs/soybean-admin/commit/49558ca)
  - pef manage role &nbsp;-&nbsp; by @honghuangdc [<samp>(18709)</samp>](https://github.com/soybeanjs/soybean-admin/commit/1870981)
  - login page: code-login &nbsp;-&nbsp; by @honghuangdc [<samp>(c91dd)</samp>](https://github.com/soybeanjs/soybean-admin/commit/c91dd28)
  - login page: register &nbsp;-&nbsp; by @honghuangdc [<samp>(1ed33)</samp>](https://github.com/soybeanjs/soybean-admin/commit/1ed33dc)
  - add request refresh token & logout &nbsp;-&nbsp; by @honghuangdc [<samp>(11a6a)</samp>](https://github.com/soybeanjs/soybean-admin/commit/11a6a3b)
  - add request exception example page &nbsp;-&nbsp; by @honghuangdc [<samp>(41e8b)</samp>](https://github.com/soybeanjs/soybean-admin/commit/41e8bc4)
  - add auth example &nbsp;-&nbsp; by @honghuangdc [<samp>(c11d5)</samp>](https://github.com/soybeanjs/soybean-admin/commit/c11d56d)
- **router**:
  - add sortRoutesByOrder function &nbsp;-&nbsp; by @Azir-11 [<samp>(0cf09)</samp>](https://github.com/soybeanjs/soybean-admin/commit/0cf09ba)

### &nbsp;&nbsp;&nbsp;🐞 Bug Fixes

- **components**:
  - fix tooltip zIndex of ButtonIcon &nbsp;-&nbsp; by @honghuangdc [<samp>(99097)</samp>](https://github.com/soybeanjs/soybean-admin/commit/99097b4)
  - supplement the `NaiveUI` type &nbsp;-&nbsp; by **tnt group** [<samp>(ccc2b)</samp>](https://github.com/soybeanjs/soybean-admin/commit/ccc2b67)
  - fix homeTab closeRight and disable colseLeft &nbsp;-&nbsp; by **~li** [<samp>(d28bf)</samp>](https://github.com/soybeanjs/soybean-admin/commit/d28bf52)
- **hooks**:
  - Fix Naive Pagination's outdated API &nbsp;-&nbsp; by **tnt group** [<samp>(37436)</samp>](https://github.com/soybeanjs/soybean-admin/commit/3743612)
- **projects**:
  - 修复路由命名为包含关系时导致导航数据出错的问题 &nbsp;-&nbsp; by **pantao** [<samp>(76636)</samp>](https://github.com/soybeanjs/soybean-admin/commit/766369f)
  - rename zh-ch &nbsp;-&nbsp; by @honghuangdc [<samp>(a8a77)</samp>](https://github.com/soybeanjs/soybean-admin/commit/a8a77ea)
  - Fix welcome notification not closing &nbsp;-&nbsp; by @Azir-11 [<samp>(748cf)</samp>](https://github.com/soybeanjs/soybean-admin/commit/748cfa2)
  - fix i18n vscode settings &nbsp;-&nbsp; by @honghuangdc [<samp>(fbf4c)</samp>](https://github.com/soybeanjs/soybean-admin/commit/fbf4cc4)
  - add duration of login success notification &nbsp;-&nbsp; by @honghuangdc [<samp>(1335d)</samp>](https://github.com/soybeanjs/soybean-admin/commit/1335d47)
  - fix menu indent &nbsp;-&nbsp; by @honghuangdc [<samp>(87143)</samp>](https://github.com/soybeanjs/soybean-admin/commit/8714317)
  - fix theme mode segment &nbsp;-&nbsp; by @honghuangdc [<samp>(2372d)</samp>](https://github.com/soybeanjs/soybean-admin/commit/2372dc9)
  - fix app loading theme color &nbsp;-&nbsp; by @honghuangdc [<samp>(0ba19)</samp>](https://github.com/soybeanjs/soybean-admin/commit/0ba19d5)
  - fix page about style in mobile &nbsp;-&nbsp; by @honghuangdc [<samp>(8b6de)</samp>](https://github.com/soybeanjs/soybean-admin/commit/8b6de48)
  - fix themeDrawer darkMode segement &nbsp;-&nbsp; by @honghuangdc [<samp>(1b5ca)</samp>](https://github.com/soybeanjs/soybean-admin/commit/1b5caa0)
  - fix themeDrawer copy &nbsp;-&nbsp; by @honghuangdc [<samp>(b3779)</samp>](https://github.com/soybeanjs/soybean-admin/commit/b3779a6)
  - remove space in tab content &nbsp;-&nbsp; by @honghuangdc [<samp>(4aae6)</samp>](https://github.com/soybeanjs/soybean-admin/commit/4aae6a5)
  - fix horizontal menu &nbsp;-&nbsp; by @honghuangdc [<samp>(d886e)</samp>](https://github.com/soybeanjs/soybean-admin/commit/d886e50)
  - perf card style &nbsp;-&nbsp; by @honghuangdc [<samp>(c1afb)</samp>](https://github.com/soybeanjs/soybean-admin/commit/c1afb9d)
  - fix manage_user title &nbsp;-&nbsp; by @honghuangdc [<samp>(7770b)</samp>](https://github.com/soybeanjs/soybean-admin/commit/7770b37)
  - default proxy prefix &nbsp;-&nbsp; by @smileluck [<samp>(da246)</samp>](https://github.com/soybeanjs/soybean-admin/commit/da24642)
  - fix request msg &nbsp;-&nbsp; by @honghuangdc [<samp>(ae6b6)</samp>](https://github.com/soybeanjs/soybean-admin/commit/ae6b613)
  - Fix the issue of tab error displaying parent localIcon &nbsp;-&nbsp; by @Azir-11 [<samp>(a9c98)</samp>](https://github.com/soybeanjs/soybean-admin/commit/a9c98d9)
  - The matched value of TabRoute should be optional &nbsp;-&nbsp; by @Azir-11 [<samp>(e6fed)</samp>](https://github.com/soybeanjs/soybean-admin/commit/e6fed1f)
  - fix build [unocss]: build failed to load icon "close", fixed #319 &nbsp;-&nbsp; by @honghuangdc in https://github.com/soybeanjs/soybean-admin/issues/319 [<samp>(c18d8)</samp>](https://github.com/soybeanjs/soybean-admin/commit/c18d82f)
  - fix resolve alias &nbsp;-&nbsp; by @honghuangdc [<samp>(3bdcb)</samp>](https://github.com/soybeanjs/soybean-admin/commit/3bdcbc7)
  - Missing default value for tab icon &nbsp;-&nbsp; by @Azir-11 [<samp>(72a46)</samp>](https://github.com/soybeanjs/soybean-admin/commit/72a4679)
  - add route icon: fucntion_hide-child &nbsp;-&nbsp; by @honghuangdc [<samp>(0a3ef)</samp>](https://github.com/soybeanjs/soybean-admin/commit/0a3efe3)
  - fix table x-scroll. fixed #324 &nbsp;-&nbsp; by @honghuangdc in https://github.com/soybeanjs/soybean-admin/issues/324 [<samp>(c7e2c)</samp>](https://github.com/soybeanjs/soybean-admin/commit/c7e2c55)
  - Fix the logic of root route redirection to home &nbsp;-&nbsp; by **恕瑞玛的皇帝** [<samp>(0123c)</samp>](https://github.com/soybeanjs/soybean-admin/commit/0123c37)
  - Fix homepage mount error under dynamic routing &nbsp;-&nbsp; by **恕瑞玛的皇帝** [<samp>(9cf2a)</samp>](https://github.com/soybeanjs/soybean-admin/commit/9cf2a51)
  - fix repeat home tab &nbsp;-&nbsp; by @honghuangdc [<samp>(bccd6)</samp>](https://github.com/soybeanjs/soybean-admin/commit/bccd6cb)
  - fix proxy config &nbsp;-&nbsp; by @honghuangdc [<samp>(c8019)</samp>](https://github.com/soybeanjs/soybean-admin/commit/c8019c4)
  - fix proxy config &nbsp;-&nbsp; by @honghuangdc [<samp>(ffc95)</samp>](https://github.com/soybeanjs/soybean-admin/commit/ffc95d2)
  - fix table row-key ts type &nbsp;-&nbsp; by @honghuangdc [<samp>(0cc8f)</samp>](https://github.com/soybeanjs/soybean-admin/commit/0cc8f05)
  - fix class name conflict with unocss icon &nbsp;-&nbsp; by @honghuangdc [<samp>(455e4)</samp>](https://github.com/soybeanjs/soybean-admin/commit/455e48f)
  - fix repeat routes &nbsp;-&nbsp; by @honghuangdc [<samp>(2c543)</samp>](https://github.com/soybeanjs/soybean-admin/commit/2c543f1)
  - fix route init &nbsp;-&nbsp; by @honghuangdc [<samp>(23a40)</samp>](https://github.com/soybeanjs/soybean-admin/commit/23a4098)

### &nbsp;&nbsp;&nbsp;🔥 Performance

- **components**:
  - Optimize internationalized menu search code &nbsp;-&nbsp; by **燕博文** [<samp>(8c1ef)</samp>](https://github.com/soybeanjs/soybean-admin/commit/8c1ef4b)
  - Optimize menu search code &nbsp;-&nbsp; by **燕博文** [<samp>(296a2)</samp>](https://github.com/soybeanjs/soybean-admin/commit/296a2d2)
  - perf count-to &nbsp;-&nbsp; by @honghuangdc [<samp>(b2c61)</samp>](https://github.com/soybeanjs/soybean-admin/commit/b2c61f0)
  - components  name is converted to uppercase &nbsp;-&nbsp; by **燕博文** [<samp>(04aa1)</samp>](https://github.com/soybeanjs/soybean-admin/commit/04aa10b)
  - perf global-search &nbsp;-&nbsp; by @honghuangdc [<samp>(72745)</samp>](https://github.com/soybeanjs/soybean-admin/commit/7274522)
- **projects**:
  - perf code &nbsp;-&nbsp; by @honghuangdc [<samp>(8081e)</samp>](https://github.com/soybeanjs/soybean-admin/commit/8081e19)
  - env config &nbsp;-&nbsp; by @honghuangdc [<samp>(1bac3)</samp>](https://github.com/soybeanjs/soybean-admin/commit/1bac3b7)
  - add detailed annotations for route role &nbsp;-&nbsp; by @honghuangdc [<samp>(f6bab)</samp>](https://github.com/soybeanjs/soybean-admin/commit/f6bab0c)
  - perf code &nbsp;-&nbsp; by @honghuangdc [<samp>(5c49d)</samp>](https://github.com/soybeanjs/soybean-admin/commit/5c49d24)
  - remove useless file &nbsp;-&nbsp; by @honghuangdc [<samp>(c624f)</samp>](https://github.com/soybeanjs/soybean-admin/commit/c624f32)
  - remove @soybeanjs/cli &nbsp;-&nbsp; by @honghuangdc [<samp>(41349)</samp>](https://github.com/soybeanjs/soybean-admin/commit/4134955)
  - echarts loading style &nbsp;-&nbsp; by @honghuangdc [<samp>(456c3)</samp>](https://github.com/soybeanjs/soybean-admin/commit/456c318)
  - perf page manage_role, useTable &nbsp;-&nbsp; by @honghuangdc [<samp>(39aa7)</samp>](https://github.com/soybeanjs/soybean-admin/commit/39aa7aa)
  - perf table columns style &nbsp;-&nbsp; by @honghuangdc [<samp>(babdb)</samp>](https://github.com/soybeanjs/soybean-admin/commit/babdb5d)
  - perf page manage_menu style &nbsp;-&nbsp; by @honghuangdc [<samp>(0aa75)</samp>](https://github.com/soybeanjs/soybean-admin/commit/0aa75c0)
  - perf code &nbsp;-&nbsp; by @honghuangdc [<samp>(7fa87)</samp>](https://github.com/soybeanjs/soybean-admin/commit/7fa87f5)
  - perf code &nbsp;-&nbsp; by @honghuangdc [<samp>(05db8)</samp>](https://github.com/soybeanjs/soybean-admin/commit/05db8c0)
  - perf code &nbsp;-&nbsp; by @honghuangdc [<samp>(dc24a)</samp>](https://github.com/soybeanjs/soybean-admin/commit/dc24a36)
  - perf manage page style &nbsp;-&nbsp; by @honghuangdc [<samp>(779ba)</samp>](https://github.com/soybeanjs/soybean-admin/commit/779ba4e)
  - perf manage menu &nbsp;-&nbsp; by @honghuangdc [<samp>(71f2c)</samp>](https://github.com/soybeanjs/soybean-admin/commit/71f2c55)
  - manage menu: add transform to component &nbsp;-&nbsp; by @honghuangdc [<samp>(0abbf)</samp>](https://github.com/soybeanjs/soybean-admin/commit/0abbfa5)

### &nbsp;&nbsp;&nbsp;💅 Refactors

- **projects**:
  - remove plugin-web-update-notification &nbsp;-&nbsp; by @honghuangdc [<samp>(f6c6d)</samp>](https://github.com/soybeanjs/soybean-admin/commit/f6c6dbd)
  - fix conflict with locale file &nbsp;-&nbsp; by @honghuangdc [<samp>(3346b)</samp>](https://github.com/soybeanjs/soybean-admin/commit/3346bcd)
  - refactor app-loading &nbsp;-&nbsp; by @honghuangdc [<samp>(b4f3d)</samp>](https://github.com/soybeanjs/soybean-admin/commit/b4f3dd2)
  - use naive-ui color-picker &nbsp;-&nbsp; by @honghuangdc [<samp>(b5551)</samp>](https://github.com/soybeanjs/soybean-admin/commit/b5551d6)
  - perf page home &nbsp;-&nbsp; by @honghuangdc [<samp>(4c61c)</samp>](https://github.com/soybeanjs/soybean-admin/commit/4c61c6f)
  - login components => modules &nbsp;-&nbsp; by @honghuangdc [<samp>(59bec)</samp>](https://github.com/soybeanjs/soybean-admin/commit/59bec2d)
  - perf page function_tab &nbsp;-&nbsp; by @honghuangdc [<samp>(b5477)</samp>](https://github.com/soybeanjs/soybean-admin/commit/b5477e8)
  - update mock api &nbsp;-&nbsp; by @honghuangdc [<samp>(27241)</samp>](https://github.com/soybeanjs/soybean-admin/commit/2724169)
  - page manage_role: extract module &nbsp;-&nbsp; by @honghuangdc [<samp>(0e9e2)</samp>](https://github.com/soybeanjs/soybean-admin/commit/0e9e2e1)
  - perf page manage_role &nbsp;-&nbsp; by @honghuangdc [<samp>(a19f8)</samp>](https://github.com/soybeanjs/soybean-admin/commit/a19f895)
  - manage_route => manage_menu &nbsp;-&nbsp; by @honghuangdc [<samp>(f8467)</samp>](https://github.com/soybeanjs/soybean-admin/commit/f8467ce)
  - refactor service env config &nbsp;-&nbsp; by @honghuangdc [<samp>(43193)</samp>](https://github.com/soybeanjs/soybean-admin/commit/43193e2)
  - refactor unocss shortcuts: wh-full => size-full &nbsp;-&nbsp; by @honghuangdc [<samp>(b4c00)</samp>](https://github.com/soybeanjs/soybean-admin/commit/b4c00ce)
  - use enquirer replace prompts &nbsp;-&nbsp; by @honghuangdc [<samp>(b546f)</samp>](https://github.com/soybeanjs/soybean-admin/commit/b546ff8)
  - refactor useTable &nbsp;-&nbsp; by @honghuangdc [<samp>(c3efa)</samp>](https://github.com/soybeanjs/soybean-admin/commit/c3efa1b)
  - finish refactor useTable &nbsp;-&nbsp; by @honghuangdc [<samp>(86301)</samp>](https://github.com/soybeanjs/soybean-admin/commit/8630175)
  - finish refactor useTable and apply &nbsp;-&nbsp; by @honghuangdc [<samp>(3fd15)</samp>](https://github.com/soybeanjs/soybean-admin/commit/3fd15e5)
  - perf code &nbsp;-&nbsp; by @honghuangdc [<samp>(f91ef)</samp>](https://github.com/soybeanjs/soybean-admin/commit/f91ef30)
  - new route guard &nbsp;-&nbsp; by @honghuangdc [<samp>(37d20)</samp>](https://github.com/soybeanjs/soybean-admin/commit/37d20b8)

### &nbsp;&nbsp;&nbsp;📖 Documentation

- **projects**:
  - update README.md &nbsp;-&nbsp; by @honghuangdc [<samp>(78364)</samp>](https://github.com/soybeanjs/soybean-admin/commit/783648f)
  - update README.md &nbsp;-&nbsp; by @honghuangdc [<samp>(1ea48)</samp>](https://github.com/soybeanjs/soybean-admin/commit/1ea4817)
  - add README &nbsp;-&nbsp; by @honghuangdc [<samp>(2371b)</samp>](https://github.com/soybeanjs/soybean-admin/commit/2371ba8)
  - update README &nbsp;-&nbsp; by @honghuangdc [<samp>(d16a9)</samp>](https://github.com/soybeanjs/soybean-admin/commit/d16a9d5)
  - update README.md &nbsp;-&nbsp; by @honghuangdc [<samp>(6a771)</samp>](https://github.com/soybeanjs/soybean-admin/commit/6a771ea)
  - update README.md &nbsp;-&nbsp; by @honghuangdc [<samp>(57b6d)</samp>](https://github.com/soybeanjs/soybean-admin/commit/57b6d8a)
  - update README.md &nbsp;-&nbsp; by @honghuangdc [<samp>(b30c0)</samp>](https://github.com/soybeanjs/soybean-admin/commit/b30c035)
  - update README.md &nbsp;-&nbsp; by @honghuangdc [<samp>(c260f)</samp>](https://github.com/soybeanjs/soybean-admin/commit/c260fe2)
  - update README.md &nbsp;-&nbsp; by @honghuangdc [<samp>(03c42)</samp>](https://github.com/soybeanjs/soybean-admin/commit/03c42aa)
  - update README.md &nbsp;-&nbsp; by @honghuangdc [<samp>(0fae9)</samp>](https://github.com/soybeanjs/soybean-admin/commit/0fae993)
  - update README.md &nbsp;-&nbsp; by @honghuangdc [<samp>(4e4d2)</samp>](https://github.com/soybeanjs/soybean-admin/commit/4e4d2de)
  - update README.md &nbsp;-&nbsp; by @honghuangdc [<samp>(86b44)</samp>](https://github.com/soybeanjs/soybean-admin/commit/86b445c)
  - update README.md &nbsp;-&nbsp; by @honghuangdc [<samp>(e2085)</samp>](https://github.com/soybeanjs/soybean-admin/commit/e2085e0)
  - update README.md &nbsp;-&nbsp; by @honghuangdc [<samp>(6ea9b)</samp>](https://github.com/soybeanjs/soybean-admin/commit/6ea9b85)
  - update README.md &nbsp;-&nbsp; by @honghuangdc [<samp>(ef4af)</samp>](https://github.com/soybeanjs/soybean-admin/commit/ef4af79)
  - update README.md &nbsp;-&nbsp; by @honghuangdc [<samp>(41830)</samp>](https://github.com/soybeanjs/soybean-admin/commit/418302a)
  - add CHANGELOG.md &nbsp;-&nbsp; by @honghuangdc [<samp>(46b61)</samp>](https://github.com/soybeanjs/soybean-admin/commit/46b6156)

### &nbsp;&nbsp;&nbsp;🏡 Chore

- **deps**:
  - update deps &nbsp;-&nbsp; by @honghuangdc [<samp>(3eaf0)</samp>](https://github.com/soybeanjs/soybean-admin/commit/3eaf05b)
  - update deps &nbsp;-&nbsp; by @honghuangdc [<samp>(36fe1)</samp>](https://github.com/soybeanjs/soybean-admin/commit/36fe1da)
  - update deps &nbsp;-&nbsp; by @honghuangdc [<samp>(55342)</samp>](https://github.com/soybeanjs/soybean-admin/commit/5534294)
  - update deps &nbsp;-&nbsp; by @honghuangdc [<samp>(f1b86)</samp>](https://github.com/soybeanjs/soybean-admin/commit/f1b86cc)
  - update deps &nbsp;-&nbsp; by @honghuangdc [<samp>(840e7)</samp>](https://github.com/soybeanjs/soybean-admin/commit/840e7f9)
  - update deps &nbsp;-&nbsp; by @honghuangdc [<samp>(6114b)</samp>](https://github.com/soybeanjs/soybean-admin/commit/6114b9f)
  - update deps &nbsp;-&nbsp; by @honghuangdc [<samp>(9cc7e)</samp>](https://github.com/soybeanjs/soybean-admin/commit/9cc7ee5)
  - update deps &nbsp;-&nbsp; by @honghuangdc [<samp>(9c4ba)</samp>](https://github.com/soybeanjs/soybean-admin/commit/9c4ba66)
  - update deps &nbsp;-&nbsp; by @honghuangdc [<samp>(fb3b9)</samp>](https://github.com/soybeanjs/soybean-admin/commit/fb3b94b)
  - update deps &nbsp;-&nbsp; by @honghuangdc [<samp>(14aa8)</samp>](https://github.com/soybeanjs/soybean-admin/commit/14aa856)
  - update deps &nbsp;-&nbsp; by @honghuangdc [<samp>(02d4b)</samp>](https://github.com/soybeanjs/soybean-admin/commit/02d4b0a)
  - update deps &nbsp;-&nbsp; by @honghuangdc [<samp>(b2ee9)</samp>](https://github.com/soybeanjs/soybean-admin/commit/b2ee9ee)
  - update deps &nbsp;-&nbsp; by @honghuangdc [<samp>(0fee1)</samp>](https://github.com/soybeanjs/soybean-admin/commit/0fee104)
  - update deps &nbsp;-&nbsp; by @honghuangdc [<samp>(c0a65)</samp>](https://github.com/soybeanjs/soybean-admin/commit/c0a65a1)
- **project**:
  - delete src/locales/lang/zh-CN.ts &nbsp;-&nbsp; by @honghuangdc [<samp>(377db)</samp>](https://github.com/soybeanjs/soybean-admin/commit/377db82)
- **projects**:
  - use eslint flat config & update config &nbsp;-&nbsp; by @honghuangdc [<samp>(a176d)</samp>](https://github.com/soybeanjs/soybean-admin/commit/a176dc4)
  - update @sa/scripts &nbsp;-&nbsp; by @honghuangdc [<samp>(d7785)</samp>](https://github.com/soybeanjs/soybean-admin/commit/d778560)
  - update pnpm version &nbsp;-&nbsp; by @honghuangdc [<samp>(55f76)</samp>](https://github.com/soybeanjs/soybean-admin/commit/55f7638)
  - update eslint config &nbsp;-&nbsp; by @honghuangdc [<samp>(5023f)</samp>](https://github.com/soybeanjs/soybean-admin/commit/5023f37)
  - lock deps versions &nbsp;-&nbsp; by @honghuangdc [<samp>(a24f9)</samp>](https://github.com/soybeanjs/soybean-admin/commit/a24f963)
  - update pnpm version &nbsp;-&nbsp; by @honghuangdc [<samp>(ea02b)</samp>](https://github.com/soybeanjs/soybean-admin/commit/ea02b23)
  - remove @simonwep/pickr &nbsp;-&nbsp; by @honghuangdc [<samp>(502a4)</samp>](https://github.com/soybeanjs/soybean-admin/commit/502a4d2)
  - remove soybean.svg &nbsp;-&nbsp; by @honghuangdc [<samp>(4031f)</samp>](https://github.com/soybeanjs/soybean-admin/commit/4031faf)
  - update pnpm version &nbsp;-&nbsp; by @honghuangdc [<samp>(adec0)</samp>](https://github.com/soybeanjs/soybean-admin/commit/adec0d7)
  - update deps & fix keep-alive &nbsp;-&nbsp; by @honghuangdc [<samp>(13001)</samp>](https://github.com/soybeanjs/soybean-admin/commit/13001bc)
  - update @elegant-router/vue, fix inject name in windows &nbsp;-&nbsp; by @honghuangdc [<samp>(0b56e)</samp>](https://github.com/soybeanjs/soybean-admin/commit/0b56e44)
  - add dev and build command with service env &nbsp;-&nbsp; by @honghuangdc [<samp>(ebb15)</samp>](https://github.com/soybeanjs/soybean-admin/commit/ebb1548)
  - update deps & remove packages docs &nbsp;-&nbsp; by @honghuangdc [<samp>(57963)</samp>](https://github.com/soybeanjs/soybean-admin/commit/579636b)
  - update pnpm-lock.yaml &nbsp;-&nbsp; by @honghuangdc [<samp>(147f6)</samp>](https://github.com/soybeanjs/soybean-admin/commit/147f60d)
  - update repository url &nbsp;-&nbsp; by @honghuangdc [<samp>(806a1)</samp>](https://github.com/soybeanjs/soybean-admin/commit/806a1cb)
  - update deps & update pnpm version &nbsp;-&nbsp; by @honghuangdc [<samp>(9772a)</samp>](https://github.com/soybeanjs/soybean-admin/commit/9772aec)
  - add unocss eslint config &nbsp;-&nbsp; by @honghuangdc [<samp>(40635)</samp>](https://github.com/soybeanjs/soybean-admin/commit/4063529)
  - update launch.json &nbsp;-&nbsp; by @honghuangdc [<samp>(3db82)</samp>](https://github.com/soybeanjs/soybean-admin/commit/3db82ac)
  - update vscode extensions.json &nbsp;-&nbsp; by @honghuangdc [<samp>(4e29a)</samp>](https://github.com/soybeanjs/soybean-admin/commit/4e29aca)
  - update pnpm version &nbsp;-&nbsp; by @honghuangdc [<samp>(7065f)</samp>](https://github.com/soybeanjs/soybean-admin/commit/7065f6f)
  - update deps & fix eslint vue rule &nbsp;-&nbsp; by @honghuangdc [<samp>(8143b)</samp>](https://github.com/soybeanjs/soybean-admin/commit/8143b00)
  - update pnpm version &nbsp;-&nbsp; by @honghuangdc [<samp>(6ad51)</samp>](https://github.com/soybeanjs/soybean-admin/commit/6ad51e9)

### &nbsp;&nbsp;&nbsp;🎨 Styles

- **components**:
  - Uniform icon size for header &nbsp;-&nbsp; by @Azir-11 [<samp>(b37c1)</samp>](https://github.com/soybeanjs/soybean-admin/commit/b37c1e9)
- **projects**:
  - format code &nbsp;-&nbsp; by @honghuangdc [<samp>(a7481)</samp>](https://github.com/soybeanjs/soybean-admin/commit/a748166)
  - update theme mode segment height &nbsp;-&nbsp; by @honghuangdc [<samp>(4d846)</samp>](https://github.com/soybeanjs/soybean-admin/commit/4d8469e)
  - fix tooltip zIndex of ButtonIcon &nbsp;-&nbsp; by @honghuangdc [<samp>(db747)</samp>](https://github.com/soybeanjs/soybean-admin/commit/db747c4)
  - sort defineProps, defineEmits with TS type &nbsp;-&nbsp; by @honghuangdc [<samp>(123fd)</samp>](https://github.com/soybeanjs/soybean-admin/commit/123fd4f)

### &nbsp;&nbsp;&nbsp;🤖 CI

- **projects**: add github actions config &nbsp;-&nbsp; by @honghuangdc [<samp>(4cb17)</samp>](https://github.com/soybeanjs/soybean-admin/commit/4cb17c7)

### &nbsp;&nbsp;&nbsp;❤️ Contributors

[![honghuangdc](https://github.com/honghuangdc.png?size=48)](https://github.com/honghuangdc)&nbsp;&nbsp;[![Azir-11](https://github.com/Azir-11.png?size=48)](https://github.com/Azir-11)&nbsp;&nbsp;[![smileluck](https://github.com/smileluck.png?size=48)](https://github.com/smileluck)&nbsp;&nbsp;[![Particaly](https://github.com/Particaly.png?size=48)](https://github.com/Particaly)&nbsp;&nbsp;
[~li](mailto:miciili-02@outlook.com),&nbsp;[Azir-11](mailto:2075125282@qq.com),&nbsp;[燕博文](mailto:349952469@qq.com),&nbsp;[tnt group](mailto:dodu@live.cn),&nbsp;[Kori](mailto:kexin@korix.top),&nbsp;

## [v0.10.4](https://github.com/honghuangdc/soybean-admin/compare/v0.10.3...v0.10.4) (23-09-20)

### &nbsp;&nbsp;&nbsp;🚀 Features

- **auth**:
  - 防止多次刷新token &nbsp;-&nbsp; by @eAliwei [<samp>(0eaa3)</samp>](https://github.com/honghuangdc/soybean-admin/commit/0eaa327)
- **hooks**:
  - add useHookTable &nbsp;-&nbsp; by @honghuangdc [<samp>(b3ae7)</samp>](https://github.com/honghuangdc/soybean-admin/commit/b3ae760)
- **projects**:
  - add websocket demo &nbsp;-&nbsp; by @honghuangdc [<samp>(af53e)</samp>](https://github.com/honghuangdc/soybean-admin/commit/af53ec7)
  - add switch for customize darkmode transition &nbsp;-&nbsp; by @honghuangdc [<samp>(6e0cc)</samp>](https://github.com/honghuangdc/soybean-admin/commit/6e0cce4)
  - new i18n function $t & login page and setting drawer config i18n &nbsp;-&nbsp; by @honghuangdc [<samp>(854d0)</samp>](https://github.com/honghuangdc/soybean-admin/commit/854d0bc)
  - add plugin-web-update-notification &nbsp;-&nbsp; by @honghuangdc [<samp>(c9164)</samp>](https://github.com/honghuangdc/soybean-admin/commit/c91644b)

### &nbsp;&nbsp;&nbsp;🐞 Bug Fixes

- **components**:
  - 修复动态路由主页404 &nbsp;-&nbsp; by @lapislazulisch [<samp>(3ae19)</samp>](https://github.com/honghuangdc/soybean-admin/commit/3ae1952)
  - 修复动态路由home页404 &nbsp;-&nbsp; by @lapislazulisch [<samp>(ad6ac)</samp>](https://github.com/honghuangdc/soybean-admin/commit/ad6ac72)
- **projects**:
  - fix set tab title (fixed #256) &nbsp;-&nbsp; by @honghuangdc in https://github.com/honghuangdc/soybean-admin/issues/256 [<samp>(13f6c)</samp>](https://github.com/honghuangdc/soybean-admin/commit/13f6cd8)
  - correct the lang file name & add recommend vscode plugin i18n-ally &nbsp;-&nbsp; by @honghuangdc [<samp>(864ec)</samp>](https://github.com/honghuangdc/soybean-admin/commit/864ec47)
  - fix reload button animate &nbsp;-&nbsp; by @honghuangdc [<samp>(41f23)</samp>](https://github.com/honghuangdc/soybean-admin/commit/41f2338)
- **styles**:
  - 用户管理页面布局自适应屏幕高度 (fixed #253) &nbsp;-&nbsp; by @honghuangdc in https://github.com/honghuangdc/soybean-admin/issues/253 [<samp>(0f7b9)</samp>](https://github.com/honghuangdc/soybean-admin/commit/0f7b9d5)

### &nbsp;&nbsp;&nbsp;🔥 Performance

- **hooks**:
  - perf use-table &nbsp;-&nbsp; by @honghuangdc [<samp>(33180)</samp>](https://github.com/honghuangdc/soybean-admin/commit/3318041)
  - perf useHookTable &nbsp;-&nbsp; by @honghuangdc [<samp>(809fa)</samp>](https://github.com/honghuangdc/soybean-admin/commit/809fa85)
- **projects**:
  - add type declaration for document startViewTransition &nbsp;-&nbsp; by @honghuangdc [<samp>(d3ebe)</samp>](https://github.com/honghuangdc/soybean-admin/commit/d3ebe95)

### &nbsp;&nbsp;&nbsp;💅 Refactors

- **projects**:
  - 生产环境缓存主题变更为sessionStorage &nbsp;-&nbsp; by @honghuangdc [<samp>(c46a5)</samp>](https://github.com/honghuangdc/soybean-admin/commit/c46a592)
  - add reCacheRoute method &nbsp;-&nbsp; by @honghuangdc [<samp>(f92ee)</samp>](https://github.com/honghuangdc/soybean-admin/commit/f92ee77)
  - update soybean domain &nbsp;-&nbsp; by @honghuangdc [<samp>(073fd)</samp>](https://github.com/honghuangdc/soybean-admin/commit/073fd16)

### &nbsp;&nbsp;&nbsp;📖 Documentation

- **projects**:
  - update README.md logo &nbsp;-&nbsp; by @honghuangdc [<samp>(19141)</samp>](https://github.com/honghuangdc/soybean-admin/commit/19141a7)
  - update Docker deployment method &nbsp;-&nbsp; by @snowords [<samp>(00da0)</samp>](https://github.com/honghuangdc/soybean-admin/commit/00da000)
  - update git hooks init command &nbsp;-&nbsp; by @snowords [<samp>(7f35e)</samp>](https://github.com/honghuangdc/soybean-admin/commit/7f35e87)
  - update README.md &nbsp;-&nbsp; by @eltociear [<samp>(93ed5)</samp>](https://github.com/honghuangdc/soybean-admin/commit/93ed5ad)

### &nbsp;&nbsp;&nbsp;🏡 Chore

- **deps**:
  - update deps &nbsp;-&nbsp; by @honghuangdc [<samp>(bba68)</samp>](https://github.com/honghuangdc/soybean-admin/commit/bba68bf)
  - update deps &nbsp;-&nbsp; by @honghuangdc [<samp>(0e6d2)</samp>](https://github.com/honghuangdc/soybean-admin/commit/0e6d289)
  - update deps &nbsp;-&nbsp; by @honghuangdc [<samp>(135ce)</samp>](https://github.com/honghuangdc/soybean-admin/commit/135ce77)
  - update deps &nbsp;-&nbsp; by @honghuangdc [<samp>(44ba3)</samp>](https://github.com/honghuangdc/soybean-admin/commit/44ba327)
  - update deps &nbsp;-&nbsp; by @honghuangdc [<samp>(9296e)</samp>](https://github.com/honghuangdc/soybean-admin/commit/9296e69)
  - update deps &nbsp;-&nbsp; by @honghuangdc [<samp>(751de)</samp>](https://github.com/honghuangdc/soybean-admin/commit/751ded4)
  - update deps &nbsp;-&nbsp; by @honghuangdc [<samp>(305d9)</samp>](https://github.com/honghuangdc/soybean-admin/commit/305d956)
- **projects**:
  - update deps and fix swiper &nbsp;-&nbsp; by @honghuangdc [<samp>(9d105)</samp>](https://github.com/honghuangdc/soybean-admin/commit/9d1051b)
  - update package.json &nbsp;-&nbsp; by @honghuangdc [<samp>(d7aea)</samp>](https://github.com/honghuangdc/soybean-admin/commit/d7aea9d)
  - update deps & fix eslint code &nbsp;-&nbsp; by @honghuangdc [<samp>(08e0c)</samp>](https://github.com/honghuangdc/soybean-admin/commit/08e0cf5)
  - update pnpm-lock.yaml &nbsp;-&nbsp; by @honghuangdc [<samp>(94644)</samp>](https://github.com/honghuangdc/soybean-admin/commit/9464473)
  - update VSCode setting &nbsp;-&nbsp; by @honghuangdc [<samp>(56c77)</samp>](https://github.com/honghuangdc/soybean-admin/commit/56c770c)
  - correct the word spell &nbsp;-&nbsp; by @honghuangdc [<samp>(458e3)</samp>](https://github.com/honghuangdc/soybean-admin/commit/458e387)
  - correct word spell & eslint fix code &nbsp;-&nbsp; by @honghuangdc [<samp>(cffc3)</samp>](https://github.com/honghuangdc/soybean-admin/commit/cffc30a)
  - When tab is switched, keep the page without refreshing &nbsp;-&nbsp; by @linjiangl [<samp>(83f25)</samp>](https://github.com/honghuangdc/soybean-admin/commit/83f2514)

### &nbsp;&nbsp;&nbsp;🎨 Styles

- **projects**:
  - unify card border radius, 16px to 8px &nbsp;-&nbsp; by @honghuangdc [<samp>(cbda4)</samp>](https://github.com/honghuangdc/soybean-admin/commit/cbda4a3)
  - update default theme color &nbsp;-&nbsp; by @honghuangdc [<samp>(43ac2)</samp>](https://github.com/honghuangdc/soybean-admin/commit/43ac23f)
  - prettier format code &nbsp;-&nbsp; by @honghuangdc [<samp>(24cf1)</samp>](https://github.com/honghuangdc/soybean-admin/commit/24cf1d9)

### &nbsp;&nbsp;&nbsp;❤️ Contributors

[![honghuangdc](https://github.com/honghuangdc.png?size=48)](https://github.com/honghuangdc)&nbsp;&nbsp;[![eltociear](https://github.com/eltociear.png?size=48)](https://github.com/eltociear)&nbsp;&nbsp;[![linjiangl](https://github.com/linjiangl.png?size=48)](https://github.com/linjiangl)&nbsp;&nbsp;[![lapislazulisch](https://github.com/lapislazulisch.png?size=48)](https://github.com/lapislazulisch)&nbsp;&nbsp;[![snowords](https://github.com/snowords.png?size=48)](https://github.com/snowords)&nbsp;&nbsp;[![eAliwei](https://github.com/eAliwei.png?size=48)](https://github.com/eAliwei)&nbsp;&nbsp;[![honghuangdc](https://github.com/honghuangdc.png?size=48)](https://github.com/honghuangdc)&nbsp;&nbsp;

## [v0.10.3](https://github.com/honghuangdc/soybean-admin/compare/v0.10.2...v0.10.3) (23-06-15)

### &nbsp;&nbsp;&nbsp;🐞 Bug Fixes

- **projects**: fix userRoleOptions &nbsp;-&nbsp; by @soybeanjs [<samp>(2ca2b)</samp>](https://github.com/honghuangdc/soybean-admin/commit/2ca2b76)
- **styles**: fix toggle-lang bg &nbsp;-&nbsp; by @soybeanjs [<samp>(47309)</samp>](https://github.com/honghuangdc/soybean-admin/commit/473095b)

### &nbsp;&nbsp;&nbsp;🔥 Performance

- **projects**:
  - remove useless code &nbsp;-&nbsp; by @soybeanjs [<samp>(eb8e4)</samp>](https://github.com/honghuangdc/soybean-admin/commit/eb8e49e)
  - use transformObjectToOption to generate option of object labels &nbsp;-&nbsp; by @soybeanjs [<samp>(da611)</samp>](https://github.com/honghuangdc/soybean-admin/commit/da611fb)

### &nbsp;&nbsp;&nbsp;📖 Documentation

- **projects**:
  - CHANGELOG.md &nbsp;-&nbsp; by @soybeanjs [<samp>(ff5bf)</samp>](https://github.com/honghuangdc/soybean-admin/commit/ff5bf62)
  - generate full CHANGELOG.md &nbsp;-&nbsp; by @soybeanjs [<samp>(055d4)</samp>](https://github.com/honghuangdc/soybean-admin/commit/055d4cc)
  - update README.md &nbsp;-&nbsp; by @soybeanjs [<samp>(3c7e1)</samp>](https://github.com/honghuangdc/soybean-admin/commit/3c7e1cf)
  - update README.md &nbsp;-&nbsp; by @soybeanjs [<samp>(1681c)</samp>](https://github.com/honghuangdc/soybean-admin/commit/1681c34)
  - update README.md picture url &nbsp;-&nbsp; by @soybeanjs [<samp>(4eefc)</samp>](https://github.com/honghuangdc/soybean-admin/commit/4eefc95)
  - update README.md &nbsp;-&nbsp; by @soybeanjs [<samp>(8f24a)</samp>](https://github.com/honghuangdc/soybean-admin/commit/8f24a94)
  - update CHANGELOG.md by regenerate changelog &nbsp;-&nbsp; by @soybeanjs [<samp>(2a9b7)</samp>](https://github.com/honghuangdc/soybean-admin/commit/2a9b725)

### &nbsp;&nbsp;&nbsp;🏡 Chore

- **deps**:
  - update deps &nbsp;-&nbsp; by @soybeanjs [<samp>(f9d47)</samp>](https://github.com/honghuangdc/soybean-admin/commit/f9d47c0)
  - update deps &nbsp;-&nbsp; by @soybeanjs [<samp>(47ab0)</samp>](https://github.com/honghuangdc/soybean-admin/commit/47ab018)
  - decrease vite-plugin-page-route &nbsp;-&nbsp; by @soybeanjs [<samp>(882f2)</samp>](https://github.com/honghuangdc/soybean-admin/commit/882f281)
  - update deps &nbsp;-&nbsp; by @soybeanjs [<samp>(e6abf)</samp>](https://github.com/honghuangdc/soybean-admin/commit/e6abf93)
- **projects**:
  - remove bumpp & add release script &nbsp;-&nbsp; by @soybeanjs [<samp>(a3dfe)</samp>](https://github.com/honghuangdc/soybean-admin/commit/a3dfe61)
  - update @soybeanjs/cli and generate total changelog &nbsp;-&nbsp; by @soybeanjs [<samp>(58591)</samp>](https://github.com/honghuangdc/soybean-admin/commit/58591f6)
  - update deps & update unocss deprecated api exclude &nbsp;-&nbsp; by @soybeanjs [<samp>(0907d)</samp>](https://github.com/honghuangdc/soybean-admin/commit/0907d38)
  - update deps & update package.json &nbsp;-&nbsp; by @soybeanjs [<samp>(0b2f6)</samp>](https://github.com/honghuangdc/soybean-admin/commit/0b2f68a)
  - add vite-plugin-vue-devtools &nbsp;-&nbsp; by @soybeanjs [<samp>(c1bee)</samp>](https://github.com/honghuangdc/soybean-admin/commit/c1bee40)

### &nbsp;&nbsp;&nbsp;❤️ Contributors

[![soybeanjs](https://github.com/soybeanjs.png?size=48)](https://github.com/soybeanjs)&nbsp;&nbsp;

## [v0.10.2](https://github.com/honghuangdc/soybean-admin/compare/v0.10.1...v0.10.2) (2023-06-01)

### &nbsp;&nbsp;&nbsp;🐞 Bug Fixes

- **components**: fix mix-menu layout when the locale is English (fixed 241) &nbsp;-&nbsp; by @soybeanjs [<samp>(5c085)</samp>](https://github.com/honghuangdc/soybean-admin/commit/5c085a1)

### &nbsp;&nbsp;&nbsp;📖 Documentation

- **projects**:
  - CHANGELOG.md &nbsp;-&nbsp; by @soybeanjs [<samp>(bb2ea)</samp>](https://github.com/honghuangdc/soybean-admin/commit/bb2eab6)
  - update README.md: update example image url [更新示例图片的链接] &nbsp;-&nbsp; by @soybeanjs [<samp>(4f512)</samp>](https://github.com/honghuangdc/soybean-admin/commit/4f51263)
  - fix README.md: example image link &nbsp;-&nbsp; by @soybeanjs [<samp>(56ea8)</samp>](https://github.com/honghuangdc/soybean-admin/commit/56ea893)

### &nbsp;&nbsp;&nbsp;🏡 Chore

- release v0.10.2 &nbsp;-&nbsp; by @soybeanjs [<samp>(1f6d0)</samp>](https://github.com/honghuangdc/soybean-admin/commit/1f6d079)
- **projects**: update deps and use soy lint-staged replace lint-staged &nbsp;-&nbsp; by @soybeanjs [<samp>(9a238)</samp>](https://github.com/honghuangdc/soybean-admin/commit/9a23817)

### &nbsp;&nbsp;&nbsp;❤️ Contributors

[![soybeanjs](https://github.com/soybeanjs.png?size=48)](https://github.com/soybeanjs)&nbsp;&nbsp;

## [v0.10.1](https://github.com/honghuangdc/soybean-admin/compare/v0.10.0...v0.10.1) (2023-05-31)

### &nbsp;&nbsp;&nbsp;📖 Documentation

- **projects**:
  - CHANGELOG.md &nbsp;-&nbsp; by @soybeanjs [<samp>(a2521)</samp>](https://github.com/honghuangdc/soybean-admin/commit/a252138)
  - update README.md &nbsp;-&nbsp; by @soybeanjs [<samp>(b5839)</samp>](https://github.com/honghuangdc/soybean-admin/commit/b5839ea)

### &nbsp;&nbsp;&nbsp;🏡 Chore

- release v0.10.1 &nbsp;-&nbsp; by @soybeanjs [<samp>(44e4c)</samp>](https://github.com/honghuangdc/soybean-admin/commit/44e4c04)
- **projects**: add switch for pageRoute plugin [添加自动生成路由的插件的开关] &nbsp;-&nbsp; by @soybeanjs [<samp>(780ac)</samp>](https://github.com/honghuangdc/soybean-admin/commit/780ac75)

### &nbsp;&nbsp;&nbsp;❤️ Contributors

[![soybeanjs](https://github.com/soybeanjs.png?size=48)](https://github.com/soybeanjs)&nbsp;&nbsp;

## [v0.10.0](https://github.com/honghuangdc/soybean-admin/compare/v0.9.9...v0.10.0) (2023-05-31)

### &nbsp;&nbsp;&nbsp;🚀 Features

- **components**:
  - Add tree related component instances &nbsp;-&nbsp; by **small_happy** [<samp>(d203a)</samp>](https://github.com/honghuangdc/soybean-admin/commit/d203a35)
  - Add routing data related to tree components and page display optimization &nbsp;-&nbsp; by **small_happy** [<samp>(a0f55)</samp>](https://github.com/honghuangdc/soybean-admin/commit/a0f55ac)
- **projects**:
  - 返回顶部功能适配新布局 &nbsp;-&nbsp; by @yanbowe [<samp>(54e2c)</samp>](https://github.com/honghuangdc/soybean-admin/commit/54e2cb5)
  - 增加i18n支持翻译菜单,tab,title &nbsp;-&nbsp; by **cc** [<samp>(3d48a)</samp>](https://github.com/honghuangdc/soybean-admin/commit/3d48aa8)
  - add menu translate [翻译菜单] &nbsp;-&nbsp; by @soybeanjs [<samp>(f6828)</samp>](https://github.com/honghuangdc/soybean-admin/commit/f68285f)
  - 增加主题切换过渡效果 &nbsp;-&nbsp; by **cc** [<samp>(8da88)</samp>](https://github.com/honghuangdc/soybean-admin/commit/8da8843)
  - support mobile layout [支持移动端布局] &nbsp;-&nbsp; by @soybeanjs [<samp>(f2b51)</samp>](https://github.com/honghuangdc/soybean-admin/commit/f2b518e)

### &nbsp;&nbsp;&nbsp;🐞 Bug Fixes

- **projects**:
  - fix router guide [修复路由跳转异常] fixed #216 &nbsp;-&nbsp; by @soybeanjs in https://github.com/honghuangdc/soybean-admin/issues/216 [<samp>(59578)</samp>](https://github.com/honghuangdc/soybean-admin/commit/5957833)
  - fix better-mock usage [修复better-mock用法] &nbsp;-&nbsp; by @soybeanjs [<samp>(c5764)</samp>](https://github.com/honghuangdc/soybean-admin/commit/c57640a)
  - tsconfig missing isolatedModules &nbsp;-&nbsp; by @kirklin [<samp>(ab49a)</samp>](https://github.com/honghuangdc/soybean-admin/commit/ab49afd)
  - fix mockjs [修复mockjs] &nbsp;-&nbsp; by @soybeanjs [<samp>(9b19f)</samp>](https://github.com/honghuangdc/soybean-admin/commit/9b19f96)
  - add prod mockjs switch [添加生产模式的mockjs的开关] &nbsp;-&nbsp; by @soybeanjs [<samp>(9f563)</samp>](https://github.com/honghuangdc/soybean-admin/commit/9f5638f)
  - 修复面包屑导航下拉菜单语言显示问题 &nbsp;-&nbsp; by **cc** [<samp>(ee8fa)</samp>](https://github.com/honghuangdc/soybean-admin/commit/ee8fa04)
  - hide the drawer when it is initial mobile mode [初始化时为移动端布局则隐藏侧边栏] fixed #238 &nbsp;-&nbsp; by @soybeanjs in https://github.com/honghuangdc/soybean-admin/issues/238 [<samp>(0abde)</samp>](https://github.com/honghuangdc/soybean-admin/commit/0abde46)

### &nbsp;&nbsp;&nbsp;🔥 Performance

- **projects**:
  - complete dynamic route translate [补充动态路由的翻译] &nbsp;-&nbsp; by @soybeanjs [<samp>(7b746)</samp>](https://github.com/honghuangdc/soybean-admin/commit/7b746fa)
  - move changing document title by locale to global event of composables & add appLoading unmount &nbsp;-&nbsp; by @soybeanjs [<samp>(08e19)</samp>](https://github.com/honghuangdc/soybean-admin/commit/08e194e)

### &nbsp;&nbsp;&nbsp;💅 Refactors

- **projects**:
  - update useTable &nbsp;-&nbsp; by @soybeanjs [<samp>(211ae)</samp>](https://github.com/honghuangdc/soybean-admin/commit/211ae1f)
  - remove page examples: tree [去除tree相关示例页面] &nbsp;-&nbsp; by @soybeanjs [<samp>(f3090)</samp>](https://github.com/honghuangdc/soybean-admin/commit/f309003)
  - use better-mock replace mockjs [用better-mock替换mockjs] &nbsp;-&nbsp; by @soybeanjs [<samp>(9d3c7)</samp>](https://github.com/honghuangdc/soybean-admin/commit/9d3c732)
  - upgrade vue3.3, official support defineOptions &nbsp;-&nbsp; by @kirklin [<samp>(86a37)</samp>](https://github.com/honghuangdc/soybean-admin/commit/86a370f)

### &nbsp;&nbsp;&nbsp;📖 Documentation

- **projects**:
  - add qq to README.md [文档添加QQ群] &nbsp;-&nbsp; by @soybeanjs [<samp>(f74a6)</samp>](https://github.com/honghuangdc/soybean-admin/commit/f74a642)
  - update README.md [更新README.md] &nbsp;-&nbsp; by @soybeanjs [<samp>(39709)</samp>](https://github.com/honghuangdc/soybean-admin/commit/397092c)
  - update README.md [更新README.md] &nbsp;-&nbsp; by @soybeanjs [<samp>(5a4f8)</samp>](https://github.com/honghuangdc/soybean-admin/commit/5a4f842)
  - update README.md [更新README.md] &nbsp;-&nbsp; by @soybeanjs [<samp>(a765d)</samp>](https://github.com/honghuangdc/soybean-admin/commit/a765da6)
  - update README.md [更新README.md] &nbsp;-&nbsp; by @soybeanjs [<samp>(a989b)</samp>](https://github.com/honghuangdc/soybean-admin/commit/a989b44)
  - 优化README.md &nbsp;-&nbsp; by @greper [<samp>(6ea75)</samp>](https://github.com/honghuangdc/soybean-admin/commit/6ea755f)
  - readme.md 二次开发的项目内容换行 &nbsp;-&nbsp; by @greper [<samp>(f3a17)</samp>](https://github.com/honghuangdc/soybean-admin/commit/f3a1707)
  - update CHANGELOG.md &nbsp;-&nbsp; by @soybeanjs [<samp>(5f6ca)</samp>](https://github.com/honghuangdc/soybean-admin/commit/5f6caab)

### &nbsp;&nbsp;&nbsp;📦 Build

- **deps**:
  - update deps &nbsp;-&nbsp; by @soybeanjs [<samp>(db629)</samp>](https://github.com/honghuangdc/soybean-admin/commit/db62959)
  - update deps [升级依赖] &nbsp;-&nbsp; by @soybeanjs [<samp>(f2e82)</samp>](https://github.com/honghuangdc/soybean-admin/commit/f2e82da)
  - update deps and remove vite-plugin-html [升级依赖，去除vite-plugin-html] &nbsp;-&nbsp; by @soybeanjs [<samp>(eaf36)</samp>](https://github.com/honghuangdc/soybean-admin/commit/eaf3678)
  - update deps [升级依赖] &nbsp;-&nbsp; by @soybeanjs [<samp>(bae17)</samp>](https://github.com/honghuangdc/soybean-admin/commit/bae1767)
  - update deps [升级依赖] &nbsp;-&nbsp; by @soybeanjs [<samp>(c2642)</samp>](https://github.com/honghuangdc/soybean-admin/commit/c264216)
  - update deps [升级依赖] &nbsp;-&nbsp; by @soybeanjs [<samp>(40f85)</samp>](https://github.com/honghuangdc/soybean-admin/commit/40f8587)
- **projects**:
  - remove old layout,tab package [去除旧的布局和页签依赖] &nbsp;-&nbsp; by @soybeanjs [<samp>(42e6d)</samp>](https://github.com/honghuangdc/soybean-admin/commit/42e6de3)
  - update deps and fix type error [升级依赖并修复类型问题] &nbsp;-&nbsp; by @soybeanjs [<samp>(34f02)</samp>](https://github.com/honghuangdc/soybean-admin/commit/34f023c)
  - update deps and fix style [升级依赖&修复代码格式] &nbsp;-&nbsp; by @soybeanjs [<samp>(c1c43)</samp>](https://github.com/honghuangdc/soybean-admin/commit/c1c4335)

### &nbsp;&nbsp;&nbsp;🏡 Chore

- release v0.10.0 &nbsp;-&nbsp; by @soybeanjs [<samp>(270a0)</samp>](https://github.com/honghuangdc/soybean-admin/commit/270a055)
- **deps**: update deps &nbsp;-&nbsp; by @soybeanjs [<samp>(cebbe)</samp>](https://github.com/honghuangdc/soybean-admin/commit/cebbef6)
- **projects**: remove useless packages, update lint-staged config, add githublogen &nbsp;-&nbsp; by @soybeanjs [<samp>(5aaa3)</samp>](https://github.com/honghuangdc/soybean-admin/commit/5aaa318)

### &nbsp;&nbsp;&nbsp;🎨 Styles

- **projects**: per style [完善样式] &nbsp;-&nbsp; by @soybeanjs [<samp>(209ef)</samp>](https://github.com/honghuangdc/soybean-admin/commit/209ef3d)

### &nbsp;&nbsp;&nbsp;❤️ Contributors

[![soybeanjs](https://github.com/soybeanjs.png?size=48)](https://github.com/soybeanjs)&nbsp;&nbsp;[![greper](https://github.com/greper.png?size=48)](https://github.com/greper)&nbsp;&nbsp;[![kirklin](https://github.com/kirklin.png?size=48)](https://github.com/kirklin)&nbsp;&nbsp;[![yanbowe](https://github.com/yanbowe.png?size=48)](https://github.com/yanbowe)&nbsp;&nbsp;
[cc](mailto:cc@qq.com),&nbsp;[small_happy](mailto:5304122+small_happy@user.noreply.gitee.com),&nbsp;

## [v0.9.9](https://github.com/honghuangdc/soybean-admin/compare/v0.9.8...v0.9.9) (2023-03-13)

### &nbsp;&nbsp;&nbsp;🚀 Features

- **hooks**:
  - add useNaiveTable &nbsp;-&nbsp; by @soybeanjs [<samp>(cc13f)</samp>](https://github.com/honghuangdc/soybean-admin/commit/cc13fcc)
- **projects**:
  - custom unocss colors support opacity &nbsp;-&nbsp; by @soybeanjs [<samp>(488e6)</samp>](https://github.com/honghuangdc/soybean-admin/commit/488e6e3)
  - new layout,tab and add update theme settings &nbsp;-&nbsp; by @soybeanjs [<samp>(912c3)</samp>](https://github.com/honghuangdc/soybean-admin/commit/912c353)

### &nbsp;&nbsp;&nbsp;🐞 Bug Fixes

- **components**:
  - 页面跳转被拦截, 则会出现 tab 页签与页面不一致的问题 &nbsp;-&nbsp; by @taisha [<samp>(bd5dd)</samp>](https://github.com/honghuangdc/soybean-admin/commit/bd5dd2c)
  - 修复iconSelect选择器点击事件失效 &nbsp;-&nbsp; by @yanbowe [<samp>(7e505)</samp>](https://github.com/honghuangdc/soybean-admin/commit/7e505f9)
  - refresh cached routes &nbsp;-&nbsp; by @taisha [<samp>(b0f98)</samp>](https://github.com/honghuangdc/soybean-admin/commit/b0f98e4)
- **projects**:
  - fix eslint svg cause incorrect icon render &nbsp;-&nbsp; by @soybeanjs [<samp>(0b5af)</samp>](https://github.com/honghuangdc/soybean-admin/commit/0b5afda)
  - sortRoutes recursively &nbsp;-&nbsp; by @sunhao1256 [<samp>(91889)</samp>](https://github.com/honghuangdc/soybean-admin/commit/9188941)
  - not only `/login` claim dynamic path scenario , but also others , eg:/user/1 &nbsp;-&nbsp; by @sunhao1256 [<samp>(60598)</samp>](https://github.com/honghuangdc/soybean-admin/commit/6059891)
  - the length of routes children list should greater than 0 &nbsp;-&nbsp; by @Shadowsight9 [<samp>(e1afc)</samp>](https://github.com/honghuangdc/soybean-admin/commit/e1afc10)
  - fix pwa logo &nbsp;-&nbsp; by @soybeanjs [<samp>(bf2f6)</samp>](https://github.com/honghuangdc/soybean-admin/commit/bf2f617)
  - fix github bug-report &nbsp;-&nbsp; by @soybeanjs [<samp>(f73e3)</samp>](https://github.com/honghuangdc/soybean-admin/commit/f73e3f6)
- **utils**:
  - make AxiosRequestConfig optional for request.handleDelete() &nbsp;-&nbsp; by @guuuuo [<samp>(4a6fe)</samp>](https://github.com/honghuangdc/soybean-admin/commit/4a6fec8)

### &nbsp;&nbsp;&nbsp;💅 Refactors

- **projects**:
  - all file and folder use kebab-case &nbsp;-&nbsp; by @soybeanjs [<samp>(cea60)</samp>](https://github.com/honghuangdc/soybean-admin/commit/cea600f)
  - update service and proxy config &nbsp;-&nbsp; by @soybeanjs [<samp>(8debf)</samp>](https://github.com/honghuangdc/soybean-admin/commit/8debfe7)
  - remove enum &nbsp;-&nbsp; by @soybeanjs [<samp>(21d52)</samp>](https://github.com/honghuangdc/soybean-admin/commit/21d5214)
  - rename union key &nbsp;-&nbsp; by @soybeanjs [<samp>(e2b32)</samp>](https://github.com/honghuangdc/soybean-admin/commit/e2b320a)

### &nbsp;&nbsp;&nbsp;📖 Documentation

- **projects**:
  - update README.md &nbsp;-&nbsp; by @soybeanjs [<samp>(cf8c7)</samp>](https://github.com/honghuangdc/soybean-admin/commit/cf8c7cb)
  - update README.md &nbsp;-&nbsp; by @soybeanjs [<samp>(1ef1b)</samp>](https://github.com/honghuangdc/soybean-admin/commit/1ef1b6b)
  - update README.md &nbsp;-&nbsp; by @soybeanjs [<samp>(aaef0)</samp>](https://github.com/honghuangdc/soybean-admin/commit/aaef0be)

### &nbsp;&nbsp;&nbsp;📦 Build

- **deps**:
  - update deps &nbsp;-&nbsp; by @soybeanjs [<samp>(61998)</samp>](https://github.com/honghuangdc/soybean-admin/commit/6199888)
- **projects**:
  - update deps and fix project config &nbsp;-&nbsp; by @soybeanjs [<samp>(da521)</samp>](https://github.com/honghuangdc/soybean-admin/commit/da521b3)
  - perf logo &nbsp;-&nbsp; by @soybeanjs [<samp>(a8a6e)</samp>](https://github.com/honghuangdc/soybean-admin/commit/a8a6ed9)
  - update vscode config &nbsp;-&nbsp; by @soybeanjs [<samp>(608d7)</samp>](https://github.com/honghuangdc/soybean-admin/commit/608d7fb)
  - update unocss config &nbsp;-&nbsp; by @soybeanjs [<samp>(3503d)</samp>](https://github.com/honghuangdc/soybean-admin/commit/3503dff)
  - update deps, add prettier format command &nbsp;-&nbsp; by @soybeanjs [<samp>(36e5f)</samp>](https://github.com/honghuangdc/soybean-admin/commit/36e5fea)

### &nbsp;&nbsp;&nbsp;🏡 Chore

- **projects**:
  - add github action &nbsp;-&nbsp; by @lixin59 [<samp>(f355a)</samp>](https://github.com/honghuangdc/soybean-admin/commit/f355a69)
  - 修复issue模板格式问题 &nbsp;-&nbsp; by @lixin59 [<samp>(d8bab)</samp>](https://github.com/honghuangdc/soybean-admin/commit/d8baba5)
- **release**:
  - 0.9.9 &nbsp;-&nbsp; by @soybeanjs [<samp>(c0066)</samp>](https://github.com/honghuangdc/soybean-admin/commit/c0066b2)

### &nbsp;&nbsp;&nbsp;🎨 Styles

- **projects**: format yaml &nbsp;-&nbsp; by @soybeanjs [<samp>(fb46d)</samp>](https://github.com/honghuangdc/soybean-admin/commit/fb46d7e)

### &nbsp;&nbsp;&nbsp;❤️ Contributors

[![soybeanjs](https://github.com/soybeanjs.png?size=48)](https://github.com/soybeanjs)&nbsp;&nbsp;[![guuuuo](https://github.com/guuuuo.png?size=48)](https://github.com/guuuuo)&nbsp;&nbsp;[![lixin59](https://github.com/lixin59.png?size=48)](https://github.com/lixin59)&nbsp;&nbsp;[![taisha](https://github.com/taisha.png?size=48)](https://github.com/taisha)&nbsp;&nbsp;[![Shadowsight9](https://github.com/Shadowsight9.png?size=48)](https://github.com/Shadowsight9)&nbsp;&nbsp;[![sunhao1256](https://github.com/sunhao1256.png?size=48)](https://github.com/sunhao1256)&nbsp;&nbsp;[![yanbowe](https://github.com/yanbowe.png?size=48)](https://github.com/yanbowe)&nbsp;&nbsp;

## [v0.9.8](https://github.com/honghuangdc/soybean-admin/compare/v0.9.7...v0.9.8) (2023-01-15)

### &nbsp;&nbsp;&nbsp;🚀 Features

- setting 页面新增 是否显示footer的开关 &nbsp;-&nbsp; by @zuihou [<samp>(d064f)</samp>](https://github.com/honghuangdc/soybean-admin/commit/d064f62)
- 新增 affix 属性，用于将其固定在tab卡 &nbsp;-&nbsp; by @zuihou [<samp>(e772f)</samp>](https://github.com/honghuangdc/soybean-admin/commit/e772ff0)
- **projects**:
  - add compress script [添加压缩命令] &nbsp;-&nbsp; by @soybeanjs [<samp>(be6d4)</samp>](https://github.com/honghuangdc/soybean-admin/commit/be6d431)
  - add script about generating png logo from [添加根据svg生成png图标的命令] &nbsp;-&nbsp; by @soybeanjs [<samp>(70aee)</samp>](https://github.com/honghuangdc/soybean-admin/commit/70aeefe)
  - add generate logo script &nbsp;-&nbsp; by @soybeanjs [<samp>(25daa)</samp>](https://github.com/honghuangdc/soybean-admin/commit/25daa23)
  - add new route plugin @soybeanjs/vite-plugin-vue-page-route [集成新的路由插件] &nbsp;-&nbsp; by @soybeanjs [<samp>(3131e)</samp>](https://github.com/honghuangdc/soybean-admin/commit/3131e00)

### &nbsp;&nbsp;&nbsp;🐞 Bug Fixes

- remove height limit h-360px &nbsp;-&nbsp; by @codearhat [<samp>(b5c57)</samp>](https://github.com/honghuangdc/soybean-admin/commit/b5c570a)
- set password attributes &nbsp;-&nbsp; by @codearhat [<samp>(a9a37)</samp>](https://github.com/honghuangdc/soybean-admin/commit/a9a3703)
- **components**:
  - 修复路由在path中包含重复路单词径菜单时，被激活会错误展开 &nbsp;-&nbsp; by @shabby2333 [<samp>(264da)</samp>](https://github.com/honghuangdc/soybean-admin/commit/264da00)
- **projects**:
  - fix vite-pwa plugin config &nbsp;-&nbsp; by @soybeanjs [<samp>(94098)</samp>](https://github.com/honghuangdc/soybean-admin/commit/94098d0)
  - add router-page.d.ts to git [将router-page.d.ts添加git提交] &nbsp;-&nbsp; by @soybeanjs [<samp>(7a580)</samp>](https://github.com/honghuangdc/soybean-admin/commit/7a58035)
  - fix router when the dynamic routes api was failed [修复当动态路由接口失败后路由异常问题] &nbsp;-&nbsp; by @soybeanjs [<samp>(f2b58)</samp>](https://github.com/honghuangdc/soybean-admin/commit/f2b580f)
  - fix login success message [修复登录成功的消息提示] &nbsp;-&nbsp; by @soybeanjs [<samp>(81039)</samp>](https://github.com/honghuangdc/soybean-admin/commit/810398a)
  - 修复tabs在static路由模式下可以关闭首页 &nbsp;-&nbsp; by @yanbowe [<samp>(7211a)</samp>](https://github.com/honghuangdc/soybean-admin/commit/7211a17)
  - 修复动态路由模式下路由不排序的问题 &nbsp;-&nbsp; by @HnyLi [<samp>(58b27)</samp>](https://github.com/honghuangdc/soybean-admin/commit/58b27c9)

### &nbsp;&nbsp;&nbsp;💅 Refactors

- **czg**:
  - update cz-git,czg breaking changes &nbsp;-&nbsp; by @yanbowe [<samp>(fcb7a)</samp>](https://github.com/honghuangdc/soybean-admin/commit/fcb7ad9)
- **hooks**:
  - 重构hook函数取消监听方式 &nbsp;-&nbsp; by @yanbowe [<samp>(fd948)</samp>](https://github.com/honghuangdc/soybean-admin/commit/fd94886)
- **projects**:
  - format code style [调整代码格式] &nbsp;-&nbsp; by @soybeanjs [<samp>(a9d58)</samp>](https://github.com/honghuangdc/soybean-admin/commit/a9d58f8)
  - import cz-git, czg replace @soybeanjs/cli [引入cz-git、czg替换@soybeanjs/cli] &nbsp;-&nbsp; by @soybeanjs [<samp>(1bdd8)</samp>](https://github.com/honghuangdc/soybean-admin/commit/1bdd81a)
  - perfect scrollbar style [完善滚动条] &nbsp;-&nbsp; by @soybeanjs [<samp>(1a02c)</samp>](https://github.com/honghuangdc/soybean-admin/commit/1a02cab)
  - refactor app init loading [重构系统初始化的加载] &nbsp;-&nbsp; by @soybeanjs [<samp>(57bfe)</samp>](https://github.com/honghuangdc/soybean-admin/commit/57bfe27)
  - new storage system [新的本地数据存储系统] &nbsp;-&nbsp; by @soybeanjs [<samp>(97191)</samp>](https://github.com/honghuangdc/soybean-admin/commit/9719159)
  - add simple-git-hooks replace husky &nbsp;-&nbsp; by @soybeanjs [<samp>(9110d)</samp>](https://github.com/honghuangdc/soybean-admin/commit/9110d87)

### &nbsp;&nbsp;&nbsp;📖 Documentation

- **projects**:
  - update README &nbsp;-&nbsp; by @soybeanjs [<samp>(828a2)</samp>](https://github.com/honghuangdc/soybean-admin/commit/828a2f5)
  - update README &nbsp;-&nbsp; by @soybeanjs [<samp>(a3562)</samp>](https://github.com/honghuangdc/soybean-admin/commit/a3562d9)

### &nbsp;&nbsp;&nbsp;📦 Build

- **deps**:
  - update deps &nbsp;-&nbsp; by @soybeanjs [<samp>(84567)</samp>](https://github.com/honghuangdc/soybean-admin/commit/8456750)
  - update deps &nbsp;-&nbsp; by @soybeanjs [<samp>(fcc65)</samp>](https://github.com/honghuangdc/soybean-admin/commit/fcc65c3)
  - update deps &nbsp;-&nbsp; by @soybeanjs [<samp>(c097b)</samp>](https://github.com/honghuangdc/soybean-admin/commit/c097b56)
- **projects**:
  - update plugin config &nbsp;-&nbsp; by @soybeanjs [<samp>(6a344)</samp>](https://github.com/honghuangdc/soybean-admin/commit/6a344ff)
  - update deps and perfect the details [升级依赖，完善细节] &nbsp;-&nbsp; by @soybeanjs [<samp>(61a43)</samp>](https://github.com/honghuangdc/soybean-admin/commit/61a43b8)
  - update deps and update config &nbsp;-&nbsp; by @soybeanjs [<samp>(b08c3)</samp>](https://github.com/honghuangdc/soybean-admin/commit/b08c389)
  - update lint-staged config &nbsp;-&nbsp; by @soybeanjs [<samp>(0882c)</samp>](https://github.com/honghuangdc/soybean-admin/commit/0882c25)
  - add VSCode debug config file &nbsp;-&nbsp; by @soybeanjs [<samp>(0c126)</samp>](https://github.com/honghuangdc/soybean-admin/commit/0c12665)
  - update deps &nbsp;-&nbsp; by @soybeanjs [<samp>(f7181)</samp>](https://github.com/honghuangdc/soybean-admin/commit/f71812d)

### &nbsp;&nbsp;&nbsp;🏡 Chore

- **release**: 0.9.8 &nbsp;-&nbsp; by @soybeanjs [<samp>(34ffd)</samp>](https://github.com/honghuangdc/soybean-admin/commit/34ffd9c)

### &nbsp;&nbsp;&nbsp;❤️ Contributors

[![soybeanjs](https://github.com/soybeanjs.png?size=48)](https://github.com/soybeanjs)&nbsp;&nbsp;[![shabby2333](https://github.com/shabby2333.png?size=48)](https://github.com/shabby2333)&nbsp;&nbsp;[![HnyLi](https://github.com/HnyLi.png?size=48)](https://github.com/HnyLi)&nbsp;&nbsp;[![yanbowe](https://github.com/yanbowe.png?size=48)](https://github.com/yanbowe)&nbsp;&nbsp;[![zuihou](https://github.com/zuihou.png?size=48)](https://github.com/zuihou)&nbsp;&nbsp;[![codearhat](https://github.com/codearhat.png?size=48)](https://github.com/codearhat)&nbsp;&nbsp;[![RockerHX](https://github.com/RockerHX.png?size=48)](https://github.com/RockerHX)&nbsp;&nbsp;

## [v0.9.7](https://github.com/honghuangdc/soybean-admin/compare/v0.9.6...v0.9.7) (2022-11-08)

### &nbsp;&nbsp;&nbsp;🚀 Features

- **projects**:
  - 增加系统消息组件 &nbsp;-&nbsp; by @yanbowe [<samp>(afa01)</samp>](https://github.com/honghuangdc/soybean-admin/commit/afa0134)
  - 系统消息组件代码优化 &nbsp;-&nbsp; by @yanbowe [<samp>(95183)</samp>](https://github.com/honghuangdc/soybean-admin/commit/9518372)
  - 增加返回顶部功能 &nbsp;-&nbsp; by @yanbowe [<samp>(894b0)</samp>](https://github.com/honghuangdc/soybean-admin/commit/894b0f1)
  - 添加生产的主题配置缓存 &nbsp;-&nbsp; by @soybeanjs [<samp>(718c3)</samp>](https://github.com/honghuangdc/soybean-admin/commit/718c362)
  - 添加provide、inject上下文示例 &nbsp;-&nbsp; by @soybeanjs [<samp>(a4447)</samp>](https://github.com/honghuangdc/soybean-admin/commit/a444731)
  - 添加组件名称，调整vue文件里面的类型声明位置 &nbsp;-&nbsp; by @soybeanjs [<samp>(f64bc)</samp>](https://github.com/honghuangdc/soybean-admin/commit/f64bc91)
  - 适配移动端，修复Tab关闭图标的bug &nbsp;-&nbsp; by @soybeanjs [<samp>(296b1)</samp>](https://github.com/honghuangdc/soybean-admin/commit/296b154)
  - 添加系统管理的页面 &nbsp;-&nbsp; by @soybeanjs [<samp>(c33b5)</samp>](https://github.com/honghuangdc/soybean-admin/commit/c33b5eb)
  - useNaiveTable函数：类型部分 &nbsp;-&nbsp; by @soybeanjs [<samp>(02992)</samp>](https://github.com/honghuangdc/soybean-admin/commit/02992dc)
  - 添加请求适配adapter层应用的示例页面 &nbsp;-&nbsp; by @soybeanjs [<samp>(8d11a)</samp>](https://github.com/honghuangdc/soybean-admin/commit/8d11a6a)
  - 实现用户管理页面 &nbsp;-&nbsp; by @soybeanjs [<samp>(472f9)</samp>](https://github.com/honghuangdc/soybean-admin/commit/472f93b)
  - 全局搜索菜单及消息通知适配移动端 &nbsp;-&nbsp; by @yanbowe [<samp>(97e2f)</samp>](https://github.com/honghuangdc/soybean-admin/commit/97e2ffd)
  - support constant route without login status[支持未登录状态下访问自定义的固定路由] &nbsp;-&nbsp; by @soybeanjs [<samp>(a5391)</samp>](https://github.com/honghuangdc/soybean-admin/commit/a539112)
  - add pinia setup syntax example: setup-store[添加setup syntax的pinia示例setup-store] &nbsp;-&nbsp; by @soybeanjs [<samp>(82c4b)</samp>](https://github.com/honghuangdc/soybean-admin/commit/82c4b09)
  - add constant route page without login status[添加未登录可访问的固定路由示例页面] &nbsp;-&nbsp; by @soybeanjs [<samp>(78efd)</samp>](https://github.com/honghuangdc/soybean-admin/commit/78efd77)
  - refactor icon system, unify icon usage [重构图标系统，统一图标用法] &nbsp;-&nbsp; by @soybeanjs [<samp>(811f8)</samp>](https://github.com/honghuangdc/soybean-admin/commit/811f820)
  - import i18n [引入i18n] &nbsp;-&nbsp; by @soybeanjs [<samp>(b632b)</samp>](https://github.com/honghuangdc/soybean-admin/commit/b632b7f)
  - new router system [新的路由系统] &nbsp;-&nbsp; by @soybeanjs [<samp>(c7b6a)</samp>](https://github.com/honghuangdc/soybean-admin/commit/c7b6a3f)
- **tabs**:
  - 多页签增加关闭所有 &nbsp;-&nbsp; by @yanbowe [<samp>(8237a)</samp>](https://github.com/honghuangdc/soybean-admin/commit/8237adb)

### &nbsp;&nbsp;&nbsp;🐞 Bug Fixes

- **deps**:
  - decrease @types/node version to fix TS type error [降低@types/node版本修复TS的类型错误] &nbsp;-&nbsp; by @soybeanjs [<samp>(149d2)</samp>](https://github.com/honghuangdc/soybean-admin/commit/149d22a)
- **projects**:
  - 修复tab不显示路由首页的问题 &nbsp;-&nbsp; by @soybeanjs [<samp>(a792b)</samp>](https://github.com/honghuangdc/soybean-admin/commit/a792bb5)
  - 修复多个后端服务时的本地代理 &nbsp;-&nbsp; by @soybeanjs [<samp>(2aba5)</samp>](https://github.com/honghuangdc/soybean-admin/commit/2aba58c)
  - 修复图标的TS类型 &nbsp;-&nbsp; by @soybeanjs [<samp>(dbd67)</samp>](https://github.com/honghuangdc/soybean-admin/commit/dbd6760)
  - 修复import.meta.env的TS类型 &nbsp;-&nbsp; by @soybeanjs [<samp>(19942)</samp>](https://github.com/honghuangdc/soybean-admin/commit/1994262)
  - 修复构建后mockjs对xhr的影响问题 &nbsp;-&nbsp; by @soybeanjs [<samp>(77572)</samp>](https://github.com/honghuangdc/soybean-admin/commit/7757285)
  - 修复TS类型问题 &nbsp;-&nbsp; by @soybeanjs [<samp>(16dce)</samp>](https://github.com/honghuangdc/soybean-admin/commit/16dce9a)
  - 修复eslint规则 &nbsp;-&nbsp; by @soybeanjs [<samp>(d7f5b)</samp>](https://github.com/honghuangdc/soybean-admin/commit/d7f5bf3)
  - add iconify json &nbsp;-&nbsp; by @soybeanjs [<samp>(8a1ec)</samp>](https://github.com/honghuangdc/soybean-admin/commit/8a1ec93)
- **svg-icon**:
  - 自定义图标在Dropdown组件下hover状态无法显示图标 &nbsp;-&nbsp; by @yanbowe [<samp>(0523f)</samp>](https://github.com/honghuangdc/soybean-admin/commit/0523f08)
- **utils**:
  - 修复iconifyRender &nbsp;-&nbsp; by @soybeanjs [<samp>(c37d0)</samp>](https://github.com/honghuangdc/soybean-admin/commit/c37d0ac)

### &nbsp;&nbsp;&nbsp;🔥 Performance

- **components**:
  - 添加更多主题颜色设置模态窗的层级 &nbsp;-&nbsp; by @xiaotao2018 [<samp>(ee7eb)</samp>](https://github.com/honghuangdc/soybean-admin/commit/ee7eb3a)
  - 添加更多主题颜色设置模态窗的层级，z-index为int &nbsp;-&nbsp; by @xiaotao2018 [<samp>(e2d65)</samp>](https://github.com/honghuangdc/soybean-admin/commit/e2d6554)

### &nbsp;&nbsp;&nbsp;💅 Refactors

- **projects**:
  - 代码优化 &nbsp;-&nbsp; by @yanbowe [<samp>(41147)</samp>](https://github.com/honghuangdc/soybean-admin/commit/41147b3)
  - 添加subscribeAppStore &nbsp;-&nbsp; by @soybeanjs [<samp>(aa2f7)</samp>](https://github.com/honghuangdc/soybean-admin/commit/aa2f78a)
  - 代码优化 &nbsp;-&nbsp; by @soybeanjs [<samp>(b60db)</samp>](https://github.com/honghuangdc/soybean-admin/commit/b60db89)
  - 代码优化 &nbsp;-&nbsp; by @soybeanjs [<samp>(61436)</samp>](https://github.com/honghuangdc/soybean-admin/commit/6143605)
  - 请求适配器函数范型重构、优化请求相关的命名 &nbsp;-&nbsp; by @soybeanjs [<samp>(7f9c9)</samp>](https://github.com/honghuangdc/soybean-admin/commit/7f9c98a)
  - 更新搜索弹窗的图标 &nbsp;-&nbsp; by @soybeanjs [<samp>(ed9cd)</samp>](https://github.com/honghuangdc/soybean-admin/commit/ed9cd6c)
  - 抽离格式化相关依赖配置 &nbsp;-&nbsp; by @soybeanjs [<samp>(f4d37)</samp>](https://github.com/honghuangdc/soybean-admin/commit/f4d37cf)
  - 代码优化 &nbsp;-&nbsp; by @soybeanjs [<samp>(49f95)</samp>](https://github.com/honghuangdc/soybean-admin/commit/49f95c4)
  - cancel autoinstall @iconify-json [取消@iconify-json自动安装] &nbsp;-&nbsp; by @soybeanjs [<samp>(c29b8)</samp>](https://github.com/honghuangdc/soybean-admin/commit/c29b887)
  - refactor page: user-management [重构用户管理页面] &nbsp;-&nbsp; by @soybeanjs [<samp>(468b4)</samp>](https://github.com/honghuangdc/soybean-admin/commit/468b4bb)

### &nbsp;&nbsp;&nbsp;📖 Documentation

- **projects**:
  - update README.md &nbsp;-&nbsp; by @soybeanjs [<samp>(e2727)</samp>](https://github.com/honghuangdc/soybean-admin/commit/e2727e6)
  - revert docs &nbsp;-&nbsp; by @soybeanjs [<samp>(2c562)</samp>](https://github.com/honghuangdc/soybean-admin/commit/2c56233)

### &nbsp;&nbsp;&nbsp;📦 Build

- **deps**:
  - update deps &nbsp;-&nbsp; by @soybeanjs [<samp>(69e39)</samp>](https://github.com/honghuangdc/soybean-admin/commit/69e39c1)
  - update deps &nbsp;-&nbsp; by @soybeanjs [<samp>(ea1a3)</samp>](https://github.com/honghuangdc/soybean-admin/commit/ea1a336)
  - update deps &nbsp;-&nbsp; by @soybeanjs [<samp>(73fa3)</samp>](https://github.com/honghuangdc/soybean-admin/commit/73fa3d1)
  - update deps &nbsp;-&nbsp; by @soybeanjs [<samp>(973ab)</samp>](https://github.com/honghuangdc/soybean-admin/commit/973ab14)
  - update deps &nbsp;-&nbsp; by @soybeanjs [<samp>(75000)</samp>](https://github.com/honghuangdc/soybean-admin/commit/750000e)
  - update deps &nbsp;-&nbsp; by @soybeanjs [<samp>(8dcfb)</samp>](https://github.com/honghuangdc/soybean-admin/commit/8dcfbb2)
  - update deps &nbsp;-&nbsp; by @soybeanjs [<samp>(1523c)</samp>](https://github.com/honghuangdc/soybean-admin/commit/1523c7b)
  - update deps &nbsp;-&nbsp; by @soybeanjs [<samp>(da407)</samp>](https://github.com/honghuangdc/soybean-admin/commit/da407b6)
  - update deps &nbsp;-&nbsp; by @soybeanjs [<samp>(cec0f)</samp>](https://github.com/honghuangdc/soybean-admin/commit/cec0f25)
  - update deps &nbsp;-&nbsp; by @soybeanjs [<samp>(d9cfe)</samp>](https://github.com/honghuangdc/soybean-admin/commit/d9cfeab)
  - update deps &nbsp;-&nbsp; by @soybeanjs [<samp>(dd113)</samp>](https://github.com/honghuangdc/soybean-admin/commit/dd11324)
  - update deps &nbsp;-&nbsp; by @soybeanjs [<samp>(d0823)</samp>](https://github.com/honghuangdc/soybean-admin/commit/d0823b0)
  - update deps &nbsp;-&nbsp; by @soybeanjs [<samp>(94ff7)</samp>](https://github.com/honghuangdc/soybean-admin/commit/94ff787)
  - update deps &nbsp;-&nbsp; by @soybeanjs [<samp>(b32bc)</samp>](https://github.com/honghuangdc/soybean-admin/commit/b32bca4)
  - update deps &nbsp;-&nbsp; by @soybeanjs [<samp>(f6b61)</samp>](https://github.com/honghuangdc/soybean-admin/commit/f6b6141)
  - update deps &nbsp;-&nbsp; by @soybeanjs [<samp>(0f0cd)</samp>](https://github.com/honghuangdc/soybean-admin/commit/0f0cd0b)
  - 更新@soybeanjs/eslint-config &nbsp;-&nbsp; by @soybeanjs [<samp>(36f06)</samp>](https://github.com/honghuangdc/soybean-admin/commit/36f06bc)
  - update deps &nbsp;-&nbsp; by @soybeanjs [<samp>(d9324)</samp>](https://github.com/honghuangdc/soybean-admin/commit/d9324f0)
  - update deps &nbsp;-&nbsp; by @soybeanjs [<samp>(1ad92)</samp>](https://github.com/honghuangdc/soybean-admin/commit/1ad92a2)
  - 升级依赖 &nbsp;-&nbsp; by @soybeanjs [<samp>(7240b)</samp>](https://github.com/honghuangdc/soybean-admin/commit/7240be8)
  - update deps &nbsp;-&nbsp; by @soybeanjs [<samp>(c5ba6)</samp>](https://github.com/honghuangdc/soybean-admin/commit/c5ba631)
  - update deps &nbsp;-&nbsp; by @soybeanjs [<samp>(3e0cc)</samp>](https://github.com/honghuangdc/soybean-admin/commit/3e0cc8c)
  - update deps &nbsp;-&nbsp; by @soybeanjs [<samp>(21b6f)</samp>](https://github.com/honghuangdc/soybean-admin/commit/21b6fb6)
  - update deps &nbsp;-&nbsp; by @soybeanjs [<samp>(d823e)</samp>](https://github.com/honghuangdc/soybean-admin/commit/d823ee5)
  - unplugin-vue-define-options替换为unplugin-vue-macros &nbsp;-&nbsp; by @soybeanjs [<samp>(22c90)</samp>](https://github.com/honghuangdc/soybean-admin/commit/22c9025)
  - update deps &nbsp;-&nbsp; by @soybeanjs [<samp>(7dd7c)</samp>](https://github.com/honghuangdc/soybean-admin/commit/7dd7c71)
  - update deps &nbsp;-&nbsp; by @soybeanjs [<samp>(fe8ca)</samp>](https://github.com/honghuangdc/soybean-admin/commit/fe8cab3)
  - unplugin-icon autoinstall @iconify-json [unplugin-icon自动安装@iconify-json] &nbsp;-&nbsp; by @soybeanjs [<samp>(c045e)</samp>](https://github.com/honghuangdc/soybean-admin/commit/c045e3f)
  - update deps [升级依赖] &nbsp;-&nbsp; by @soybeanjs [<samp>(331b1)</samp>](https://github.com/honghuangdc/soybean-admin/commit/331b14e)
  - update deps &nbsp;-&nbsp; by @soybeanjs [<samp>(88e53)</samp>](https://github.com/honghuangdc/soybean-admin/commit/88e535f)
  - update deps &nbsp;-&nbsp; by @soybeanjs [<samp>(89985)</samp>](https://github.com/honghuangdc/soybean-admin/commit/8998581)
  - update deps &nbsp;-&nbsp; by @soybeanjs [<samp>(65ac6)</samp>](https://github.com/honghuangdc/soybean-admin/commit/65ac69e)
  - update deps &nbsp;-&nbsp; by @soybeanjs [<samp>(abd02)</samp>](https://github.com/honghuangdc/soybean-admin/commit/abd02d1)
  - update deps &nbsp;-&nbsp; by @soybeanjs [<samp>(d6b15)</samp>](https://github.com/honghuangdc/soybean-admin/commit/d6b1530)
  - update deps &nbsp;-&nbsp; by @soybeanjs [<samp>(8e801)</samp>](https://github.com/honghuangdc/soybean-admin/commit/8e801dd)
  - update deps &nbsp;-&nbsp; by @soybeanjs [<samp>(41b3b)</samp>](https://github.com/honghuangdc/soybean-admin/commit/41b3bcb)
  - update deps &nbsp;-&nbsp; by @soybeanjs [<samp>(1f3e6)</samp>](https://github.com/honghuangdc/soybean-admin/commit/1f3e6e4)
  - update deps &nbsp;-&nbsp; by @soybeanjs [<samp>(74772)</samp>](https://github.com/honghuangdc/soybean-admin/commit/74772a1)
- **projects**:
  - 代码优化 &nbsp;-&nbsp; by @soybeanjs [<samp>(5c1b0)</samp>](https://github.com/honghuangdc/soybean-admin/commit/5c1b086)
  - update tsconfig &nbsp;-&nbsp; by @soybeanjs [<samp>(9ce58)</samp>](https://github.com/honghuangdc/soybean-admin/commit/9ce5807)
  - update vscode settings &nbsp;-&nbsp; by @soybeanjs [<samp>(3fe4e)</samp>](https://github.com/honghuangdc/soybean-admin/commit/3fe4e92)
  - 添加.gitattributes &nbsp;-&nbsp; by @soybeanjs [<samp>(896e6)</samp>](https://github.com/honghuangdc/soybean-admin/commit/896e6f2)
  - 代码优化 &nbsp;-&nbsp; by @soybeanjs [<samp>(6a9a3)</samp>](https://github.com/honghuangdc/soybean-admin/commit/6a9a362)
  - 升级依赖，添加对json的eslint检测及格式化 &nbsp;-&nbsp; by @soybeanjs [<samp>(711a4)</samp>](https://github.com/honghuangdc/soybean-admin/commit/711a4ae)
  - update deps and README.md &nbsp;-&nbsp; by @soybeanjs [<samp>(35aee)</samp>](https://github.com/honghuangdc/soybean-admin/commit/35aeedf)
  - 升级依赖、vite配置optimizeDeps &nbsp;-&nbsp; by @soybeanjs [<samp>(ee434)</samp>](https://github.com/honghuangdc/soybean-admin/commit/ee434b4)
  - 去除prettier，已集成进@soybeanjs/eslint-config &nbsp;-&nbsp; by @soybeanjs [<samp>(182da)</samp>](https://github.com/honghuangdc/soybean-admin/commit/182dac0)
  - update eslint &nbsp;-&nbsp; by @soybeanjs [<samp>(907cf)</samp>](https://github.com/honghuangdc/soybean-admin/commit/907cf44)
  - 引入pwa插件，更新配置 &nbsp;-&nbsp; by @soybeanjs [<samp>(695ec)</samp>](https://github.com/honghuangdc/soybean-admin/commit/695ec7e)
  - 更新依赖、调整页面 &nbsp;-&nbsp; by @soybeanjs [<samp>(40ecc)</samp>](https://github.com/honghuangdc/soybean-admin/commit/40ecc32)
  - 引入vite-plugin-progress &nbsp;-&nbsp; by @soybeanjs [<samp>(44ab0)</samp>](https://github.com/honghuangdc/soybean-admin/commit/44ab077)
  - 升级依赖、修复T标签右键菜单连续显示问题 &nbsp;-&nbsp; by @soybeanjs [<samp>(639c4)</samp>](https://github.com/honghuangdc/soybean-admin/commit/639c445)
  - 引入TS高级类型库 &nbsp;-&nbsp; by @soybeanjs [<samp>(71a75)</samp>](https://github.com/honghuangdc/soybean-admin/commit/71a753f)
  - 更换eslint依赖为eslint-config-soybeanjs-vue &nbsp;-&nbsp; by @soybeanjs [<samp>(07325)</samp>](https://github.com/honghuangdc/soybean-admin/commit/07325a4)
  - 升级依赖，降低naive-ui版本修复打包问题 &nbsp;-&nbsp; by @soybeanjs [<samp>(f408e)</samp>](https://github.com/honghuangdc/soybean-admin/commit/f408ea0)
  - 升级依赖，修复TS类型 &nbsp;-&nbsp; by @soybeanjs [<samp>(73ce5)</samp>](https://github.com/honghuangdc/soybean-admin/commit/73ce53a)
  - 引入@unocss/vite替换unocss，精简体积 &nbsp;-&nbsp; by @soybeanjs [<samp>(3540b)</samp>](https://github.com/honghuangdc/soybean-admin/commit/3540b75)
  - update deps, update logos &nbsp;-&nbsp; by @soybeanjs [<samp>(22c05)</samp>](https://github.com/honghuangdc/soybean-admin/commit/22c0567)
  - add constant page content &nbsp;-&nbsp; by @soybeanjs [<samp>(13d0c)</samp>](https://github.com/honghuangdc/soybean-admin/commit/13d0c41)
  - add tauri scripts, change tauri icon, fix mockjs [添加tauri相关的命令，变更tauri图标，修复mockjs] &nbsp;-&nbsp; by @soybeanjs [<samp>(1b45b)</samp>](https://github.com/honghuangdc/soybean-admin/commit/1b45b71)
  - use @soybeanjs/cli replace commitizen &nbsp;-&nbsp; by @soybeanjs [<samp>(428d4)</samp>](https://github.com/honghuangdc/soybean-admin/commit/428d41b)
  - use pnpm patch replace @milahu/patch-package &nbsp;-&nbsp; by @soybeanjs [<samp>(9455a)</samp>](https://github.com/honghuangdc/soybean-admin/commit/9455ad9)
  - remove useless file: commitlint.config.js &nbsp;-&nbsp; by @soybeanjs [<samp>(67736)</samp>](https://github.com/honghuangdc/soybean-admin/commit/6773659)
  - move tauri to branch tauri &nbsp;-&nbsp; by @soybeanjs [<samp>(6c14b)</samp>](https://github.com/honghuangdc/soybean-admin/commit/6c14bfe)
  - update deps and update config &nbsp;-&nbsp; by @soybeanjs [<samp>(7d699)</samp>](https://github.com/honghuangdc/soybean-admin/commit/7d69992)
  - new router branch &nbsp;-&nbsp; by @soybeanjs [<samp>(288d5)</samp>](https://github.com/honghuangdc/soybean-admin/commit/288d586)
  - add vite plugin @soybeanjs/router-page &nbsp;-&nbsp; by @soybeanjs [<samp>(40c1e)</samp>](https://github.com/honghuangdc/soybean-admin/commit/40c1e13)

### &nbsp;&nbsp;&nbsp;🏡 Chore

- **other**:
  - release v0.9.7 &nbsp;-&nbsp; by @soybeanjs [<samp>(cc00c)</samp>](https://github.com/honghuangdc/soybean-admin/commit/cc00c8f)
- **projects**:
  - 更新.cz-config &nbsp;-&nbsp; by @soybeanjs [<samp>(b18c4)</samp>](https://github.com/honghuangdc/soybean-admin/commit/b18c49e)
  - 更新eslint配置 &nbsp;-&nbsp; by @soybeanjs [<samp>(872bb)</samp>](https://github.com/honghuangdc/soybean-admin/commit/872bb84)

### &nbsp;&nbsp;&nbsp;🤖 CI

- add docker build &nbsp;-&nbsp; by @zq-xu [<samp>(af740)</samp>](https://github.com/honghuangdc/soybean-admin/commit/af74046)
- change docker image name &nbsp;-&nbsp; by @zq-xu [<samp>(6fbde)</samp>](https://github.com/honghuangdc/soybean-admin/commit/6fbde1e)

### &nbsp;&nbsp;&nbsp;❤️ Contributors

[![soybeanjs](https://github.com/soybeanjs.png?size=48)](https://github.com/soybeanjs)&nbsp;&nbsp;[![hhstore](https://github.com/hhstore.png?size=48)](https://github.com/hhstore)&nbsp;&nbsp;[![zq-xu](https://github.com/zq-xu.png?size=48)](https://github.com/zq-xu)&nbsp;&nbsp;[![yanbowe](https://github.com/yanbowe.png?size=48)](https://github.com/yanbowe)&nbsp;&nbsp;[![xiaotao2018](https://github.com/xiaotao2018.png?size=48)](https://github.com/xiaotao2018)&nbsp;&nbsp;

## [v0.9.6](https://github.com/honghuangdc/soybean-admin/compare/v0.9.5...v0.9.6) (2022-06-16)

### &nbsp;&nbsp;&nbsp;🚀 Features

- **projects**:
  - 新增Antv G2图表示例 &nbsp;-&nbsp; by @soybeanjs [<samp>(2d64a)</samp>](https://github.com/honghuangdc/soybean-admin/commit/2d64a2e)
  - 上下结构，菜单支持横向滚动 &nbsp;-&nbsp; by @suiyingsky [<samp>(80805)</samp>](https://github.com/honghuangdc/soybean-admin/commit/808051b)
  - 增加设置当前Tab页签名称功能 &nbsp;-&nbsp; by @yanbowe [<samp>(48721)</samp>](https://github.com/honghuangdc/soybean-admin/commit/487213b)
  - 本地svg动态渲染图标 &nbsp;-&nbsp; by @soybeanjs [<samp>(c3c97)</samp>](https://github.com/honghuangdc/soybean-admin/commit/c3c975e)

### &nbsp;&nbsp;&nbsp;🐞 Bug Fixes

- **projects**:
  - 修复顶部菜单的位置失效问题 &nbsp;-&nbsp; by @honghuangdc [<samp>(4ee0d)</samp>](https://github.com/honghuangdc/soybean-admin/commit/4ee0d94)
  - 设置tab标题导致meta属性丢失 &nbsp;-&nbsp; by @yanbowe [<samp>(efcfa)</samp>](https://github.com/honghuangdc/soybean-admin/commit/efcfa57)

### &nbsp;&nbsp;&nbsp;💅 Refactors

- **projects**:
  - 优化菜单支持横向滚动 &nbsp;-&nbsp; by @soybeanjs [<samp>(8f3e8)</samp>](https://github.com/honghuangdc/soybean-admin/commit/8f3e855)
  - 代码优化 &nbsp;-&nbsp; by @honghuangdc [<samp>(5fa82)</samp>](https://github.com/honghuangdc/soybean-admin/commit/5fa822f)

### &nbsp;&nbsp;&nbsp;📖 Documentation

- **projects**: update README.md &nbsp;-&nbsp; by @soybeanjs [<samp>(0c70a)</samp>](https://github.com/honghuangdc/soybean-admin/commit/0c70a9e)

### &nbsp;&nbsp;&nbsp;📦 Build

- **deps**:
  - update deps &nbsp;-&nbsp; by @soybeanjs [<samp>(906ae)</samp>](https://github.com/honghuangdc/soybean-admin/commit/906aed5)
  - update deps &nbsp;-&nbsp; by @soybeanjs [<samp>(9917b)</samp>](https://github.com/honghuangdc/soybean-admin/commit/9917b5e)
  - update deps &nbsp;-&nbsp; by @soybeanjs [<samp>(83301)</samp>](https://github.com/honghuangdc/soybean-admin/commit/833018a)
- **projects**:
  - update deps, update config &nbsp;-&nbsp; by @honghuangdc [<samp>(8e6e7)</samp>](https://github.com/honghuangdc/soybean-admin/commit/8e6e787)

### &nbsp;&nbsp;&nbsp;🏡 Chore

- **release**: 0.9.6 &nbsp;-&nbsp; by @soybeanjs [<samp>(65c21)</samp>](https://github.com/honghuangdc/soybean-admin/commit/65c2181)

### &nbsp;&nbsp;&nbsp;❤️ Contributors

[![soybeanjs](https://github.com/soybeanjs.png?size=48)](https://github.com/soybeanjs)&nbsp;&nbsp;[![yanbowe](https://github.com/yanbowe.png?size=48)](https://github.com/yanbowe)&nbsp;&nbsp;[![honghuangdc](https://github.com/honghuangdc.png?size=48)](https://github.com/honghuangdc)&nbsp;&nbsp;[![suiyingsky](https://github.com/suiyingsky.png?size=48)](https://github.com/suiyingsky)&nbsp;&nbsp;

## [v0.9.5](https://github.com/honghuangdc/soybean-admin/compare/v0.9.4...v0.9.5) (2022-06-07)

### &nbsp;&nbsp;&nbsp;🚀 Features

- **projects**:
  - 添加自动跟随系统主题设置 &nbsp;-&nbsp; by @toolvcn [<samp>(ba07b)</samp>](https://github.com/honghuangdc/soybean-admin/commit/ba07b69)
  - 引入echarts替换antvG2plot &nbsp;-&nbsp; by @soybeanjs [<samp>(e7ad0)</samp>](https://github.com/honghuangdc/soybean-admin/commit/e7ad086)
  - 添加百度地图、升级依赖 &nbsp;-&nbsp; by @soybeanjs [<samp>(39854)</samp>](https://github.com/honghuangdc/soybean-admin/commit/39854a4)
  - 添加插件页面：图表 &nbsp;-&nbsp; by @soybeanjs [<samp>(0a46e)</samp>](https://github.com/honghuangdc/soybean-admin/commit/0a46ea0)
  - 添加antv g2图表示例 &nbsp;-&nbsp; by @soybeanjs [<samp>(44b02)</samp>](https://github.com/honghuangdc/soybean-admin/commit/44b022a)
  - 补充更多的ECharts示例 &nbsp;-&nbsp; by @soybeanjs [<samp>(c7762)</samp>](https://github.com/honghuangdc/soybean-admin/commit/c776249)
  - 动态路由根路由重定向只需取决于后端返回的路由首页 &nbsp;-&nbsp; by @soybeanjs [<samp>(434ab)</samp>](https://github.com/honghuangdc/soybean-admin/commit/434ab1c)
  - 支持同一路由根据不同query和hash同时显示不同Tab &nbsp;-&nbsp; by @soybeanjs [<samp>(41226)</samp>](https://github.com/honghuangdc/soybean-admin/commit/4122685)
- **route**:
  - 路由meta新增activeMenu属性 &nbsp;-&nbsp; by @yanbowe [<samp>(ebd16)</samp>](https://github.com/honghuangdc/soybean-admin/commit/ebd16a4)

### &nbsp;&nbsp;&nbsp;🐞 Bug Fixes

- **projects**:
  - 修复插件不存在的错误提示 &nbsp;-&nbsp; by @ThinkDevelop [<samp>(71652)</samp>](https://github.com/honghuangdc/soybean-admin/commit/7165282)
  - 修复权限切换路由数据未更新的问题 &nbsp;-&nbsp; by @soybeanjs [<samp>(60f91)</samp>](https://github.com/honghuangdc/soybean-admin/commit/60f9125)
  - 修复页面切换时导致的溢出滚动条 &nbsp;-&nbsp; by @soybeanjs [<samp>(e0233)</samp>](https://github.com/honghuangdc/soybean-admin/commit/e023306)
  - 修复@antv/g2生产环境报错 &nbsp;-&nbsp; by @soybeanjs [<samp>(4558c)</samp>](https://github.com/honghuangdc/soybean-admin/commit/4558c24)
- **route**:
  - 当为左侧混合菜单时activeMenu无效情况 &nbsp;-&nbsp; by @yanbowe [<samp>(3e4f9)</samp>](https://github.com/honghuangdc/soybean-admin/commit/3e4f9e2)

### &nbsp;&nbsp;&nbsp;💅 Refactors

- **layouts**:
  - layout/header 反转色样式补充 &nbsp;-&nbsp; by **元家怿** [<samp>(01d0b)</samp>](https://github.com/honghuangdc/soybean-admin/commit/01d0bcb)
- **projects**:
  - 代码优化 &nbsp;-&nbsp; by @honghuangdc [<samp>(14c14)</samp>](https://github.com/honghuangdc/soybean-admin/commit/14c145e)
  - 代码优化 &nbsp;-&nbsp; by @soybeanjs [<samp>(3590b)</samp>](https://github.com/honghuangdc/soybean-admin/commit/3590b65)
  - 代码优化 &nbsp;-&nbsp; by @soybeanjs [<samp>(a1c7e)</samp>](https://github.com/honghuangdc/soybean-admin/commit/a1c7e10)
  - 代码优化 &nbsp;-&nbsp; by @soybeanjs [<samp>(44ab5)</samp>](https://github.com/honghuangdc/soybean-admin/commit/44ab55d)
  - 代码优化 &nbsp;-&nbsp; by @soybeanjs [<samp>(095c4)</samp>](https://github.com/honghuangdc/soybean-admin/commit/095c432)
  - 代码优化 &nbsp;-&nbsp; by @soybeanjs [<samp>(d28b9)</samp>](https://github.com/honghuangdc/soybean-admin/commit/d28b903)
  - 代码优化 &nbsp;-&nbsp; by @soybeanjs [<samp>(4c2f5)</samp>](https://github.com/honghuangdc/soybean-admin/commit/4c2f535)
  - 代码优化 &nbsp;-&nbsp; by @soybeanjs [<samp>(d9ac7)</samp>](https://github.com/honghuangdc/soybean-admin/commit/d9ac7e4)
- **styles**:
  - 代码格式 &nbsp;-&nbsp; by @soybeanjs [<samp>(8f6d6)</samp>](https://github.com/honghuangdc/soybean-admin/commit/8f6d6ce)

### &nbsp;&nbsp;&nbsp;📖 Documentation

- **projects**:
  - update README.md &nbsp;-&nbsp; by @soybeanjs [<samp>(3d8be)</samp>](https://github.com/honghuangdc/soybean-admin/commit/3d8befa)
  - update README.md &nbsp;-&nbsp; by @honghuangdc [<samp>(21e63)</samp>](https://github.com/honghuangdc/soybean-admin/commit/21e6399)
  - update README.md &nbsp;-&nbsp; by @honghuangdc [<samp>(0811f)</samp>](https://github.com/honghuangdc/soybean-admin/commit/0811ffa)
  - update README.md &nbsp;-&nbsp; by @soybeanjs [<samp>(84cb0)</samp>](https://github.com/honghuangdc/soybean-admin/commit/84cb07b)
  - update README.md &nbsp;-&nbsp; by @soybeanjs [<samp>(4b80a)</samp>](https://github.com/honghuangdc/soybean-admin/commit/4b80a66)
  - update docs &nbsp;-&nbsp; by @honghuangdc [<samp>(e9656)</samp>](https://github.com/honghuangdc/soybean-admin/commit/e9656c6)
  - update README.md &nbsp;-&nbsp; by @honghuangdc [<samp>(ae99e)</samp>](https://github.com/honghuangdc/soybean-admin/commit/ae99e57)

### &nbsp;&nbsp;&nbsp;📦 Build

- **deps**:
  - update deps &nbsp;-&nbsp; by @honghuangdc [<samp>(518f7)</samp>](https://github.com/honghuangdc/soybean-admin/commit/518f7ee)
  - update deps &nbsp;-&nbsp; by @soybeanjs [<samp>(92b84)</samp>](https://github.com/honghuangdc/soybean-admin/commit/92b8406)
  - update deps &nbsp;-&nbsp; by @soybeanjs [<samp>(50d7c)</samp>](https://github.com/honghuangdc/soybean-admin/commit/50d7ccd)
  - update deps &nbsp;-&nbsp; by @soybeanjs [<samp>(3f822)</samp>](https://github.com/honghuangdc/soybean-admin/commit/3f822a7)
  - update deps &nbsp;-&nbsp; by @soybeanjs [<samp>(02809)</samp>](https://github.com/honghuangdc/soybean-admin/commit/028096e)
  - update deps &nbsp;-&nbsp; by @soybeanjs [<samp>(be45d)</samp>](https://github.com/honghuangdc/soybean-admin/commit/be45d83)
  - update deps &nbsp;-&nbsp; by @soybeanjs [<samp>(6a5a3)</samp>](https://github.com/honghuangdc/soybean-admin/commit/6a5a357)
  - 依赖升级 &nbsp;-&nbsp; by @honghuangdc [<samp>(e3c4a)</samp>](https://github.com/honghuangdc/soybean-admin/commit/e3c4a6e)
- **other**:
  - update cz config &nbsp;-&nbsp; by @honghuangdc [<samp>(07baa)</samp>](https://github.com/honghuangdc/soybean-admin/commit/07baac7)
- **projects**:
  - update config &nbsp;-&nbsp; by @soybeanjs [<samp>(a0c40)</samp>](https://github.com/honghuangdc/soybean-admin/commit/a0c405d)
  - 代码优化 &nbsp;-&nbsp; by @soybeanjs [<samp>(de09f)</samp>](https://github.com/honghuangdc/soybean-admin/commit/de09f82)
  - 配置优化 &nbsp;-&nbsp; by @honghuangdc [<samp>(fd787)</samp>](https://github.com/honghuangdc/soybean-admin/commit/fd78791)
  - 配置更改 &nbsp;-&nbsp; by @honghuangdc [<samp>(c8717)</samp>](https://github.com/honghuangdc/soybean-admin/commit/c8717c2)

### &nbsp;&nbsp;&nbsp;🏡 Chore

- **deps**:
  - update deps &nbsp;-&nbsp; by @soybeanjs [<samp>(a70e4)</samp>](https://github.com/honghuangdc/soybean-admin/commit/a70e416)
  - update deps &nbsp;-&nbsp; by @soybeanjs [<samp>(7487a)</samp>](https://github.com/honghuangdc/soybean-admin/commit/7487ab7)
- **release**:
  - 0.9.5 &nbsp;-&nbsp; by @soybeanjs [<samp>(08d83)</samp>](https://github.com/honghuangdc/soybean-admin/commit/08d83ec)

### &nbsp;&nbsp;&nbsp;🎨 Styles

- **GlobalBreadcrumb**: 代码格式fix &nbsp;-&nbsp; by @tclyjy [<samp>(0243b)</samp>](https://github.com/honghuangdc/soybean-admin/commit/0243b27)

### &nbsp;&nbsp;&nbsp;❤️ Contributors

[![soybeanjs](https://github.com/soybeanjs.png?size=48)](https://github.com/soybeanjs)&nbsp;&nbsp;[![honghuangdc](https://github.com/honghuangdc.png?size=48)](https://github.com/honghuangdc)&nbsp;&nbsp;[![yanbowe](https://github.com/yanbowe.png?size=48)](https://github.com/yanbowe)&nbsp;&nbsp;[![ThinkDevelop](https://github.com/ThinkDevelop.png?size=48)](https://github.com/ThinkDevelop)&nbsp;&nbsp;[![tclyjy](https://github.com/tclyjy.png?size=48)](https://github.com/tclyjy)&nbsp;&nbsp;[![toolvcn](https://github.com/toolvcn.png?size=48)](https://github.com/toolvcn)&nbsp;&nbsp;
[元家怿](mailto:jiayi.yuan@lkcoffee.com),&nbsp;

## [v0.9.4](https://github.com/honghuangdc/soybean-admin/compare/main-0428...v0.9.4) (2022-04-29)

### &nbsp;&nbsp;&nbsp;🚀 Features

- **layouts**:
  - 添加侧边栏/头部的反转模式来增加对比度 &nbsp;-&nbsp; by **元家怿** [<samp>(861c8)</samp>](https://github.com/honghuangdc/soybean-admin/commit/861c8b9)
- **projects**:
  - 引入unocss替换windicss &nbsp;-&nbsp; by @honghuangdc [<samp>(c9d3e)</samp>](https://github.com/honghuangdc/soybean-admin/commit/c9d3e5a)
  - HTML lang 修改为 zh-cmn-Hans &nbsp;-&nbsp; by @toolvcn [<samp>(b9c5c)</samp>](https://github.com/honghuangdc/soybean-admin/commit/b9c5c34)
  - 权限完善及权限示例页面 &nbsp;-&nbsp; by @soybeanjs [<samp>(80744)</samp>](https://github.com/honghuangdc/soybean-admin/commit/807448a)
  - mock添加权限过滤 &nbsp;-&nbsp; by @soybeanjs [<samp>(7f435)</samp>](https://github.com/honghuangdc/soybean-admin/commit/7f4350a)

### &nbsp;&nbsp;&nbsp;🐞 Bug Fixes

- **projects**:
  - 添加.npmrc修复无法获取自动引入的全局组件声明类型 &nbsp;-&nbsp; by @honghuangdc [<samp>(e8488)</samp>](https://github.com/honghuangdc/soybean-admin/commit/e8488e4)
  - 修复样式 &nbsp;-&nbsp; by @honghuangdc [<samp>(e8999)</samp>](https://github.com/honghuangdc/soybean-admin/commit/e899914)

### &nbsp;&nbsp;&nbsp;💅 Refactors

- **projects**:
  - mock权限相关数据优化 &nbsp;-&nbsp; by @soybeanjs [<samp>(41e46)</samp>](https://github.com/honghuangdc/soybean-admin/commit/41e46a5)
  - 代码优化 &nbsp;-&nbsp; by @soybeanjs [<samp>(251b5)</samp>](https://github.com/honghuangdc/soybean-admin/commit/251b5b9)
  - 代码优化 &nbsp;-&nbsp; by @honghuangdc [<samp>(a7824)</samp>](https://github.com/honghuangdc/soybean-admin/commit/a782461)
  - 细节优化 &nbsp;-&nbsp; by @soybeanjs [<samp>(c275f)</samp>](https://github.com/honghuangdc/soybean-admin/commit/c275f26)
  - layout和tab组件依赖名称变更、样式修复 &nbsp;-&nbsp; by @soybeanjs [<samp>(de5fb)</samp>](https://github.com/honghuangdc/soybean-admin/commit/de5fb84)
  - merge branch unocss to main &nbsp;-&nbsp; by @soybeanjs [<samp>(69d51)</samp>](https://github.com/honghuangdc/soybean-admin/commit/69d5131)
  - 动态路由权限完善 &nbsp;-&nbsp; by @soybeanjs [<samp>(55ddc)</samp>](https://github.com/honghuangdc/soybean-admin/commit/55ddc9c)

### &nbsp;&nbsp;&nbsp;📖 Documentation

- **projects**: update README.md &nbsp;-&nbsp; by @soybeanjs [<samp>(d5c75)</samp>](https://github.com/honghuangdc/soybean-admin/commit/d5c7511)

### &nbsp;&nbsp;&nbsp;📦 Build

- **deps**: update deps &nbsp;-&nbsp; by @honghuangdc [<samp>(5c75e)</samp>](https://github.com/honghuangdc/soybean-admin/commit/5c75e9d)
- **projects**: 细节调整 &nbsp;-&nbsp; by @soybeanjs [<samp>(401f0)</samp>](https://github.com/honghuangdc/soybean-admin/commit/401f0c7)

### &nbsp;&nbsp;&nbsp;🏡 Chore

- **release**: 0.9.4 &nbsp;-&nbsp; by @soybeanjs [<samp>(97c92)</samp>](https://github.com/honghuangdc/soybean-admin/commit/97c9262)

### &nbsp;&nbsp;&nbsp;❤️ Contributors

[![soybeanjs](https://github.com/soybeanjs.png?size=48)](https://github.com/soybeanjs)&nbsp;&nbsp;[![honghuangdc](https://github.com/honghuangdc.png?size=48)](https://github.com/honghuangdc)&nbsp;&nbsp;[![toolvcn](https://github.com/toolvcn.png?size=48)](https://github.com/toolvcn)&nbsp;&nbsp;
[元家怿](mailto:jiayi.yuan@luckincoffee.com),&nbsp;

## [v0.10.2](https://github.com/honghuangdc/soybean-admin/compare/v0.9.3...main-0428) (23-06-07)

### &nbsp;&nbsp;&nbsp;🚀 Features

- **layouts**:
  - 添加侧边栏/头部的反转模式来增加对比度 &nbsp;-&nbsp; by **元家怿** [<samp>(3c8dd)</samp>](https://github.com/honghuangdc/soybean-admin/commit/3c8dd77)
- **projects**:
  - 新增静态路由 &nbsp;-&nbsp; by @soybeanjs [<samp>(ca2df)</samp>](https://github.com/honghuangdc/soybean-admin/commit/ca2dfa6)
  - 插件方式按需引入naiveUI &nbsp;-&nbsp; by @soybeanjs [<samp>(6bed9)</samp>](https://github.com/honghuangdc/soybean-admin/commit/6bed9ea)
  - 添加请求适配器的请求示例 &nbsp;-&nbsp; by @soybeanjs [<samp>(bed42)</samp>](https://github.com/honghuangdc/soybean-admin/commit/bed4292)
  - 登录页面适配移动端 &nbsp;-&nbsp; by @soybeanjs [<samp>(ec077)</samp>](https://github.com/honghuangdc/soybean-admin/commit/ec0776e)
  - 登录页背景图片位置适配移动端 &nbsp;-&nbsp; by @soybeanjs [<samp>(24010)</samp>](https://github.com/honghuangdc/soybean-admin/commit/24010d0)
  - HTML lang 修改为 zh-cmn-Hans &nbsp;-&nbsp; by @toolvcn [<samp>(dbeb5)</samp>](https://github.com/honghuangdc/soybean-admin/commit/dbeb595)

### &nbsp;&nbsp;&nbsp;🐞 Bug Fixes

- **projects**:
  - 修复vite alias &nbsp;-&nbsp; by @soybeanjs [<samp>(cd7ca)</samp>](https://github.com/honghuangdc/soybean-admin/commit/cd7ca8f)
  - 修复路由守卫的动态路由逻辑 &nbsp;-&nbsp; by @soybeanjs [<samp>(e6c26)</samp>](https://github.com/honghuangdc/soybean-admin/commit/e6c26fc)
  - 全局搜索弹窗弹出时动画闪屏问题 &nbsp;-&nbsp; by @yanbowe [<samp>(bb1bb)</samp>](https://github.com/honghuangdc/soybean-admin/commit/bb1bbf2)
  - 去除从环境文件引入端口号导致的错误 &nbsp;-&nbsp; by @soybeanjs [<samp>(2d6d1)</samp>](https://github.com/honghuangdc/soybean-admin/commit/2d6d179)
  - 修复在新版vite下环境变量获取不到的问题 &nbsp;-&nbsp; by @soybeanjs [<samp>(3fb13)</samp>](https://github.com/honghuangdc/soybean-admin/commit/3fb13ca)
  - 修复获取vite环境变量的方式 &nbsp;-&nbsp; by @soybeanjs [<samp>(46e1a)</samp>](https://github.com/honghuangdc/soybean-admin/commit/46e1ae7)
  - 添加获取路由组件文件未找到时的错误提示 &nbsp;-&nbsp; by @honghuangdc [<samp>(219f8)</samp>](https://github.com/honghuangdc/soybean-admin/commit/219f87f)

### &nbsp;&nbsp;&nbsp;🔥 Performance

- refresh-koken命名 &nbsp;-&nbsp; by @southliu [<samp>(17155)</samp>](https://github.com/honghuangdc/soybean-admin/commit/1715504)

### &nbsp;&nbsp;&nbsp;💅 Refactors

- **projects**:
  - lint命令修改 &nbsp;-&nbsp; by @soybeanjs [<samp>(20911)</samp>](https://github.com/honghuangdc/soybean-admin/commit/20911dd)
  - 代码优化 &nbsp;-&nbsp; by @soybeanjs [<samp>(e8b53)</samp>](https://github.com/honghuangdc/soybean-admin/commit/e8b534b)
  - 去除在pinia的getters的函数调用副作用，用watch代替 &nbsp;-&nbsp; by @soybeanjs [<samp>(b35ed)</samp>](https://github.com/honghuangdc/soybean-admin/commit/b35ed89)
  - 代码优化 &nbsp;-&nbsp; by @honghuangdc [<samp>(5e276)</samp>](https://github.com/honghuangdc/soybean-admin/commit/5e27642)

### &nbsp;&nbsp;&nbsp;📖 Documentation

- **projects**:
  - update README.md &nbsp;-&nbsp; by @honghuangdc [<samp>(21645)</samp>](https://github.com/honghuangdc/soybean-admin/commit/2164553)
  - update README.md &nbsp;-&nbsp; by @honghuangdc [<samp>(9a90f)</samp>](https://github.com/honghuangdc/soybean-admin/commit/9a90f18)
  - update README.md &nbsp;-&nbsp; by @honghuangdc [<samp>(60a55)</samp>](https://github.com/honghuangdc/soybean-admin/commit/60a55a7)

### &nbsp;&nbsp;&nbsp;📦 Build

- **deps**: update deps &nbsp;-&nbsp; by @soybeanjs [<samp>(cecce)</samp>](https://github.com/honghuangdc/soybean-admin/commit/cecce83)
- **projects**: vite.config代码优化 &nbsp;-&nbsp; by @soybeanjs [<samp>(ca707)</samp>](https://github.com/honghuangdc/soybean-admin/commit/ca707a4)

### &nbsp;&nbsp;&nbsp;🏡 Chore

- **deps**: update deps &nbsp;-&nbsp; by @soybeanjs [<samp>(4eb46)</samp>](https://github.com/honghuangdc/soybean-admin/commit/4eb46ea)

### &nbsp;&nbsp;&nbsp;🎨 Styles

- **projects**: update prettier config &nbsp;-&nbsp; by @honghuangdc [<samp>(df56a)</samp>](https://github.com/honghuangdc/soybean-admin/commit/df56abe)

### &nbsp;&nbsp;&nbsp;❤️ Contributors

[![toolvcn](https://github.com/toolvcn.png?size=48)](https://github.com/toolvcn)&nbsp;&nbsp;[![honghuangdc](https://github.com/honghuangdc.png?size=48)](https://github.com/honghuangdc)&nbsp;&nbsp;[![soybeanjs](https://github.com/soybeanjs.png?size=48)](https://github.com/soybeanjs)&nbsp;&nbsp;[![yanbowe](https://github.com/yanbowe.png?size=48)](https://github.com/yanbowe)&nbsp;&nbsp;[![southliu](https://github.com/southliu.png?size=48)](https://github.com/southliu)&nbsp;&nbsp;[![honghuangdc](https://github.com/honghuangdc.png?size=48)](https://github.com/honghuangdc)&nbsp;&nbsp;
[元家怿](mailto:jiayi.yuan@luckincoffee.com),&nbsp;

## [v0.9.3](https://github.com/honghuangdc/soybean-admin/compare/old-version...v0.9.3) (2022-03-12)

### &nbsp;&nbsp;&nbsp;🚀 Features

- **components**:
  - svgIcon,添加type,调整size方案 &nbsp;-&nbsp; by @Lsq128 [<samp>(ce4e0)</samp>](https://github.com/honghuangdc/soybean-admin/commit/ce4e039)
- **projects**:
  - 路由页面跳转权限完成 &nbsp;-&nbsp; by @soybeanjs [<samp>(0d2a5)</samp>](https://github.com/honghuangdc/soybean-admin/commit/0d2a562)
  - 集成naiveUI主题配置，将css vars添加至html &nbsp;-&nbsp; by @soybeanjs [<samp>(2c196)</samp>](https://github.com/honghuangdc/soybean-admin/commit/2c19684)
  - 初始化加载效果：应用主题颜色 &nbsp;-&nbsp; by @honghuangdc [<samp>(035fa)</samp>](https://github.com/honghuangdc/soybean-admin/commit/035fa11)
  - 登录页面开始迁移 &nbsp;-&nbsp; by @honghuangdc [<samp>(f5a36)</samp>](https://github.com/honghuangdc/soybean-admin/commit/f5a36a0)
  - 迁移登录完成 &nbsp;-&nbsp; by @soybeanjs [<samp>(b93b8)</samp>](https://github.com/honghuangdc/soybean-admin/commit/b93b80c)
  - 添加NaiveProvider组件 &nbsp;-&nbsp; by @honghuangdc [<samp>(c804b)</samp>](https://github.com/honghuangdc/soybean-admin/commit/c804b21)
  - 多级路由的所有子路由转换成二级路由 &nbsp;-&nbsp; by @honghuangdc [<samp>(85b55)</samp>](https://github.com/honghuangdc/soybean-admin/commit/85b55bb)
  - 新增BasicLayout布局 &nbsp;-&nbsp; by @soybeanjs [<samp>(00646)</samp>](https://github.com/honghuangdc/soybean-admin/commit/006467a)
  - 创建自定义布局组件SoybeanLayout &nbsp;-&nbsp; by @honghuangdc [<samp>(0653f)</samp>](https://github.com/honghuangdc/soybean-admin/commit/0653fb1)
  - 添加抽屉 &nbsp;-&nbsp; by @honghuangdc [<samp>(10e4d)</samp>](https://github.com/honghuangdc/soybean-admin/commit/10e4d81)
  - theme store完成 &nbsp;-&nbsp; by @soybeanjs [<samp>(bf020)</samp>](https://github.com/honghuangdc/soybean-admin/commit/bf020a8)
  - 主题配置抽屉：迁移暗黑模式、布局模式、添加颜色选择面板 &nbsp;-&nbsp; by @soybeanjs [<samp>(912bf)</samp>](https://github.com/honghuangdc/soybean-admin/commit/912bfdf)
  - 主题配置抽屉: 迁移其他功能 &nbsp;-&nbsp; by @soybeanjs [<samp>(6d132)</samp>](https://github.com/honghuangdc/soybean-admin/commit/6d132c5)
  - 添加头部折叠按钮 &nbsp;-&nbsp; by @honghuangdc [<samp>(a090d)</samp>](https://github.com/honghuangdc/soybean-admin/commit/a090d39)
  - 添加侧边菜单 &nbsp;-&nbsp; by @soybeanjs [<samp>(e25af)</samp>](https://github.com/honghuangdc/soybean-admin/commit/e25afe2)
  - 面包屑 &nbsp;-&nbsp; by @honghuangdc [<samp>(09c76)</samp>](https://github.com/honghuangdc/soybean-admin/commit/09c7658)
  - 请求拦截器添加刷新token &nbsp;-&nbsp; by @honghuangdc [<samp>(839b8)</samp>](https://github.com/honghuangdc/soybean-admin/commit/839b82b)
  - 细节完善 &nbsp;-&nbsp; by @soybeanjs [<samp>(cc290)</samp>](https://github.com/honghuangdc/soybean-admin/commit/cc290ac)
  - 迁移多页签 &nbsp;-&nbsp; by @soybeanjs [<samp>(28efb)</samp>](https://github.com/honghuangdc/soybean-admin/commit/28efbdb)
  - 细节完善、迁移页面 &nbsp;-&nbsp; by @soybeanjs [<samp>(ce531)</samp>](https://github.com/honghuangdc/soybean-admin/commit/ce531ce)
  - 添加页面缓存、记录在tab中的缓存页面的滚动条位置 &nbsp;-&nbsp; by @soybeanjs [<samp>(1d63a)</samp>](https://github.com/honghuangdc/soybean-admin/commit/1d63a83)
  - 添加缓存主题色 &nbsp;-&nbsp; by @soybeanjs [<samp>(37092)</samp>](https://github.com/honghuangdc/soybean-admin/commit/3709297)
  - 新版重构完成 &nbsp;-&nbsp; by @soybeanjs [<samp>(68b42)</samp>](https://github.com/honghuangdc/soybean-admin/commit/68b4230)
  - 迁移全局搜索菜单功能 &nbsp;-&nbsp; by @yanbowe [<samp>(554d7)</samp>](https://github.com/honghuangdc/soybean-admin/commit/554d7fd)
  - 添加naiveUI按需引入 &nbsp;-&nbsp; by @soybeanjs [<samp>(a810e)</samp>](https://github.com/honghuangdc/soybean-admin/commit/a810ef8)
  - 添加SvgIcon,配置vite plugin &nbsp;-&nbsp; by **Liushengqun** [<samp>(378d5)</samp>](https://github.com/honghuangdc/soybean-admin/commit/378d55a)
  - 引入soybean-admin-tab、去除vite-plugin-svg-icons，用unplugin-icons实现自定义svg的iconify写法、代码优化 &nbsp;-&nbsp; by @soybeanjs [<samp>(a1a57)</samp>](https://github.com/honghuangdc/soybean-admin/commit/a1a57a1)
  - 新增子菜单图标和多页签图标 &nbsp;-&nbsp; by @soybeanjs [<samp>(f5c56)</samp>](https://github.com/honghuangdc/soybean-admin/commit/f5c56c3)
  - 重构项目的TS类型架构，去除interface文件夹 &nbsp;-&nbsp; by @soybeanjs [<samp>(81914)</samp>](https://github.com/honghuangdc/soybean-admin/commit/8191490)
  - 添加网络代理 &nbsp;-&nbsp; by @soybeanjs [<samp>(094dc)</samp>](https://github.com/honghuangdc/soybean-admin/commit/094dca9)
  - 添加全局组件自动引入注册 &nbsp;-&nbsp; by @soybeanjs [<samp>(f5a04)</samp>](https://github.com/honghuangdc/soybean-admin/commit/f5a043b)
  - 新增自定义svg图标动态渲染 &nbsp;-&nbsp; by @soybeanjs [<samp>(f83c7)</samp>](https://github.com/honghuangdc/soybean-admin/commit/f83c7b5)

### &nbsp;&nbsp;&nbsp;🐞 Bug Fixes

- **components**:
  - 修复Tab在移动端设备无法点击的问题 &nbsp;-&nbsp; by @honghuangdc [<samp>(2c966)</samp>](https://github.com/honghuangdc/soybean-admin/commit/2c9660f)
  - 修复组件LoadingEmptyWrapper适应暗黑模式 &nbsp;-&nbsp; by @soybeanjs [<samp>(811b1)</samp>](https://github.com/honghuangdc/soybean-admin/commit/811b15e)
  - 组件LoadingEmptyWrapper添加背景颜色动画过渡 &nbsp;-&nbsp; by @soybeanjs [<samp>(7add5)</samp>](https://github.com/honghuangdc/soybean-admin/commit/7add5c2)
- **projects**:
  - 修复redirect-not-found子路由 &nbsp;-&nbsp; by @honghuangdc [<samp>(5bfb8)</samp>](https://github.com/honghuangdc/soybean-admin/commit/5bfb819)
  - 去除Layout组件冗余代码 &nbsp;-&nbsp; by @honghuangdc [<samp>(0e783)</samp>](https://github.com/honghuangdc/soybean-admin/commit/0e783bc)
  - 修复面包屑数据 &nbsp;-&nbsp; by @honghuangdc [<samp>(28b5d)</samp>](https://github.com/honghuangdc/soybean-admin/commit/28b5d22)
  - 修复vertical-mix布局、重构初始化的loading &nbsp;-&nbsp; by @soybeanjs [<samp>(579e0)</samp>](https://github.com/honghuangdc/soybean-admin/commit/579e074)
  - 修复未登录时会调用获取用户路由的接口 &nbsp;-&nbsp; by @soybeanjs [<samp>(21bab)</samp>](https://github.com/honghuangdc/soybean-admin/commit/21bab1f)
  - 修复路由守卫的动态路由逻辑 &nbsp;-&nbsp; by @soybeanjs [<samp>(b61b0)</samp>](https://github.com/honghuangdc/soybean-admin/commit/b61b0ce)
  - vite配置修复 &nbsp;-&nbsp; by @soybeanjs [<samp>(facc0)</samp>](https://github.com/honghuangdc/soybean-admin/commit/facc00e)
  - 修复分析页和工作台的布局问题 &nbsp;-&nbsp; by @honghuangdc [<samp>(e93b9)</samp>](https://github.com/honghuangdc/soybean-admin/commit/e93b94c)
  - 修复项目配置拷贝功能 &nbsp;-&nbsp; by @soybeanjs [<samp>(a7a26)</samp>](https://github.com/honghuangdc/soybean-admin/commit/a7a269d)
  - 修复页面切换动画无变化 &nbsp;-&nbsp; by @soybeanjs [<samp>(c4546)</samp>](https://github.com/honghuangdc/soybean-admin/commit/c4546bd)
  - 修复页面切换动画开关不生效 &nbsp;-&nbsp; by @bundlejs [<samp>(9d4ed)</samp>](https://github.com/honghuangdc/soybean-admin/commit/9d4ed61)
  - 修复 BASE_URL 没有生效的问题 &nbsp;-&nbsp; by @pany-ang [<samp>(72d7d)</samp>](https://github.com/honghuangdc/soybean-admin/commit/72d7dcf)

### &nbsp;&nbsp;&nbsp;💅 Refactors

- **components**:
  - 去除packages的soybean-layout，通过npm的方式引入 &nbsp;-&nbsp; by @soybeanjs [<samp>(c1182)</samp>](https://github.com/honghuangdc/soybean-admin/commit/c1182fe)
- **projects**:
  - 精简版+动态路由权限初步 &nbsp;-&nbsp; by @soybeanjs [<samp>(de205)</samp>](https://github.com/honghuangdc/soybean-admin/commit/de2057f)
  - 单独一级路由相关逻辑重构 &nbsp;-&nbsp; by @honghuangdc [<samp>(ab9a6)</samp>](https://github.com/honghuangdc/soybean-admin/commit/ab9a6a2)
  - 单独路由逻辑重构、路由转换函数优化 &nbsp;-&nbsp; by @soybeanjs [<samp>(b36a6)</samp>](https://github.com/honghuangdc/soybean-admin/commit/b36a62b)
  - 恢复pinia默认写法 &nbsp;-&nbsp; by @soybeanjs [<samp>(b2a4d)</samp>](https://github.com/honghuangdc/soybean-admin/commit/b2a4ddf)
  - 请求构造函数适配不同后端接口的数据结构 &nbsp;-&nbsp; by @soybeanjs [<samp>(4f9d5)</samp>](https://github.com/honghuangdc/soybean-admin/commit/4f9d544)
  - 细节完善 &nbsp;-&nbsp; by @soybeanjs [<samp>(651e5)</samp>](https://github.com/honghuangdc/soybean-admin/commit/651e58d)
  - 重构路由页面组件的导入 &nbsp;-&nbsp; by @honghuangdc [<samp>(e6503)</samp>](https://github.com/honghuangdc/soybean-admin/commit/e65034d)
  - 代码优化 &nbsp;-&nbsp; by @soybeanjs [<samp>(4e31a)</samp>](https://github.com/honghuangdc/soybean-admin/commit/4e31abd)

### &nbsp;&nbsp;&nbsp;📖 Documentation

- **other**:
  - 注释文案修改 &nbsp;-&nbsp; by **毛博文** [<samp>(d0064)</samp>](https://github.com/honghuangdc/soybean-admin/commit/d00643c)
- **projects**:
  - update README.md &nbsp;-&nbsp; by @soybeanjs [<samp>(5eddb)</samp>](https://github.com/honghuangdc/soybean-admin/commit/5eddb49)
  - update README.md &nbsp;-&nbsp; by @soybeanjs [<samp>(02c51)</samp>](https://github.com/honghuangdc/soybean-admin/commit/02c51e6)
  - update README.md &nbsp;-&nbsp; by @honghuangdc [<samp>(47f28)</samp>](https://github.com/honghuangdc/soybean-admin/commit/47f2871)
  - update README.md &nbsp;-&nbsp; by @honghuangdc [<samp>(7ed5d)</samp>](https://github.com/honghuangdc/soybean-admin/commit/7ed5d0d)
  - update README.md &nbsp;-&nbsp; by @honghuangdc [<samp>(3befb)</samp>](https://github.com/honghuangdc/soybean-admin/commit/3befb22)
  - update README.md &nbsp;-&nbsp; by @honghuangdc [<samp>(e856c)</samp>](https://github.com/honghuangdc/soybean-admin/commit/e856cdb)
  - update README.md &nbsp;-&nbsp; by @soybeanjs [<samp>(3aded)</samp>](https://github.com/honghuangdc/soybean-admin/commit/3aded40)
  - update README.md &nbsp;-&nbsp; by @soybeanjs [<samp>(225e7)</samp>](https://github.com/honghuangdc/soybean-admin/commit/225e712)
  - update README.md &nbsp;-&nbsp; by @honghuangdc [<samp>(5b401)</samp>](https://github.com/honghuangdc/soybean-admin/commit/5b401a7)
  - update README.md &nbsp;-&nbsp; by @honghuangdc [<samp>(8cdad)</samp>](https://github.com/honghuangdc/soybean-admin/commit/8cdad54)
  - update README.md &nbsp;-&nbsp; by @soybeanjs [<samp>(a0dfa)</samp>](https://github.com/honghuangdc/soybean-admin/commit/a0dfa3d)
  - update README.md &nbsp;-&nbsp; by @soybeanjs [<samp>(b8db2)</samp>](https://github.com/honghuangdc/soybean-admin/commit/b8db211)

### &nbsp;&nbsp;&nbsp;📦 Build

- **deps**:
  - 升级依赖 &nbsp;-&nbsp; by @soybeanjs [<samp>(284af)</samp>](https://github.com/honghuangdc/soybean-admin/commit/284af63)
  - 升级依赖 &nbsp;-&nbsp; by @soybeanjs [<samp>(57c69)</samp>](https://github.com/honghuangdc/soybean-admin/commit/57c692b)
  - 升级依赖 &nbsp;-&nbsp; by @soybeanjs [<samp>(7ba33)</samp>](https://github.com/honghuangdc/soybean-admin/commit/7ba332c)
  - upgrade deps &nbsp;-&nbsp; by @soybeanjs [<samp>(50c8b)</samp>](https://github.com/honghuangdc/soybean-admin/commit/50c8b9d)
  - upgrade deps &nbsp;-&nbsp; by @soybeanjs [<samp>(8d00b)</samp>](https://github.com/honghuangdc/soybean-admin/commit/8d00b23)
  - upgrade deps &nbsp;-&nbsp; by @soybeanjs [<samp>(b298a)</samp>](https://github.com/honghuangdc/soybean-admin/commit/b298af1)
- **projects**:
  - 修改vscode配置 &nbsp;-&nbsp; by @honghuangdc [<samp>(0c577)</samp>](https://github.com/honghuangdc/soybean-admin/commit/0c5770d)
  - 添加vercel打包的环境 &nbsp;-&nbsp; by @honghuangdc [<samp>(371fa)</samp>](https://github.com/honghuangdc/soybean-admin/commit/371fad4)
  - add license &nbsp;-&nbsp; by @soybeanjs [<samp>(b1672)</samp>](https://github.com/honghuangdc/soybean-admin/commit/b16721b)
  - 更新tsconfig.json &nbsp;-&nbsp; by @soybeanjs [<samp>(f42ee)</samp>](https://github.com/honghuangdc/soybean-admin/commit/f42ee9d)
  - update tsconfig、eslintrc &nbsp;-&nbsp; by @soybeanjs [<samp>(75de2)</samp>](https://github.com/honghuangdc/soybean-admin/commit/75de2b0)

### &nbsp;&nbsp;&nbsp;🏡 Chore

- **release**:
  - 0.1.1 精简版发布 &nbsp;-&nbsp; by @soybeanjs [<samp>(db3c2)</samp>](https://github.com/honghuangdc/soybean-admin/commit/db3c25e)
  - 0.1.2 &nbsp;-&nbsp; by @soybeanjs [<samp>(db75c)</samp>](https://github.com/honghuangdc/soybean-admin/commit/db75c91)
  - 0.1.3 &nbsp;-&nbsp; by @soybeanjs [<samp>(32a7c)</samp>](https://github.com/honghuangdc/soybean-admin/commit/32a7cc4)
  - 0.9.1 &nbsp;-&nbsp; by @soybeanjs [<samp>(be374)</samp>](https://github.com/honghuangdc/soybean-admin/commit/be37408)
  - 0.9.2 &nbsp;-&nbsp; by @honghuangdc [<samp>(11407)</samp>](https://github.com/honghuangdc/soybean-admin/commit/1140722)
  - 0.9.3 &nbsp;-&nbsp; by @soybeanjs [<samp>(d0522)</samp>](https://github.com/honghuangdc/soybean-admin/commit/d0522ce)

### &nbsp;&nbsp;&nbsp;🎨 Styles

- **components**: 代码优化 &nbsp;-&nbsp; by @soybeanjs [<samp>(1e2fd)</samp>](https://github.com/honghuangdc/soybean-admin/commit/1e2fdda)
- **projects**: 路由相关文件夹简化 &nbsp;-&nbsp; by @honghuangdc [<samp>(e5793)</samp>](https://github.com/honghuangdc/soybean-admin/commit/e5793e1)

### &nbsp;&nbsp;&nbsp;❤️ Contributors

[![soybeanjs](https://github.com/soybeanjs.png?size=48)](https://github.com/soybeanjs)&nbsp;&nbsp;[![pany-ang](https://github.com/pany-ang.png?size=48)](https://github.com/pany-ang)&nbsp;&nbsp;[![honghuangdc](https://github.com/honghuangdc.png?size=48)](https://github.com/honghuangdc)&nbsp;&nbsp;[![bundlejs](https://github.com/bundlejs.png?size=48)](https://github.com/bundlejs)&nbsp;&nbsp;[![Lsq128](https://github.com/Lsq128.png?size=48)](https://github.com/Lsq128)&nbsp;&nbsp;[![honghuangdc](https://github.com/honghuangdc.png?size=48)](https://github.com/honghuangdc)&nbsp;&nbsp;[![yanbowe](https://github.com/yanbowe.png?size=48)](https://github.com/yanbowe)&nbsp;&nbsp;
[毛博文](mailto:maobowen@bonc.com.cn),&nbsp;[Liushengqun](mailto:18232366809@163.com),&nbsp;

## [v0.10.2](https://github.com/honghuangdc/soybean-admin/compare/v0.9.2...old-version) (23-06-07)

### &nbsp;&nbsp;&nbsp;🚀 Features

- **projects**:
  - 路由页面跳转权限完成 &nbsp;-&nbsp; by @soybeanjs [<samp>(0d2a5)</samp>](https://github.com/honghuangdc/soybean-admin/commit/0d2a562)
  - 集成naiveUI主题配置，将css vars添加至html &nbsp;-&nbsp; by @soybeanjs [<samp>(2c196)</samp>](https://github.com/honghuangdc/soybean-admin/commit/2c19684)
  - 初始化加载效果：应用主题颜色 &nbsp;-&nbsp; by @honghuangdc [<samp>(035fa)</samp>](https://github.com/honghuangdc/soybean-admin/commit/035fa11)
  - 登录页面开始迁移 &nbsp;-&nbsp; by @honghuangdc [<samp>(f5a36)</samp>](https://github.com/honghuangdc/soybean-admin/commit/f5a36a0)
  - 迁移登录完成 &nbsp;-&nbsp; by @soybeanjs [<samp>(b93b8)</samp>](https://github.com/honghuangdc/soybean-admin/commit/b93b80c)
  - 添加NaiveProvider组件 &nbsp;-&nbsp; by @honghuangdc [<samp>(c804b)</samp>](https://github.com/honghuangdc/soybean-admin/commit/c804b21)
  - 多级路由的所有子路由转换成二级路由 &nbsp;-&nbsp; by @honghuangdc [<samp>(85b55)</samp>](https://github.com/honghuangdc/soybean-admin/commit/85b55bb)
  - 新增BasicLayout布局 &nbsp;-&nbsp; by @soybeanjs [<samp>(00646)</samp>](https://github.com/honghuangdc/soybean-admin/commit/006467a)
  - 创建自定义布局组件SoybeanLayout &nbsp;-&nbsp; by @honghuangdc [<samp>(0653f)</samp>](https://github.com/honghuangdc/soybean-admin/commit/0653fb1)
  - 添加抽屉 &nbsp;-&nbsp; by @honghuangdc [<samp>(10e4d)</samp>](https://github.com/honghuangdc/soybean-admin/commit/10e4d81)
  - theme store完成 &nbsp;-&nbsp; by @soybeanjs [<samp>(bf020)</samp>](https://github.com/honghuangdc/soybean-admin/commit/bf020a8)
  - 主题配置抽屉：迁移暗黑模式、布局模式、添加颜色选择面板 &nbsp;-&nbsp; by @soybeanjs [<samp>(912bf)</samp>](https://github.com/honghuangdc/soybean-admin/commit/912bfdf)
  - 主题配置抽屉: 迁移其他功能 &nbsp;-&nbsp; by @soybeanjs [<samp>(6d132)</samp>](https://github.com/honghuangdc/soybean-admin/commit/6d132c5)
  - 添加头部折叠按钮 &nbsp;-&nbsp; by @honghuangdc [<samp>(a090d)</samp>](https://github.com/honghuangdc/soybean-admin/commit/a090d39)
  - 添加侧边菜单 &nbsp;-&nbsp; by @soybeanjs [<samp>(e25af)</samp>](https://github.com/honghuangdc/soybean-admin/commit/e25afe2)
  - 面包屑 &nbsp;-&nbsp; by @honghuangdc [<samp>(09c76)</samp>](https://github.com/honghuangdc/soybean-admin/commit/09c7658)
  - 请求拦截器添加刷新token &nbsp;-&nbsp; by @honghuangdc [<samp>(839b8)</samp>](https://github.com/honghuangdc/soybean-admin/commit/839b82b)
  - 细节完善 &nbsp;-&nbsp; by @soybeanjs [<samp>(cc290)</samp>](https://github.com/honghuangdc/soybean-admin/commit/cc290ac)
  - 迁移多页签 &nbsp;-&nbsp; by @soybeanjs [<samp>(28efb)</samp>](https://github.com/honghuangdc/soybean-admin/commit/28efbdb)
  - 细节完善、迁移页面 &nbsp;-&nbsp; by @soybeanjs [<samp>(ce531)</samp>](https://github.com/honghuangdc/soybean-admin/commit/ce531ce)
  - 添加页面缓存、记录在tab中的缓存页面的滚动条位置 &nbsp;-&nbsp; by @soybeanjs [<samp>(1d63a)</samp>](https://github.com/honghuangdc/soybean-admin/commit/1d63a83)
  - 添加缓存主题色 &nbsp;-&nbsp; by @soybeanjs [<samp>(37092)</samp>](https://github.com/honghuangdc/soybean-admin/commit/3709297)
  - 新版重构完成 &nbsp;-&nbsp; by @soybeanjs [<samp>(68b42)</samp>](https://github.com/honghuangdc/soybean-admin/commit/68b4230)
  - 迁移全局搜索菜单功能 &nbsp;-&nbsp; by @yanbowe [<samp>(554d7)</samp>](https://github.com/honghuangdc/soybean-admin/commit/554d7fd)

### &nbsp;&nbsp;&nbsp;🐞 Bug Fixes

- **components**:
  - 修复Tab在移动端设备无法点击的问题 &nbsp;-&nbsp; by @honghuangdc [<samp>(2c966)</samp>](https://github.com/honghuangdc/soybean-admin/commit/2c9660f)
- **projects**:
  - 修复redirect-not-found子路由 &nbsp;-&nbsp; by @honghuangdc [<samp>(5bfb8)</samp>](https://github.com/honghuangdc/soybean-admin/commit/5bfb819)
  - 去除Layout组件冗余代码 &nbsp;-&nbsp; by @honghuangdc [<samp>(0e783)</samp>](https://github.com/honghuangdc/soybean-admin/commit/0e783bc)
  - 修复面包屑数据 &nbsp;-&nbsp; by @honghuangdc [<samp>(28b5d)</samp>](https://github.com/honghuangdc/soybean-admin/commit/28b5d22)
  - 修复vertical-mix布局、重构初始化的loading &nbsp;-&nbsp; by @soybeanjs [<samp>(579e0)</samp>](https://github.com/honghuangdc/soybean-admin/commit/579e074)
  - 修复未登录时会调用获取用户路由的接口 &nbsp;-&nbsp; by @soybeanjs [<samp>(21bab)</samp>](https://github.com/honghuangdc/soybean-admin/commit/21bab1f)
  - 修复路由守卫的动态路由逻辑 &nbsp;-&nbsp; by @soybeanjs [<samp>(b61b0)</samp>](https://github.com/honghuangdc/soybean-admin/commit/b61b0ce)
  - vite配置修复 &nbsp;-&nbsp; by @soybeanjs [<samp>(facc0)</samp>](https://github.com/honghuangdc/soybean-admin/commit/facc00e)
  - 修复分析页和工作台的布局问题 &nbsp;-&nbsp; by @honghuangdc [<samp>(e93b9)</samp>](https://github.com/honghuangdc/soybean-admin/commit/e93b94c)
  - 修复项目配置拷贝功能 &nbsp;-&nbsp; by @soybeanjs [<samp>(a7a26)</samp>](https://github.com/honghuangdc/soybean-admin/commit/a7a269d)

### &nbsp;&nbsp;&nbsp;💅 Refactors

- **projects**:
  - 精简版+动态路由权限初步 &nbsp;-&nbsp; by @soybeanjs [<samp>(de205)</samp>](https://github.com/honghuangdc/soybean-admin/commit/de2057f)
  - 单独一级路由相关逻辑重构 &nbsp;-&nbsp; by @honghuangdc [<samp>(ab9a6)</samp>](https://github.com/honghuangdc/soybean-admin/commit/ab9a6a2)
  - 单独路由逻辑重构、路由转换函数优化 &nbsp;-&nbsp; by @soybeanjs [<samp>(b36a6)</samp>](https://github.com/honghuangdc/soybean-admin/commit/b36a62b)
  - 恢复pinia默认写法 &nbsp;-&nbsp; by @soybeanjs [<samp>(b2a4d)</samp>](https://github.com/honghuangdc/soybean-admin/commit/b2a4ddf)
  - 请求构造函数适配不同后端接口的数据结构 &nbsp;-&nbsp; by @soybeanjs [<samp>(4f9d5)</samp>](https://github.com/honghuangdc/soybean-admin/commit/4f9d544)
  - 细节完善 &nbsp;-&nbsp; by @soybeanjs [<samp>(651e5)</samp>](https://github.com/honghuangdc/soybean-admin/commit/651e58d)
  - 重构路由页面组件的导入 &nbsp;-&nbsp; by @honghuangdc [<samp>(e6503)</samp>](https://github.com/honghuangdc/soybean-admin/commit/e65034d)

### &nbsp;&nbsp;&nbsp;📖 Documentation

- **projects**:
  - update README.md &nbsp;-&nbsp; by @soybeanjs [<samp>(5eddb)</samp>](https://github.com/honghuangdc/soybean-admin/commit/5eddb49)
  - update README.md &nbsp;-&nbsp; by @soybeanjs [<samp>(02c51)</samp>](https://github.com/honghuangdc/soybean-admin/commit/02c51e6)
  - update README.md &nbsp;-&nbsp; by @honghuangdc [<samp>(47f28)</samp>](https://github.com/honghuangdc/soybean-admin/commit/47f2871)
  - update README.md &nbsp;-&nbsp; by @honghuangdc [<samp>(7ed5d)</samp>](https://github.com/honghuangdc/soybean-admin/commit/7ed5d0d)
  - update README.md &nbsp;-&nbsp; by @honghuangdc [<samp>(3befb)</samp>](https://github.com/honghuangdc/soybean-admin/commit/3befb22)

### &nbsp;&nbsp;&nbsp;📦 Build

- **projects**:
  - 修改vscode配置 &nbsp;-&nbsp; by @honghuangdc [<samp>(0c577)</samp>](https://github.com/honghuangdc/soybean-admin/commit/0c5770d)
  - 添加vercel打包的环境 &nbsp;-&nbsp; by @honghuangdc [<samp>(371fa)</samp>](https://github.com/honghuangdc/soybean-admin/commit/371fad4)
  - add license &nbsp;-&nbsp; by @soybeanjs [<samp>(b1672)</samp>](https://github.com/honghuangdc/soybean-admin/commit/b16721b)

### &nbsp;&nbsp;&nbsp;🏡 Chore

- **release**:
  - 0.1.1 精简版发布 &nbsp;-&nbsp; by @soybeanjs [<samp>(db3c2)</samp>](https://github.com/honghuangdc/soybean-admin/commit/db3c25e)
  - 0.1.2 &nbsp;-&nbsp; by @soybeanjs [<samp>(db75c)</samp>](https://github.com/honghuangdc/soybean-admin/commit/db75c91)
  - 0.1.3 &nbsp;-&nbsp; by @soybeanjs [<samp>(32a7c)</samp>](https://github.com/honghuangdc/soybean-admin/commit/32a7cc4)
  - 0.9.1 &nbsp;-&nbsp; by @soybeanjs [<samp>(be374)</samp>](https://github.com/honghuangdc/soybean-admin/commit/be37408)
  - 0.9.2 &nbsp;-&nbsp; by @honghuangdc [<samp>(11407)</samp>](https://github.com/honghuangdc/soybean-admin/commit/1140722)

### &nbsp;&nbsp;&nbsp;🎨 Styles

- **projects**: 路由相关文件夹简化 &nbsp;-&nbsp; by @honghuangdc [<samp>(e5793)</samp>](https://github.com/honghuangdc/soybean-admin/commit/e5793e1)

### &nbsp;&nbsp;&nbsp;❤️ Contributors

[![honghuangdc](https://github.com/honghuangdc.png?size=48)](https://github.com/honghuangdc)&nbsp;&nbsp;[![soybeanjs](https://github.com/soybeanjs.png?size=48)](https://github.com/soybeanjs)&nbsp;&nbsp;[![honghuangdc](https://github.com/honghuangdc.png?size=48)](https://github.com/honghuangdc)&nbsp;&nbsp;[![yanbowe](https://github.com/yanbowe.png?size=48)](https://github.com/yanbowe)&nbsp;&nbsp;

## [v0.9.2](https://github.com/honghuangdc/soybean-admin/compare/v0.9.1...v0.9.2) (2022-02-11)

### &nbsp;&nbsp;&nbsp;🚀 Features

- **projects**: 迁移全局搜索菜单功能 &nbsp;-&nbsp; by @yanbowe [<samp>(554d7)</samp>](https://github.com/honghuangdc/soybean-admin/commit/554d7fd)

### &nbsp;&nbsp;&nbsp;🐞 Bug Fixes

- **components**:
  - 修复Tab在移动端设备无法点击的问题 &nbsp;-&nbsp; by @honghuangdc [<samp>(2c966)</samp>](https://github.com/honghuangdc/soybean-admin/commit/2c9660f)
- **projects**:
  - vite配置修复 &nbsp;-&nbsp; by @soybeanjs [<samp>(facc0)</samp>](https://github.com/honghuangdc/soybean-admin/commit/facc00e)
  - 修复分析页和工作台的布局问题 &nbsp;-&nbsp; by @honghuangdc [<samp>(e93b9)</samp>](https://github.com/honghuangdc/soybean-admin/commit/e93b94c)
  - 修复项目配置拷贝功能 &nbsp;-&nbsp; by @soybeanjs [<samp>(a7a26)</samp>](https://github.com/honghuangdc/soybean-admin/commit/a7a269d)

### &nbsp;&nbsp;&nbsp;💅 Refactors

- **projects**: 重构路由页面组件的导入 &nbsp;-&nbsp; by @honghuangdc [<samp>(e6503)</samp>](https://github.com/honghuangdc/soybean-admin/commit/e65034d)

### &nbsp;&nbsp;&nbsp;📖 Documentation

- **projects**:
  - update README.md &nbsp;-&nbsp; by @soybeanjs [<samp>(02c51)</samp>](https://github.com/honghuangdc/soybean-admin/commit/02c51e6)
  - update README.md &nbsp;-&nbsp; by @honghuangdc [<samp>(47f28)</samp>](https://github.com/honghuangdc/soybean-admin/commit/47f2871)
  - update README.md &nbsp;-&nbsp; by @honghuangdc [<samp>(7ed5d)</samp>](https://github.com/honghuangdc/soybean-admin/commit/7ed5d0d)
  - update README.md &nbsp;-&nbsp; by @honghuangdc [<samp>(3befb)</samp>](https://github.com/honghuangdc/soybean-admin/commit/3befb22)

### &nbsp;&nbsp;&nbsp;📦 Build

- **projects**: add license &nbsp;-&nbsp; by @soybeanjs [<samp>(b1672)</samp>](https://github.com/honghuangdc/soybean-admin/commit/b16721b)

### &nbsp;&nbsp;&nbsp;🏡 Chore

- **release**: 0.9.2 &nbsp;-&nbsp; by @honghuangdc [<samp>(11407)</samp>](https://github.com/honghuangdc/soybean-admin/commit/1140722)

### &nbsp;&nbsp;&nbsp;❤️ Contributors

[![honghuangdc](https://github.com/honghuangdc.png?size=48)](https://github.com/honghuangdc)&nbsp;&nbsp;[![soybeanjs](https://github.com/soybeanjs.png?size=48)](https://github.com/soybeanjs)&nbsp;&nbsp;[![honghuangdc](https://github.com/honghuangdc.png?size=48)](https://github.com/honghuangdc)&nbsp;&nbsp;[![yanbowe](https://github.com/yanbowe.png?size=48)](https://github.com/yanbowe)&nbsp;&nbsp;

## [v0.9.1](https://github.com/honghuangdc/soybean-admin/compare/v0.1.3...v0.9.1) (2022-01-24)

### &nbsp;&nbsp;&nbsp;🚀 Features

- **projects**: 新版重构完成 &nbsp;-&nbsp; by @soybeanjs [<samp>(68b42)</samp>](https://github.com/honghuangdc/soybean-admin/commit/68b4230)

### &nbsp;&nbsp;&nbsp;🏡 Chore

- **release**: 0.9.1 &nbsp;-&nbsp; by @soybeanjs [<samp>(be374)</samp>](https://github.com/honghuangdc/soybean-admin/commit/be37408)

### &nbsp;&nbsp;&nbsp;❤️ Contributors

[![soybeanjs](https://github.com/soybeanjs.png?size=48)](https://github.com/soybeanjs)&nbsp;&nbsp;

## [v0.1.3](https://github.com/honghuangdc/soybean-admin/compare/v0.1.2...v0.1.3) (2022-01-24)

### &nbsp;&nbsp;&nbsp;🐞 Bug Fixes

- **projects**:
  - 修复未登录时会调用获取用户路由的接口 &nbsp;-&nbsp; by @soybeanjs [<samp>(21bab)</samp>](https://github.com/honghuangdc/soybean-admin/commit/21bab1f)
  - 修复路由守卫的动态路由逻辑 &nbsp;-&nbsp; by @soybeanjs [<samp>(b61b0)</samp>](https://github.com/honghuangdc/soybean-admin/commit/b61b0ce)

### &nbsp;&nbsp;&nbsp;💅 Refactors

- **projects**:
  - 请求构造函数适配不同后端接口的数据结构 &nbsp;-&nbsp; by @soybeanjs [<samp>(4f9d5)</samp>](https://github.com/honghuangdc/soybean-admin/commit/4f9d544)
  - 细节完善 &nbsp;-&nbsp; by @soybeanjs [<samp>(651e5)</samp>](https://github.com/honghuangdc/soybean-admin/commit/651e58d)

### &nbsp;&nbsp;&nbsp;🏡 Chore

- **release**: 0.1.3 &nbsp;-&nbsp; by @soybeanjs [<samp>(32a7c)</samp>](https://github.com/honghuangdc/soybean-admin/commit/32a7cc4)

### &nbsp;&nbsp;&nbsp;❤️ Contributors

[![soybeanjs](https://github.com/soybeanjs.png?size=48)](https://github.com/soybeanjs)&nbsp;&nbsp;

## [v0.1.2](https://github.com/honghuangdc/soybean-admin/compare/v0.1.1...v0.1.2) (2022-01-22)

### &nbsp;&nbsp;&nbsp;🚀 Features

- **projects**:
  - 添加页面缓存、记录在tab中的缓存页面的滚动条位置 &nbsp;-&nbsp; by @soybeanjs [<samp>(1d63a)</samp>](https://github.com/honghuangdc/soybean-admin/commit/1d63a83)
  - 添加缓存主题色 &nbsp;-&nbsp; by @soybeanjs [<samp>(37092)</samp>](https://github.com/honghuangdc/soybean-admin/commit/3709297)

### &nbsp;&nbsp;&nbsp;🏡 Chore

- **release**: 0.1.2 &nbsp;-&nbsp; by @soybeanjs [<samp>(db75c)</samp>](https://github.com/honghuangdc/soybean-admin/commit/db75c91)

### &nbsp;&nbsp;&nbsp;❤️ Contributors

[![soybeanjs](https://github.com/soybeanjs.png?size=48)](https://github.com/soybeanjs)&nbsp;&nbsp;

## [v0.1.1](https://github.com/honghuangdc/soybean-admin/compare/v0.0.5...v0.1.1) (2022-01-20)

### &nbsp;&nbsp;&nbsp;🚀 Features

- **projects**:
  - 添加路由跳转浏览器新标签 &nbsp;-&nbsp; by @honghuangdc [<samp>(987ce)</samp>](https://github.com/honghuangdc/soybean-admin/commit/987cef3)
  - 添加常用组件、composables函数 &nbsp;-&nbsp; by @soybeanjs [<samp>(230a5)</samp>](https://github.com/honghuangdc/soybean-admin/commit/230a50a)
  - 添加表格页面示例 &nbsp;-&nbsp; by @soybeanjs [<samp>(51c74)</samp>](https://github.com/honghuangdc/soybean-admin/commit/51c744c)
  - 增加Icon选择器组件 &nbsp;-&nbsp; by @yanbowe [<samp>(9472b)</samp>](https://github.com/honghuangdc/soybean-admin/commit/9472b51)
  - 图标选择器增加扩展树形 &nbsp;-&nbsp; by @yanbowe [<samp>(04101)</samp>](https://github.com/honghuangdc/soybean-admin/commit/041012b)
  - 增加项目文档外链 &nbsp;-&nbsp; by @yanbowe [<samp>(1901a)</samp>](https://github.com/honghuangdc/soybean-admin/commit/1901a0b)
  - 引入mockjs &nbsp;-&nbsp; by @soybeanjs [<samp>(9bc68)</samp>](https://github.com/honghuangdc/soybean-admin/commit/9bc682d)
  - 增加全局搜索菜单功能 &nbsp;-&nbsp; by @yanbowe [<samp>(b9ce6)</samp>](https://github.com/honghuangdc/soybean-admin/commit/b9ce691)
  - 菜单搜索增加大小写转换 &nbsp;-&nbsp; by @yanbowe [<samp>(29078)</samp>](https://github.com/honghuangdc/soybean-admin/commit/2907868)
  - 添加cryptojs，对本地缓存数据进行加密 &nbsp;-&nbsp; by @soybeanjs [<samp>(7a064)</samp>](https://github.com/honghuangdc/soybean-admin/commit/7a0648d)
  - 路由页面跳转权限完成 &nbsp;-&nbsp; by @soybeanjs [<samp>(0d2a5)</samp>](https://github.com/honghuangdc/soybean-admin/commit/0d2a562)
  - 集成naiveUI主题配置，将css vars添加至html &nbsp;-&nbsp; by @soybeanjs [<samp>(2c196)</samp>](https://github.com/honghuangdc/soybean-admin/commit/2c19684)
  - 初始化加载效果：应用主题颜色 &nbsp;-&nbsp; by @honghuangdc [<samp>(035fa)</samp>](https://github.com/honghuangdc/soybean-admin/commit/035fa11)
  - 登录页面开始迁移 &nbsp;-&nbsp; by @honghuangdc [<samp>(f5a36)</samp>](https://github.com/honghuangdc/soybean-admin/commit/f5a36a0)
  - 迁移登录完成 &nbsp;-&nbsp; by @soybeanjs [<samp>(b93b8)</samp>](https://github.com/honghuangdc/soybean-admin/commit/b93b80c)
  - 添加NaiveProvider组件 &nbsp;-&nbsp; by @honghuangdc [<samp>(c804b)</samp>](https://github.com/honghuangdc/soybean-admin/commit/c804b21)
  - 多级路由的所有子路由转换成二级路由 &nbsp;-&nbsp; by @honghuangdc [<samp>(85b55)</samp>](https://github.com/honghuangdc/soybean-admin/commit/85b55bb)
  - 新增BasicLayout布局 &nbsp;-&nbsp; by @soybeanjs [<samp>(00646)</samp>](https://github.com/honghuangdc/soybean-admin/commit/006467a)
  - 创建自定义布局组件SoybeanLayout &nbsp;-&nbsp; by @honghuangdc [<samp>(0653f)</samp>](https://github.com/honghuangdc/soybean-admin/commit/0653fb1)
  - 添加抽屉 &nbsp;-&nbsp; by @honghuangdc [<samp>(10e4d)</samp>](https://github.com/honghuangdc/soybean-admin/commit/10e4d81)
  - theme store完成 &nbsp;-&nbsp; by @soybeanjs [<samp>(bf020)</samp>](https://github.com/honghuangdc/soybean-admin/commit/bf020a8)
  - 主题配置抽屉：迁移暗黑模式、布局模式、添加颜色选择面板 &nbsp;-&nbsp; by @soybeanjs [<samp>(912bf)</samp>](https://github.com/honghuangdc/soybean-admin/commit/912bfdf)
  - 主题配置抽屉: 迁移其他功能 &nbsp;-&nbsp; by @soybeanjs [<samp>(6d132)</samp>](https://github.com/honghuangdc/soybean-admin/commit/6d132c5)
  - 添加头部折叠按钮 &nbsp;-&nbsp; by @honghuangdc [<samp>(a090d)</samp>](https://github.com/honghuangdc/soybean-admin/commit/a090d39)
  - 添加侧边菜单 &nbsp;-&nbsp; by @soybeanjs [<samp>(e25af)</samp>](https://github.com/honghuangdc/soybean-admin/commit/e25afe2)
  - 面包屑 &nbsp;-&nbsp; by @honghuangdc [<samp>(09c76)</samp>](https://github.com/honghuangdc/soybean-admin/commit/09c7658)
  - 请求拦截器添加刷新token &nbsp;-&nbsp; by @honghuangdc [<samp>(839b8)</samp>](https://github.com/honghuangdc/soybean-admin/commit/839b82b)
  - 细节完善 &nbsp;-&nbsp; by @soybeanjs [<samp>(cc290)</samp>](https://github.com/honghuangdc/soybean-admin/commit/cc290ac)
  - 迁移多页签 &nbsp;-&nbsp; by @soybeanjs [<samp>(28efb)</samp>](https://github.com/honghuangdc/soybean-admin/commit/28efbdb)
  - 细节完善、迁移页面 &nbsp;-&nbsp; by @soybeanjs [<samp>(ce531)</samp>](https://github.com/honghuangdc/soybean-admin/commit/ce531ce)

### &nbsp;&nbsp;&nbsp;🐞 Bug Fixes

- **deps**:
  - 降低vite版本 &nbsp;-&nbsp; by @honghuangdc [<samp>(c9c5c)</samp>](https://github.com/honghuangdc/soybean-admin/commit/c9c5ca9)
- **projects**:
  - 修复网络请求错误空信息的提示 &nbsp;-&nbsp; by @honghuangdc [<samp>(ff921)</samp>](https://github.com/honghuangdc/soybean-admin/commit/ff9216b)
  - 请求相关细节修复 &nbsp;-&nbsp; by @honghuangdc [<samp>(2ad1a)</samp>](https://github.com/honghuangdc/soybean-admin/commit/2ad1ad3)
  - 修复redirect-not-found子路由 &nbsp;-&nbsp; by @honghuangdc [<samp>(5bfb8)</samp>](https://github.com/honghuangdc/soybean-admin/commit/5bfb819)
  - 去除Layout组件冗余代码 &nbsp;-&nbsp; by @honghuangdc [<samp>(0e783)</samp>](https://github.com/honghuangdc/soybean-admin/commit/0e783bc)
  - 修复面包屑数据 &nbsp;-&nbsp; by @honghuangdc [<samp>(28b5d)</samp>](https://github.com/honghuangdc/soybean-admin/commit/28b5d22)
  - 修复vertical-mix布局、重构初始化的loading &nbsp;-&nbsp; by @soybeanjs [<samp>(579e0)</samp>](https://github.com/honghuangdc/soybean-admin/commit/579e074)

### &nbsp;&nbsp;&nbsp;💅 Refactors

- **projects**:
  - 登录模块由query变更为动态路由params &nbsp;-&nbsp; by @honghuangdc [<samp>(225c4)</samp>](https://github.com/honghuangdc/soybean-admin/commit/225c4fe)
  - 精简版+动态路由权限初步 &nbsp;-&nbsp; by @soybeanjs [<samp>(de205)</samp>](https://github.com/honghuangdc/soybean-admin/commit/de2057f)
  - 单独一级路由相关逻辑重构 &nbsp;-&nbsp; by @honghuangdc [<samp>(ab9a6)</samp>](https://github.com/honghuangdc/soybean-admin/commit/ab9a6a2)
  - 单独路由逻辑重构、路由转换函数优化 &nbsp;-&nbsp; by @soybeanjs [<samp>(b36a6)</samp>](https://github.com/honghuangdc/soybean-admin/commit/b36a62b)
  - 恢复pinia默认写法 &nbsp;-&nbsp; by @soybeanjs [<samp>(b2a4d)</samp>](https://github.com/honghuangdc/soybean-admin/commit/b2a4ddf)
- **styles**:
  - 样式调整 &nbsp;-&nbsp; by @honghuangdc [<samp>(f2910)</samp>](https://github.com/honghuangdc/soybean-admin/commit/f29106e)

### &nbsp;&nbsp;&nbsp;📖 Documentation

- **projects**:
  - update README.md &nbsp;-&nbsp; by @honghuangdc [<samp>(659e4)</samp>](https://github.com/honghuangdc/soybean-admin/commit/659e460)
  - update README.md &nbsp;-&nbsp; by @honghuangdc [<samp>(90ddf)</samp>](https://github.com/honghuangdc/soybean-admin/commit/90ddf98)
  - update README.md &nbsp;-&nbsp; by @soybeanjs [<samp>(5eddb)</samp>](https://github.com/honghuangdc/soybean-admin/commit/5eddb49)

### &nbsp;&nbsp;&nbsp;📦 Build

- **deps**:
  - 升级依赖 &nbsp;-&nbsp; by @soybeanjs [<samp>(ae7ec)</samp>](https://github.com/honghuangdc/soybean-admin/commit/ae7ec99)
  - 升级依赖 &nbsp;-&nbsp; by @soybeanjs [<samp>(e755c)</samp>](https://github.com/honghuangdc/soybean-admin/commit/e755caa)
  - 升级依赖 &nbsp;-&nbsp; by @honghuangdc [<samp>(f3c86)</samp>](https://github.com/honghuangdc/soybean-admin/commit/f3c86ef)
  - 升级依赖 &nbsp;-&nbsp; by @honghuangdc [<samp>(e776d)</samp>](https://github.com/honghuangdc/soybean-admin/commit/e776df4)
  - 升级依赖 &nbsp;-&nbsp; by @soybeanjs [<samp>(777cf)</samp>](https://github.com/honghuangdc/soybean-admin/commit/777cf8e)
- **projects**:
  - 环境变量获取方式变更 &nbsp;-&nbsp; by @honghuangdc [<samp>(21c2f)</samp>](https://github.com/honghuangdc/soybean-admin/commit/21c2f5a)
  - 修改vscode配置 &nbsp;-&nbsp; by @honghuangdc [<samp>(0c577)</samp>](https://github.com/honghuangdc/soybean-admin/commit/0c5770d)
  - 添加vercel打包的环境 &nbsp;-&nbsp; by @honghuangdc [<samp>(371fa)</samp>](https://github.com/honghuangdc/soybean-admin/commit/371fad4)

### &nbsp;&nbsp;&nbsp;🏡 Chore

- **release**: 0.1.1 精简版发布 &nbsp;-&nbsp; by @soybeanjs [<samp>(db3c2)</samp>](https://github.com/honghuangdc/soybean-admin/commit/db3c25e)

### &nbsp;&nbsp;&nbsp;🎨 Styles

- **projects**: 路由相关文件夹简化 &nbsp;-&nbsp; by @honghuangdc [<samp>(e5793)</samp>](https://github.com/honghuangdc/soybean-admin/commit/e5793e1)

### &nbsp;&nbsp;&nbsp;❤️ Contributors

[![soybeanjs](https://github.com/soybeanjs.png?size=48)](https://github.com/soybeanjs)&nbsp;&nbsp;[![honghuangdc](https://github.com/honghuangdc.png?size=48)](https://github.com/honghuangdc)&nbsp;&nbsp;[![yanbowe](https://github.com/yanbowe.png?size=48)](https://github.com/yanbowe)&nbsp;&nbsp;[![honghuangdc](https://github.com/honghuangdc.png?size=48)](https://github.com/honghuangdc)&nbsp;&nbsp;

## [v0.0.5](https://github.com/honghuangdc/soybean-admin/compare/v0.0.4...v0.0.5) (2021-11-28)

### &nbsp;&nbsp;&nbsp;🚀 Features

- **projects**: 新增组件页面：按钮、卡片示例 &nbsp;-&nbsp; by @soybeanjs [<samp>(bdc39)</samp>](https://github.com/honghuangdc/soybean-admin/commit/bdc39af)

### &nbsp;&nbsp;&nbsp;🐞 Bug Fixes

- **components**: 修复HorizontalLayout布局 &nbsp;-&nbsp; by @soybeanjs [<samp>(9fb64)</samp>](https://github.com/honghuangdc/soybean-admin/commit/9fb641f)

### &nbsp;&nbsp;&nbsp;💅 Refactors

- **projects**:
  - 重构路由类型和路由元数据类型，重构多级菜单路由写法 &nbsp;-&nbsp; by @soybeanjs [<samp>(d6838)</samp>](https://github.com/honghuangdc/soybean-admin/commit/d683894)
  - 优化路由导入页面写法，页面路由调整 &nbsp;-&nbsp; by @soybeanjs [<samp>(0b10b)</samp>](https://github.com/honghuangdc/soybean-admin/commit/0b10b50)

### &nbsp;&nbsp;&nbsp;📦 Build

- **deps**: 升级依赖 &nbsp;-&nbsp; by @soybeanjs [<samp>(a6bdc)</samp>](https://github.com/honghuangdc/soybean-admin/commit/a6bdc38)

### &nbsp;&nbsp;&nbsp;🏡 Chore

- **release**: 0.0.5 &nbsp;-&nbsp; by @soybeanjs [<samp>(e53e7)</samp>](https://github.com/honghuangdc/soybean-admin/commit/e53e793)

### &nbsp;&nbsp;&nbsp;❤️ Contributors

[![soybeanjs](https://github.com/soybeanjs.png?size=48)](https://github.com/soybeanjs)&nbsp;&nbsp;

## [v0.0.4](https://github.com/honghuangdc/soybean-admin/compare/v0.0.3...v0.0.4) (2021-11-25)

### &nbsp;&nbsp;&nbsp;🚀 Features

- **components**: 添加多页签Tab点击后自动往中间滚动 &nbsp;-&nbsp; by @soybeanjs [<samp>(8ce62)</samp>](https://github.com/honghuangdc/soybean-admin/commit/8ce627a)
- **projects**: 新增网址导航页面 &nbsp;-&nbsp; by @honghuangdc [<samp>(32aa5)</samp>](https://github.com/honghuangdc/soybean-admin/commit/32aa5ee)
- **storage**: local存储增加有效期 &nbsp;-&nbsp; by @yanbowe [<samp>(e6c9b)</samp>](https://github.com/honghuangdc/soybean-admin/commit/e6c9b35)

### &nbsp;&nbsp;&nbsp;🐞 Bug Fixes

- **components**:
  - 修复多页签Tab自动滚动问题 &nbsp;-&nbsp; by @soybeanjs [<samp>(20aa3)</samp>](https://github.com/honghuangdc/soybean-admin/commit/20aa39f)
  - 修复多页签按钮风格的tab滚动问题 &nbsp;-&nbsp; by @soybeanjs [<samp>(c429c)</samp>](https://github.com/honghuangdc/soybean-admin/commit/c429cd0)
- **projects**:
  - 修复打包构建时图标错误 &nbsp;-&nbsp; by @soybeanjs [<samp>(93f9a)</samp>](https://github.com/honghuangdc/soybean-admin/commit/93f9aa9)
  - 添加西瓜视频实例在onUnMounted的销毁，多页签居中距离精确 &nbsp;-&nbsp; by @soybeanjs [<samp>(73896)</samp>](https://github.com/honghuangdc/soybean-admin/commit/738964a)
- **types**:
  - 添加dotEnv类型的非空判断 &nbsp;-&nbsp; by @soybeanjs [<samp>(cff11)</samp>](https://github.com/honghuangdc/soybean-admin/commit/cff11d9)

### &nbsp;&nbsp;&nbsp;💅 Refactors

- **components**:
  - blankLayout引入GlobalContent &nbsp;-&nbsp; by @soybeanjs [<samp>(1ffb7)</samp>](https://github.com/honghuangdc/soybean-admin/commit/1ffb75a)
- **projects**:
  - axios处理的请求结果去除网路状态 &nbsp;-&nbsp; by @honghuangdc [<samp>(05696)</samp>](https://github.com/honghuangdc/soybean-admin/commit/0569666)
  - 文件夹位置规范 &nbsp;-&nbsp; by @honghuangdc [<samp>(f5a5f)</samp>](https://github.com/honghuangdc/soybean-admin/commit/f5a5f44)
  - 细节完善 &nbsp;-&nbsp; by @honghuangdc [<samp>(62611)</samp>](https://github.com/honghuangdc/soybean-admin/commit/6261156)

### &nbsp;&nbsp;&nbsp;📖 Documentation

- **projects**:
  - update README.md &nbsp;-&nbsp; by @soybeanjs [<samp>(54577)</samp>](https://github.com/honghuangdc/soybean-admin/commit/54577f1)
  - update README.md &nbsp;-&nbsp; by @honghuangdc [<samp>(1b346)</samp>](https://github.com/honghuangdc/soybean-admin/commit/1b3463d)
  - update README.md &nbsp;-&nbsp; by @honghuangdc [<samp>(98a7d)</samp>](https://github.com/honghuangdc/soybean-admin/commit/98a7d25)

### &nbsp;&nbsp;&nbsp;🏡 Chore

- **release**: 0.0.4 &nbsp;-&nbsp; by @soybeanjs [<samp>(8b27f)</samp>](https://github.com/honghuangdc/soybean-admin/commit/8b27fc8)

### &nbsp;&nbsp;&nbsp;❤️ Contributors

[![soybeanjs](https://github.com/soybeanjs.png?size=48)](https://github.com/soybeanjs)&nbsp;&nbsp;[![honghuangdc](https://github.com/honghuangdc.png?size=48)](https://github.com/honghuangdc)&nbsp;&nbsp;[![yanbowe](https://github.com/yanbowe.png?size=48)](https://github.com/yanbowe)&nbsp;&nbsp;

## [v0.0.3](https://github.com/honghuangdc/soybean-admin/compare/v0.0.2...v0.0.3) (2021-11-23)

### &nbsp;&nbsp;&nbsp;💅 Refactors

- **projects**:
  - 请求函数重构初步 &nbsp;-&nbsp; by @soybeanjs [<samp>(9f643)</samp>](https://github.com/honghuangdc/soybean-admin/commit/9f64321)
  - axios封装：文件夹规范，错误处理完善 &nbsp;-&nbsp; by @honghuangdc [<samp>(451c7)</samp>](https://github.com/honghuangdc/soybean-admin/commit/451c754)
  - axios封装完成 &nbsp;-&nbsp; by @soybeanjs [<samp>(03b39)</samp>](https://github.com/honghuangdc/soybean-admin/commit/03b398a)

### &nbsp;&nbsp;&nbsp;📦 Build

- **deps**:
  - 升级依赖 &nbsp;-&nbsp; by @soybeanjs [<samp>(4e04a)</samp>](https://github.com/honghuangdc/soybean-admin/commit/4e04a8f)
  - 升级依赖 &nbsp;-&nbsp; by @soybeanjs [<samp>(c8122)</samp>](https://github.com/honghuangdc/soybean-admin/commit/c81221e)

### &nbsp;&nbsp;&nbsp;🏡 Chore

- **release**: 0.0.3 &nbsp;-&nbsp; by @honghuangdc [<samp>(e1dac)</samp>](https://github.com/honghuangdc/soybean-admin/commit/e1dacdb)

### &nbsp;&nbsp;&nbsp;❤️ Contributors

[![honghuangdc](https://github.com/honghuangdc.png?size=48)](https://github.com/honghuangdc)&nbsp;&nbsp;[![soybeanjs](https://github.com/soybeanjs.png?size=48)](https://github.com/soybeanjs)&nbsp;&nbsp;



