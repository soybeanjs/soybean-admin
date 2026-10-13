# 菜单/路由数据模式的兼容方案探讨

> 状态：设计探讨（未落地）
> 关联：`docs/v3.md` §5.3 路由与菜单一元模型、§5.5 鉴权流程
> 对照实现：`soybean-admin@main`（v2，elegant-router legacy）、`soybean-unify`（elegant-router main）、本仓库 `lite` 分支（ubean 文件路由）

本文记录一次针对「同时支持前端定义菜单与后端加载菜单」的调研与方案论证，包含事实核验结论、候选方案对比、待落地清单与风险。

---

## 1. 背景

需要同时支持两种菜单数据模式：

- **static（前端定义）**：菜单在前端产生，不依赖后端接口即可导航。
- **dynamic（后端加载）**：菜单由后端下发，按用户权限过滤。

历史包袱：v2 为了能从路由**反推**菜单树，对页面文件结构施加了约束（目录 + `_` 分隔的扁平文件名），社区对此评价偏负面。新版 `elegant-router` 删掉了菜单树生成逻辑，`soybean-unify` 因此改成手写静态菜单 JSON。

---

## 2. 核心事实（核验结论）

### 2.1 两种模式的差异不在「数据源」，在「谁拥有路由定义」

`main` 分支的 dynamic 模式让后端直接下发 `ElegantConstRoute[]`：

```ts
// main:src/typings/api/route.d.ts
interface MenuRoute extends ElegantConstRoute {
  id: string;
}
interface UserRoute {
  routes: MenuRoute[];
  home: LastLevelRouteKey;
}
```

static 模式则由文件系统生成**同形状**的 routes。两者共用同一个消费者 `transformElegantRoutesToVueRoutes` —— 这才是 v2「同时支持两模式」的真正机制，而不是「支持两种数据源」。

### 2.2 社区负面声音的来源是文件名约束

legacy 的菜单树必须从「目录 + `_` 分隔的扁平文件名」反推（`transformRouterEntriesToTrees` + `splitRouterName('a_b_c') → ['a','a_b','a_b_c']`），页面文件结构被迫贴着菜单结构走。新版删除该逻辑后，static 模式失去了菜单的凭空来源。

### 2.3 菜单结构 ≠ 路由结构

三个项目的共同收敛点：最终都喂给 `transformToVueRoutes(routes, layouts, views)`。该函数把扁平路由按 `layout` 分组，塞进 `/${layout}-layout` 的 `children`，**children 是平铺的，不做嵌套**。

而菜单只用到路由的 `name / path / layout / component / meta(title, i18nKey, icon, order, hideInMenu)`。菜单是展示层的树形投影，路由是扁平的。

### 2.4 ubean 的 routeName 无分隔符，不能用前缀判父子

`node_modules/@ubean/vue/dist/vite.js` 的 `generateRouteName`：

```js
function generateRouteName(routePath) {
  if (routePath === '/' || routePath === '') return 'Index';
  const segments = routePath.replace(/^\//, '').replace(/\/$/, '').split('/');
  const nameSegments = [];
  for (const segment of segments) {
    if (segment.startsWith('(') && segment.endsWith(')')) continue;
    /* [...p] → All{P}；[[p]] → {P}Optional；[p] → {P}；其余 pascalCase */
    nameSegments.push(pascalCase(segment));
  }
  return nameSegments.join('') || 'Index';
}
```

段间无分隔符：`pages/system/user/index.vue` → `SystemUser`，`pages/system/index.vue` → `System`。**用 name 前缀匹配判父子会误判（`System` / `Systematic`）。**

同时 `stripRouteGroups` 会剥掉 `(group)` 段，因此 `(builtin)/login.vue` 的 path 是 `/login` —— **group 目录天然不进菜单层级**，等于白送一个「分组但不显示」的机制。

### 2.5 后端表早已是通用菜单表

`src/db/schema/menu.ts`（drizzle sqlite）的菜单行自带 `routePath` / `routeName` / `routeLayout` / `routeComponent` / `keepAlive` / `multiTab` / `pinned` 等列，与 `soybean-unify` 的 `packages/schema/src/schema/menu.ts` 字段基本一致（后者额外有 `staticRoles`）。

两列的语义分工：

- `routePath` → **层级**（`/system/user` 的父是 `/system`）
- `routeName` → **身份**（菜单行 ↔ 路由的唯一标识）

