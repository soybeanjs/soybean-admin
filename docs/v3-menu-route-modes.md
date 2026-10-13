# 菜单/路由数据模式的兼容方案探讨

> 状态：**已定案并落地**（方案 B + 工具 P1；详见 §7）。§6.5 / §7 的原文保留作对照，落地结果在各节末尾标注。
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

**落地后**：产地其实有三个，但都是同一份文件的投影 —— `pnpm menu:sync` 从页面文件生成它、seed 把它写进 DB、static 模式直接 import 它。

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

**落地结果**：`src/store/modules/menu/shared.ts` 导出 `AppMenu`（= `src/schema/menu.ts` 的 `MenuSource`）与 `buildMenuTree`；static 侧 `loadStaticMenus` 对应 unify 的 `buildMenuByStaticMenus`，但**只补 `routePath`**（`routeLayout` / `routeComponent` 由 `transformMenuToRoute` 从 `row` 直接读，不经中间表示）；`validateMenuRoutes` 对应 `validateRoute` 并多了 directory 前缀校验。与 unify 的差异：unify 的 `App.StaticMenu` 把开关字段也剔出去了，本仓库保留（菜单与 DB 行同形，seed 直接可用）。

---

## 5. 开发者工具（方案 B 的配套）

### 5.1 工具只做「增量补缺」，不自动决定顺序/位置

必须守的三条约束，否则手写数据会被覆盖：

1. **按 `routeName` 增量 merge**：路由新增 → 追加条目（`name` / `icon` / `order` 留空待填）；已存在 → 一个字段都不动；路由消失 → 只打警告，不删。
2. **机器产物与人产物分文件**：`src/menus/_generated.json`（工具写，含 `pending: true` 标记）+ `src/menus/menus.json`（人写，覆盖标题/图标/顺序/层级）。单文件双写是冲突来源。
   → **落地时改为单文件**（`src/menus/menus.json`）。此约束要防的是「工具覆盖人工字段」，实际实现只用更窄的规则就消掉了这个风险：工具**只刷新从页面文件重算的派生字段**（`routePath` / `routeComponent` / `keepAlive` / `multiTab` / `pinned`）与**只追加**新条目，而 `name` / `icon` / `i18nKey` / `order` / `parentId` 等审美决定**一个字段都不动**。降到一个文件的好处是「菜单在哪」只有一个答案 —— 两个文件反而让「这条到底算人工还是机器」成为新的含糊点。代价：工具不能再往条目里写 `pending: true`（会与人工字段混在一起），新增条目以 `order: DEFAULT_ORDER`（= 999）末位插入作标记。
3. **面板写回原子替换 + 固定 JSON 格式**（2 空格缩进、键序稳定），否则每次 git diff 全是噪声。

### 5.2 拖拽排序 / 换父的边界

- **order 无法推断**，只能：新建条目给路径字典序初值 + `pending: true`，人在面板里改。
  → 落地实现给的是 `order: DEFAULT_ORDER`（999，末位）而非字典序，人改起来更好找。
- **换父（拖进别的目录）实际改的是 `routePath`**，而 `routePath` 来自文件路径 → 拖拽不能直接写文件。正解：**拖拽改的是 `parentId` + 可选 `routePath` 覆盖（存在 JSON 里，不改页面文件路径）**。这要求 `routePath` 与文件路径解耦 —— `transformMenuToRoute` 已经用 `row.routePath` 而非文件路径，本来就是解耦的。
  → 落地后：static 模式下 `routePath` 实际由 `loadStaticMenus` 从**路由表**取（不是从菜单 JSON 取），所以换父只需改 `parentId`；`routePath` 想脱离文件路径时手写的值只在路由表查不到该 `routeName` 时分生效。层级调整无需动页面文件。

### 5.3 分期