唯一与前端路由插件耦合的是 `routeComponent` 的视图名编码格式（v2: `layout.base$view.system_menu`；lite 的 `parseViewName` 从同一字符串里正则抽出 `system_menu`）。

### 2.6 ubean 暴露的扩展点（工具化无需改 ubean）

| 需要的能力                                  | ubean 提供的                                                                                                |
| ------------------------------------------- | ----------------------------------------------------------------------------------------------------------- |
| 从 `src/pages/**` 推出 `{name, path, meta}` | `@ubean/scan` 导出 `scanPages` / `filePathToRoute` / `generateRouteName` / `stripRouteGroups`               |
| 挂本地模块                                  | `ubean.config.ts` 的 `modules: ModuleConfiguration[]`，接受 `ModuleDefinition { setup, hooks, vitePlugin }` |
| dev 起 HTTP 端点                            | `addDevServerHandler`                                                                                       |
| 文件变动自动跑                              | `addVitePlugin` + 钩子 `dev:setup` / `dev:listen` / `build:before`                                          |
| 面板 UI                                     | `addDevToolsTab({ id, title, icon, component })`                                                            |

`GeneratorOptions.getRouteMeta?: (page: ScannedPage) => Record<string, unknown> | null` 是**不改页面文件就注入 meta** 的官方扩展点。注意 `renderRouteRecord` 会把 `requiresAuth` / `cache` 提升到路由记录顶层，不进 `meta`。

---

## 3. 方案 A（已否决）：从路由反推菜单树

思路：static 模式下 `getRouter().getRoutes()` 拿到扁平路由，按 `routePath` 的路径段建树，中间层目录节点自动合成。

**否决原因**：这不是「一份数据两个出口」，而是「从一份数据反推另一份数据」。反推不出 `order`（排序）、反推不出 `parentId`（换父），目录的标题/图标还得靠「正好有个 `pages/system/index.vue`」去承载。等于用文件系统约束换来了半个菜单，正是 legacy 被批评的路径。

**保留价值**：`routePath` 建树本身是对的（§2.4），可以降级为 dynamic 侧的**建树与校验工具** —— 校验 directory 行的 `routePath` 必须是其子项 `routePath` 的前缀。

---

## 4. 方案 B（推荐）：一份菜单源数据，两个出口

### 4.1 心智模型

> 菜单永远有一份持久化的源数据；static 模式的源是仓库里的 JSON，dynamic 模式的源是数据库。路由都从源推导。

static / dynamic 因此不是两种模式，而是同一份 `ApiMenuRow[]` 的两个产地。

### 4.2 单一来源消除种子漂移

现状是 `src/db/seed-data.ts` 写菜单种子，static 模式还要另写一份，两份必然漂移。改成：

```
src/menus/menus.json      ← 单一菜单源（人手写 + 工具补缺）
src/db/seed-data.ts       ← import menus.json，seed 进 DB
static 模式                ← import menus.json，不请求 API
dynamic 模式               ← seed 后的 API 返回
```

### 4.3 对照 `soybean-unify` 的实现

unify 的关键设计：static 与 dynamic 在 store 层收敛成同一个 `App.Menu[]` 中间表示，`autoRoutes` 只认菜单。

- `src/store/menu/shared.ts` 的 `buildMenuByStaticMenus(statics: App.StaticMenu[], routes: AutoRouterRoute[])`：以 `routeName` 为键从生成的路由表里补齐 `routeLayout` / `routeComponent` / `routeRedirect`；查不到则 `console.warn` 并跳过。
- `App.StaticMenu = Omit<Menu, 'routePath'|'routeLayout'|'routeComponent'|'routeRedirect'|'keepAlive'|'multiTab'|'pinned'>` —— **静态菜单只保留「结构 + 身份」，路由字段全由生成的路由表补**。
- `src/store/route/shared.ts` 的 `validateRoute(routeName, routePath)` 用 `getRoutePath(routeName)` 校验名字↔路径映射一致，不一致 warn。

本仓库可照搬这个收敛点，把 `App.Menu[]` 定为 static / dynamic 的统一中间表示。

---

## 5. 开发者工具（方案 B 的配套）

### 5.1 工具只做「增量补缺」，不自动决定顺序/位置

必须守的三条约束，否则手写数据会被覆盖：