| 期  | 内容                                                                                | 估计     |
| --- | ----------------------------------------------------------------------------------- | -------- |
| P1  | `scripts/menu-sync.ts` → `pnpm menu:sync`：`scanPages` + diff + 补缺 + 孤立条目清单 | 2-3 小时 |
| P2  | `scripts/menu-watch.ts`：vite 插件监听 `src/pages/**` 变更触发 P1                   | +4 小时  |
| P3  | `addDevToolsTab` + `addDevServerHandler`：拖拽排序/换父写回 JSON                    | +1-2 天  |

**P1 / P2 已完成**（`pnpm menu:sync`；dev 下自动触发）。P3 未开工，记在 `docs/v3-task.md` 的 M-14。

> **P2 未走 ubean module**（与本文原计划不同）：`ubean.config.ts` 的 `modules` 只在 `ubean build` CLI 的 `prepareBuild` 里被 `resolveModules` 解析，`@ubean/build` 只解构 `{ plugins }`，`serverHandlers` / `devServerHandlers` / `devToolsTabs` 三个数组**无人消费**；`vp dev`（裸 Vite）下注入的 `modules` 探针 25 秒 0 次命中 —— 即该路径在 dev 下完全不执行。所以 P2 做成 `vite.config.ts` 的 `plugins` 项。

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

> **落地后更新**：本节写于 `lite` 分支摸底期，当时列的 4 条缺口**已全部补齐**（第 3、4 项在本文撰写之后的 P3-07/P3-08 落地，第 1、2 项随方案 B 落地）。下文保留原文以记录当时的判断，落点见每条末尾。

现状恰好是两种策略各取其一，缺的只有两处：

1. **static 模式没有角色判权**：`src/router/guard.ts:48-51` 只判了 `requiresAuth`，没有角色检查。
   → **已补齐**：`src/router/guard.ts` 已判 `to.meta.roles` + `hasRole`（`src/shared/permission.ts`，语义 = super 恒过 + required 空放行 + 交集，与 v2 等价）。唯一真实用例 `src/pages/function/super-page/index.vue:29`（`roles: ['super']`）。**M-07 核对通过，无需改动。**
2. **dynamic 模式的 `exist-path` 没接进 guard**：403 形同虚设。
   → **已补齐**：`src/router/guard.ts` 在 `isNotFound && dynamic` 时 `POST /menu/exist-path`，判定抽在 `src/shared/route-exist.ts` 的 `shouldTreatMissingRouteAsForbidden`（纯函数 + 单测）。

相关现状证据（原文）：

- `src/router/guard.ts:70` 的 dynamic 首跳 hack（`String(to.name) === 'NotFound'` 回放）只处理了「路由刚注册」，没处理「存在但无权限 → 403」。
  → 回放保留（首跳时菜单未初始化，NotFound 是假阳性），随后才做 `exist-path` 反查，两段互不冲突。
- `src/service/api/menu.ts:14` 已有 `fetchIsRouteExist(query)` → `POST /api/menu/exist-path`，`src/routes/api/menu/(r)/exist-path.ts` 服务端已实现，但 guard 未调用。
  → **已调用**（`src/router/guard.ts:110`）。注：`src/service/api/menu.ts` 已退役，统一走 `api.get` / `api.post`。
- `src/typings/app.d.ts` 的 `AppRouteMeta` **没有 `roles` 字段**（只有 title / i18nKey / icon / order / hideInMenu / cache / multiTab / pinned / menuId / layout）。auth store 只有 `isStaticSuper` getter（`src/store/modules/auth/index.ts:38`），没有 `hasAnyRole`。
  → **已加**：`AppRouteMeta.roles?: string[]`，由 `src/utils/route-meta.ts` 做运行时收窄（全仓唯一的 `RouteMeta → AppRouteMeta` 信任边界）。角色判定没有另造 `hasAnyRole`，直接用 `src/shared/permission.ts` 的 `hasRole`（与 `v-auth` 指令同一份语义）。
- 全仓无 403 页面：grep `403` 只出现在 `src/service/api/menu.ts` 与 `src/routes/api/menu/(r)/exist-path.ts` 的注释里。
  → **已有**：`src/pages/403.vue`（`name: 'Forbidden'`，`layout: 'blank'`）。