1. **按 `routeName` 增量 merge**：路由新增 → 追加条目（`name` / `icon` / `order` 留空待填）；已存在 → 一个字段都不动；路由消失 → 只打警告，不删。
2. **机器产物与人产物分文件**：`src/menus/_generated.json`（工具写，含 `pending: true` 标记）+ `src/menus/index.json`（人写，覆盖标题/图标/顺序/层级）。单文件双写是冲突来源。
3. **面板写回原子替换 + 固定 JSON 格式**（2 空格缩进、键序稳定），否则每次 git diff 全是噪声。

### 5.2 拖拽排序 / 换父的边界

- **order 无法推断**，只能：新建条目给路径字典序初值 + `pending: true`，人在面板里改。
- **换父（拖进别的目录）实际改的是 `routePath`**，而 `routePath` 来自文件路径 → 拖拽不能直接写文件。正解：**拖拽改的是 `parentId` + 可选 `routePath` 覆盖（存在 JSON 里，不改页面文件路径）**。这要求 `routePath` 与文件路径解耦 —— `transformMenuToRoute` 已经用 `row.routePath` 而非文件路径，本来就是解耦的。

### 5.3 分期

| 期  | 内容                                                                                | 估计     |
| --- | ----------------------------------------------------------------------------------- | -------- |
| P1  | `scripts/menu-sync.ts` → `pnpm menu:sync`：`scanPages` + diff + 补缺 + 孤立条目清单 | 2-3 小时 |
| P2  | 本地 ubean module：`addVitePlugin` 监听 `src/pages/**` 变更触发 P1                  | +4 小时  |
| P3  | `addDevToolsTab` + `addDevServerHandler`：拖拽排序/换父写回 JSON                    | +1-2 天  |

### 5.4 明确不做

- 自动删条目、自动决定 order、自动改 `routePath` 重命名页面文件。
- 改后端 schema（现有列够用）。
- **把菜单结构写回页面文件的 `definePage`** —— 那正是 legacy 被批评的原因，工具一上手就退回老路。

---

## 6. 路由注册策略对比

### 6.1 安全边界不在注册策略上

两种策略下页面代码都在 `dist` 里（懒加载 chunk 也是），拿到 URL 就能直接请求 chunk。**注册的是路由表，不是权限。** 真正的守门人是后端接口。

「只注册有权限的路由」的唯一安全收益是**不暴露路由清单**（path / name / meta），防的是信息泄露与爬虫，不是越权访问。

### 6.2 逐项差别

|               | 只注册有权限                                     | 全量注册 + guard 判权                                          |
| ------------- | ------------------------------------------------ | -------------------------------------------------------------- |
| guard 逻辑    | 需要 `NotFound` 反查「路由存在吗」               | 直接读 `to.meta.roles`                                         |
| 额外请求      | 需要 `/route/isRouteExist` 或 `/menu/exist-path` | 无                                                             |
| 首跳处理      | 需要「NotFound 回放」                            | 不需要                                                         |
| 菜单 API 依赖 | 硬依赖：接口挂了 = 无法导航                      | 软依赖：只影响菜单渲染                                         |
| 路由清单暴露  | 否                                               | 是（bundle 内可读）                                            |
| 首屏体积      | 一样                                             | 一样（component 是 `() => import()` 懒加载，注册不加载 chunk） |

最后一行是常见误解：全量注册**不增加首屏 JS**，只是多了几张路由表条目。

### 6.3 v2 的真实做法是「混合」

```ts
// main:src/router/guard/route.ts:139
const exist = await routeStore.getIsAuthRouteExist(to.path as RoutePath);
if (exist) return { name: noPermissionRoute }; // → 403
```

`getIsAuthRouteExist`（`main:src/store/modules/route/index.ts:295`）里 static 模式走 `isRouteExistByRouteName(routeName, staticAuthRoutes)` 本地查，dynamic 模式走 `fetchIsRouteExist` 发请求。

即：**注册的是有权限的子集；`NotFound` 捕获后再查一次「是否存在但无权限」来区分 404 与 403。** dynamic 模式的 `/route/isRouteExist`（本仓库对应 `POST /api/menu/exist-path`）纯粹是为了补上这个信息缺口而存在。

### 6.4 dynamic 模式根本没有「全量注册」这个选项