**已收口（M-08）**：① `menuService.isMenuRouteExist` 的 `routePath` 分支改为取全部非空 `routePath` 后用 `findHonoRouteByPath` 逐条模板匹配（原先 `eq` 全等，`/manage/user/:id` 反查不到）；② guard 反查前用 `stripLocalePrefix(to.path, APP_LOCALES)` 剥掉已解析地址里的语言前缀。**原方案写错了**：这里要的不是 `normalizeRoutePath` —— 它剥的是路由**模板**里的 `:locale(en)?`，而 `to.path` 是已解析的 `/en/about`，正则不匹配；需要的是「剥掉首段等于某个 locale code」的另一个函数。`findHonoRouteByPath` 由此获得第一个调用点。

> **M-06 已修**（API 侧同一类缺陷，与本条无关但同一根因）：`src/middleware/01.auth.ts` 原先也用**具体请求路径**拼权限码，`GET /api/user/123` 产出 `api:get:(/user/123)`，与登记的模板码 `api:get:(/user/[id])` 永不相等 → 带路径参数的端点 RBAC 全失效。修法是读 `c.req.routePath`（hono 按 `routeIndex` 反查注册表得到的**模板**）并统一走新增的 `buildApiPermissionCode(method, routePath)`（`src/shared/route.ts`），`permission.service` 的 `resolveResourceBinding` 共用同一函数。`exist-path` 的菜单侧收口（本条）仍未做。

---

## 7. 待落地清单

> **本节是原始清单，落地状态见下表末列。** 实施后的实际路径与本表有两处不同：文件叫 `src/menus/menus.json`（不是 `index.json`）；`routeComponent` 的编码从 legacy 的 `layout.base$view.xxx` 改为**页面相对路径**（`manage/user/index.vue`），旧格式仍兼容。

| #   | 改动                                                                      | 文件                                                                                                        | 估计     | 状态                                                                                                                                                                                                                                                                                                                                                   |
| --- | ------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------- | -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| 1   | 建单一菜单源，seed 改为 import                                            | 新建 `src/menus/menus.json`；改 `src/db/seed-data.ts`                                                       | 20 分钟  | ✅ 44 条（由 `pnpm menu:sync` 从真实页面生成）；`seedMenus` 改为 `parse(menuSourceFileSchema, menusSource).menus`；seed 菜单计数断言 6 → 44。旧 6 条 legacy 路由名（`home` / `system_user` / …）整体删除。**顺带修实缺陷**：旧 `M_about` 的 `requiresAuth: 'N'` 是唯一公开菜单，生成时曾误写成 `'Y'`，被 RBAC 集成测试（`public` 返回 `[]`）当场捉住。 |
| 2   | `App.Menu[]` 定为 static/dynamic 统一中间表示                             | `src/store/modules/menu/index.ts`                                                                           | 1-2 小时 | ✅ 新建 `src/store/modules/menu/shared.ts`（`buildMenuTree` 是**唯一建树点**）+ `src/schema/menu.ts` 新增 `menuSourceSchema`（`AppMenu = MenuSource`）。两条路径不再各自建树。                                                                                                                                                                         |
| 3   | static 模式补角色判权（`AppRouteMeta.roles` + `hasAnyRole` + guard 判定） | `src/typings/app.d.ts`、`src/typings/router.d.ts`、`src/store/modules/auth/index.ts`、`src/router/guard.ts` | 1 小时   | ✅ 已于此前的 P3-07 落地（未另造 `hasAnyRole`，用 `src/shared/permission.ts` 的 `hasRole`）。                                                                                                                                                                                                                                                          |
| 4   | dynamic 模式 `exist-path` 接进 guard，区分 403/404；补 403 页面           | `src/router/guard.ts`、新建 `src/pages/403.vue`、`src/locales/{zh,en}.json`                                 | 1 小时   | ✅ 已于此前的 P3-08 落地（`src/shared/route-exist.ts` 纯函数 + 单测）；参数路由与 locale 前缀的反查已由 M-08 补齐（`findHonoRouteByPath` + `stripLocalePrefix`）。                                                                                                                                                                                     |
| 5   | `routePath` 建树 + directory 前缀校验（仅 dynamic 建树与 dev 断言）       | `src/services/menu.service.ts`、`src/store/modules/menu/index.ts`                                           | 1 小时   | ✅ **已完成**。按用户决定建树走 `parentId`（方案 A 已否决），`routePath` 降级为校验——两处都已落地：`shared.ts` 的 `validateMenuRoutes`（dev 启动期，菜单源快照）与 `menu.service.ts` 的 `validateDirectoryPrefix`（**写入时**，create/update 两入口，两个方向）。同时 `validateMenuTypeConstraints` 放行了 directory 的 `routePath`（M-02）。          |
| 6   | 菜单同步脚本（P1）                                                        | 新建 `scripts/menu-sync.ts`                                                                                 | 2-3 小时 | ✅ `pnpm menu:sync`（`node scripts/menu-sync.ts`）。**未按原计划分 `_generated.json`** —— 只用「只刷新派生字段 + 只追加、绝不改人工字段、绝不删」把风险消掉，多一个文件反而让「菜单到底在哪」变两份（理由写在脚本头注释）。已实测幂等。                                                                                                                |
| 7   | 更新 `docs/v3.md` §5.3 / §5.5，同步 `docs/v3-task.md`                     | `docs/`                                                                                                     | 20 分钟  | ✅ §5.3 已加链接；本文件 §6.5 / §7 / §8 已更新；`docs/v3-task.md` 新增 Phase 6 表（M-01…M-14）。                                                                                                                                                                                                                                                       |