- **static**：`src/router/_generated/routes.ts` 含全部路由 → 前端天然持有全量，全量注册是零成本默认行为。
- **dynamic**：前端唯一路由来源是 `GET /api/menu/user`，只返回用户可见的。要全量注册只能复用 `/api/menu/all`（管理端点，会把全部菜单数据暴露给任何登录用户），或新增只含路由字段的端点（语义上仍是在「让前端知道它不该知道的路由」）。

**正确结论不是「选哪种」，而是「按模式分别选」：**

- static：全量注册 + guard 读 `meta.roles` + 403
- dynamic：只注册有权限的 + `exist-path` 区分 403/404

### 6.5 本仓库现状与缺口

现状恰好是两种策略各取其一，缺的只有两处：

1. **static 模式没有角色判权**：`src/router/guard.ts:48-51` 只判了 `requiresAuth`，没有角色检查。
2. **dynamic 模式的 `exist-path` 没接进 guard**：403 形同虚设。

相关现状证据：

- `src/router/guard.ts:70` 的 dynamic 首跳 hack（`String(to.name) === 'NotFound'` 回放）只处理了「路由刚注册」，没处理「存在但无权限 → 403」。
- `src/service/api/menu.ts:14` 已有 `fetchIsRouteExist(query)` → `POST /api/menu/exist-path`，`src/routes/api/menu/(r)/exist-path.ts` 服务端已实现，但 guard 未调用。
- `src/typings/app.d.ts` 的 `AppRouteMeta` **没有 `roles` 字段**（只有 title / i18nKey / icon / order / hideInMenu / cache / multiTab / pinned / menuId / layout）。auth store 只有 `isStaticSuper` getter（`src/store/modules/auth/index.ts:38`），没有 `hasAnyRole`。
- 全仓无 403 页面：grep `403` 只出现在 `src/service/api/menu.ts` 与 `src/routes/api/menu/(r)/exist-path.ts` 的注释里。

---

## 7. 待落地清单

| #   | 改动                                                                      | 文件                                                                                                        | 估计     |
| --- | ------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------- | -------- |
| 1   | 建单一菜单源，seed 改为 import                                            | 新建 `src/menus/menus.json`；改 `src/db/seed-data.ts`                                                       | 20 分钟  |
| 2   | `App.Menu[]` 定为 static/dynamic 统一中间表示                             | `src/store/modules/menu/index.ts`                                                                           | 1-2 小时 |
| 3   | static 模式补角色判权（`AppRouteMeta.roles` + `hasAnyRole` + guard 判定） | `src/typings/app.d.ts`、`src/typings/router.d.ts`、`src/store/modules/auth/index.ts`、`src/router/guard.ts` | 1 小时   |
| 4   | dynamic 模式 `exist-path` 接进 guard，区分 403/404；补 403 页面           | `src/router/guard.ts`、新建 `src/pages/403.vue`、`src/locales/{zh,en}.json`                                 | 1 小时   |
| 5   | `routePath` 建树 + directory 前缀校验（仅 dynamic 建树与 dev 断言）       | `src/services/menu.service.ts`、`src/store/modules/menu/index.ts`                                           | 1 小时   |
| 6   | 菜单同步脚本（P1）                                                        | 新建 `scripts/menu-sync.ts`                                                                                 | 2-3 小时 |
| 7   | 更新 `docs/v3.md` §5.3 / §5.5，同步 `docs/v3-task.md`                     | `docs/`                                                                                                     | 20 分钟  |

---

## 8. 未验证 / 风险

- `addDevToolsTab` 的 `component` 字段实际如何被 devframe 消费：只在 `@ubean/config` 里看到类型定义（`interface DevToolsCustomTab { id: string; title: string; icon?: string; component?: any }`）与 `push` 逻辑（`ctx._devToolsTabs.push(tab)`），`@ubean/devtools` 包未在 `node_modules/@ubean/` 下直接可见（可能仅在 `devtools: true` 时才解析）。P3 前需实测。
- `scanPages` 的独立调用签名未读函数体，可能需要 `UbeanRouter` 实例或 `cwd` 参数。P1 前需实测。
- `routePath` 段与历史种子数据是否全部一致：只核对了 schema 与部分种子，未全量校验。
- 目录节点（无对应路由）的可点击性：`src/layouts/default.vue:81` 的 `resolveMenuItems` 递归映射时是否需要跳过无路由的节点，未实测。
- static 模式 `roles` 的判定语义需与 v2 对齐（v2 是 `authStore.isStaticSuper || !routeRoles.length || hasRole`），落 `hasAnyRole` 时不要引入行为差异。