**落地后的真实数据流（一条，不再分叉）**：

```
                  ┌─ static ─ src/menus/menus.json ─┐
页面文件（事实）──┴─ dynamic ─ DB seed（同一份）─────┴─> GET /api/menu/user
                                                            ↓
                                          loadStaticMenus / 直接映射
                                                            ↓
                                                      AppMenu[]
                                                            ↓
                                      buildMenuTree（唯一建树点）
                                                            ↓
                                                    MenuTreeNode[]
```

路由本身仍从页面文件自动生成（`src/pages/**`），菜单的 `routePath` 在 static 模式下被路由表的真实 path 覆盖 —— 所以**改页面文件名不会把菜单跳错**，这是 `loadStaticMenus` 存在的理由。

---

## 8. 未验证 / 风险

> 落地后逐条收口（原文保留，结论跟在后面）。

- `addDevToolsTab` 的 `component` 字段实际如何被 devframe 消费：只在 `@ubean/config` 里看到类型定义（`interface DevToolsCustomTab { id: string; title: string; icon?: string; component?: any }`）与 `push` 逻辑（`ctx._devToolsTabs.push(tab)`），`@ubean/devtools` 包未在 `node_modules/@ubean/` 下直接可见（可能仅在 `devtools: true` 时才解析）。P3 前需实测。
  → **部分实测**：`node_modules/@ubean/` 下确实**没有** `@ubean/devtools` 包；全 `node_modules/.pnpm/` grep `_devToolsTabs` / `devServerHandlers` / `_serverHandlers` 除 `@ubean/config` 自身外**零命中**，且 `@ubean/build` 调 `resolveModules` 时只取 `{ plugins }`。所以 P3 开工前必须先在 devframe 里实测一个自定义 tab 能不能渲染出来（或改用自建 dev 路由 + 页面）。风险仍为未消除。
- `scanPages` 的独立调用签名未读函数体，可能需要 `UbeanRouter` 实例或 `cwd` 参数。P1 前需实测。
  → **已实测**：`scanPages({ cwd, srcDir, pagesDir, ignore })` 可独立调用（`scanPages` 从 `@ubean/vue/vite` 导出，不在 `@ubean/scan` 的运行时导出里）。扫出 53 页，44 条进菜单。**踩到的坑**：`pnpm menu:sync` 走普通 `node`，**不能 import `@/` 别名模块**（`@ubean/vue/vite` 与 type-only import 可以）。
- `routePath` 段与历史种子数据是否全部一致：只核对了 schema 与部分种子，未全量校验。
  → **已核实为完全不一致**：历史 seed 的 `routeName` 是 legacy elegant-router 约定（`home` / `system_user` / `about`），真实页面是 ubean 的 `Index` / `ManageUserIndex` / `AboutIndex`；`routeComponent: 'layout.base$view.xxx'` 指向已不存在的 `src/views`。已整体替换（见 §7 第 1 项）。
- 目录节点（无对应路由）的可点击性：`src/layouts/default.vue:81` 的 `resolveMenuItems` 递归映射时是否需要跳过无路由的节点，未实测。
  → **悬空**：当前 44 条菜单**没有 directory 行**，所以没触发。一旦引入纯分组目录（`routePath` 有、无 `routeName`），需确认 `resolveMenuItems` 不会把目录渲染成可导航项。
- static 模式 `roles` 的判定语义需与 v2 对齐（v2 是 `authStore.isStaticSuper || !routeRoles.length || hasRole`），落 `hasAnyRole` 时不要引入行为差异。
  → **已核对等价**：`src/shared/permission.ts` 的 `hasRole` 是「super 恒过 + required 空放行 + 交集」，与 v2 逐项等价（M-07）。未另造 `hasAnyRole`。

### 8.1 落地过程新发现的坑

- **`resolveJsonModule` 会把 JSON 字面量放宽成 `string`**：直接 `import menus.json` 拿不到 `menuType: 'directory' \| 'menu' \| …` 的窄类型，`seedMenus: NewMenu[]` 会报 TS2322。解决：在契约单一来源 `src/schema/menu.ts` 加 `menuSourceSchema` + `parseMenuSource(raw)`，全仓唯一的 JSON → 领域类型的信任边界（与 `src/utils/route-meta.ts` 收窄 `RouteMeta` 同一套路）。注意用 `optional(nullable(x))` 而**不是** `optional(x, default)` —— 后者的 `InferOutput` 仍收窄成必填，无法兼容手写 JSON。
- **`definePage(` 出现在注释里会“劫持”扫描**：`extractDefinePageFromCode` → `findBalancedCall` 取 script 块内**第一处** `definePage(`，命中注释即导致该页 meta 全丢（`src/pages/function/multi-tab/index.vue:10` 就这么丢了 title/i18nKey/icon/order，菜单从 45 条掉到 44 条）。已改为普通文字。**后续写注释不要出现 `definePage(` 字面量。**
- **`extractDefinePageFromCode` 返回的 `meta` 是实时引用**：脚本直接改会污染扫描器缓存，必须浅拷贝后再改。
- **`pipeline 排序 bug 顺带修了**：旧 `buildMenuTree`的`sortTree`用`node.value`（= `routeName \|\| code`）去查以 `id`为键的 Map，order 恒落 0。新的`buildMenuTree` 「先排好序再挂父」，每层自然有序。
- **`ubean.config.ts` 的 `modules` 在 `vp dev` 下不执行**：探针（`modules: [{ name, setup, vitePlugin: { configureServer } }]`）在 `vp dev` 25 秒内 0 次命中。`resolveModules` 只在 `ubean build` CLI 的 `prepareBuild` 里被调用，且 `@ubean/build` 只解构 `{ plugins }`。**dev 期钩子必须写成 `vite.config.ts` 的 vite 插件**；`@ubean/config` 的 `addDevToolsTab` / `addDevServerHandler` 目前是死路径（P3 需另找挂点）。
- **`_` 前缀页面文件不参与扫描**：`scanPages` 忽略 `_` 开头的文件（`src/pages/_placeholder.vue` 即此例）。用探针文件测 watcher 时要避开这个前缀，否则「触发成功但计数不变」看起来像 watcher 没工作。
- **菜单同步写回必须比对内容**：`syncMenus` 若每次都无条件 `writeFileSync`，会刷新 `menus.json` 的 mtime，dev 下被 vite 监听到并反复重载（日志里刷 `page reload src/menus/menus.json`）。改为「内容没变就不写」后消失。
