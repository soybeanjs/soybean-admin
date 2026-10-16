# v3 注释沉淀（注释清理回收站）

> 本文件收拢 `src/**` / `test/**` / `scripts/**` 中被精简掉的长注释原文，共 **453 条**（N-001 – N-449、N-454 – N-457；另有 N-450 – N-453 只在下面的注意事项汇编里，来自 `src/router/guard/**` 的拆分）。
> 代码里只保留「这是什么 / 必须怎么做」的一两行说明，**为什么这么做**的历史推理放在这里；
> 代码注释里出现 `docs/v3-notes.md N-0xx` 时即指向对应条目（当前 356 处引用、覆盖 214 个文件）。
> 重建完整注释时，把该条目正文按原位置贴回即可；条目正文就是压缩前的原文，带原始缩进与 ``` 围栏。

## 目录

- **工程根 / 应用入口**：27 条（N-001 – N-027）
- **布局与样式**：44 条（N-028 – N-071）
- **路由 / 守卫 / 中间件**：24 条（N-072 – N-095）
- **store**：35 条（N-096 – N-130）
- **shared 纯函数**：63 条（N-131 – N-193）
- **schema（Valibot 契约）**：31 条（N-194 – N-224）
- **services / request / db**：35 条（N-225 – N-259）
- **constants / utils / composables**：30 条（N-260 – N-289）
- **pages**：97 条（N-290 – N-386）
- **scripts**：15 条（N-387 – N-401）
- **test**：45 条（N-402 – N-446）
- **登录页与 SSR 豁免 / 外观切换**：4 条（N-447 – N-449、N-457）
- **菜单下拉 / 语言切换**：3 条（N-454 – N-456）

## 注意事项汇编（从现有代码注释汇总，供项目文档参考）

> 下面是清理后仍留在代码里的「是什么 / 必须怎么做」短注释，按目录分组。
> 想知道**为什么**这么做，按 id 去下面的原始条目里查。

### scripts

- **N-387** `scripts/dependency-manifest.ts:1` — 构建期依赖清单（about 页数据源，P3-08）。 把解析搬到构建期，产物里只剩最终表格数据（`vite.config.ts` 通过 `define` 注入 `__DEPENDENCIES__`），`yaml` 也就只需要是开发依赖。
- **N-388** `scripts/dependency-manifest.ts:44` — 从任意值里读一个「字符串 → 字符串」对象字段。
- **N-389** `scripts/dependency-manifest.ts:64` — 从任意值里读一个「字符串 → 字符串记录」的两层对象字段（`catalogs.<name>`）。
- **N-390** `scripts/dependency-manifest.ts:101` — 把 `package.json` 里的依赖版本声明解析成展示值。
- **N-391** `scripts/menu-sync.ts:7` — `pnpm menu:sync` —— 用页面文件补齐 `src/menus/menus.json`（文档 §5 的 P1）。 必须与文件系统一致，否则 `router.push` 跳错页 —— 所以它们不接受人工覆盖。
- **N-392** `scripts/menu-sync.ts:13` — 与 `src/store/modules/menu/shared.ts` 的 `AppMenu` 对齐的字段顺序。
- **N-393** `scripts/menu-sync.ts:137` — 执行一次对账并写回 `src/menus/menus.json`。
- **N-394** `scripts/menu-watch.ts:4` — `menu:watch`（文档 §5.3 的 P2 / M-13）—— dev 期页面文件变更时自动跑 `pnpm menu:sync`。 只监听 `src/pages/**` 的**新增 / 删除 / 重命名**（`add` / `unlink`），因为只有这三类会改变「有哪些页面」这个机器事实。
- **N-395** `scripts/remove-i18n.ts:2` — `pnpm remove:i18n` —— 一键裁剪国际化（v3 §4.5「保留 `remove-i18n` 裁剪脚本」）。 给不需要多语言的模板用户用：把 `src/**` 里 `t('key')` / `$t('key')` 的**字面量调用**就地替换成默认语言（`src/constants/index.ts` 的 `DEFAULT_LOCALE`）文案，再拆掉 i18n 基础设施（`src/locales/`、`src/shared/vean-locale.ts`、`ubean.config.ts
- **N-396** `scripts/remove-i18n.ts:19` — 残留扫描的「活跃 i18n API」模式。
- **N-397** `scripts/remove-i18n.ts:31` — 有意保留 `useI18n` 装配的文件（相对仓库根，POSIX 分隔）。

### src/app.ts

- **N-002** `src/app.ts:22` — 写入首屏主题信封（P2-10）。 用户在 `SThemeCustomizer` 里调过配色/圆角时，`__VEAN_THEME` 信封已经是更完整的那份真值，`seedPresetState` 会自己跳过；只有「首次访问 / 信封被清」时才按持久化的 `presetName` + `mode` 种一次。
- **N-003** `src/app.ts:30` — 应用入口（ubean 约定：`src/app.ts`）。 预构建优化；SSR 状态水合需另配 `serializeState` / `hydrateState`（Phase 0 `ssr: false`，暂不需要）。

### src/app.vue

- **N-004** `src/app.vue:14` — 应用根组件（ubean 的 `appRoot` 文件约定）。 框架出口（布局链 + 页面）从**默认插槽**注入，所以这里必须 `<slot />`：绝不渲染 `<PageView />`，否则会绕过布局链。
- **N-005** `src/app.vue:25` — 把应用 locale 直接交给 SConfigProvider 做组件文案 locale。 `zh` / `en` 里**只有 `en` 是 Vean（`@vean/aria/locale`）出厂注册的 key**；中文出厂的 key 是 `zh-CN`，而未知 key 会被静默回落到 `en`。
- **N-006** `src/app.vue:50` — locale → `<html lang>` / `<html dir>` 同步。
- **N-007** `src/app.vue:56` — 灰色 / 色弱滤镜（P2-10）写在 `<html>` 上。

### src/components:count-to

- **N-028** `src/components/count-to/index.vue:22` — 计数源从 0 起：服务端渲染与首帧必须一致，否则水合时数字会跳变/报 mismatch。

### src/components:enabled-tag

- **N-029** `src/components/enabled-tag/index.vue:7` — 启用状态标签（P3-03）。 8 套 CRUD表格共用，避免每页重复一份颜色/文案映射。

### src/components:exception-base

- **N-030** `src/components/exception-base/index.vue:11` — 异常页统一壳（P3-07，替代 unify 的 `components/exception-base.vue`）。 异常页需要的是大插图 + 码 + 标题 + 说明 + 动作组的完整版面。

### src/components:global-search

- **N-031** `src/components/global-search/index.vue:13` — 全局搜索（P2-11）。
- **N-032** `src/components/global-search/index.vue:62` — `SCommand` 的 items：分组打包 + 菜单文案解析。
- **N-033** `src/components/global-search/shared.ts:1` — 全局搜索（P2-11）的纯逻辑部分。 菜单树是搜索的唯一数据源；把派生逻辑从组件里拆出来是为了能单测 —— 仓库里没有 DOM 测试环境（`vitest.config.ts` 是 `environment: 'node'`），组件层测不了，但「树 → 条目」是纯函数。
- **N-034** `src/components/global-search/shared.ts:39` — 展平菜单树。

### src/components:global-watermark

- **N-036** `src/components/global-watermark/index.vue:8` — 全局水印（P2-12）。 `SWatermark` 的 `fullscreen` 把遮罩做成 `fixed inset-0 z-9999 pointer-events-none`，所以这里挂在应用根部即可，不必包裹内容 ，也不会挡住交互。

### src/components:manage-page

- **N-037** `src/components/manage-page/index.vue:9` — manage 页统一外壳（P3-03，v3 §4.6「统一范式」）。 把骨架收敛到这里，页面只留「列定义 + 字段单元格 + 弹窗」，避免 8 份几乎逐字相同的模板漂移。

### src/components:manage-search

- **N-039** `src/components/manage-search/index.vue:5` — manage 页搜索卡外壳（P3-03）。 差异只在字段本身，因此字段由页面经默认插槽塞进来，按钮与`<form>` 元素（`type="submit"` 生效的前提）收敛在这里。

### src/components:manage-search-select.vue

- **N-038** `src/components/manage-search-select.vue:8` — 搜索卡里的枚举下拉（P3-03 修正）。 存在的唯一理由是 `@vean/aria` 把**空串**保留给「未选择」语义：`shouldShowPlaceholder(v)` 判定 `isNullish(v) || v === '' || []`，且`SelectItem` 在 `setup` 里对 `value === ''` 直接抛错。

### src/components:theme-bridge.vue

- **N-041** `src/components/theme-bridge.vue:7` — 主题桥（P2-10）—— 必须挂在 `SConfigProvider` **内部**。 干两件单向同步的事：这是唯一同时改生效样式和 `__VEAN_THEME` 信封的入口：抽屉与 provider 的主题上下文是兄弟关系，拿不到它，只能经这里落地。

### src/components:theme-drawer

- **N-043** `src/components/theme-drawer/appearance-panel.vue:73` — `ui.root` 必须显式给 `w-full h-full`：`ui` 覆盖走 tailwind-merge **叠加**，而 recipe 默认是 `w-96 max-w-[calc(100vw-2rem)] max-h-fit h-[70vh]` —— 不显式给尺寸类，`w-96`（384px）与 `h-[70vh]`（实测 630px）都会留下来。
- **N-044** `src/components/theme-drawer/index.vue:22` — 抽屉容器样式覆盖。 `showConfirm` / `showCancel` 显式关掉：SDrawer 默认渲染一整条确认/取消页脚，但主题抽屉的改动是**即时生效**的（每个控件直接写 store / provider 信封），没有「草稿 → 提交」语义，默认的「确认」按钮点了不做事，反而让人以为还需要保存。
- **N-045** `src/components/theme-drawer/shared.ts:1` — 主题抽屉的共享件（P2-10）。 这些只在 `src/components/theme-drawer/` 内部使用，所以放在同目录的`shared.ts`，而不是 `src/shared/`（后者是跨模块的纯逻辑）。
- **N-047** `src/components/theme-drawer/shared.ts:50` — 布局模式缩略图（P2-10 布局 Tab）。
- **N-048** `src/components/theme-drawer/shared.ts:102` — 下拉/分段控件回传的 `string | number` → 精确的字面量联合。
- **N-049** `src/components/theme-drawer/shared.ts:122` — 「下拉控件 ↔ store 字段」的双向代理。 写入统一走 `setThemeSettings`（一次 `computed` 定义，八个下拉共用），面板里不出现 `@update:modelValue` 的手写窄化，也不需要类型断言。
- **N-050** `src/components/theme-drawer/shared.ts:166` — 把 `SInputNumber` 回传的 `null` 收敛为兜底值。

### src/composables/use-echarts.ts

- **N-260** `src/composables/use-echarts.ts:36` — echarts 按需注册（P3-01 起，v2 `hooks/common/echarts.ts` 的移植）。 Canvas 渲染器。新增图表类型时**在这里加一行**，不要在页面里
- **N-261** `src/composables/use-echarts.ts:87` — 图表生命周期钩子（v3 §4.6：v2 `useEcharts` 保留）。 负责三件事：容器尺寸就绪后 init、尺寸变化 resize、明暗切换重建实例（echarts 的主题只在 init 时生效，切主题必须 dispose + init）。

### src/composables/use-hydrated.ts

- **N-263** `src/composables/use-hydrated.ts:4` — 客户端挂载门控（水合一致性工具）。 应用是 SSR 首屏 + 客户端水合。
- **N-264** `src/composables/use-hydrated.ts:19` — 派生一个「水合前用占位值、水合后用真值」的 computed。 `fallback` 必须与服务端渲染结果一致（通常是空串 / `'-'` / `'U'`）。

### src/composables/use-manage-options.ts

- **N-265** `src/composables/use-manage-options.ts:6` — 管理端下拉选项（P3-03）。 文案一律写成静态字面量 key，**不能**用 `t(labelKeys[value])` 这类动态取值：`scripts/remove-i18n` 只能内联字面量 key，动态调用会留下无法裁剪的 `useI18n`装配（`test/specs/scripts/remove-i18n.test.ts` 断言 `plan.leftovers ===
- **N-267** `src/composables/use-manage-options.ts:92` — 表单值 → `SSelect` 的选项值（`''` → `'all'`）。

### src/composables/use-table-operate.ts

- **N-268** `src/composables/use-table-operate.ts:6` — 表格 operate 弹窗 / 搜索 / 刷新范式（v3 §5.7，P3-02）。 `t()` 只能在 setup 上下文用 → 走 `useI18n()`，不再有 unify 的
- **N-269** `src/composables/use-table-operate.ts:19` — 管理页（8 套 CRUD 列表页）的查询状态：分页字段 + 排序 + 各页自己的搜索字段。

### src/composables/use-vchart.ts

- **N-272** `src/composables/use-vchart.ts:10` — VChart 生命周期（P4-01，v2 `hooks/common/vchart.ts` 的移植）。 差异只在库本身：只销毁不重建（`canRender()`）；否则沿用上一个实例的主题。
- **N-273** `src/composables/use-vchart.ts:33` — VChart 生命周期钩子。

### src/constants/error-code.ts

- **N-274** `src/constants/error-code.ts:1` — 业务错误码表（v3 §6.1 统一响应契约）。 响应格式恒为 `{ code, message, data }`：`0000` 表示成功，其余为业务码。

### src/constants/index.ts

- **N-275** `src/constants/index.ts:1` — 应用常量。
- **N-276** `src/constants/index.ts:16` — 应用 locale 列表。 注意：Vean（`@vean/aria/locale`）出厂只注册 `en` 与 `zh-CN`，且未知 key**静默回落到 `en`**。
- **N-277** `src/constants/index.ts:27` — locale → 展示名（**各语言的原生写法**，切语言时不变形）。 语言下拉的单一来源：`APP_LOCALES` 加一项 + 此处补一行即可，不要在视图里写 `if (value === 'zh')` 这类硬编码分支。

### src/constants/layout.ts

- **N-278** `src/constants/layout.ts:1` — 布局模式（v2 语义名）与 Vean 壳模式的映射（P2-01 / P2-20）。
- **N-279** `src/constants/layout.ts:7` — key 用 v2 命名（`vertical` / `horizontal` / …），`shell` 是 `@vean/ui` 的`AppShellMode`（6 模式）。 `mobile` 标记该模式在 <768px 下是否需要退化为纯侧栏（Vean 的`app-shell.vue` 在移动端本来就固定渲染 `sidebar` 骨架，见`resolveShellCapabilities()`：矩阵把这件事显式化，而不是靠隐式副作用）。

### src/constants/manage.ts

- **N-280** `src/constants/manage.ts:1` — 管理端常量（P3-03）。 标签**不在这里**：文案必须以静态字面量 key 的 `t()` 调用形式写在组件/组合式函数里，才能被 `scripts/remove-i18n` 内联（`test/remove-i18n.test.ts` 断言`plan.leftovers === []`）。

### src/constants/service.ts

- **N-282** `src/constants/service.ts:3` — 请求层业务码配置（v3 §5.4，来自 `.env` 的 `SERVICE_*` 环境变量）。

### src/constants/theme.ts

- **N-283** `src/constants/theme.ts:1` — 主题 / 布局的可选项常量（P2-10 ~ P2-15）。 `label` 一律是 **i18n key**（不是文案字面量）：这些表要进主题抽屉，切语言时必须由 `t()` 解析。
- **N-284** `src/constants/theme.ts:35` — 水印时间格式（7 种，对齐 v2 `watermarkTimeFormatOptions`）。

### src/db/index.ts

- **N-225** `src/db/index.ts:12` — 数据库接线（v3 §6.2，P1-02）。 ubean 的 `Database` 面是裸 `{ sql, exec, close }`；框架对 connector 的处理是：全局 `$db0Create` 未注册时**静默回落内存库**，因此必须在任何 defineDatabase调用前 `registerDb0Create` 显式接线：连接目标由 `DATABASE_URL`
- **N-226** `src/db/index.ts:164` — 应用 drizzle 实例（类型化查询用）。

### src/db/migrations.ts

- **N-227** `src/db/migrations.ts:5` — SQLite 建表 DDL（与 src/db/schema 13 表一一对应，v3 §6.1）。 约定（P1-08）：注意：ubean runMigrations 的 Migration.up 是**纯 SQL 字符串**（直接 db.exec），不是回调。
- **N-228** `src/db/migrations.ts:183` — 0003：api 表自然键 + 鉴权链路索引（§5.1 / §5.2 配套）。 `(method, path)` 唯一索引同时是治理幽灵行/重复登记的手段。

### src/db/schema

- **N-229** `src/db/schema/menu.ts:7` — 菜单表（unify menu 移植，最宽的业务表）。
- **N-230** `src/db/schema/shared.ts:5` — 公共列（v3 §6.1 P1-08 数据模型约定）：SQLite 移植说明（源自 unify pg-core）： 主键：UUID v7 字符串（应用层生成，趋势递增）；

### src/db/seed-data.ts

- **N-231** `src/db/seed-data.ts:14` — Seed 数据（v3 §6.2：dev 默认库带演示数据）。
- **N-232** `src/db/seed-data.ts:60` — 菜单种子 = 仓库里的菜单源数据（`src/menus/menus.json`），不在这里另写一份。 为什么必须同源（`docs/v3-menu-route-modes.md` §4.2）：菜单有两份就必然漂移。
- **N-233** `src/db/seed-data.ts:176` — API 清单（RBAC 权限码的资源来源）。 **必须与 `src/routes/api/**` 的真实路由一一对应**（§5.2-5）：路由有了而这里没有，该端点就没有权限点可授予，只剩 super 角色能访问 —— 「接口裸奔」（authorization.md §4.3）。

### src/db/seed.ts

- **N-234** `src/db/seed.ts:15` — Seed 执行器（幂等：INSERT OR IGNORE，可重复执行）。

### src/directives/auth.ts

- **N-072** `src/directives/auth.ts:5` — `v-auth` 权限指令 + `useAuth()` 组合式函数（v3 §4.6 按钮级权限）。 用法：指令只在 `mounted` 执行一次（与 v2 语义一致：按钮可见性不随运行期切换，切账号后走整页重载）。

### src/env.server.ts

- ~~**N-008** `src/env.server.ts:3`~~ — **文件已删除（P0-D）**。服务端环境变量的声明点迁到 `ubean.config.ts` 的 `env.schema`（`context: 'server'`），取值改从 `ubean:env/server` 具名导入。原注释正文保留在下方 `### N-008`。

### src/env.ts

- ~~**N-009** `src/env.ts:1`~~ — **文件已删除（P0-D）**。客户端环境变量的声明点迁到 `ubean.config.ts` 的 `env.schema`（`context: 'client'`），取值改从 `ubean:env/client` 具名导入；不再需要 `VITE_` 前缀。原注释正文保留在下方 `### N-009`。

### src/layouts/default.vue

- **N-051** `src/layouts/default.vue:29` — 默认布局：`SAppShell` 全接线（v3 §5.2 后台壳）。 （close/pin/drag/右键菜单都走它），应用侧只做 value 对齐 + pinned 合并。
- **N-052** `src/layouts/default.vue:43` — 「布局模式 × 设置」矩阵（P2-20）。
- **N-053** `src/layouts/default.vue:51` — 下发给 `SAppShell` 的菜单参数（P2-20 补充）。 顶栏菜单（`top` 模式）需要显式开启 `treeNav.collapsible`：Vean 的`STreeNav` 默认不收缩，条目超出容器宽度时会把顶栏撑破，也不会出现末尾的「更多」弹层 。
- **N-054** `src/layouts/default.vue:59` — `SAppShell` 的 `ui` 覆盖。
- **N-055** `src/layouts/default.vue:65` — `SAppShell` 的 `menuUi` 覆盖（`top` 模式顶栏菜单的测量容器）。 开 `treeNav.collapsible` 后 Vean 把 `STreeNav` 包进一个`[data-vean-tree-nav-overflow]` 测量容器，但它的 `overflow` 槽类只有`group` —— **没有 `min-w-0`**。
- **N-056** `src/layouts/default.vue:84` — 页面转场（P2-15）。 所以关闭动画只能传 `false`，不能用 `''`。
- **N-057** `src/layouts/default.vue:99` — 服务端预渲染时的菜单兜底（P4 水合修复）。 dynamic 模式的菜单依赖登录态与 `GET /api/menu/user`，服务端拿不到，那里只能让客户端先渲染空壳（守卫随后补齐）。
- **N-058** `src/layouts/default.vue:158` — 菜单叶子选中 → 跳转（页签由 afterEach 守卫补）。 三条通道，优先级：`encodeURIComponent`（URL 里的 `//`、`?` 进不了路径段，只能走 query）；不按路由名跳：dynamic 模式运行时注册的路由名不在 RouteNamedMap 字面量并集里，`push({ name })` 过不了类型；目录节点本就无可导航目标，忽略即可。
- **N-059** `src/layouts/default.vue:192` — 是否已完成客户端挂载。
- **N-060** `src/layouts/default.vue:198` — 页签栏里这条页签还该不该显示。
- **N-061** `src/layouts/default.vue:226` — 页签点击 → 切换路由。
- **N-063** `src/layouts/default.vue:262` — 页签右键菜单（v2 `TabsDropdown` 的等价物）。 动作全部走 `PageTabsState` 提供的操作，组件内部照旧把它们汇进`update:items` 回写 —— 应用层不需要为每个动作写一遍 store 调用。
- **N-065** `src/layouts/default.vue:322` — 头像兜底文案。 水合前与服务端一律用 `'U'`，挂载后才是真实姓氏。
- **N-454** `src/layouts/default.vue:294-297` — 菜单 `select` 的第 1 个参数是 **menu item 对象**。`SDropdownMenu` 的 `select` 类型为 `[item: MenuOptionData<T>, event: Event]`，按裸 value 比较恒为假、静默失效（登出无反应）；签名刻意不收 `unknown`，写错时当场报错。同文件 `:348` 的 `SAppShell` 那条 select 载荷**仍是裸 string**，别一起改。
- **N-068** `src/layouts/default.vue:406` — 页签走 `#tabs` 槽而不是 `tabs` prop：页签风格（chrome/card/slider）在样式层`PageTabsProps.variant`，壳的 `tabProps` 是 `PageTabsCompactProps`，类型上给不到。

### src/middleware/01.auth.ts

- **N-073** `src/middleware/01.auth.ts:9` — 认证 / RBAC 中间件（v3 §6.1/§2，P1-06）。

### src/middleware/01.global.ts

- **N-075** `src/middleware/01.global.ts:3` — 全局中间件（文件名前缀 `01.` 决定执行顺序）。

### src/middleware/02.response.ts

- **N-076** `src/middleware/02.response.ts:5` — c.json 的窄化签名：只取“响应体 + 可选状态码 + 可选 headers”形态（处理器只用这一种）。
- **N-077** `src/middleware/02.response.ts:11` — 响应中间件（v3 §6.1，P1-03）：重写 `c.json` 统一包装 `{ code, message, data }`。 仅对 `/api/` 前缀路由生效；已经是 ApiResponse 结构（错误端点直接返回完整结构、演示码端点等）的响应不再二次包装。

### src/middleware/03.error.ts

- **N-078** `src/middleware/03.error.ts:5` — 错误处理中间件（v3 §6.1，P1-03）：app.onError 回调。 ubean 框架级错误输出是 `{ error, statusCode, data }`（UbeanError），与业务码`{ code, message, data }` 不同构，因此由应用层归一：AppError 直接输出业务码，其余异常包装为 SYSTEM_ERROR（500），日志带 requestId 便于排障。

### src/pages:_placeholder.vue

- **N-305** `src/pages/_placeholder.vue:4` — 动态菜单缺页占位视图（menu store 的 `transformMenuToRoute` 兜底）。

### src/pages:(builtin)

- **N-290** `src/pages/(builtin)/iframe/index.vue:8` — iframe 内嵌外链页（P3-07，v3 §4.2 的 `(builtin)/iframe/[url].vue`）。 dynamic 模式下菜单行 `iframeUrl` 无法映射成路由参数（URL 含 `//`、`?`，当路径段会被 router 拆碎），所以`transformMenuToRoute`生成 的是一条 `redirect: { path: '/iframe', query: { url } }` 的路由；静态声明或手动使用也一律走同一条 query 通道。
- **N-292** `src/pages/(builtin)/login/index.vue:40` — 登录页（v3 §4.6）：单路由多模块壳。 ⚠️ `requiresAuth: false` 必须写在 **`meta` 里**，不能写成顶层字段。
- **N-293** `src/pages/(builtin)/login/modules/bind-wechat.vue:10` — 绑定微信（v3 §4.6）。 ⚠️ 本模块**需要登录态**：绑定是账号级操作，服务端 `GET/POST/api/auth/bind-wechat` 走默认鉴权；未登录时只提示去登录，不发请求（避免 401 触发全局登出回调）。
- **N-294** `src/pages/(builtin)/login/modules/code-login.vue:11` — 验证码登录（v3 §4.6 / §5.7 P3-05）。
- **N-295** `src/pages/(builtin)/login/modules/pwd-login.vue:10` — 密码登录（v3 §4.6 / §5.7 P3-05）。 成功后回跳 `?redirect=` 指向的来源页，否则用户 `homePath`。
- **N-296** `src/pages/(builtin)/login/modules/register.vue:10` — 注册（v3 §4.6 / §5.7 P3-05）。 后端 `/api/auth/register` 是「注册即登录」：直接返回 token 对，因此注册成功后无需再走一次登录，落库后按 `?redirect=` / `homePath` 回跳。
- **N-297** `src/pages/(builtin)/login/modules/reset-pwd.vue:10` — 重置密码（v3 §4.6 / §5.7 P3-05）。
- **N-298** `src/pages/(builtin)/login/use-login.ts:7` — 登录页公共逻辑（v3 §4.6）。 登录页是**单路由多模块**：`/login?module=<模块>` 决定渲染哪个子组件，与 v2 的视图层结构一致（对应 `src/pages/(builtin)/login/module s/*`） —— 免去为 5 个页面各建一条路由，回跳（`?redirect=`）与页签语义也更简单。

### src/pages:403.vue

- **N-302** `src/pages/403.vue:7` — 403 无访问权限（P3-06 引入，P3-07 改用统一异常壳）。

### src/pages:404.vue

- **N-303** `src/pages/404.vue:5` — 404 页面不存在（P3-07：改用统一异常壳）。

### src/pages:500.vue

- **N-304** `src/pages/500.vue:8` — 500 服务异常（P3-07）。 必须 `requiresAuth: false`：系统异常时用户可能刚好处于登录态失效状态，再被守卫推去登录页会掩盖真实错误。

### src/pages:about

- **N-306** `src/pages/about/modules/dependencies.ts:1` — about 页的构建期注入数据。 兜底分支只在非 vite/vitest 环境（如直接被 node require）命中，正常构建与测试都走注入值。

### src/pages:function

- **N-307** `src/pages/function/hide-child/index.vue:7` — 隐藏子菜单（P3-06，v3 §4.6）。 这是 v2「隐藏子菜单」演示的核心行为，不需要父路由 `redirect`（ubean 的`PageMeta` 没有 `redirect` 字段，父级重定向在本仓不可用）。
- **N-308** `src/pages/function/hide-child/modules/hide-child-panel.vue:6` — 隐藏子菜单的共享内容块（P3-06）。 收敛成这个组件，避免三份重复的卡片骨架。
- **N-309** `src/pages/function/multi-tab/index.vue:7` — 多标签页（P3-06，v3 §4.6「多标签」）。 页签切换时本页不会重挂载（同一路由记录，仅 query 变），因此必须用 `useRoute().query` 的响应式读取，而不是在 setup 里取一次快照。
- **N-310** `src/pages/function/request/index.vue:7` — 请求演示（P3-06，v3 §4.6：对接真实错误码端点 `POST /api/auth/error`）。
- **N-311** `src/pages/function/super-page/index.vue:7` — 超管可见页（P3-06，v3 §4.6）。
- **N-312** `src/pages/function/tab/index.vue:7` — 标签页操作（P3-06，v3 §4.6「function：标签页」）。
- **N-313** `src/pages/function/toggle-auth/index.vue:7` — 切换权限（P3-06，v3 §4.6）。 切换账号 = 重新登录 + **整页重载**：`v-auth` 指令只在 `mounted` 判定一次（与 v2 语义一致），动态重建指令不如直接 reload 干净；菜单树也随重载重新初始化。

### src/pages:home

- **N-314** `src/pages/home/modules/greeting-banner.vue:21` — 服务端 / 水合前空串（`userInfo` 来自 `localStorage`，见`@/composables/use-hydrated`）。

### src/pages:index.vue

- **N-315** `src/pages/index.vue:9` — 首页工作台（P3-01）：问候横幅 / 4 统计卡 / 折线 + 饼图 / 项目动态 / 创意横幅。

### src/pages:manage

- **N-316** `src/pages/manage/api/index.vue:17` — 接口管理页（P3-03，8 套 CRUD 的**参照实现**）。 职责分层：复用到其他域时只需改：`query` 字段、`api` 回调、列定义、两个子组件。
- **N-317** `src/pages/manage/api/modules/api-operate.vue:10` — 接口新增 / 编辑弹窗（P3-03）。 8 套 operate 弹窗同形，本文件是**参照实现**：所以回填只能走 `form.reset(values)`（TanStack 的 `reset` 会把`defaultValues` 一并替换成新值，见 `FormApi.js:127`）；
- **N-318** `src/pages/manage/api/modules/api-search.vue:10` — 接口搜索卡（P3-03）。
- **N-319** `src/pages/manage/dict-item/index.vue:19` — 字典项管理页（P3-03）。 `dictId` 列只存id，需要一份 `GET /api/dict/all` 的 id → 名称映射。
- **N-320** `src/pages/manage/dict-item/modules/dict-item-search.vue:9` — 字典项搜索卡（P3-03）。
- **N-321** `src/pages/manage/dict/index.vue:18` — 字典管理页（P3-03）。
- **N-323** `src/pages/manage/menu/modules/menu-operate.vue:13` — 菜单新增 / 编辑弹窗（P3-03）。 菜单类型决定字段可见性与提交内容，参照 unify 的 `clearFieldsByMenuType`：切换类型时把不适用字段清空，避免脏数据进入后端（后端`src/services/menu .service.ts` 的 `validateMenuTypeConstraints` 会拒绝）。
- **N-324** `src/pages/manage/menu/modules/route-param-form.vue:6` — 路由参数 / 查询编辑器（P3-03）。 行内编辑用局部数组，避免每次按键都重建 record 造成父级表单抖动；回写用 `JSON.stringify` 比对，防止 `watch` 来回互相触发。
- **N-327** `src/pages/manage/permission/modules/permission-operate.vue:10` — 权限点新增 / 编辑弹窗（P3-03）。 资源绑定：`resourceType` 为 `menu` / `api` 时必须选 `resourceId`，后端会据此推导 `name` / `code`（见 `src/services/permission.service.ts` 的`resolveResourceBinding`）；`other` 则手工填 `name` / `code`。
- **N-328** `src/pages/manage/role/modules/permission-picker.vue:8` — 权限点选择器（P3-03，角色弹窗内嵌）。
- **N-329** `src/pages/manage/role/modules/role-operate.vue:12` — 角色新增 / 编辑弹窗（P3-03）。 当前选中集从 `form.useSelector` 读（`form.state`是 TanStack Store 快照，没有 Vue 响应性），写回走 `form.setFieldValue`。
- **N-330** `src/pages/manage/user/index.vue:17` — 用户管理页（P3-03）。 `roles` 列只有 `{id}`（`userService.getUserList` 的输出），需要一份
- **N-331** `src/pages/manage/user/index.vue:26` — 表格查询状态：分页字段（`ManagePageQuery`）+ 搜索字段（`UserSearchFormDTO`）。
- **N-332** `src/pages/manage/user/modules/user-operate.vue:11` — 用户新增 / 编辑弹窗（P3-03）。 与 `api-operate.vue` 同形，额外两处：空串 → `null` 的还原在提交时统一做：表单一律用空串表达"未填"（`SInput`的 `modelValue` 是 `string`），后端 DTO 的可选字段是 `string | null`。
- **N-334** `src/pages/manage/user/modules/user-search.vue:10` — 用户搜索卡（P3-03）。

### src/pages:multi-menu

- **N-335** `src/pages/multi-menu/first/second-new/index.vue:10` — 多级菜单演示 · 二级（有子菜单）（P3-10）。
- **N-336** `src/pages/multi-menu/first/second-new/third/index.vue:10` — 多级菜单演示 · 三级（P3-10）。 注意父名取的是 ubean 由目录链推导的路由名（`/multi-menu/first/second-new` →`MultiMenuFirstSecondNewIndex`），不是文件名拼音 。
- **N-337** `src/pages/multi-menu/index.vue:7` — 多级菜单演示 · 一级（P3-10）。
- **N-338** `src/pages/multi-menu/index.vue:24` — 多级菜单演示 · 一级（P3-10，v3 §4.6「保留（文件目录天然表达）」）。
- **N-339** `src/pages/multi-menu/modules/multi-menu-panel.vue:9` — 多级菜单演示的共享内容块（P3-10）。 四个页面（一级 + 二级 + 二级(有子) + 三级）是同一模板的四份实例，收敛成这个组件，避免四份重复的卡片骨架。

### src/pages:plugin

- **N-341** `src/pages/plugin/charts/antv/index.vue:11` — AntV G6 关系图演示（P4-01，v2 `charts/antv/index.vue` 的移植）。 与 v2 的差异：`event.target as unknown as HTMLElement`，把 G6 的图形 `Element` 硬转成DOM `Element` 再读 `.id` —— 本仓禁 `as T` 断言，而且 G6 的 `Target`本来就带 `id`，不需要断言）；（G6 要具体颜色值，不能吃 CSS
- **N-342** `src/pages/plugin/charts/antv/index.vue:25` — 取 G6 图形元素的 id。 这里用类型守卫读，避免 `as` 断言（本仓 eslint 禁 `as T`）。
- **N-343** `src/pages/plugin/charts/antv/modules/antv-flow.vue:11` — G6 画布容器（P4-01，v2 `modules/antv-flow.vue` 的移植）。 主题色由 `palette` 传入（G6 需要具体颜色字符串，不是 CSS 变量）。
- **N-344** `src/pages/plugin/charts/antv/modules/antv-g6-flow.ts:7` — AntV G6 流程图（P4-01，v2 `modules/antv-g6-flow.ts` 的移植）。 与 v2 的差异：`palette`（`primary` / `destructive` 的完整 CSS 颜色，由调用方从`@vean/theme` 的 `resolveTokenColor()` + `useTheme()` 状态算出来）——G6 要的是具体颜色字符串，不是 CSS 变量，所以必须在 Vue 侧解析；**不存在**（g6
- **N-346** `src/pages/plugin/charts/antv/modules/types.ts:13` — 流程图节点数据。 这里把用到的字段显式声明成精确类型，避免每处取值都要窄化。
- **N-347** `src/pages/plugin/charts/echarts/index.vue:16` — ECharts 演示（P4-01）。 仪表盘时钟的 `setInterval` 只在 `onMounted` 起、`onUnmounted` 清（v2 在
- **N-348** `src/pages/plugin/charts/index.vue:6` — 图表分组落地页（P4-01）。
- **N-349** `src/pages/plugin/charts/vchart/data.ts:9` — 从自定义 mark 的回调上下文里读出画布尺寸。 vchart 的 `IModelMarkAttributeContext` 只声明了 `[key: string]: unknown`，且不对外导出；这里用类型守卫逐层读 `ctx.vchart.getChart().getCanvasRect()`，避免 `as` 断言（本仓 eslint 禁 `as T`）。
- **N-350** `src/pages/plugin/charts/vchart/index.vue:14` — VChart 演示（P4-01）。
- **N-351** `src/pages/plugin/copy/index.vue:7` — 文本复制演示（P4-01）。
- **N-352** `src/pages/plugin/editor/markdown/index.vue:8` — Markdown 编辑器（vditor，P4-01）。
- **N-353** `src/pages/plugin/editor/rich-text/index.vue:7` — 富文本编辑器（wangEditor，P4-01）。 与 v2 的差异：`@vean/ui` 的 `--vean-card` 走，不用再单独判断明暗；但不能盖住 toast；
- **N-354** `src/pages/plugin/excel/index.vue:10` — Excel 导出演示（P4-01）。 与 v2 的差异：不是假数组 ——导出的表格就是用户管理页看到的东西；转成可读文案再写入，否则导出的是 `Y` / `N`；
- **N-355** `src/pages/plugin/gantt/dhtmlx/index.vue:10` — DHTMLX 甘特图演示（P4-01，v2 `gantt/dhtmlx/index.vue` 的移植）。 与 v2 的差异：（挂在 `gantt.ext` 上），多个实例互相覆盖，所以这里 `onUnmounted` 里清掉DOM 内容，避免残留状态；注意：dhtmlx-gantt 的 `gantt` 是模块级单例，一个页面只应实例化一次。
- **N-356** `src/pages/plugin/gantt/vtable/index.vue:11` — VTable Gantt 的三种用法（P4-01，v2 `views/plugin/gantt/vtable/index.vue` 的移植）。
- **N-357** `src/pages/plugin/icon/index.vue:6` — 图标展示（P4-01）。 给出「怎么用」的代码片段 —— 复制即用，比一个只能看的选择器更有价值。
- **N-358** `src/pages/plugin/index.vue:6` — plugin 演示总入口（P4-01，v3 §5.8）。 链接清单与 `src/pages/plugin/**` 一一对应；这里刻意用静态数组而不是从`router.getRoutes()` 反查 —— 演示页的导航顺序是人工编排的，反射出来的顺序会跟着 meta.order 变，反而不稳定。
- **N-359** `src/pages/plugin/map/components/baidu-map.vue:6` — 百度地图（P4-01）。 `window.HOST_TYPE = '2'` 是百度 GL 分支的开关，必须在脚本加载**前**设置；v2 把它写在模块顶层（import 时执行）—— 这是对的，但副作用发生在模块求值期。
- **N-360** `src/pages/plugin/map/components/gaode-map.vue:6` — 高德地图（P4-01）。
- **N-362** `src/pages/plugin/map/index.vue:8` — 地图插件（P4-01）。 与 v2 的差异：这里写死 `h-150` 避免在无 `h-full` 上下文的页面里塌成 0；
- **N-363** `src/pages/plugin/map/index.vue:23` — 三张地图，值为 SDK 名。
- **N-364** `src/pages/plugin/map/map-sdk-globals.d.ts:1` — 地图 SDK 的全局类型声明（P4-01）。 这里只声明地图页真正用到的构造器与方法，够用就好；不要让`@types/*` 这类依赖为了三个演示页进入依赖树。
- **N-365** `src/pages/plugin/map/map-sdk.ts:1` — 地图演示用的 JS SDK 直连地址（P4-01）。 v2 把这些放在 `src/constants/map-sdk.ts`，但只有 plugin 地图页用得到 —— 放在插件模块内，避免 `src/constants/**` 被 plugin 的第三方细节污染。
- **N-366** `src/pages/plugin/modules/plugin-doc-links.vue:6` — 演示页的「外部链接」行（P4-01）。
- **N-367** `src/pages/plugin/modules/plugin-group.vue:5` — 分组落地页的公共列表（P4-01）。 文案由调用方传入 `t()` 的结果（本仓 `test/specs/scripts/remove-i18n.test.ts` 禁动态 i18n key，子组件里不能再 `t(props.key)`）。
- **N-368** `src/pages/plugin/pdf/index.vue:7` — PDF 预览（P4-01）。
- **N-369** `src/pages/plugin/pinyin/index.vue:9` — 拼音标注演示（P4-01）。 v3 不引 dompurify（多一个依赖只为洗一个自己生成的字符串，不划算），改成 `pinyin(text, { type: 'all' })` 拿结构化结果，用模板渲染 —— 没有 innerHTML 就没有 XSS 面，也不需要 sanitize。
- **N-370** `src/pages/plugin/print/index.vue:7` — 打印演示（P4-01）。 都靠新建 iframe 完成，无需额外处理。
- **N-371** `src/pages/plugin/swiper/index.vue:7` — 轮播示例（P4-01）。 `SwiperCore.use` 的全局注册改为组件级 `modules`，避免污染其它页面的 chunk；
- **N-372** `src/pages/plugin/typeit/index.vue:10` — 打字机演示（P4-01）。 TypeIt 实例持有内部定时器，必须 `destroy()`；v2 版本只 `.go()` 没销毁，离开页面后循环动画还在跑。
- **N-374** `src/pages/plugin/vtable/data.ts:1048` — Pivot Table 的数据（P4-01）。
- **N-375** `src/pages/plugin/vtable/data.ts:1505` — Pivot Chart 的数据（P4-01）。
- **N-376** `src/pages/plugin/vtable/index.vue:34` — VTable 四种表格形态的演示（P4-01，v2 `views/plugin/vtable/index.vue` 的移植）。 与 v2 的差异：站点可用性，也避免演示页偷偷发请求）；`DefineComponent<Record<string, never>, ...>`（props / emits 全无类型），所以模板属性不参与类型检查，实例方法改用运行时类型守卫；
- **N-377** `src/pages/plugin/vtable/index.vue:133` — 分组标题背景色。

### src/pages:user-center

- **N-378** `src/pages/user-center/modules/password-form.vue:9` — 修改密码卡（个人中心）。 `changePasswordFormSchema` 用 `v.forward(v.partialCheck(...))` 做「两次输入一致」的跨字段校验 —— 与登录页注册表单同一写法；错误键落在 `confirmPassword` 上，所以模板里只需渲染三个字段，不需要额外的手写比较。
- **N-380** `src/pages/user-center/modules/profile-card.vue:22` — 水合前一律 `undefined`（服务端读不到 `localStorage`，见`@/composables/use-hydrated`）。
- **N-381** `src/pages/user-center/modules/profile-card.vue:30` — 服务端 / 水合前一律 `'U'`。
- **N-382** `src/pages/user-center/modules/profile-form.vue:11` — 个人资料编辑卡（个人中心）。 回填走 `form.reset(values)`：`useForm` 的 `defaultValues` 在组合时固化，TanStack 的 `reset` 才会一并替换 `defaultValues`（否则「取消后回到初值」会回到首次挂载时的旧快照）。
- **N-383** `src/pages/user-center/modules/profile-form.vue:22` — 是否已完成客户端挂载。
- **N-384** `src/pages/user-center/profile.vue:6` — 个人中心 · 资料（P3-09）：左侧身份概览 + 右侧资料编辑与修改密码。
- **N-385** `src/pages/user-center/profile.vue:13` — 个人中心 · 资料页。
- **N-386** `src/pages/user-center/settings.vue:15` — 个人中心 · 设置（P3-09）。 这样新增一个主题配置项只需改一处，两边自动同步。

### src/request/factory.ts

- **N-235** `src/request/factory.ts:15` — 请求实例工厂（v3 §5.4 / P2-18）。 每一个 baseURL（主实例 + 每个 `/_p/{key}` 代理实例）都从这里创建，**共享同一套钩子与模块级状态**：共享单飞与去重状态是刻意的：多个 baseURL 指向同一套账号体系时，并发过期只应触发一次刷新、只弹一次提示。
- **N-237** `src/request/factory.ts:67` — 单飞刷新：并发过期只发一次 refresh，成功后本地凭据已更新。
- **N-239** `src/request/factory.ts:170` — 传输层错误（网络/超时/5xx）与**业务失败**共用同一入口。 ⚠️ 业务失败必须跳过：`onBackendFail` 已经用后端 `message` 提示过，但 `@soybeanjs/fetch` 在 `onBackendFail` 返回空后仍会 `thrownew BackendError(backendErrorMsg)`，那条错误会再走一次本钩子。
- **N-240** `src/request/factory.ts:194` — 按 baseURL 造一套 client。 是后端挂载前缀，须与路由前缀一致，否则类型路径整体对不上。

### src/request/index.ts

- **N-241** `src/request/index.ts:5` — 主请求层（v3 §5.4）。

### src/request/internal.ts

- **N-242** `src/request/internal.ts:7` — 服务端内部直调（零网络开销，走 Hono `app.request()`）。

### src/request/proxy.ts

- **N-243** `src/request/proxy.ts:6` — 多 baseURL 代理 client（v3 §4.3 / P2-18）：`/_p/{key}/**` 由`routeRules.proxy` 转发到 `API_PROXY_TARGETS` 里对应的上游。
- **N-244** `src/request/proxy.ts:23` — 按 key 取代理 client。

### src/router/guard

- **N-080** `src/router/guard/auth.ts:37` — 鉴权守卫（P2-16）。链路：浏览器早退 → 未登录跳登录页（记 `redirect`）→ 已登录访问裸登录页回 `homePath` → `initUserInfo` + `initMenu` → `meta.roles` 门禁 → dynamic 首跳补偿 → `NotFound` 反查 `POST /api/menu/exist-path` 区分 404/403。
- **N-081** `src/router/guard/auth.ts:100` — 注册请求层登出回调与「重置收尾」回调（模块级普通函数，不是 store action：ubean 的 `router.setup` 在 `applyAppConfig` 安装 pinia **之前**执行，拿不到活跃 pinia）。
- **N-450** `src/router/guard/context.ts:1-16` — 预渲染上下文早退判据 `isBrowserContext()`。ubean dev 的 HTML 请求在 Node 里预渲染执行应用与守卫，该上下文带 client 编译标志（`import.meta.server === false`，不可用！）但无 `window`/`localStorage`；判据是**能力检测**不是编译标志。守卫里不准再直接写 `typeof window`。
- **N-451** `src/router/guard/index.ts:1-29` — 守卫链注册顺序即执行顺序：`initAuthGuardWiring` → `createProgressGuard` → `createAuthGuard` → `createTabGuard`。进度条必须最外层先注册（鉴权要 `await` 用户信息与菜单）。
- **N-452** `src/router/guard/tab.ts:1-19` — 页签守卫。只能挂 `afterEach`：`beforeEach` 里目标路由尚未 resolve，`to.name` 可能是 `NotFound` 占位。
- **N-453** `src/router/guard/progress.ts:1-25` — 进度条守卫。`onError` 里必须 `done(true)`，否则导航报错会让进度条永远停在屏幕上。

### src/routes/api

- **N-082** `src/routes/api/auth/bind-wechat.ts:6` — `GET /api/auth/bind-wechat` —— 查询当前用户微信绑定状态（需登录）。 `POST /api/auth/bind-wechat` —— 完成微信绑定（需登录，mock）。
- **N-083** `src/routes/api/auth/captcha.ts:5` — `GET /api/auth/captcha` —— 获取图形验证码（公开）。
- **N-084** `src/routes/api/auth/error.ts:8` — `POST /api/auth/error` —— 错误归一演示（P3-06，v3 §4.6）。 请求演示页按 `?code=` 逐条触发请求层的四类分派：注意本端点**公开**（在鉴权中间件的 `PUBLIC_API_PATHS` 里），因此演示「令牌过期」不需要真实 token —— 请求层拿到 9999 会走刷新链路，刷新失败再回到这里重新报错（演示链路要看的正是这一段）。
- **N-085** `src/routes/api/auth/login.ts:6` — `POST /api/auth/login` —— 用户名密码登录（公开）。 失败经 AppError（PASSWORD_INVALID /CAPTCHA_INVALID 等）由全局错误中间件归一为业务码响应。
- **N-086** `src/routes/api/auth/logout.ts:6` — `POST /api/auth/logout` —— 登出（需登录）。
- **N-087** `src/routes/api/auth/modify-password.ts:7` — `POST /api/auth/modify-password` —— 当前用户修改密码（需登录）。
- **N-088** `src/routes/api/auth/profile.ts:7` — `PUT /api/auth/profile` —— 当前登录用户自助更新个人资料（P3-09）。 为什么单独开这个端点而不是复用 `PUT /api/user/:id`：manage 的 user 更新接口是**管理员**语义（可改 `enabled` / `roleIds` / 替别人改密码），走 RBAC权限码校验；个人中心只允许改自己的展示字段，且不能碰状态与角色。
- **N-089** `src/routes/api/auth/refresh-token.ts:6` — `POST /api/auth/refresh-token` —— 刷新令牌（公开，凭 refreshToken 换新 token 对）。
- **N-090** `src/routes/api/auth/register.ts:6` — `POST /api/auth/register` —— 用户注册（公开）。
- **N-091** `src/routes/api/auth/reset-password.ts:7` — `POST /api/auth/reset-password` —— 重置密码（公开）。 校验通过后直接覆写密码；需重新登录（不自动签发 token）。
- **N-092** `src/routes/api/auth/user-info.ts:5` — `GET /api/auth/user-info` —— 当前登录用户信息（需登录，无权限码要求）。
- **N-093** `src/routes/api/auth/wechat-qrcode.ts:5` — `GET /api/auth/wechat-qrcode` —— 获取微信绑定二维码（公开，mock）。
- **N-094** `src/routes/api/menu/user.ts:5` — `GET /api/menu/user` —— 当前用户可见菜单（dynamic 路由模式数据源）。
- **N-095** `src/routes/api/system/health.ts:5` — `GET /api/system/health` —— 服务健康检查。 健康检查必须显式声明 `requiresAuth: false`，否则会被鉴权拦截。

### src/schema/_form.ts

- **N-194** `src/schema/_form.ts:3` — operate 表单的**跨域公共片段**（P3-03）。 本文件同时放「行数据 → 表单值」的公共换算：`null` → 空串，`SInput` /`SSelect` 的 `modelValue` 是 `string`，收 `null` 会退化成非受控；表单一律用空串表达「未填」，提交时再还原成 `null`。
- **N-195** `src/schema/_form.ts:18` — 「可为空文本」字段。

### src/schema/_search.ts

- **N-196** `src/schema/_search.ts:9` — 搜索表单的**跨域公共片段**（P3-03）。 与 operate 表单同约束：`useForm`（`@vean/ui`）走 `@tanstack/form-core` 的`DeepKeys<Values>` 推导字段名，`v.optional(v.string())`（无默认值）会让推导退化成 `never[]`，因此搜索字段一律**带默认值**（`v.string()` /
- **N-198** `src/schema/_search.ts:23` — 「全部」选项的**渲染值**：`'all'`，仅供 `SSelect` 使用。 为什么不能用空串：`@vean/aria` 把空串保留给「未选择」语义 ——`shouldShowPlaceholder(v)` 判定 `isNullish(v) || v === '' || []`，而`SelectItem` 在 `setup` 里对 `value === ''` 直接 `throw Error('A <SelectItem />must have a

### src/schema/_shared.ts

- **N-199** `src/schema/_shared.ts:23` — 服务端 Valibot DTO 的公共片段（v3 §6.1）。

### src/schema/api.ts

- **N-202** `src/schema/api.ts:16` — 接口（API）资源契约（v3 §6.3，unify api.service 范式）。

### src/schema/auth.ts

- **N-203** `src/schema/auth.ts:22` — 认证域 DTO（v3 §6.3/§5.5）。
- **N-204** `src/schema/auth.ts:64` — 重置密码请求（未登录，图形验证码代替短信验证码）。
- **N-205** `src/schema/auth.ts:75` — `POST /api/auth/error` 的演示码入参（P3-06）。
- **N-206** `src/schema/auth.ts:92` — 登录页表单 schema 是**服务端 schema 的超集**：`useForm`（`@vean/ui`）直接吃valibot（Standard Schema），前端不再手写「非空 / 长度 / 邮箱格式」这套重复校验 —— 只保留服务端没有的「确认密码一致」。 **字段名与类型必须宽兼容服务端 schema**：`useForm` 用`@tanstack/form-core` 的 `DeepKeys<Values>`
- **N-207** `src/schema/auth.ts:110` — 注册表单（服务端 `registerSchema` + 确认密码）。
- **N-208** `src/schema/auth.ts:159` — `@vean/ui` 的 `useForm` 以 `defaultValues` 为基准（`handleReset` 也回这里），与各 manage 域的 `emptyXxxForm` 同一套路。
- **N-209** `src/schema/auth.ts:216` — 按钮级权限码列表（v3 §4.6：`userInfo.buttons` + `hasAuth(code)` + `v-auth`）。 超级管理员拿到全量权限码，前端只需按 `buttons.includes(code)` 判定，不再逐个角色推导。

### src/schema/menu.ts

- **N-213** `src/schema/menu.ts:143` — 菜单树节点 schema。 递归 schema 必须用 `metadata({ ref })` 显式命名，否则 OpenAPI 类型生成会失败：`@standard-community/standard-json` 生成的 `$defs.0` 会被`convertToOpenAPISchema` 的递归提前捕获并转成 `#/components/schemas/0`，但 `children.items`
- **N-214** `src/schema/menu.ts:261` — 菜单源数据（`src/menus/menus.json` 的 `menus` 数组），也是 static / dynamic 两种模式的**统一中间表示** `AppMenu`（`docs/v3-menu-route-modes.md` §4.1/§4.3）。 为什么需要它：`resolveJsonModule` 把 JSON 字面量放宽成 `string`，直接`import menus.json` 得不到 `menuType` 这类窄类型。

### src/schema/profile.ts

- **N-218** `src/schema/profile.ts:16` — user-center（个人中心）表单契约（P3-09）。 与 `src/schema/auth.ts` 的分工：认证域 schema 管「登录 / 注册 / 重置密码」（服务端对应 `src/routes/api/auth/**`）；这里是**登录后 **的个人资料与修改密码，两者共用同一套 valibot 约定（P3-05 的 StandardSchema 复用方式）。
- **N-219** `src/schema/profile.ts:28` — 服务端可空文本字段：`null` 或空串都视为「清空」，非空时跑格式校验。
- **N-220** `src/schema/profile.ts:55` — `PUT /api/auth/profile` 的请求体 schema（前后端共用）。

### src/schema/system.ts

- **N-222** `src/schema/system.ts:4` — 系统域 DTO（v3 §6.3）。 `src/schema/` 是前后端**唯一契约源**：Valibot schema 即运行时校验器，推导类型即 DTO。

### src/schema/user.ts

- **N-224** `src/schema/user.ts:132` — 用户新增 / 编辑表单。

### src/server.ts

- **N-010** `src/server.ts:12` — 服务端入口（ubean 约定：`src/server.ts`）。 插件 setup 拿到 hono 实例后注册应用级 onError（hono 单槽、后注册覆盖先注册），统一归一为 AppError 业务码。

### src/services/auth.service.ts

- **N-245** `src/services/auth.service.ts:23` — 认证服务（P1-04/P1-05，v3 §6.3/§6.4，unify auth.service 范式）。
- **N-246** `src/services/auth.service.ts:58` — 带角色码 + 按钮权限码的用户安全视图。 超级管理员的权限码来自 `rolePermission` 关联表（seed 里已给全量），无需特例。
- **N-247** `src/services/auth.service.ts:89` — 密码登录（`grantType: 'pwd'`）。
- **N-248** `src/services/auth.service.ts:121` — 验证码登录（`grantType: 'captcha'`）。
- **N-249** `src/services/auth.service.ts:175` — 生成微信绑定二维码（mock）。

### src/services/captcha.service.ts

- **N-250** `src/services/captcha.service.ts:4` — 图形验证码服务（P2-08，v3 §4.6）。 答案存在 `@ubean/server` 的 KV 存储里（`useKV('captcha')`，dev 内存 driver，演进换 Redis driver 与 token 黑名单同路），TTL 5 分钟、**一次性消费**：校验过即删除，避免同一验证码被重放。

### src/services/menu.service.ts

- **N-253** `src/services/menu.service.ts:102` — 目录前缀校验（M-09）：目录与其子项的 `routePath` 必须同前缀。 目录是纯分组节点、没有对应路由，路径分家在导航上看不出来 —— 这是它唯一能自检的地方。

### src/services/permission.service.ts

- **N-254** `src/services/permission.service.ts:12` — 权限服务（P1-07，unify permission.service 范式）。 权限码约定（P1-06 RBAC）:**enabled 过滤（§5.1）**：鉴权链路上的每次查询都必须带 `enabled = 'Y'` 条件，否则停用的角色/权限点仍然放行 —— 停用只是列表里变灰、鉴权却照旧，是静默的最坏情况。
- **N-255** `src/services/permission.service.ts:199` — 用户是否拥有某权限码（RBAC 中间件核心查询）。
- **N-256** `src/services/permission.service.ts:214` — 权限码集合回源（同步三查，缓存未命中时调用）。

### src/services/role.service.ts

- **N-257** `src/services/role.service.ts:12` — 角色服务（P1-07，unify role.service 范式）。 **enabled 过滤（§5.1）**：`getRolesByUserId` 只返回启用中的角色 —— 停用的角色不得继续参与鉴权（否则停用只是可见性变更，不是权限变更）。

### src/services/user.service.ts

- **N-258** `src/services/user.service.ts:14` — 用户服务（P1-07，unify user.service 范式）。 **缓存失效（§5.2）**：角色分配 / 停用用户后必须清该用户的权限码缓存，否则旧 token 在 TTL 内仍按旧权限放行。
- **N-259** `src/services/user.service.ts:87` — 当前用户的个人资料视图（P3-09）。 比 `getUserById` 多的是展示所需的角色码 / 按钮权限码（个人中心要显示「我有哪些角色和权限」），少的是 `password`。

### src/shared/api-proxy.ts

- **N-131** `src/shared/api-proxy.ts:1` — 多 baseURL 代理（v3 §4.3 / P2-18）：`/_p/{key}` 前缀代理。
- **N-132** `src/shared/api-proxy.ts:30` — 解析 `key=origin,key2=origin2`。
- **N-133** `src/shared/api-proxy.ts:76` — key → routeRules：`/_p/{key}/**` 代理到 `{origin}/**`。
- **N-134** `src/shared/api-proxy.ts:92` — 浏览器专用演示页的 SSR 豁免（P4-01）。 ubean 的 dev server 会对每个 HTML 请求在 Node 里预渲染整棵应用树（AGENTS.md 的已知陷阱：`import.meta.server === false` 且没有 `window`）。

### src/shared/api-route-sync.ts

- **N-135** `src/shared/api-route-sync.ts:3` — 路由 ↔ `api` 表对账（§5.2 第 5 条）。 **为什么需要**：RBAC 权限码是 `api:${method}:(${path})`，权限点挂在 `api` 行上。
- **N-137** `src/shared/api-route-sync.ts:56` — `api` 表行的候选键（可能命中多个）。
- **N-138** `src/shared/api-route-sync.ts:81` — 对账（纯函数）。

### src/shared/auth.ts

- **N-139** `src/shared/auth.ts:7` — 认证工具层（v3 §6.4，unify 自研 JWT 首版）：

### src/shared/common.ts

- **N-140** `src/shared/common.ts:1` — 通用纯函数（v3 §5.7，P3-02）。 这一层刻意不放 `t()` 之类需要运行时上下文的东西 —— 所有需要i18n 的应用层逻辑在 `src/composables/` 里。
- **N-141** `src/shared/common.ts:7` — 过滤查询参数里的空值（`undefined` / `null` / `''`）。 为什么需要：表格搜索卡的表单字段在"未填"时是空串，直接拼进 query 会让后端把 `keyword=` 当成"搜索空关键字"从而命中 0 行；`sort=` / `enabled=`同理会把有效默认值覆盖掉。 filterValidQuery({ keyword: '', current: 1, size: 10 }) // → { current: 1, size: 10 }

### src/shared/i18n.ts

- **N-143** `src/shared/i18n.ts:1` — locale → 文档属性（`<html lang>` / `dir`）的纯逻辑 + 客户端同步。 **为什么需要**：`src/app.ts` 的 `defineApp({ head: { htmlAttrs: { lang } } })`是**构建期静态值**（写死 `DEFAULT_LOCALE`），页面里的语言切换不会改它。

### src/shared/iframe.ts

- **N-145** `src/shared/iframe.ts:1` — 外链 / 内嵌页地址解析（P3-07）。 只放行 `http:` / `https:`：典型的注入面，必须在数据入口就砍掉；

### src/shared/layout-matrix.ts

- **N-146** `src/shared/layout-matrix.ts:1` — 「布局模式 × 配置项」矩阵（P2-20 PoC）。 这些组合不会报错、不会崩，只会让某个开关**默默无反应**，typecheck / lint /build / 视觉回归全绿。
- **N-147** `src/shared/layout-matrix.ts:14` — 矩阵的列（配置项维度）。 新增抽屉开关时在此登记，避免出现「只在面板里有、矩阵里查不到」的孤儿开关。
- **N-149** `src/shared/layout-matrix.ts:86` — 侧栏宽度是否由骨架**推导**（而不是直接采用应用设置）。 四个分栏模式（`dual-vertical` / `vertical-horizontal` /`horizontal-vertical` / `horizontal-dual-vertical`）的侧栏由`SSplitNav` 渲染「轨道 + 面板」列，列的存在取决于当前激活的一级菜单**有没有子菜单** —— 所以宽度必须由
- **N-151** `src/shared/layout-matrix.ts:191` — 非生效态的原因分类。 `dependency` 是「本应用根据其他设置现算」—— 既不是模式限制，也不是用户没开，所以同样不计入 `degraded`。
- **N-152** `src/shared/layout-matrix.ts:218` — 可直接 `v-bind` 到 `SAppShell` 的 props。 这是矩阵的**运行时效用**：`cells` 是给人看的诊断，`layoutProps` 是给壳的真值（已应用 forced 覆盖）。
- **N-153** `src/shared/layout-matrix.ts:231` — 侧栏展开宽度。
- **N-154** `src/shared/layout-matrix.ts:256` — 顶栏菜单（`top` 模式）是否把放不下的条目收进末尾的「更多」弹层。
- **N-155** `src/shared/layout-matrix.ts:265` — 下发给 `SAppShell` 的 `menuProps`。 目前只有一件事：给**顶栏菜单**（`top` 骨架的 `STreeNav`）开容器超长收缩。
- **N-156** `src/shared/layout-matrix.ts:297` — 核心：解一个「模式 × 配置项」组合。
- **N-157** `src/shared/layout-matrix.ts:469` — 渲染 Markdown 表（6 模式 × 19 维），供 `docs/v3-task.md` 直接引用。

### src/shared/pagination.ts

- **N-158** `src/shared/pagination.ts:1` — 分页 / 排序参数解析（unify 范式）。
- **N-159** `src/shared/pagination.ts:34` — 从排序串解析出 drizzle 列引用（列表查询专用）。

### src/shared/permission-cache.ts

- **N-160** `src/shared/permission-cache.ts:3` — 用户权限码缓存（§5.2 鉴权热路径优化）。 **为什么需要**：RBAC 中间件对每个已登录请求都要判定权限码。
- **N-161** `src/shared/permission-cache.ts:27` — 读缓存，未命中则 `loader` 回源并写回。
- **N-162** `src/shared/permission-cache.ts:62` — 清空整个权限码命名空间。

### src/shared/permission.ts

- **N-163** `src/shared/permission.ts:3` — 权限判定纯函数（v3 §4.6）。
- **N-165** `src/shared/permission.ts:21` — 权限码判定：所需的任一枚命中即可；`required` 为空视为放行。

### src/shared/response.ts

- **N-166** `src/shared/response.ts:4` — 统一响应契约（v3 §6.1）：所有 `/api/**` 响应恒为 `{ code, message, data }`。

### src/shared/route-exist.ts

- **N-167** `src/shared/route-exist.ts:1` — NotFound 落点判定：404 vs 403（P3-07，v3 §4.2「路径存在但无权限 → 403」）。 两种权限模式的区别决定了这个判定只能有一半靠本地：落到 `NotFound` 就是真 404，与权限无关 → 不查、不判。

### src/shared/route.ts

- **N-169** `src/shared/route.ts:21` — 归一化接口路径为权限码里的 path 段。 中间件（请求 /api/user/123） api:get:(/user/123) ← 错，永远匹配不到 seed 中间件（路由模板） api:get:(/user/[id]) ← 对
- **N-170** `src/shared/route.ts:41` — 剥掉**已解析**路径里的 locale 前缀（`/en/about` → `/about`）。 两者都需要的场景是「拿实际路径去比对菜单里存的干净路径」—— 菜单的 `routePath` 一律无locale 前缀（`prefix_except_default` 下默认语言无前缀，其它语言由运行时加上）。
- **N-171** `src/shared/route.ts:56` — 剥掉 vue-router 路径里的 locale 参数段（`/:locale(en)?/about` → `/about`）。 **为什么需要**：i18n 策略不是 `no_prefix` 时，ubean 把每条页面路由注册在带locale 参数段的 path 上（`prefix_except_default` → `/:locale(en)?/about`）。
- **N-172** `src/shared/route.ts:71` — 读取必填路径参数（ubean 文件路由 `[id].ts` → `:id`）。

### src/shared/tab.ts

- **N-173** `src/shared/tab.ts:3` — 「这条路由该不该出现在页签栏」的单一判定（P4-03）。 判定**只看布局**，不看 `requiresAuth`：登录页与 500 页都是公开页，但它们已经被布局这一条排除；反过来，将来若有需要登录却不该进页签的页面，布局仍是它自己的语义声明，不需 要再加一条白名单。

### src/shared/table.ts

- **N-174** `src/shared/table.ts:1` — 表格数据适配（v3 §5.7，P3-02）。 `usePaginatedTable`（`@vean/ui`）要求 `transform` 把接口响应映射成统一的`PaginationResult`（`{ page, pageSize, total, list }`）；本后端列表接口返回的却是 `{ current, size, total, list }`（见 `src/schema/_shared.ts`
- **N-175** `src/shared/table.ts:21` — 页面查询对象约束：`page` / `pageSize` 由分页组件驱动，其余为业务搜索字段。
- **N-176** `src/shared/table.ts:31` — 页面查询对象 → 列表接口 query（`page` / `pageSize` 改名 `current` / `size`）。 api: async () => (await flatApi.get('/user/list', { query: toPageQuery(filterValidQuery(query.value)) })).data
- **N-177** `src/shared/table.ts:46` — `{ current, size, total, list }` → `@vean/ui` 的 `PaginationResult`。

### src/shared/theme-preset.ts

- **N-179** `src/shared/theme-preset.ts:8` — 主题预设 ↔ `@vean/ui` 主题信封的桥（P2-10）。 为什么需要这一层：Vean 的主题真值在 `SConfigProvider` 的内部状态 + 单一持久化信封 `__VEAN_THEME`（`persistTheme`），**不**走 props；而 `useTheme()`在 `src/app.vue`（provider 的祖先）里取不到上下文 —— provider 在自己的`setup` 里才

### src/shared/uuid.ts

- **N-182** `src/shared/uuid.ts:1` — UUID v7 生成器（P1-08：所有表主键为 UUID v7 字符串）。

### src/shared/validate.ts

- **N-183** `src/shared/validate.ts:6` — 统一参数校验中间件（v3 §6.1，P1-07）。 OpenAPI 元数据由 `validator` 内部 resolver 透传，`describeRoute` 可照常声明 400 响应。

### src/shared/vean-locale.ts

- **N-184** `src/shared/vean-locale.ts:6` — 把应用 locale key（`zh` / `en`，见 `@/constants` 的 `APP_LOCALES`）对齐到Vean 的组件内置文案。 **为什么需要这一步**：`@vean/aria/locale` 出厂只注册两个 key —— `en`与 `zh-CN`（`node_modules/@vean/aria/dist/loca le/locales.js` 里的`{[en.key]: en, [zhCN.key]: zhCN}`），而 `resolveLocaleRegistry()` 对**未知key 静默回落到 resolveLocaleRegistry('zh').key // 'en'（回落！） resolveLocale('zh').table.emptyTitle // 'No data'（应为「暂无数据」）
- **N-185** `src/shared/vean-locale.ts:18` — Vean 出厂的 **13 个语言包**（`node_modules/@vean/aria/dist/locale/langs/`）。 与 `@/constants` 的 `APP_LOCALES` 是两件事：`APP_LOCALES` 是**本应用**提供 JSON 文案的语言（当前 `zh` / `en`），这里是**组件库**自带的文案包。
- **N-188** `src/shared/vean-locale.ts:79` — 应用 locale → 语言包（纯函数，无副作用）。
- **N-456** `src/layouts/default.vue:305-315` — 登出二次确认走 `dialog.warning(message, data?)`。`@vean/aria` 里 `warning(message, data)` = `create({ ...data, title: message, type: 'warning' })`，**文案只能塞在 `title`**（`DialogExternal` 无独立 message 字段）；不传 `cancelText` 时回落组件包内置的 `dialog.cancel`（随 locale 变），所以不要写死「取消」。
- **N-455** `src/shared/vean-locale.ts:62-68` — `isAppLocale()`：菜单交回的是 `string`，这是收窄回 `AppLocale` 的唯一入口（禁 `as` 断言）。写法与配套的 `isVeanLocalePack()` 一致。

### src/shared/watermark.ts

- **N-191** `src/shared/watermark.ts:1` — 水印内容派生的纯逻辑（P2-12）。 定时器只在「水印可见 且 开启时间」时创建，其余情形省掉一个 interval。
- **N-192** `src/shared/watermark.ts:16` — 是否需要一个会随时间推进的水印。

### src/store

- **N-097** `src/store/modules/app/index.ts:35` — 进入/退出移动端只修「抽屉开合」这类运行态。
- **N-098** `src/store/modules/auth/index.ts:18` — 认证 store（v3 §5.5）：token 对 + 用户信息 + 登录/登出流程。
- **N-100** `src/store/modules/auth/index.ts:98` — 登出：调后端拉黑 token 对 → 重置本地。
- **N-102** `src/store/modules/auth/index.ts:130` — 注册请求层登出回调与「重置收尾」回调（`setupRouterGuard` 拿到 router 后调用一次）。 ①故意做成**模块级普通函数**而非 store action：ubean 的 `router.setup` 在`applyAppConfig`（安装 plugins/pinia）**之前**执行，此时拿不到活跃 pinia；回调注册本身不需要 store 实例，回调体在使用期（接口响应时）才动态取 store。
- **N-103** `src/store/modules/menu/index.ts:10` — 菜单 store（v3 §5.3，菜单/路由/标题一元模型的菜单侧）。 两份菜单源，同一棵菜单树（`docs/v3-menu-route-modes.md` §4）：两条路径在建树前收敛成 `AppMenu[]`（见 `./shared.ts`），所以层级与排序只有一套行为。
- **N-104** `src/store/modules/menu/index.ts:67` — 从仓库里的菜单源数据建树。
- **N-105** `src/store/modules/menu/index.ts:106` — dev 下断言 dynamic 菜单与本地视图的一致性，输出缺页清单。
- **N-107** `src/store/modules/menu/index.ts:168` — `routeComponent` → `import.meta.glob` 的键（视图不存在时 undefined）。
- **N-108** `src/store/modules/menu/index.ts:190` — iframe（P3-07）：菜单行不配 routePath/routeName，但菜单需要一个可跳转的路由名 —— 统一复用内置的 `/iframe` 页，地址通过 query.url 下发。
- **N-109** `src/store/modules/menu/index.ts:222` — ubean 的 keep-alive 契约字段：PageView 靠 `$route.meta.pageName` 决定是否给组件套 `getNamedPageWrapper`（包装组件的 `name` 才能被 `<KeepAlive :include>`命中）。
- **N-111** `src/store/modules/menu/shared.ts:5` — 菜单纯函数与统一中间表示（`docs/v3-menu-route-modes.md` §4.3）。 现在两者在**建树之前**收敛成同一个 `AppMenu[]`：`buildMenuTree` 因此是**唯一建树点**：菜单树只有一份行为，不存在两种模式层级/排序不一致的可能。 static → src/menus/menus.json + 生成的路由表 ┐ ├→ AppMenu[] → buildMenuTree() dynamic → GET /api/menu/user（DB 是同一个源） ┘
- **N-112** `src/store/modules/menu/shared.ts:21` — 菜单 → 菜单树（唯一建树点）。 排序在**挂父之前**一次完成 —— 按 `order` 排好序后顺序 push 进各自父节点的`children`，每一层自然有序，不再需要递归排序。
- **N-113** `src/store/modules/menu/shared.ts:82` — 解析菜单源文件（`src/menus/menus.json`）为 `AppMenu[]`。 唯一的信任边界：`menus.json` 是人手编辑的文件，而 `resolveJsonModule` 会把JSON 字面量放宽成 `string`（`menuType` / `requiresAuth` 的窄类型丢失）。
- **N-114** `src/store/modules/menu/shared.ts:98` — static 模式的加载器：菜单源数据 + 路由表 → `AppMenu[]`。 这也让「换父/改路径」可以在 JSON 里覆盖：手写的 `routePath` 在路由表命中时被覆盖、未命中时生效 —— 不需要动页面文件。
- **N-115** `src/store/modules/menu/shared.ts:112` — dev 一致性校验：菜单与路由表对齐（文档 §3 降级来的校验价值）。 目录没有对应路由（纯分组），这条是它唯一的自检。
- **N-116** `src/store/modules/menu/shared.ts:151` — 剥掉 vue-router 路径里的 locale 参数段（`/:locale(en)?/about` → `/about`）。 规则只有一条正则，重复的代价小于耦合。
- **N-117** `src/store/modules/tab/index.ts:9` — 页签 store（v3 §5.4 多页签）。 keep-alive：`meta.cache` 的路由由 ubean 启动期种入KeepAlive（`initCachedViewsFromRoutes`），缓存开关走 ubean 全局的`excludePageCache` / `includePageCache`（模块级响应式状态，PageView 的`<KeepAlive :include>` 直接消费）——
- **N-118** `src/store/modules/tab/index.ts:18` — `addTab` 真正读取的路由切片。 用最小结构而非 `RouteLocationNormalized`：守卫传进来的仍是完整对象（结构兼容），而测试可以只造这几个字段、**不需要 `as RouteLocationNormalized`断言**（本仓 eslint 禁 `as T`）。
- **N-119** `src/store/modules/theme/index.ts:30` — 布局模式（v2 语义名）与 SAppShell 模式的映射表在 `@/constants/layout`（`src/shared/layout-matrix.ts` 也要读它，不该为此把 store 拖进依赖图）。
- **N-120** `src/store/modules/theme/index.ts:38` — 水印设置（P2-12）。
- **N-121** `src/store/modules/theme/index.ts:50` — 主题 + 布局设置（P2-10 ~ P2-15、P2-20 的配置项维度）。
- **N-122** `src/store/modules/theme/index.ts:55` — 主题预设名（`themePresets[].name`）。
- **N-123** `src/store/modules/theme/index.ts:60` — 明暗偏好（`light` / `dark` / `auto`）。
- **N-126** `src/store/modules/theme/index.ts:179` — 主题设置 → `SConfigProvider` 的主题信封状态（首屏种子）。
- **N-128** `src/store/modules/theme/index.ts:200` — 主题**设置表 + 预设表 + 布局设置**（应用级数据）。 自定义 preset）由 `@vean/ui` 的 `SConfigProvider` 持有，消费方通过`useTheme()` 读取与修改 —— 应用层不自建 mode 状态。
- **N-130** `src/store/modules/theme/index.ts:227` — 当前预设对应的**完整可编辑主题状态**（引擎选项 + 明暗偏好）。

### src/styles/index.css

- **N-070** `src/styles/index.css:1` — 应用级全局样式。

### src/styles/transition.css

- **N-071** `src/styles/transition.css:1` — 页面切换动画（P2-15）。 名称与 `src/constants/theme.ts` 的 `PAGE_ANIMATION_MODES` 一一对应：ubean 的`<PageView :transition="name" />` 内部就是一个 Vue `<Transition>`，class 前缀即该 name，所以必须写成 `<name>-enter-*` / `<name>-leave-*`。

### src/typings/app.d.ts

- **N-012** `src/typings/app.d.ts:1` — 纯 UI 契约类型（不含任何 API 形状）。 API / DTO 类型的单一来源是 `src/schema/**`（valibot schema 推导），响应体由`src/request` 的 typed client 从 `.ubean/openapi.d.ts` 推断 —— 这里只留 UI 层自己拆出来的视图类型（菜单项 / 页签 / 路由 meta）。
- **N-013** `src/typings/app.d.ts:20` — 外链（menuType `link`）：新窗口打开；与 `path` 互斥（P3-07）。
- **N-014** `src/typings/app.d.ts:25` — 内嵌外链（menuType `iframe`）：值即 iframe 地址，点击时拼 `/?url=` 跳转。
- **N-015** `src/typings/app.d.ts:50` — 路由 meta 扩展（文件路由 `definePage({ meta })` + 动态路由共用）。
- **N-016** `src/typings/app.d.ts:55` — ubean keep-alive 的契约字段：`PageView` 用它决定是否给页面组件套一层以它为 `name` 的包装（`getNamedPageWrapper`），`<KeepAl ive :include>` 匹配的就是这个包装名。
- **N-017** `src/typings/app.d.ts:61` — 激活的高亮菜单值（子页不在菜单时指向父菜单，隐藏子菜单演示用）。
- **N-018** `src/typings/app.d.ts:76` — 需要拥有的角色码（任一命中即可）；静态路由不配则视为公开。
- **N-019** `src/typings/app.d.ts:81` — 静态菜单树的父节点值（父路由的路由名）。
- **N-020** `src/typings/app.d.ts:92` — 外链地址（`menuType === 'link'`）：点击菜单以新窗口打开，不产生路由。
- **N-021** `src/typings/app.d.ts:97` — 内嵌外链地址（`menuType === 'iframe'`）：点击菜单跳 `/?url=<编码后的地址>`。
- **N-022** `src/typings/app.d.ts:102` — 是否需要登录（`false` = 公开页）。 ⚠️ 必须写在 `definePage({ meta: { requiresAuth: false } })` 里，**不能**写成`definePage` 的顶层字段。

### src/typings/env.d.ts

- ~~**N-023** `src/typings/env.d.ts:3`~~ — **已改（P0-D）**：手写 `ImportMetaEnv` 已删除，类型改由 codegen 生成 `.ubean/env.d.ts`；本文件现在只剩 `__BUILD_TIME__` / `__DEPENDENCIES__` 两个自由变量声明。原注释正文保留在下方 `### N-023`。
- **N-024** `src/typings/env.d.ts:10` — 构建时间戳（ISO 8601，`vite.config.ts` 的 `define` 注入）。
- **N-025** `src/typings/env.d.ts:13` — about 页的依赖清单（`vite.config.ts` / `vitest.config.ts` 经 `define` 注入）。

### src/typings/ubean.d.ts

- **N-027** `src/typings/ubean.d.ts:3` — ubean Context 变量扩展（v3 §6.1）：鉴权中间件写入的用户上下文。

### src/utils/auth.ts

- **N-285** `src/utils/auth.ts:4` — 认证凭据的本地缓存与全局登出回调（v3 §5.5）。

### src/utils/route-meta.ts

- **N-288** `src/utils/route-meta.ts:4` — `RouteMeta`（继承 `Record<PropertyKey, unknown>`，取值是 unknown）→`AppRouteMeta` 的单一受信边界：逐字段运行时收窄，无 as 断言。

### src/utils/storage.ts

- **N-289** `src/utils/storage.ts:3` — SSR 安全的 localStorage 封装。 key 统一加 `STORAGE_PREFIX` 前缀，避免同域多应用互踩。

### test

- **N-402** `test/integration/api.test.ts:1` — API 集成测试（P1-10，v3 §6.1/§6.3）。
- **N-403** `test/integration/api.test.ts:606` — 回归背景：中间件原先用具体请求路径拼权限码，`GET /api/user/123` 产出`api:get:(/user/123)`，与登记的 `api:get:(/user/[id])` 永不相等。
- **N-405** `test/integration/auth-hardening.test.ts:1` — 鉴权加固集成测试（authorization.md §5.1 + §5.2）—— 真实 HTTP。 覆盖两件在单测里测不到、只能端到端验证的事：改造前 `getRolesByUserId` 与权限码查询都没有 `enabled='Y'` 条件，停用只是列表里变灰，鉴权照旧放行 —— 静默失效，最坏的一类 bug。
- **N-406** `test/integration/e2e.test.ts:5` — 真实浏览器回归（P4-02，v3 §5.9 中必须在真 DOM 里验证的部分）。 覆盖（这些能力在 node/jsdom 下测不到）：ubean 生成器丢弃），headless Chrome 渲染进程 100% CPU 卡死，`page.evaluate()`永久挂起 —— 看起来像「浏览器环境不可用」，实为应用 bug。
- **N-407** `test/integration/e2e.test.ts:48` — 打开页面并**等到水合完成**。 必须等：ubean 是 SSR，首屏 HTML 里的 `<input>` 在客户端水合前**没有**`v-model` 绑定 —— 那时 `fill()` 写进去的值不会被 Vue 感知（水合还可能把它覆盖回去），点提交自然什么都不发生。
- **N-408** `test/shared/api-client.ts:4` — 集成测试共用的 HTTP 客户端（`test/integration/**`）。 所有端点经响应包装中间件输出统一信封 `{ code, message, data }`（v3 §6.1），所以 `api()` 直接按信封类型收，`okData()` 断言业务码 `0000` 并取出 `data`。
- **N-409** `test/shared/api-client.ts:17` — 发起一次 API 请求，返回 HTTP 状态码 + 已解析的信封。 注意：**不断言状态码**。
- **N-411** `test/specs/composables/use-manage-options.test.ts:5` — 「全部」哨兵值的边界转换。 折中办法是渲染层换一个非空哨兵值，只在提交边界转换 ——转换一旦错位，要么控制台满屏报错（空串漏进 `SSelect`），要么请求带上`enabled=` 这类空参数（哨兵值漏进 query）。
- **N-412** `test/specs/composables/use-table-operate.test.ts:5` — `useTableOperate`（P3-02）：表格交互范式。 `t()` 只在 `usePageSizeOptions` 里用（需要 setup 上下文），不在覆盖范围。
- **N-413** `test/specs/constants/manage.test.ts:18` — 常量层与 schema 层的**值域一致性**护栏（P3-03）。 两份声明一旦漂移，症状是「前端下拉里能选的值，提交时被 valibot 拒绝」——typecheck 看不到（两边都是 `readonly string[]`），只有跑起来才发现。
- **N-414** `test/specs/guards/env-flag-guard.test.ts:5` — ubean 运行时标志（`import.meta.client` / `import.meta.server`）的禁用守卫（P4-02）。 **为什么需要这条守卫**：ubean 0.6.0 **从不注入**这两个标志。
- **N-415** `test/specs/guards/import-guard.test.ts:5` — 客户端图文件的导入纪律（见 docs/v3.md §3.3「导入路径与构建」）。 **为什么需要这条守卫**：`ubean` 主入口是聚合 barrel（shared / seo / pages /markdown + Vue 内核 + islands + logger）。
- **N-416** `test/specs/guards/locale-coverage.test.ts:6` — i18n key 护栏（P3-03）。 `vue-i18n` 在 key 缺失时**不报错**：它把 key 原样渲染到界面上，只有在跑到那个页面并切到那个语言时才看得见。
- **N-417** `test/specs/guards/page-meta-guard.test.ts:5` — `definePage` 顶层字段纪律（P4-02）。 **为什么需要这条守卫**：ubean 0.6.0 的生成器（`@ubean/vue/dist/generator.js`的 `renderRouteRecord`）只发射两个顶层字段：其余顶 层字段（`requiresAuth: false` 尤其致命）被**静默丢弃**，而且 `cache` /`requiresAuth` 发射在**路由记录顶层**而非 `meta` 里 —— if (page.pageMeta?.cache === true) parts.push(`    cache: true`); if (page.pageMeta?.requiresAuth === true) parts.push(`    requiresAuth: true`);
- **N-419** `test/specs/request/factory.test.ts:4` — 请求层两条「隐形能力」的回归（P4-02，v3 §5.9）。 这条能力一旦破掉不会有类型错误、不会有异常，只是页面上多叠几个 toast —— 所以必须有断言。
- **N-420** `test/specs/schema/form.test.ts:13` — 表单 schema 护栏（P3-03）。 8 套 operate 表单的"schema 加了字段、默认值忘了加"是个静默失败：`useForm`的 `defaultValues` 少一个键，该键的 `SFormField` 渲染出来就是空且不受控，只有手点进弹窗才会发现。
- **N-421** `test/specs/schema/login-form.test.ts:20` — P3-05 的核心契约：**登录页表单与服务端共用同一份 valibot 声明**。
- **N-422** `test/specs/schema/profile.test.ts:15` — 个人中心表单契约测试（P3-09）。 **空串合法**：表单里留空 = 清空该字段，不能在格式校验上被拦（邮箱/手机号）；
- **N-424** `test/specs/scripts/dependency-manifest.test.ts:13` — 构建期依赖清单（about 页数据源）的契约。 结构收窄函数对畸形 YAML / JSON 抛错 —— 应当降级而不是让构建挂掉；
- **N-425** `test/specs/scripts/remove-i18n.test.ts:22` — `remove-i18n` 裁剪脚本的守卫。 这里把纯函数与「计划」钉死：dry-run 的输出必须等于 `--write` 的结果（两者共用 `planRemoveI18n`），且在本仓库上跑必须 0 残留、0 待确认。
- **N-426** `test/specs/services/permission-cache.test.ts:12` — 权限码缓存（§5.2）。 注意 `useKV` 的命名空间是模块级单例（同名只按首次调用初始化，options 被忽略），所以每个用例前手动 `clear()`，不依赖调用顺序。
- **N-428** `test/specs/shared/api-route-sync.test.ts:5` — 路由 ↔ `api` 表对账（§5.2-5）。
- **N-430** `test/specs/shared/i18n.test.ts:10` — `<html lang>` / `<html dir>` 派生的纯函数守卫。
- **N-432** `test/specs/shared/layout-matrix.test.ts:14` — P2-20：布局模式 × 配置项矩阵的守卫。 原因：这些组合失效时**不报错**——只是某个开关默默无反应，视觉回归和 CI 全绿。
- **N-433** `test/specs/shared/permission.test.ts:4` — 权限判定纯函数（`src/shared/permission.ts`）。 这两个函数被三处共用，行为必须一致：守卫的这段判定逻辑在本文件里以 `shouldBlock` 复刻（守卫本身依赖pinia/localStorage，无法直接单测），任何一边改了规则都应同步 改这里。
- **N-434** `test/specs/shared/route.test.ts:9` — `normalizeRoutePath` 守卫（P3-11）。
- **N-435** `test/specs/shared/route.test.ts:45` — API 权限码归一化（M-06）。
- **N-436** `test/specs/shared/route.test.ts:88` — `stripLocalePrefix`（M-08）。
- **N-438** `test/specs/shared/vean-locale.test.ts:5` — 应用 locale key ↔ Vean 组件内置文案的对齐守卫。 **为什么需要这条守卫**（真实回归）：`@vean/aria/locale` 出厂只注册两个 key—— `en` 与 `zh-CN`，而 `resolveLocaleRegistry()` 对**未知 key 静默回落到`en`**，不抛错也不警告：本项目把应用 locale 从 `zh-CN` 改成了更简洁的 `zh`（见 resolveLocaleRegistry('zh').key // 'en'（回落！） resolveLocale('zh').table.emptyTitle // 'No data'（应为「暂无数据」）
- **N-439** `test/specs/shared/vean-locale.test.ts:46` — 13 个出厂语言包的「存在性 + 可用性」守卫。 `VEAN_LOCALE_PACKS` 是手写清单（`@vean/aria` 没有导出语言包枚举），写错一个码（`pt-br` 大小写、`zh-TW` 漏写）在 dev 下不会报错 —— 只有该语言切过去时组件文案静默变英文。
- **N-440** `test/specs/shared/watermark.test.ts:5` — P2-12：水印内容优先级与计时器开关的守卫。
- **N-441** `test/specs/store/build-static-menu-tree.test.ts:5` — 菜单建树 / 加载 / 校验的单测（`docs/v3-menu-route-modes.md` §4）。
- **N-442** `test/specs/store/menu-transform.test.ts:5` — dynamic 菜单行 → 路由记录（P3-07 补 iframe 分支）。
- **N-443** `test/specs/store/tab-store.test.ts:7` — 页签 store 的持久化与跨用户清理（P4-02，v3 §5.9）。 ② **跨用户清页签**：登出/换用户必须清空页签，否则新用户会看到上一个用户的页面痕迹（信息泄露）。
- **N-445** `test/specs/store/tab-store.test.ts:110` — 空白布局的页面不进页签栏。
- **N-446** `test/specs/store/theme-settings.test.ts:5` — P2-10：主题设置里两块「无 DOM 也能验证」的纯逻辑 —— 滤镜互斥、预设 → 主题信封。
- **N-447** `src/pages/(builtin)/login/components/split.vue:24` — 登录分栏壳左栏的「窄屏隐藏」写法。 本项目 `hidden md:flex` **必失效**：`@vean/ui/dist/styles.css` 末尾有无 media 的 `.hidden{display:none;}`，排在 UnoCSS 之后，同优先级后者赢。改用 `flex max-md:hidden`。
- **N-448** `src/pages/(builtin)/login/index.vue:40` — 登录页的 `definePage`。 不加 `ssr: false`（实测 dev 下 `pageMeta.ssr` 到不了服务端），SSR 豁免走 `ubean.config.ts` 的 `routeRules`。
- **N-449** `src/shared/api-proxy.ts:86` — `buildPluginSsrRouteRules()` 里登录页的 SSR 豁免。 登录壳来自 localStorage，Node 预渲染只能出 `card`，客户端读 `split` 后 hydration diff 会把两个壳混进一棵树。
- **N-457** `src/pages/(builtin)/login/components/layout-switcher.vue:9-13` — 登录页右上的布局下拉独立成组件（三套壳都要它，复制三遍会漂移）；`v-model` 走 `toSettingValue()` 收窄，不用 `as` 断言。

## 工程根 / 应用入口

### N-001 · src/app.ts:15-21

```ts
/**
 * 注册 Vean 组件内置文案的 locale key（详见 `@/shared/vean-locale`）。
 *
 * 必须在 `SConfigProvider` 解析 locale **之前**执行：Vean 出厂的 key 只有
 * `en` 与 `zh-CN`，且未知 key 会静默回落到 `en` —— 不注册的话，`zh` 下分页、
 * 表格空态、标签页等组件内部文案会全部变英文（不报错）。
 */
```

### N-002 · src/app.ts:24-31

```ts
/**
 * 写入首屏主题信封（P2-10）。
 *
 * 用户在 `SThemeCustomizer` 里调过配色/圆角时，`__VEAN_THEME` 信封已经是更完整
 * 的那份真值，`seedPresetState` 会自己跳过；只有「首次访问 / 信封被清」时才按
 * 持久化的 `presetName` + `mode` 种一次。这里必须早于 `SConfigProvider` 挂载，
 * 而 `src/app.ts` 的模块顶层正好早于根组件 setup。
 */
```

### N-003 · src/app.ts:34-62

```ts
/**
 * 应用入口（ubean 约定：`src/app.ts`）。
 *
 * - `plugins`：Pinia 实例。`ubean.config.ts` 的 `pinia: true` 只做 Vite
 *   预构建优化；SSR 状态水合需另配 `serializeState` / `hydrateState`
 *   （Phase 0 `ssr: false`，暂不需要）。
 * - `router.setup`：注册全局守卫（进度条 + 标题），并顺带把 router 实例
 *   交给 `initAuthStore`（请求层登出回调需要它跳登录页）—— 这是框架唯一把
 *   实例交到应用手里的时机。
 * - 应用根组件走 `src/app.vue` 文件约定（`appRoot` 优先级：
 *   `defineApp({ appRoot })` > `src/app.vue` > `src/App.vue`），
 *   出口是该组件的默认插槽 —— **不要**在这里渲染 `<PageView />`。
 *
 * ## 两个样式导入为什么都是显式的
 *
 * `import 'uno.css'` —— UnoCSS 原子类**必须**在客户端入口显式引入；
 * ubean 不注入它。漏掉会「dev 看着正常、build 产物 CSS 只剩几行」。
 *
 * `import '@vean/ui/styles.css'` —— 组件库的预构建样式（含 `bg-popover` /
 * `z-base` / `data-vean-*` 等内部规则，~198 kB）。`ubean.config.ts` 的
 * `ui: true` 本意是通过 module registry 注入它，但该注入**只在 dev 生效**：
 * `ubean dev` 在 `resolveModules()`（注册 `registerCssImport`）之后才解析虚拟
 * 入口，而构建路径 `prepareBuild()` 先在 `generateVirtualModulesToDisk()`
 * 里把 `client-entry.mjs` **写盘**、再调 `resolveModules()` —— 落盘的入口里
 * 因此没有这条 css import（实测 `ubean build` 与 `vp build` 同病：去掉显式
 * import 后产物 CSS 从 205.8 kB 掉到 4.2 kB，组件样式全丢）。
 * 显式 import 与 registry 注入解析到同一个模块说明符，Vite 会去重，
 * 两条路径同时存在不会重复。
 */
```

### N-004 · src/app.vue:14-36

```vue
/** * 应用根组件（ubean 的 `appRoot` 文件约定）。 * * 框架出口（布局链 + 页面）从**默认插槽**注入，所以这里必须 `
<slot />
`： * 绝不渲染 `
<PageView />
`，否则会绕过布局链。 * * 职责：放置「必须在布局之上」的全局上下文与全局浮层 —— * * - `SConfigProvider`：主题 / 组件文案
locale / 组件尺寸。它同时自动挂载 * `SProgressProvider`、`SToastProvider` 与 `SDialogProvider`，因此应用里可直接 * 用
`progress` / `toast` / `dialog`，不需要再手写 `
<SDialogProvider />
`。 * - `ThemeBridge`：主题真值的桥（必须在 provider **内部**，见其文件头）。 * - 全局水印 / 主题抽屉 /
全局搜索：与布局无关的浮层，登录页也应在。 * * 主题**不由本组件下发**：provider 的主题派生是 `props.theme.base ??
themeState.base` * （`use-theme.ts`），传一个 store 派生的响应式 `:theme` 会让它永久压过 * `SThemeCustomizer` 的编辑 ——
抽屉里改色毫无反应。所以初值只在 `src/app.ts` * 里 `seedPresetState()` 种进 `__VEAN_THEME` 信封一次，之后真值全在
provider * 内部（`persist-theme` 负责持久化），本组件只把明暗偏好镜像回 store。 * * 页面标题也在这里统一解析（守卫的
`useI18n()` 不可用）：`t(i18nKey) || title` * 的单一来源逻辑，路由/语言变化时自动更新 `document.title`。 */
```

### N-005 · src/app.vue:43-49

```vue
/** * 把应用 locale 直接交给 SConfigProvider 做组件文案 locale。 * * `zh` / `en` 里**只有 `en` 是
Vean（`@vean/aria/locale`）出厂注册的 key**； * 中文出厂的 key 是 `zh-CN`，而未知 key 会被静默回落到 `en`。`zh` 的补注册
* 在 `src/app.ts` 里通过 `registerVeanLocales()` 完成（见 `@/shared/vean-locale`）。 */
```

### N-006 · src/app.vue:69-75

```vue
/** * locale → `
<html lang>
  ` / `
  <html dir>
    ` 同步。 * * `defineApp({ head: { htmlAttrs } })` 是构建期静态值，切语言不会变；屏幕阅读器 *
    的朗读语言、浏览器翻译提示、CSS `:lang()` 都要靠这里实时跟上。无 DOM 的 * 预渲染上下文里 `syncDocumentLocale`
    自会静默返回。 */
  </html>
</html>
```

### N-007 · src/app.vue:78-84

```vue
/** * 灰色 / 色弱滤镜（P2-10）写在 `
<html>
  ` 上。 * * `filterStyle` 为 null 时清掉内联 `filter`（而不是写空串以外的值）。ubean 的 dev * 预渲染在 Node
  里执行本组件且没有 `document`，所以能力检测先行 —— 与守卫里的 * 判据一致（见 AGENTS.md「已知陷阱」）。 */
</html>
```

### N-008 · src/env.server.ts:3-11

> **P0-D 后续**：该文件已删除，声明迁到 `ubean.config.ts` 的 `env.schema`。保留原文仅作历史记录。

```ts
/**
 * 服务端环境变量（校验 + 默认值）。
 *
 * 只在服务端代码里 import（`src/routes/**`、`src/services/**`、`src/db/**`、
 * `src/crons/**`、`src/middleware/**`）—— 浏览器里 `process` 不存在，
 * 客户端要用的变量请走 `src/env.ts`。
 *
 * `mode: 'throw'` 让缺失的必填项在启动期直接失败，而不是运行期才 500。
 */
```

### N-009 · src/env.ts:1-10

> **P0-D 后续**：该文件已删除，声明迁到 `ubean.config.ts` 的 `env.schema`。保留原文仅作历史记录。

```ts
/**
 * 客户端可见环境变量。
 *
 * 为什么不用 ubean 的 `defineEnv()`：`@ubean/shared` 的 `defineEnv()`
 * （`packages/shared/src/env.ts:124`）只从 `process.env` 取值，浏览器里
 * `process` 不存在 —— public 段只会拿到 `default`，拿不到 `.env` 里的真实值。
 * 因此客户端变量一律走 Vite 原生 `import.meta.env.VITE_*`。
 *
 * 服务端变量见 `src/env.server.ts`。
 */
```

### N-010 · src/server.ts:12-33

```ts
/**
 * 服务端入口（ubean 约定：`src/server.ts`）。
 *
 * 只做进程级配置与钩子；业务逻辑放 `src/routes/**`（API）、
 * `src/middleware/**`（中间件）、`src/services/**`、`src/db/**`。
 *
 * 全局错误映射（P1-11）：框架级 onError 输出 `{ error, statusCode, data }`，
 * 与业务码 `{ code, message, data }` 不同构。插件 setup 拿到 hono 实例后注册
 * 应用级 onError（hono 单槽、后注册覆盖先注册），统一归一为 AppError 业务码。
 *
 * 注：`hooks` / `globalHooks` 是 Hono 级别的钩子。
 *
 * 路由对账（§5.2-5）：`route:register` 钩子收集本次启动真实注册的全部 API 路由，
 * `onServerReady` 里（迁移 + seed 之后）与 `api` 表比对，缺失/幽灵行打 warning。
 * 只警告不写库 —— 漏登记的代价是多一条日志，自动写库的代价是 id/审计/幂等键
 * 全都得在启动期正确处理，得不偿失。
 *
 * 请求日志（P2-18）：ubean CLI 自带的是生命周期日志，这里额外挂
 * `createRequestLoggerMiddleware` 拿到**方法 / 路径 / 状态码 / 耗时**。
 * logger 用 tslog pretty 输出：等级按级别着色，交互式终端上色、被管道重定向
 * 时自动去色（也遵守 `NO_COLOR`），所以本地彩色、CI 纯文本两不误。
 */
```

### N-011 · src/server.ts:88-91

```ts
// 迁移 + seed 幂等（账本去重 / INSERT OR IGNORE），每次启动都执行：
// 全新环境（CI、新克隆）的文件库从零建表灌数据；已有环境空跑无事。
// 不在这里做的话，`.data/dev.sqlite3` 不入库（gitignored），新环境起服
// 务必然「no such table: user」—— 集成测试与首次登录全挂。
```

### N-012 · src/typings/app.d.ts:1-10

```ts
/**
 * 纯 UI 契约类型（不含任何 API 形状）。
 *
 * API / DTO 类型的单一来源是 `src/schema/**`（valibot schema 推导），响应体由
 * `src/request` 的 typed client 从 `.ubean/openapi.d.ts` 推断 —— 这里只留 UI 层
 * 自己拆出来的视图类型（菜单项 / 页签 / 路由 meta）。
 *
 * 历史上这里手工镜像过 `ApiUserInfo` / `ApiLoginResult` / `ApiMenuRow` 等，
 * 已全部删掉：路由响应 schema 补齐后它们是冗余的第二来源。
 */
```

### N-013 · src/typings/app.d.ts:24-27

```ts
/**
 * 外链（menuType `link`）：新窗口打开；与 `path` 互斥（P3-07）。
 * 布局的 `onMenuSelect` 优先看它。
 */
```

### N-014 · src/typings/app.d.ts:29-32

```ts
/**
 * 内嵌外链（menuType `iframe`）：值即 iframe 地址，点击时拼 `/?url=` 跳转。
 * 与 `path` 互斥（P3-07）。
 */
```

### N-015 · src/typings/app.d.ts:54-60

```ts
/**
 * 路由 meta 扩展（文件路由 `definePage({ meta })` + 动态路由共用）。
 *
 * 用 type alias 而非 interface：vue-router 的 `RouteMeta` 继承了
 * `Record<PropertyKey, unknown>`，interface 没有隐式索引签名，赋给 RouteMeta
 * 会因缺索引签名而不可赋值；object type alias 有隐式索引签名，双向兼容。
 */
```

### N-016 · src/typings/app.d.ts:62-67

```ts
/**
 * ubean keep-alive 的契约字段：`PageView` 用它决定是否给页面组件套一层
 * 以它为 `name` 的包装（`getNamedPageWrapper`），`<KeepAlive :include>` 匹配的
 * 就是这个包装名。静态页由生成器写入（`@ubean/vue` 的 `buildRouteMeta`）；
 * dynamic 路由由 `transformMenuToRoute` 手动补 —— 不补则 `cache` 静默失效。
 */
```

### N-017 · src/typings/app.d.ts:69-75

```ts
/**
 * 激活的高亮菜单值（子页不在菜单时指向父菜单，隐藏子菜单演示用）。
 *
 * 只影响侧栏高亮：`src/layouts/default.vue` 的 `activeMenuValue` 把它喂给
 * `SAppShell` 的 `model-value`。隐藏子页不进菜单（`hideInMenu`），所以没有
 * 「挂到父节点」的问题。
 */
```

### N-018 · src/typings/app.d.ts:87-92

```ts
/**
 * 需要拥有的角色码（任一命中即可）；静态路由不配则视为公开。
 *
 * 路由级判定在 `src/router/guard.ts`：不命中 → `403` 页（P3-06）。
 * 仅作粗粒度门禁，细粒度按钮权限走 `v-auth` / `hasAuth`。
 */
```

### N-019 · src/typings/app.d.ts:94-102

```ts
/**
 * 静态菜单树的父节点值（父路由的路由名）。
 *
 * 文件式路由不产生嵌套关系（每个页面都是一条平级记录），多级菜单演示
 * （`/multi-menu/**`）靠这个字段显式声明层级；不配则是一级菜单。
 * **作为菜单源生成期的事实**：`scripts/menu-sync.ts` 把它转成菜单行的
 * `parentId`（`M_${snake(menuParent)}`）；运行时建树只看 `parentId`
 * （`src/store/modules/menu/shared.ts` 的 `buildMenuTree`）。
 */
```

### N-020 · src/typings/app.d.ts:110-114

```ts
/**
 * 外链地址（`menuType === 'link'`）：点击菜单以新窗口打开，不产生路由。
 *
 * `src/layouts/default.vue` 的 `onMenuSelect` 在跳路由前先看它（P3-07）。
 */
```

### N-021 · src/typings/app.d.ts:116-120

```ts
/**
 * 内嵌外链地址（`menuType === 'iframe'`）：点击菜单跳 `/?url=<编码后的地址>`。
 *
 * 动态菜单下发；`/iframe` 页读 query 后做 http(s) 协议白名单（P3-07）。
 */
```

### N-022 · src/typings/app.d.ts:122-132

```ts
/**
 * 是否需要登录（`false` = 公开页）。
 *
 * ⚠️ 必须写在 `definePage({ meta: { requiresAuth: false } })` 里，**不能**写成
 * `definePage` 的顶层字段。ubean 0.6.0 的生成器只发射顶层 `requiresAuth: true`
 * （`@ubean/vue/dist/generator.js` 的 `renderRouteRecord`：
 * `if (page.pageMeta?.requiresAuth === true)`），顶层 `false` 会被静默丢弃，
 * 于是 `to.meta.requiresAuth === false` 永假 → 未登录访问公开页被守卫无限
 * 重定向（真实浏览器里渲染进程 100% CPU 卡死）。`meta` 是逐字透传的
 * （`computeMeta()`），只有这条路径可靠。回归保护见 `test/specs/guards/page-meta-guard.test.ts`。
 */
```

### N-023 · src/typings/env.d.ts:3-8

> **P0-D 后续**：这段注释连同整个手写 `ImportMetaEnv` 已删除 —— 环境变量类型现在由 `ubean.config.ts` 的 `env.schema` 经 codegen 生成到 `.ubean/env.d.ts`（`ubean:env/client` / `ubean:env/server` 两个 `declare module` + `ImportMetaEnv` 全局增强）。保留原文仅作历史记录。

```ts
/**
 * 客户端可见环境变量（Vite 原生 `import.meta.env`）。
 *
 * ⚠️ 服务端变量不放这里：它们由 `src/env.server.ts` 的 `defineEnv()` 校验，
 * 且**不会**注入浏览器（`@ubean/shared` 的 defineEnv 只读 `process.env`）。
 */
```

### N-024 · src/typings/env.d.ts:10-19

```ts
/**
 * 构建时间戳（ISO 8601，`vite.config.ts` 的 `define` 注入）。
 *
 * dev（vite dev server）与 build 都会在**模块求值前**由 esbuild/rolldown
 * 做纯文本替换，因此 dev 下每次重启会给新值、HMR 不重算（与 vite 官方
 * `define` 行为一致）。about 页读它展示「最后构建时间」。
 *
 * 类型声明放这里（而非 `src/constants`）的原因：它是构建器注入的自由变量，
 * 不是常量模块导出的值。
 */
```

### N-025 · src/typings/env.d.ts:12-14

```ts
/**
 * about 页的依赖清单（`vite.config.ts` / `vitest.config.ts` 经 `define` 注入）。
 * 类型来自构建期解析器 `scripts/dependency-manifest.ts`，浏览器侧只消费结果。
 */
```

### N-026 · src/typings/router.d.ts:1-8

```ts
/**
 * vue-router `RouteMeta` 全局扩展：让 `route.meta` / `to.meta` 在全仓内
 * 直接以 `AppRouteMeta` 形状访问（字段全可选，不破坏 ubean 文件路由的
 * `definePage({ meta })`），从源头消灭各调用点的 `as AppRouteMeta` 断言。
 *
 * 注意：module augmentation 必须放在「模块文件」里（有顶层 import/export），
 * 放在全局脚本 `.d.ts` 里会被当作 ambient module declaration 而不生效。
 */
```

### N-027 · src/typings/ubean.d.ts:3-8

```ts
/**
 * ubean Context 变量扩展（v3 §6.1）：鉴权中间件写入的用户上下文。
 *
 * `c.set('user'/'userId')` 在 01.auth.ts 中写入，
 * 路由处理器经 `c.get('userId')` 读取当前登录用户。
 */
```

## 布局与样式

### N-028 · src/components/count-to/index.vue:22-25

```vue
/** * 计数源从 0 起：服务端渲染与首帧必须一致，否则水合时数字会跳变/报 mismatch。 * 真实值在 `onMounted` 后再喂给
`useTransition` 触发动画。 */
```

### N-029 · src/components/enabled-tag/index.vue:7-16

```vue
/** * 启用状态标签（P3-03）。 * * 值域 `Y`/`N`/`D`（见 `src/db/schema/shared.ts` 的 `enabledColumn`）。8 套 CRUD *
表格共用，避免每页重复一份颜色/文案映射。 * * 文案按值**穷举**成静态字面量 key，不能写成
`t(ENABLED_LABEL_KEYS[props.enabled])`： * `scripts/remove-i18n` 只内联字面量 key，动态调用会留下无法裁剪的 `useI18n` *
装配（`test/specs/scripts/remove-i18n.test.ts` 断言 `plan.leftovers === []`）。 */
```

### N-030 · src/components/exception-base/index.vue:11-25

```vue
/** * 异常页统一壳（P3-07，替代 unify 的 `components/exception-base.vue`）。 * * 三个异常页（403 / 404 /
500）只差「码、插图、文案、额外动作」，骨架收在这里， * 页面只传码与文案，并在默认插槽追加自己的动作（如 403
的「重新登录」）。 * * 与 unify 版本的差异： * - 插图用**本地 SVG**（unify 用 `local:no-permission`
本地图标字体；本仓没有 * 那套图标字体，且远程 iconify 在离线/首屏时要等网络）。`import` 之后交给 * Vite
资源管线，dev/build 都不缺；`?raw` 内联能跟随 `currentColor`，但 * raw SVG 上的 `size-*` 工具类不生效，所以这里取 URL
形态 + 固定尺寸。 * - 动作固定「返回上一页 / 回到首页」两颗，其余动作走默认插槽。 * - 刻意不用
`SEmpty`：它面向「列表无数据」的小型占位，`media` 尺寸上限偏小， * 异常页需要的是大插图 + 码 + 标题 + 说明 +
动作组的完整版面。 */
```

### N-031 · src/components/global-search/index.vue:13-23

```vue
/** * 全局搜索（P2-11）。 * * 数据源是菜单树（不是路由表）：菜单才是用户可见的可跳转集合，权限过滤已在 *
`menuStore.initMenu` 做过。`SCommand` 自带 Fuse 模糊匹配 + roving focus 键盘导航 * （↑↓ / Enter /
Esc），所以这里只做「树 → 条目」和「选中 → 动作」。 * * Ctrl/Cmd+K 唤起；条目 `value` 是路由名，跳转用 `path` —— 与
layout 的菜单选中 * 同一理由：dynamic 模式运行时注册的路由名不在 `RouteNamedMap` 字面量并集里， * `push({ name })`
过不了类型。 */
```

### N-032 · src/components/global-search/index.vue:69-74

```vue
/** * `SCommand` 的 items：分组打包 + 菜单文案解析。 * * store 里存的是 i18n key（标题单一来源），菜单条目按 `t(i18nKey)
|| label` 解析 * —— 与 layout 的菜单项同一语义（分组文案是常量表里的 `label` 字段，不走这里）。 */
```

### N-033 · src/components/global-search/shared.ts:1-11

```ts
/**
 * 全局搜索（P2-11）的纯逻辑部分。
 *
 * 菜单树是搜索的唯一数据源；把派生逻辑从组件里拆出来是为了能单测 —— 仓库里
 * 没有 DOM 测试环境（`vitest.config.ts` 是 `environment: 'node'`），组件层测不了，
 * 但「树 → 条目」是纯函数。
 *
 * 菜单条目把 `i18nKey` 原样带出去，由组件按 `t(i18nKey) || label` 解析（这里拿不到
 * `t`，而且把翻译留在组件里才能让本文件被 node 环境的单测直接 import）；分组常量的
 * `label` 保持 i18n key，`remove:i18n` 会把 `label: '<key>'` 就地内联成文案。
 */
```

### N-034 · src/components/global-search/shared.ts:44-49

```ts
/**
 * 展平菜单树。
 *
 * 只保留有 `path` 的节点：目录节点点开了也跳不了，列出来只会污染结果。
 * 子树先于自身排？不 —— 父在前、子在后，键盘顺序即菜单顺序。
 */
```

### N-035 · src/components/global-search/shared.ts:64-69

```ts
/**
 * 按分组打包成 `SCommand` 的 `items`。
 *
 * 分组 `value` 加 `group-` 前缀，避免与作为条目 `value` 的路由名撞车；
 * 分组顺序按首次出现（菜单在前，动作在后）。
 */
```

### N-036 · src/components/global-watermark/index.vue:8-20

```vue
/** * 全局水印（P2-12）。 * * `SWatermark` 的 `fullscreen` 把遮罩做成 `fixed inset-0 z-9999 pointer-events-none`， *
所以这里挂在应用根部即可，不必包裹内容，也不会挡住交互。水印图由组件内部用 * canvas 生成 dataURL；`content`
为空串时组件不生成遮罩，等价于关闭。 * * 「实时时间」不是常驻定时器：`shouldRunWatermarkTimer` 为假（未开水印 / 未开时间
/ * 格式为空）时把 `useNow` 的定时器暂停，省掉一个空转的 interval。 * * `defense` 打开 MutationObserver 自愈：用户用
DevTools 删掉遮罩节点会被重建 * （v2 的水印右键屏蔽在这里不需要 —— 遮罩本身 `pointer-events-none`）。 */
```

### N-037 · src/components/manage-page/index.vue:9-21

```vue
/** * manage 页统一外壳（P3-03，v3 §4.6「统一范式」）。 * * 8 套 CRUD 页的骨架完全同形：搜索卡 → 列表卡（表头操作 + 表格
+ 分页）→ * operate 弹窗。把骨架收敛到这里，页面只留「列定义 + 字段单元格 + 弹窗」， * 避免 8 份几乎逐字相同的模板漂移。
* * 插槽： * - `search` 搜索卡（各域字段不同，由页面提供） * - `toolbar` 表头操作区左侧附加按钮 * - `suffix`
表头操作区最右侧附加内容 * - 其余具名插槽（`#name` / `#enabled` / …）原样转发给 `STable` 的单元格插槽 */
```

### N-038 · src/components/manage-search-select.vue:8-26

```vue
/** * 搜索卡里的枚举下拉（P3-03 修正）。 * * 存在的唯一理由是 `@vean/aria` 把**空串**保留给「未选择」语义： *
`shouldShowPlaceholder(v)` 判定 `isNullish(v) || v === '' || []`，且 * `SelectItem` 在 `setup` 里对 `value === ''`
直接抛错。而搜索表单的 * 「全部」在数据层就是空串（schema 值域、表单默认值、`filterValidQuery` *
三处都以空串为准），两者冲突。 * * 折中方案：**数据层不动**，只在渲染边界换一个非空哨兵值 *
（`SEARCH_ANY_SELECT_VALUE`）。转换集中在 `toSelectValue` / `fromSelectValue`， * 页面里写 `
<ManageSearchSelect :items="enabledSearchOptions" />
` 即可 —— * `modelValue` / `update:modelValue` 由 `SFormField` 的默认插槽（`Slot` 原语） * 注入，这里声明成 props/emits
后就不会再透传到 `SSelect` 上， * 因此不存在「原始值绕过转换写回表单」的问题。 * * 不要在页面里直接用 `SSelect`
渲染带「全部」的选项表：那样「全部」这一项 * 挂载即抛错（控制台满屏报错），且选中具体枚举值后再也回不到「全部」。 */
```

### N-039 · src/components/manage-search/index.vue:5-15

```vue
/**
 * manage 页搜索卡外壳（P3-03）。
 *
 * 8 套 CRUD 的搜索卡结构一致：`SCard`（标题「搜索」+ 可折叠超出滚动）内含一个
 * 栅格化的 `SForm`，末尾是「重置 / 搜索」两个按钮。差异只在字段本身，因此
 * 字段由页面经默认插槽塞进来，按钮与`<form>` 元素（`type="submit"` 生效的前提）
 * 收敛在这里。
 *
 * **字段组件必须由页面提供**（`SFormField` 的 `name` 依赖页面 `useForm` 的
 * schema 推导），所以本组件只做外壳，不接管表单状态。
 */
```

### N-040 · src/components/table-column-setting/index.vue:10-14

```vue
/** * 列检查表由 `usePaginatedTable` 的 `columnChecks` 提供，双向绑定。 * 「列顺序」只对可见列有意义，所以拖动的是
`visibleColumns` 派生视图， * 回写时再按对象同一性把重排结果合并回原始数组，避免丢失 `hidden` 列。 */
```

### N-041 · src/components/theme-bridge.vue:7-23

```vue
/** * 主题桥（P2-10）—— 必须挂在 `SConfigProvider` **内部**。 * * 干两件单向同步的事： * * 1.
消费主题抽屉发出的「切预设」请求（`pendingPresetState`）→ `setThemeState()`。 * 这是唯一同时改生效样式和 `__VEAN_THEME`
信封的入口：抽屉与 provider 的 * 主题上下文是兄弟关系，拿不到它，只能经这里落地。 * 2. 把信封里的明暗偏好镜像回
`themeStore.settings.mode`，让「复制配置」输出 * 完整的 `theme.*` 命名空间。 * * 为什么 provider 不再收应用侧的
`:theme`：`SConfigProvider` 的派生逻辑是 * `props.theme.base ?? themeState.base`（见 `use-theme.ts` 的 `theme`
computed）， * 传一个 store 派生的响应式对象会让它**永久压过** `SThemeCustomizer` 的编辑 —— *
用户在抽屉里换色毫无反应。所以只在 `src/app.ts` 挂载前 `seedPresetState()` * 种一次初值，之后真值全在 provider
内部（`persistTheme` 负责持久化）。 */
```

### N-042 · src/components/theme-drawer/appearance-panel.vue:18-21

```vue
/** * 明暗模式不在 customizer 的 `mode` section 里重复：`SThemeModeSegment` 直接绑 *
`theme.mode`，放在抽屉顶部更显眼（对齐 v2 抽屉第一屏）。 */
```

### N-043 · src/components/theme-drawer/appearance-panel.vue:73-80

```vue
<!--
      `ui.root` 必须显式给 `w-full h-full`：`ui` 覆盖走 tailwind-merge **叠加**，
      而 recipe 默认是 `w-96 max-w-[calc(100vw-2rem)] max-h-fit h-[70vh]` —— 不显式
      给尺寸类，`w-96`（384px）与 `h-[70vh]`（实测 630px）都会留下来。抽屉内容列
      实测只有 334px，于是 customizer 右边超出 50px 被抽屉裁掉；高度上 `h-[70vh]`
      比父级可用高度还大，底部又溢出 22px。`w-full` / `h-full` 与默认值同属
      width / height 组，合并时后者胜出（`grow` 覆盖不了 `h-[70vh]`，必须给 `h-full`）。
    -->
```

### N-044 · src/components/theme-drawer/index.vue:22-34

```vue
/** * 抽屉容器样式覆盖。 * * - `popup`：SDrawer 侧栏默认 `w-3/4 sm:max-w-sm`（≈384px），这里对齐 v2 的 400px *
并保留窄屏 90vw 上限。class 走 tailwind-merge 覆盖，不是叠加。 * -
`content`：面板自身不滚动，滚动条留在抽屉内容层（`SThemeCustomizer` 内部 * 还要再滚一层，见 appearance-panel 的
`ui.root` 覆盖）。 * * `showConfirm` / `showCancel` 显式关掉：SDrawer 默认渲染一整条确认/取消页脚， *
但主题抽屉的改动是**即时生效**的（每个控件直接写 store / provider 信封）， * 没有「草稿 →
提交」语义，默认的「确认」按钮点了不做事，反而让人以为 * 还需要保存。各 Tab 的即时生效控件自己就是操作入口。 */
```

### N-045 · src/components/theme-drawer/shared.ts:1-14

```ts
/* @unocss-include */
/**
 * 主题抽屉的共享件（P2-10）。
 *
 * v2 的 theme-drawer 每个配置项都是「左侧文案 + 右侧控件」的一行，四个 Tab
 * 加起来二十多行。抽成三个小组件 + 一份共享常量后，面板文件只剩配置清单本身，
 * 读起来才是「有哪些开关」而不是「怎么排版」。
 *
 * 这些只在 `src/components/theme-drawer/` 内部使用，所以放在同目录的
 * `shared.ts`，而不是 `src/shared/`（后者是跨模块的纯逻辑）。
 *
 * 顶部 `@unocss-include`：`uno.config.ts` 的 pipeline 只扫 `vue/[jt]sx`，
 * 本文件里的 class 字面量（尤其是布局模式缩略图）必须显式声明才不会被漏提取。
 */
```

### N-046 · src/components/theme-drawer/shared.ts:50-55

```ts
/**
 * 预设色卡的底色（内联 style，不是 class）。
 *
 * 色值由 `@vean/theme` 的 `resolveTokenColor(preset, 'primary', mode, 'hsl')` 现算，
 * 避免把调色板抄一份进 TS。
 */
```

### N-047 · src/components/theme-drawer/shared.ts:60-67

```ts
/**
 * 布局模式缩略图（P2-10 布局 Tab）。
 *
 * `boxes` 是画在缩略图画布里的绝对定位块：`bg-primary` = 一级导航落点，
 * `bg-primary/40` = 二级面板，`bg-muted` = 内容区。只用来「看懂模式」，
 * 不承担真实布局。落点与 `SAppShell` 各模式的菜单挂载位置一致
 * （`sidebar` 侧栏整列 / `top` 顶栏 / `dual-vertical` 轨道+面板 …）。
 */
```

### N-048 · src/components/theme-drawer/shared.ts:116-122

```ts
/**
 * 下拉/分段控件回传的 `string | number` → 精确的字面量联合。
 *
 * lint 禁 `as T` 断言，而 `SSelect` 的 emit 类型就是宽的 `DefinedValue`，所以在边界处
 * 用「候选表里找得到就采纳，找不到就用默认值」代替断言 —— 顺带把越界值（手改
 * localStorage / 旧版本持久化数据）一次性吸收掉。
 */
```

### N-049 · src/components/theme-drawer/shared.ts:139-145

```ts
/**
 * 「下拉控件 ↔ store 字段」的双向代理。
 *
 * 写入统一走 `setThemeSettings`（一次 `computed` 定义，八个下拉共用），面板里
 * 不出现 `@update:modelValue` 的手写窄化，也不需要类型断言。嵌套字段（水印时间
 * 格式）同样可行：`patch` 里自己重建嵌套对象。
 */
```

### N-050 · src/components/theme-drawer/shared.ts:185-190

```ts
/**
 * 把 `SInputNumber` 回传的 `null` 收敛为兜底值。
 *
 * Vean 的数字输入允许空值（`number | null`），主题设置里所有字段都不接受 null，
 * 所以在边界处一次性处理。
 */
```

### N-051 · src/layouts/default.vue:29-51

```vue
/**
 * 默认布局：`SAppShell` 全接线（v3 §5.2 后台壳）。
 *
 * - 菜单/页签标题在此解析 `t(i18nKey) || label`（layout 是 setup 上下文，
 *   切语言后 computed 重算 —— 标题单一来源仍是 i18nKey，store 只存 key）。
 * - 页签状态由 SPageTabs 内部持有并以 `update:tabs` 全量回写
 *   （close/pin/drag/右键菜单都走它），应用侧只做 value 对齐 + pinned 合并。
 *   用 `#tabs` 槽而不是 `tabs` prop 是为了注入 `variant`（页签风格）——
 *   壳的 `tabProps` 类型是 `PageTabsCompactProps`，不含样式层的 `variant`。
 * - 出口是 `<PageView />`（ubean 内置，自带 KeepAlive + 转场），
 *   布局内不要再套 `<RouterView>`；转场名来自主题设置（P2-15）。
 * - 壳模式与 layoutProps 全部来自 `resolveLayoutMatrix()`（P2-20）：
 *   `scrollBehavior: 'content'` 之类需要联动的维度在矩阵里统一裁决，
 *   不在此处写第二份条件分支。
 * - `ui.layoutContent` 补内容区内边距：`@vean/ui` 的 `app-shell` 把
 *   `layoutContent` 默认为**空串**（见 `styles/app-shell.js` 的 `slots`），
 *   不补的话所有页面都贴着侧栏/顶栏，卡片没有呼吸感。填充值由壳合并进
 *   `SLayout.ui.content`，所以 `scrollBehavior: 'content'` 时内滚区也带内边距。
 * - 页签列表在展示前先按**路由布局**过一遍：`blank` 布局的页面（登录 /
 *   403 / 404 / 500）不渲染本壳，不该出现在页签栏（判定见 `@/shared/tab`）。
 *   写入侧 `tabStore.addTab` 已经拦了，这里是**第二道** —— 它同时清掉旧版本
 *   持久化在 `localStorage` 里的历史脏页签（如登录成功后残留的「登录」）。
 */
```

### N-052 · src/layouts/default.vue:61-66

```vue
/**
 * 「布局模式 × 设置」矩阵（P2-20）。
 *
 * `contentScroll` 传 `true`：内容滚动模式下 `<PageView>` 自带滚动容器，
 * 页脚跟内容一起滚，矩阵据此不再强制关闭 `fixedFooter`。
 */
```

### N-053 · src/layouts/default.vue:71-77

```vue
/** * 下发给 `SAppShell` 的菜单参数（P2-20 补充）。 * * 顶栏菜单（`top` 模式）需要显式开启 `treeNav.collapsible`：Vean
的 * `STreeNav` 默认不收缩，条目超出容器宽度时会把顶栏撑破，也不会出现末尾的 * 「更多」弹层。`moreLabel` 用 i18n
文案（Vean 默认是硬编码英文 `More`）。 */
```

### N-054 · src/layouts/default.vue:80-84

```vue
/** * `SAppShell` 的 `ui` 覆盖。 * * `layoutContent`：Vean 默认给内容区空字符串，页面会贴边（P2-20）。 */
```

### N-055 · src/layouts/default.vue:87-98

```vue
/** * `SAppShell` 的 `menuUi` 覆盖（`top` 模式顶栏菜单的测量容器）。 * * 开 `treeNav.collapsible` 后 Vean 把 `STreeNav`
包进一个 * `[data-vean-tree-nav-overflow]` 测量容器，但它的 `overflow` 槽类只有 * `group` —— **没有
`min-w-0`**。这个容器是 `headerCenter` * （`flex-1 min-w-0 overflow-hidden`）的 flex 子项，默认 `min-width: auto` *
让它被内部那条 `w-fit` 导航条撑到内容宽（实测 2081px，容器只有 1002px）， * 于是 `isOverflowing()` 的 `root.scrollWidth
> container.clientWidth` 永远 * 为假 —— reflow 一次都不跑，溢出条目被 `overflow-hidden` 直接裁掉，末尾的 *
「更多」也不出现。补 `min-w-0` 后测量容器回到容器宽，收缩正常工作。 */
```

### N-056 · src/layouts/default.vue:112-118

```vue
/** * 页面转场（P2-15）。 * * `false` 是「明确关闭」：`PageView` 里 `transition === false` 会短路掉 *
`route.meta.transition` 与全局 `usePageTransition()` 两级兜底，传空串反而会 * 落回全局值。所以关闭动画只能传
`false`，不能用 `''`。 */
```

### N-057 · src/layouts/default.vue:129-144

```vue
/** * 服务端预渲染时的菜单兜底（P4 水合修复）。 * * ubean dev
的预渲染上下文里**路由守卫不会执行**（实测：守卫里打点从未触发）， * 于是菜单 store 停在空数组 ——
侧栏（树菜单）、面包屑都渲染成空壳，客户端水合 * 出满树，控制台刷 `Hydration node/children mismatch`。这是真 bug
而非噪音： * 首屏侧栏会「闪一下」才出现。 * * static 模式的菜单是**纯数据**（`src/menus/menus.json` +
路由表），无请求、无 * `localStorage`，服务端可以照建，两侧于是渲染同一棵树。dynamic 模式的菜单依赖 * 登录态与 `GET
/api/menu/user`，服务端拿不到，那里只能让客户端先渲染空壳 * （守卫随后补齐）。 * * 守卫在浏览器里仍会再调一次
`initStaticMenu`：建树是幂等的纯计算，且它拿到的 * 是路由表当下的事实（本处只是让首屏两侧一致）。 */
```

### N-058 · src/layouts/default.vue:199-207

```vue
/** * 菜单叶子选中 → 跳转（页签由 afterEach 守卫补）。三条通道，优先级： * 1. `href`（`menuType: 'link'`）——
新窗口打开，不产生路由/页签； * 2. `iframeUrl`（`menuType: 'iframe'`）—— 跳内置 `/iframe?url=`，地址做 *
`encodeURIComponent`（URL 里的 `//`、`?` 进不了路径段，只能走 query）； * 3. `path` —— 普通路由，内部页面。 *
不按路由名跳：dynamic 模式运行时注册的路由名不在 RouteNamedMap 字面量并集 * 里，`push({ name })`
过不了类型；目录节点本就无可导航目标，忽略即可。 */
```

### N-059 · src/layouts/default.vue:236-242

```vue
/** * 是否已完成客户端挂载。 * * 页签、用户信息都持久化在 `localStorage`，服务端读不到 —— 不门控就是首屏 *
预渲染出空页签栏 / 默认头像、客户端水合出真值，控制台报 * `Hydration node/attribute mismatch`（详见
`@/composables/use-hydrated`）。 */
```

### N-060 · src/layouts/default.vue:245-253

```vue
/** * 页签栏里这条页签还该不该显示。 * * 页签只持久化了 `routeName` / `fullPath`，没有布局快照 —— 所以拿 `fullPath` 回查
* **当下**的路由表取 `meta.layout`（用路径而非名字：页签名是裸 `string`， * vue-router 的 `resolve`
只接受生成器产出的名字字面量并集）。解析不到任何记录 * 时按可显示处理 —— 宁可留一个点进去是 404
的页签，也不因为一次查表失败把用户 * 的页签静默抹掉。 */
```

### N-061 · src/layouts/default.vue:278-283

```vue
/** * 页签点击 → 切换路由。 * * `SPageTabs` 把 `click` 同时声明成了组件事件（页签数据）和原生事件（根元素）， *
模板上绑定的处理函数得同时吃下两种参数，所以这里按参数形状分派一次。 */
```

### N-062 · src/layouts/default.vue:290-294

```vue
/** * SPageTabs 的全量回写（close/pin/drag 都走 `update:tabs`）： * 按 value 对齐应用侧页签（保留
routeName/fullPath），合并 pinned 变化； * 对比回写前后移除的页签，驱逐对应 keep-alive 缓存。 */
```

### N-063 · src/layouts/default.vue:317-323

```vue
/** * 页签右键菜单（v2 `TabsDropdown` 的等价物）。 * * 动作全部走 `PageTabsState` 提供的操作，组件内部照旧把它们汇进 *
`update:items` 回写 —— 应用层不需要为每个动作写一遍 store 调用。 * 不可用项交给 `disabled`（工具栏显示灰态，和 v2
一致）。 */
```

### N-064 · src/layouts/default.vue:358-361

```vue
/** * 右键菜单的「重载」：非当前页签要先切过去再重载， * 否则 `reloadTab()` 驱逐的是当前页的 keep-alive
缓存，点在别的页签上会重载错页。 */
```

### N-065 · src/layouts/default.vue:380-386

```vue
/** * 头像兜底文案。 * * `userInfo` 来自 `localStorage`，服务端读不到 —— 不门控就是 SSR `'U'` / * 水合 `'超'` 的 `alt`
属性不匹配（与页签同一个成因，见 `mounted` 的说明）。 * 水合前与服务端一律用 `'U'`，挂载后才是真实姓氏。 */
```

### N-066 · src/layouts/default.vue:418-421

```vue
/** * 语言下拉项：直接由 `APP_LOCALES` 派生（新增语言只改常量 + JSON）， * 当前语言置灰（点自己无意义）。 */
```

### N-067 · src/layouts/default.vue:438-443

```vue
/** * 切语言：先按需补注册 Vean 组件文案包（`zh` / `en` 是幂等空转，新增语言才真正 * 走动态 `import()`），再调
`setLocale` —— 后者由 `ubean/client` 负责写 cookie、 * 懒加载 `src/locales/*.json`、并按 `prefix_except_default` 策略
`router.replace` * 到带语言前缀的路径。 */
```

### N-068 · src/layouts/default.vue:468-473

```vue
<!--
      页签走 `#tabs` 槽而不是 `tabs` prop：页签风格（chrome/card/slider）在样式层
      `PageTabsProps.variant`，壳的 `tabProps` 是 `PageTabsCompactProps`，类型上给不到。
      槽内 SPageTabs 的事件与壳内置版一致（壳也是把 `update:items` 透传成 `update:tabs`），
      这里直接绑到 store，少一层事件转发。
    -->
```

### N-069 · src/layouts/default.vue:534-538

```vue
<!--
 包一层 `relative` 作为离场页的定位基准：交叉淡出时两个页面同时存在，
         CSS 会把离场那份移出文档流（见 `src/styles/transition.css`），
         它需要最近的定位祖先来确定自己的宽度与上边距。
-->
```

### N-070 · src/styles/index.css:1-8

```css
/**
 * 应用级全局样式。
 *
 * Reset / 主题变量 / 组件样式全部由 UnoCSS 的 `@vean/unocss` `presetUi()`
 * （见 `uno.config.ts`：`resetCSS` + `globalCSS` + `uiCSS`）与
 * `SConfigProvider`（`@vean/theme` 的 `emitThemeCss`）产出 —— 这里只放
 * 极少数「框架不管」的兜底规则。
 */
```

### N-071 · src/styles/transition.css:1-42

```css
/**
 * 页面切换动画（P2-15）。
 *
 * 名称与 `src/constants/theme.ts` 的 `PAGE_ANIMATION_MODES` 一一对应：ubean 的
 * `<PageView :transition="name" />` 内部就是一个 Vue `<Transition>`，class 前缀
 * 即该 name，所以必须写成 `<name>-enter-*` / `<name>-leave-*`。
 * `none` 模式没有对应类 —— 动画靠 `transition: false` 关闭，不靠 CSS。
 *
 * ## 为什么离场页要 `position: absolute`
 *
 * `PageView` 用的是**交叉淡出**（同时存在两份页面），而不是 `out-in`：ubean 在
 * `mode="out-in"` 时会把两份页面同时渲染再主动降级，并打一条警告 ——
 * `[PageView] mode="out-in" is degraded to "default": vue@3.5.41 out-in + KeepAlive
 * trips emptyPlaceholder bugs`。所以传 `out-in` 只是多一条控制台噪音，行为不变。
 *
 * 两份页面若都在文档流里，旧页会把新页顶到下方 —— 实测新页
 * `getBoundingClientRect().top` 是 1042（旧页高 926，把新页顶到了下一屏），于是
 * 视口里看到的是旧页左滑淡出、新页整块从下方升起，也就是「从底下往上顶」。
 *
 * 把**离场页**提出文档流、并钉在容器左上角，两份页面就完全重叠。钉左上角而不是
 * 居中，是因为进场的位移量固定在左边（`fade-slide` 是 `translateX(-30px)` → 0），
 * 从中心缩放会让它从右边滑入，与设计相左。
 *
 * 只提离场页（`*-leave-active`）而不动进场页：进场页留在文档流里，容器高度由它
 * 撑开，内容区不会在动画期间塌陷。同时给容器补 `relative`（在
 * `src/layouts/default.vue` 的 `<PageView>` 外层）作为定位基准 —— 否则离场页会
 * 以更外层的 `relative`（内容区，带 `p-4` 与 `overflow-y-auto`）为基准，多出一份
 * 内边距、并且滚动容器内 `absolute` 的定位会跟着内容滚。
 *
 * ## 为什么离场和进场要错开
 *
 * 重叠之后暴露出第二个问题：两份页面在整段时间里**同时可见**，中间几帧各占一半
 * 不透明度，于是旧页的内容（实测工作台的图表）从新页底下透出来，糊成一片。
 *
 * 解法是让进场**等离场走完再开始** —— 给 `*-enter-active` 的 transition 加一个
 * 等于离场时长的 `delay`。这正是 `out-in` 本来的时序（先出后进），只不过是用
 * 交叉淡出的机制手工排出来的。离场时长取各模式原时长的一半，所以一轮总时长约
 * 是原时长的 1.5 倍。
 *
 * 实测（`fade-slide`，逐帧读两份页面的 opacity）：离场 1 → 0 期间进场恒为 0，
 * 离场结束后进场才开始 0 → 1，不再有交叠帧。
 */
```

## 路由 / 守卫 / 中间件

### N-072 · src/directives/auth.ts:5-18

```ts
/**
 * `v-auth` 权限指令 + `useAuth()` 组合式函数（v3 §4.6 按钮级权限）。
 *
 * 判定逻辑是纯函数（`@/shared/permission`），本文件只负责取 store 与
 * 指令生命周期；守卫里的路由级 roles 判定复用同一组纯函数。
 *
 * 用法：
 * - `v-auth="['system:user:add']"` —— 权限码（默认通道，`userInfo.buttons`）
 * - `v-auth:role="['admin']"` —— 角色码（`userInfo.roles`）
 * - `v-auth.super` —— 仅超级角色
 *
 * 指令只在 `mounted` 执行一次（与 v2 语义一致：按钮可见性不随运行期切换，
 * 切账号后走整页重载）。判定值必须是**静态字面量数组**。
 */
```

### N-073 · src/middleware/01.auth.ts:9-18

```ts
/**
 * 认证 / RBAC 中间件（v3 §6.1/§2，P1-06）。
 *
 * 执行序（仅 /api/ 前缀路由）：
 * 1. 读路由 meta（ubean 注册路由时经 metaMiddleware 写入 `c.set('route')`）；
 *    `requiresAuth: false` 的路由（登录、验证码、健康检查、演示错误端点）直接放行；
 * 2. `Bearer <token>` → authService.verifyToken（签名+过期+黑名单+用户状态）；
 * 3. 权限码 `api:${method}:(/path)` 精确匹配 permissionService.checkUserHasPermission；
 *    超级管理员角色（R_super）持有全量权限码，普通用户按权限码放行。
 */
```

### N-074 · src/middleware/01.auth.ts:68-71

```ts
// 权限码必须用**路由模板**（`/api/user/:id`），不能用具体请求路径 —— 后者会拼出
// `api:get:(/user/123)`，与登记的 `api:get:(/user/[id])` 永不相等，带路径参数的
// 端点 RBAC 会静默失效。`c.get('route').path` 就是 `c.req.path`（具体路径），
// 模板只能从 `c.req.routePath` 取（hono 按 routeIndex 反查注册表）。
```

### N-075 · src/middleware/01.global.ts:3-8

```ts
/**
 * 全局中间件（文件名前缀 `01.` 决定执行顺序）。
 *
 * 所有 API 路由（`src/routes/api/**`）与页面请求都会经过；
 * 后续鉴权 / 请求日志 / traceId 注入都挂在这里。
 */
```

### N-076 · src/middleware/02.response.ts:5-8

```ts
/**
 * c.json 的窄化签名：只取“响应体 + 可选状态码 + 可选 headers”形态（处理器只用这一种）。
 * 直接引用 Context['json'] 会让 hono 的条件类型实例化过深（TS2589）。
 */
```

### N-077 · src/middleware/02.response.ts:11-20

```ts
/**
 * 响应中间件（v3 §6.1，P1-03）：重写 `c.json` 统一包装 `{ code, message, data }`。
 *
 * 仅对 `/api/` 前缀路由生效；已经是 ApiResponse 结构（错误端点直接返回完整结构、
 * 演示码端点等）的响应不再二次包装。`c.get('message')` 允许路由处理器设置自定义
 * 成功消息（默认“成功”）。
 *
 * ⚠️ 原始 json 必须**先 bind 再替换**（early-bound）——若包装函数内晚绑定
 * `c.json(...)`，替换后即自引用，无限递归（Maximum call stack size exceeded）。
 */
```

### N-078 · src/middleware/03.error.ts:5-13

```ts
/**
 * 错误处理中间件（v3 §6.1，P1-03）：app.onError 回调。
 *
 * ubean 框架级错误输出是 `{ error, statusCode, data }`（UbeanError），与业务码
 * `{ code, message, data }` 不同构，因此由应用层归一：AppError 直接输出业务码，
 * 其余异常包装为 SYSTEM_ERROR（500），日志带 requestId 便于排障。
 *
 * 挂载方式：src/middleware/index.ts 中 `app.onError(handler)`。
 */
```

### N-079 · src/middleware/03.error.ts:30-33

```ts
/**
 * 中间件目录聚合：ubean 只注册目录内各文件的 default export，
 * onError 这类 app 级配置需要在一个 default export 的中间件里完成挂载。
 */
```

### N-080 · src/router/guard/auth.ts:1-36

```ts
/**
 * 鉴权守卫（P2-16）。
 *
 * 顺序就是语义，改动前先读这几条：
 * 1. **浏览器早退**：见 `./context` —— 预渲染上下文里没有 `localStorage`，
 *    跑鉴权会无限重定向。
 * 2. **未登录**：公开页（`requiresAuth: false`）放行，其余去登录页并记 `redirect`。
 * 3. **已登录访问登录页**：回 `homePath`。例外是 `?module=`（注册/重置密码/绑定微信）
 *    —— 这些模块在登录态同样有意义（绑定微信本身就是登录态操作）。
 * 4. **用户信息 + 菜单初始化**：两者都幂等，守卫每次导航都调也无副作用。
 * 5. **角色门禁**：`definePage({ meta: { roles: [...] } })`，与 `v-auth:role`
 *    共用 `@/shared/permission` 的纯函数（超级角色恒过）。
 * 6. **dynamic 首跳补偿**：目标路由可能刚由 `initMenu` 注册 —— 回跳原路径重新解析。
 * 7. **404 vs 403**：dynamic 模式路由按权限下发，菜单里存在但无权 → 路由没注册
 *    → 落 `NotFound`。此时反查 `POST /api/menu/exist-path`，路径存在即改判 403
 *    （v3 §4.2）。static 模式路由本地全注册，落 NotFound 就是真 404，不查后端。
 *    反查前用 `stripLocalePrefix` 剥掉实际地址里的语言前缀（`/en/about` → `/about`），
 *    菜单的 `routePath` 一律无前缀，不剥就永远查不到；网络异常静默降级为 404
 *    （不能因反查失败阻塞导航）。
 *
 * ⚠️ 公开页判定读的是 `to.meta.requiresAuth`，因此页面必须写成
 * `definePage({ meta: { requiresAuth: false } })`。ubean 0.6.0 生成器只发射
 * 顶层 `requiresAuth: true`，顶层 `false` 被静默丢弃 → 本守卫会把登录页自己
 * 也重定向到登录页，形成无限重定向（真浏览器里 CPU 打满卡死）。
 * 回归保护见 `test/specs/guards/page-meta-guard.test.ts`。
 */
```

### N-081 · src/router/guard/auth.ts:92-99

```ts
/**
 * 注册请求层登出回调与「重置收尾」回调。
 *
 * 放在守卫模块（而不是 `src/app.ts` 模块顶层）是因为回调要跳登录页，需要 router
 * 实例 —— `createRouterGuard` 是框架唯一把实例交到应用手里的时候。
 * 回调体仍动态 import store / 组件库：`router.setup` 在 pinia 安装之前执行，
 * 此刻取不到活跃 pinia。
 */
```

### N-082 · src/routes/api/auth/bind-wechat.ts:6-12

```ts
/**
 * `GET /api/auth/bind-wechat` —— 查询当前用户微信绑定状态（需登录）。
 * `POST /api/auth/bind-wechat` —— 完成微信绑定（需登录，mock）。
 *
 * mock 语义：ticket 由 `GET /api/auth/wechat-qrcode` 下发并缓存，POST 时
 * 校验 ticket 有效即视为「扫码成功」，按 userId 派生稳定假昵称落 KV。
 */
```

### N-083 · src/routes/api/auth/captcha.ts:5-11

```ts
/**
 * `GET /api/auth/captcha` —— 获取图形验证码（公开）。
 *
 * 返回 `{ captchaId, img }`：`img` 是自绘 SVG 的 base64 data URL，可直接塞进
 * `<img :src>`；答案存 `useKV('captcha')`（TTL 5 分钟），校验一次即消费。
 * 供密码登录（可开关）与验证码登录/重置密码使用。
 */
```

### N-084 · src/routes/api/auth/error.ts:8-20

```ts
/**
 * `POST /api/auth/error` —— 错误归一演示（P3-06，v3 §4.6）。
 *
 * 请求演示页按 `?code=` 逐条触发请求层的四类分派：
 * - `8888` → `DEMO_LOGOUT`，命中 `VITE_SERVICE_LOGOUT_CODES` → 静默登出；
 * - `7777` → `DEMO_MODAL_LOGOUT`，命中弹窗登出码 → `dialog.warning` 后登出；
 * - `9999` → `DEMO_REFRESH_TOKEN`，命中过期码 → 单飞刷新 + 重放；
 * - 不传 / 未登记 → `SYSTEM_ERROR`（`1000`）普通报错（3s 同文案去重）。
 *
 * 注意本端点**公开**（在鉴权中间件的 `PUBLIC_API_PATHS` 里），因此演示
 * 「令牌过期」不需要真实 token —— 请求层拿到 9999 会走刷新链路，刷新失败
 * 再回到这里重新报错（演示链路要看的正是这一段）。
 */
```

### N-085 · src/routes/api/auth/login.ts:6-12

```ts
/**
 * `POST /api/auth/login` —— 用户名密码登录（公开）。
 *
 * 校验走 valibot `loginSchema`（联合类型：`grantType: 'pwd'` 密码登录 / `'captcha'`
 * 图形验证码登录），成功返回 token 对 + 用户安全视图。失败经 AppError（PASSWORD_INVALID /
 * CAPTCHA_INVALID 等）由全局错误中间件归一为业务码响应。
 */
```

### N-086 · src/routes/api/auth/logout.ts:6-11

```ts
/**
 * `POST /api/auth/logout` —— 登出（需登录）。
 *
 * access token 拉黑 1h、refreshToken 拉黑 7d；token 已失效时幂等返回成功。
 * 用户上下文由鉴权中间件写入（c.get('userId')）。
 */
```

### N-087 · src/routes/api/auth/modify-password.ts:7-11

```ts
/**
 * `POST /api/auth/modify-password` —— 当前用户修改密码（需登录）。
 *
 * 校验 currentPassword 后更新；成功后旧 token 不强制失效（客户端自行重新登录）。
 */
```

### N-088 · src/routes/api/auth/profile.ts:7-18

```ts
/**
 * `PUT /api/auth/profile` —— 当前登录用户自助更新个人资料（P3-09）。
 *
 * 为什么单独开这个端点而不是复用 `PUT /api/user/:id`：manage 的 user 更新
 * 接口是**管理员**语义（可改 `enabled` / `roleIds` / 替别人改密码），走 RBAC
 * 权限码校验；个人中心只允许改自己的展示字段，且不能碰状态与角色。两者放同
 * 一个 handler 会让「自助」与「管理」的权限边界模糊，也逼前端把当前用户 id
 * 当参数传来传去。
 *
 * 认证中间件对 `/api/auth/` 前缀只要求登录、不做权限码校验，正好匹配这个语义。
 * `userId` 只从 token 上下文取（不接受 body 里的 id），越权面为零。
 */
```

### N-089 · src/routes/api/auth/refresh-token.ts:6-10

```ts
/**
 * `POST /api/auth/refresh-token` —— 刷新令牌（公开，凭 refreshToken 换新 token 对）。
 *
 * 旧 refreshToken 立即拉黑防重放；黑名单中的 token 抛 REFRESH_TOKEN_BLACKLISTED。
 */
```

### N-090 · src/routes/api/auth/register.ts:6-11

```ts
/**
 * `POST /api/auth/register` —— 用户注册（公开）。
 *
 * 注册成功直接返回 token 对（unify 范式：注册即登录）。
 * 用户名重复抛 USERNAME_EXISTS。
 */
```

### N-091 · src/routes/api/auth/reset-password.ts:7-12

```ts
/**
 * `POST /api/auth/reset-password` —— 重置密码（公开）。
 *
 * 无短信通道，凭证用图形验证码承担（与 v2 `reset-pwd` 页面语义一致）。
 * 校验通过后直接覆写密码；需重新登录（不自动签发 token）。
 */
```

### N-092 · src/routes/api/auth/user-info.ts:5-9

```ts
/**
 * `GET /api/auth/user-info` —— 当前登录用户信息（需登录，无权限码要求）。
 *
 * 用户上下文由鉴权中间件写入；roles 在服务层按用户-角色关联展开。
 */
```

### N-093 · src/routes/api/auth/wechat-qrcode.ts:5-11

```ts
/**
 * `GET /api/auth/wechat-qrcode` —— 获取微信绑定二维码（公开，mock）。
 *
 * 无微信开放平台凭证，返回自建 `ticket`（KV 存储，TTL 5 分钟）与形似官方
 * `qrconnect` 的授权 url；前端据此渲染二维码占位，「模拟扫码」调
 * `POST /api/auth/bind-wechat` 完成绑定。
 */
```

### N-094 · src/routes/api/menu/user.ts:5-10

```ts
/**
 * `GET /api/menu/user` —— 当前用户可见菜单（dynamic 路由模式数据源）。
 *
 * 返回启用状态且用户有权访问的菜单行（含公共菜单与经权限码授权的菜单，
 * 自动补齐祖先链），前端 `transformMenusToAutoRoutes` 据此生成路由。
 */
```

### N-095 · src/routes/api/system/health.ts:5-17

```ts
/**
 * `GET /api/system/health` —— 服务健康检查。
 *
 * ubean 0.6.0 的 API 路由约定：
 * - 文件路径即路由路径（`src/routes/api/system/health.ts` → `/api/system/health`）；
 * - 用 **void 风格命名导出** HTTP 方法（`export const GET`），不用 `.get.ts` 后缀；
 * - 链路固定为 `defineHandler(defineHandlerMeta?, describeRoute?, validator?, handler)`：
 *   `defineHandlerMeta` 负责鉴权/缓存/限流，`describeRoute` 负责 OpenAPI 元数据
 *   （它从 `hono-openapi` 重导出，不经 ubean 透传）。
 *
 * ⚠️ `defineHandler` 的默认 `requiresAuth` 是 **true**。健康检查必须显式
 * 声明 `requiresAuth: false`，否则会被鉴权拦截。
 */
```

## store

### N-096 · src/store/index.ts:1-6

```ts
/**
 * Pinia store 统一出口。
 *
 * 实例由 `defineApp({ plugins: [createPinia()] })` 安装（见 `src/app.ts`），
 * 这里只做集中导出，避免各页面深处散落相对路径 import。
 */
```

### N-097 · src/store/modules/app/index.ts:35-42

```ts
/**
 * 进入/退出移动端只修「抽屉开合」这类运行态。
 *
 * 布局模式不在这里改写：Vean 在移动端本来就固定渲染 `sidebar` 骨架
 * （`app-shell.vue` 的 `mobileView ? sidebar : mode`），而
 * `resolveLayoutMatrix()` 已把这件事显式化。改写 settings 会把「移动端退化」
 * 持久化进 localStorage，用户下次在桌面打开就回不到原来选的模式了。
 */
```

### N-098 · src/store/modules/auth/index.ts:18-24

```ts
/**
 * 认证 store（v3 §5.5）：token 对 + 用户信息 + 登录/登出流程。
 *
 * token 与用户信息同步落 localStorage（`src/utils/auth.ts`），刷新页面经
 * `initUserInfo` 恢复；请求层的登出回调由守卫在拿到 router 后注册（见
 * `initAuthStore` 与 `src/router/guard.ts`）。
 */
```

### N-099 · src/store/modules/auth/index.ts:80-85

```ts
/**
 * 覆盖本地用户信息（个人中心改资料后调用）。
 *
 * 必须同时写 localStorage：否则刷新页面后 `userInfo` 从旧快照恢复，
 * 改动看起来「丢了」。
 */
```

### N-100 · src/store/modules/auth/index.ts:103-106

```ts
/**
 * 登出：调后端拉黑 token 对 → 重置本地。
 * 抛错不阻断 —— 后端不可达时也要完成前端登出。
 */
```

### N-101 · src/store/modules/auth/index.ts:115-121

```ts
/**
 * 重置登录态并回登录页。
 *
 * 跳转经 `handleAuthReset()`（守卫注册的回调持有 router 实例），因此本
 * action 不需要 router 参数，从任何上下文（组件事件、请求层回调、测试）
 * 调用都能完成「清空 + 回登录页」。
 */
```

### N-102 · src/store/modules/auth/index.ts:137-145

```ts
/**
 * 注册请求层登出回调与「重置收尾」回调（`setupRouterGuard` 拿到 router 后调用一次）。
 *
 * ①故意做成**模块级普通函数**而非 store action：ubean 的 `router.setup` 在
 * `applyAppConfig`（安装 plugins/pinia）**之前**执行，此时拿不到活跃 pinia；
 * 回调注册本身不需要 store 实例，回调体在使用期（接口响应时）才动态取 store。
 * ②回调体动态 import，避免 store ↔ 请求层循环引用。
 * ③两个回调都靠注册时注入的 router 实例，不依赖任何单例模块。
 */
```

### N-103 · src/store/modules/menu/index.ts:10-30

```ts
/**
 * 菜单 store（v3 §5.3，菜单/路由/标题一元模型的菜单侧）。
 *
 * 两份菜单源，同一棵菜单树（`docs/v3-menu-route-modes.md` §4）：
 *
 * - static 模式：`src/menus/menus.json`（仓库里的源数据）+ 生成的路由表；
 * - dynamic 模式：`GET /api/menu/user`（数据库里的源数据，seed 自同一份 JSON）。
 *
 * 两条路径在建树前收敛成 `AppMenu[]`（见 `./shared.ts`），所以层级与排序只有
 * 一套行为。static 模式**不注册路由**（文件路由本来就全注册），只建树；
 * dynamic 模式既注册路由又建树 —— 这是两者唯一的实质差异。
 *
 * 标题单一来源：节点携带 `i18nKey`，**翻译在展示层**（layout/tab 的 setup
 * 上下文里 `t(i18nKey) || label`）—— `useI18n()` 只能在 setup 用，store
 * 不能在 action 里解析 locale（否则切语言后 label 不更新）。
 *
 * 为什么 router 从参数进而不 import：读路由表/注册路由都需要实例，而实例只有
 * 守卫与组件拿得到（`useRouter()`）。让调用方传进来，store 就不依赖 `@/router`，
 * `store → @/router → guard → store` 的模块环自然消失。守卫是唯一调用点，
 * 它拿到的正是框架 `setup` 入参。
 */
```

### N-104 · src/store/modules/menu/index.ts:82-88

```ts
/**
 * 从仓库里的菜单源数据建树。
 *
 * 路由只用来两件事：把 `routeName` 解析成真实 `path`（消除「页面改名 →
 * 菜单跳 404」的漂移，见 `loadStaticMenus`），以及 dev 下校验两者对齐。
 * 路由**不参与建树** —— 层级来自菜单自己的 `parentId`。
 */
```

### N-105 · src/store/modules/menu/index.ts:124-129

```ts
/**
 * dev 下断言 dynamic 菜单与本地视图的一致性，输出缺页清单。
 *
 * 菜单指向的视图在 `src/pages/**` 不存在时告警（不阻断启动，路由落到
 * `src/pages/_placeholder.vue`）。
 */
```

### N-106 · src/store/modules/menu/index.ts:163-169

```ts
/**
 * `src/pages` 下视图相对路径的 glob 前缀。
 *
 * `import.meta.glob` 的键是相对项目根的绝对样路径（`/src/pages/...`），
 * 而 `routeComponent` 存的是页面相对路径（`manage/user/index.vue`）——
 * 短、可读、与文件系统一一对应，工具（`scripts/menu-sync.ts`）能直接生成。
 */
```

### N-107 · src/store/modules/menu/index.ts:190-198

```ts
/**
 * `routeComponent` → `import.meta.glob` 的键（视图不存在时 undefined）。
 *
 * 两种编码都认：
 * - `src/pages` 下的相对路径（`manage/user/index.vue`）—— 现行格式，
 *   工具可直接生成，人也能一眼对到文件；
 * - legacy 的 `layout.base$view.system_user` —— v2/elegant-router 时代的
 *   存量数据（含 `src/db/seed-data.ts` 的历史行），按视图名反查。
 */
```

### N-108 · src/store/modules/menu/index.ts:217-220

```ts
// iframe（P3-07）：菜单行不配 routePath/routeName，但菜单需要一个可跳转的
// 路由名 —— 统一复用内置的 `/iframe` 页，地址通过 query.url 下发。
// 这里刻意不生成 `[url].vue` 动态段：URL 含 `//` 与 `?`，当路径段会被
// router 拆碎，query 才是稳定表达。
```

### N-109 · src/store/modules/menu/index.ts:250-253

```ts
// ubean 的 keep-alive 契约字段：PageView 靠 `$route.meta.pageName` 决定是否给
// 组件套 `getNamedPageWrapper`（包装组件的 `name` 才能被 `<KeepAlive :include>`
// 命中）。静态页由生成器写入（`@ubean/vue` 的 buildRouteMeta），dynamic 路由
// 没有 → `cache: true` 会静默失效。
```

### N-110 · src/store/modules/menu/index.ts:276-281

```ts
/**
 * 菜单树 → 根到目标节点的链路（全局搜索、多级菜单面包屑用）。
 *
 * 实现住在 `./shared.ts`（与建树同一个纯函数模块），这里只做转导出：菜单
 * store 是 UI 层唯一入口，消费方（如多级菜单面板）不需要知道纯函数的分层。
 */
```

### N-111 · src/store/modules/menu/shared.ts:5-30

````ts
/**
 * 菜单纯函数与统一中间表示（`docs/v3-menu-route-modes.md` §4.3）。
 *
 * **为什么要有 `AppMenu`**：改造前 static 模式从 `router.getRoutes()` 直接建树、
 * dynamic 模式从 `MenuResource` 行建树 —— 两条路径各写一套过滤/排序/挂父逻辑，
 * 形状不同、能表达的东西也不同（static 靠 `meta.menuParent`、dynamic 靠
 * `parentId`）。现在两者在**建树之前**收敛成同一个 `AppMenu[]`：
 *
 * ```
 * static  →  src/menus/menus.json + 生成的路由表  ┐
 *                                                ├→  AppMenu[]  →  buildMenuTree()
 * dynamic →  GET /api/menu/user（DB 是同一个源） ┘
 * ```
 *
 * `buildMenuTree` 因此是**唯一建树点**：菜单树只有一份行为，不存在两种模式
 * 层级/排序不一致的可能。
 *
 * 它只带「菜单自己拥有」的字段：标题、图标、排序、层级、身份、开关。视图组件
 * 与布局仍留在菜单行上，但**菜单树不消费它们** —— 视图由路由表（static）或
 * 后端下发（dynamic）决定，菜单不该重复声明。
 *
 * 类型本体是 `src/schema/menu.ts` 的 `menuSourceSchema`（契约单一来源），这里
 * 只给业务代码一个短名，也是 static 模式的**信任边界**：JSON 是手编辑的文件，
 * `resolveJsonModule` 又会把字面量放宽成 `string`，所以过一遍 schema 才拿到窄
 * 类型（与 `src/utils/route-meta.ts` 收窄 `RouteMeta` 同一个套路）。
 */
````

### N-112 · src/store/modules/menu/shared.ts:36-47

```ts
/**
 * 菜单 → 菜单树（唯一建树点）。
 *
 * 层级只认 `parentId`，不从 `routePath` 前缀猜：`/manage/*` 八套管理页在
 * 路由上同前缀，在菜单上是八个平级项，前缀推断会把它们折叠进一个大目录。
 *
 * 排序在**挂父之前**一次完成 —— 按 `order` 排好序后顺序 push 进各自父节点的
 * `children`，每一层自然有序，不再需要递归排序。
 *
 * 父节点缺失（`parentId` 指向不存在的 id，或父节点被 `menuType` 过滤掉）时
 * 降级为一级菜单，不丢菜单项。
 */
```

### N-113 · src/store/modules/menu/shared.ts:104-110

```ts
/**
 * 解析菜单源文件（`src/menus/menus.json`）为 `AppMenu[]`。
 *
 * 唯一的信任边界：`menus.json` 是人手编辑的文件，而 `resolveJsonModule` 会把
 * JSON 字面量放宽成 `string`（`menuType` / `requiresAuth` 的窄类型丢失）。
 * 解析失败直接抛 —— 菜单源写错应该在启动时就暴露，而不是渲染出一棵缺项的树。
 */
```

### N-114 · src/store/modules/menu/shared.ts:121-132

```ts
/**
 * static 模式的加载器：菜单源数据 + 路由表 → `AppMenu[]`。
 *
 * 只做一件事 —— **用路由表上的真实 path 覆盖菜单里写的 `routePath`**。
 * 菜单里的 `routePath` 是工具生成时的快照，页面文件改名后它就成了死数据，
 * `router.push` 会跳到不存在的地址；路由表才是当下的事实。路由表里查不到
 * 该 `routeName` 时保留菜单写的值（条目仍可见，问题交给
 * `validateMenuRoutes` 报出来）。
 *
 * 这也让「换父/改路径」可以在 JSON 里覆盖：手写的 `routePath` 在路由表命中
 * 时被覆盖、未命中时生效 —— 不需要动页面文件。
 */
```

### N-115 · src/store/modules/menu/shared.ts:142-157

```ts
/**
 * dev 一致性校验：菜单与路由表对齐（文档 §3 降级来的校验价值）。
 *
 * 三项来自两版路由插件的真实踩坑：
 *
 * 1. `routeName` 指向的路由不存在 —— 菜单点了没反应（或落 404）。legacy 时代
 *    改名页面文件就会静默产生这种菜单，是社区抱怨的来源之一。
 * 2. 菜单的 `routePath` 与路由表里该 name 的 `path` 不一致 —— `router.push`
 *    走的是 path，两边不一致就跳错页；`prefix_except_default` 下路由表的 path
 *    带 `/:locale(en)?` 前缀，故比较前先归一化。
 * 3. `directory` 行的 `routePath` 不是其子项 `routePath` 的前缀 —— 目录与子项
 *    在导航上分家了。目录没有对应路由（纯分组），这条是它唯一的自检。
 *
 * 只在 dev 调用，返回人类可读的问题清单（空数组 = 通过），由调用方决定打印与
 * 是否抛错 —— 纯函数不碰 console，便于单测。
 */
```

### N-116 · src/store/modules/menu/shared.ts:192-199

```ts
/**
 * 剥掉 vue-router 路径里的 locale 参数段（`/:locale(en)?/about` → `/about`）。
 *
 * 与 `src/shared/route.ts` 的同名函数是同一个规则 —— 这里复制一份是**刻意的**：
 * 本文件要被 `scripts/menu-sync.ts` 以普通 Node 进程加载，而 `@/shared/route.ts`
 * 会连带拉进 `hono`（`findHonoRouteByPath` / `requireParam` 的 import），
 * 在 Vite 之外无法解析。规则只有一条正则，重复的代价小于耦合。
 */
```

### N-117 · src/store/modules/tab/index.ts:9-23

```ts
/**
 * 页签 store（v3 §5.4 多页签）。
 *
 * 页签 value 约定：multiTab 页 = fullPath（同路由不同 query 独立页签），
 * 普通页 = 路由名。keep-alive：`meta.cache` 的路由由 ubean 启动期种入
 * KeepAlive（`initCachedViewsFromRoutes`），缓存开关走 ubean 全局的
 * `excludePageCache` / `includePageCache`（模块级响应式状态，PageView 的
 * `<KeepAlive :include>` 直接消费）—— 应用侧不自建缓存列表。
 *
 * 持久化：页签列表写 localStorage（`@/utils/storage` 前缀封装），刷新恢复。
 *
 * 导航类 action（`switchTab` / `reloadTab`）由调用方传入 router：store 不持有
 * router 引用，也就不会 `store → @/router → guard → store` 成环（见
 * `src/router/guard.ts` 的依赖说明）。组件传 `useRouter()`，守卫传 `setup` 入参。
 */
```

### N-118 · src/store/modules/tab/index.ts:27-34

```ts
/**
 * `addTab` 真正读取的路由切片。
 *
 * 用最小结构而非 `RouteLocationNormalized`：守卫传进来的仍是完整对象（结构
 * 兼容），而测试可以只造这几个字段、**不需要 `as RouteLocationNormalized`
 * 断言**（本仓 eslint 禁 `as T`）。同时它把「页签依赖路由的哪几个字段」写成
 * 可检查的契约：多读一个字段就要改这里。
 */
```

### N-119 · src/store/modules/theme/index.ts:30-34

```ts
/**
 * 布局模式（v2 语义名）与 SAppShell 模式的映射表在 `@/constants/layout`
 * （`src/shared/layout-matrix.ts` 也要读它，不该为此把 store 拖进依赖图）。
 * 这里 re-export 一份，老引用（`useThemeStore` 用法方、theme 抽屉）不必改。
 */
```

### N-120 · src/store/modules/theme/index.ts:38-43

```ts
/**
 * 水印设置（P2-12）。
 *
 * 文本优先级（对齐 v2）：`enableUserName` → `enableTime` → `text`。
 * 两个开关互斥，见 `setWatermarkEnableUserName` / `setWatermarkEnableTime`。
 */
```

### N-121 · src/store/modules/theme/index.ts:52-57

```ts
/**
 * 主题 + 布局设置（P2-10 ~ P2-15、P2-20 的配置项维度）。
 *
 * 一个对象一个持久化 key：主题抽屉的所有开关都写在这里，`SAppShell` 的
 * `layoutProps` / `tabProps` 由它派生，页面动画/滤镜/水印由消费方读它。
 */
```

### N-122 · src/store/modules/theme/index.ts:59-65

```ts
/**
 * 主题预设名（`themePresets[].name`）。
 *
 * 这是「用户选的是哪套预设」的记录；真正生效的 `base`/`primary`/`radius`
 * 存在 `SConfigProvider` 的主题信封（`__VEAN_THEME`）里，两者由
 * `src/app.vue` 的 `watchEffect` 单向同步（信封是更完整的那份真值）。
 */
```

### N-123 · src/store/modules/theme/index.ts:67-73

```ts
/**
 * 明暗偏好（`light` / `dark` / `auto`）。
 *
 * 真值同样在 `SConfigProvider` 的主题信封里（那里还持久化 `size` / `spacing`
 * 等本 store 不管的维度），本字段是它的镜像，仅用于「复制配置」时带上
 * 完整的 `theme.*` 命名空间（P2-10）。
 */
```

### N-124 · src/store/modules/theme/index.ts:168-171

```ts
/**
 * 从 localStorage 恢复：`watermark` 是唯一嵌套对象，旧数据缺该键时
 * 浅合并会留下 `undefined`，所以显式补回默认值。
 */
```

### N-125 · src/store/modules/theme/index.ts:182-187

```ts
/**
 * 读出持久化的主题设置（首屏种子用）。
 *
 * 导出成独立函数是因为 `src/app.ts` 要在 pinia 安装**之前**算出首屏主题信封
 * （见 `seedPresetState`），那时还拿不到 store 实例，只能调纯函数。
 */
```

### N-126 · src/store/modules/theme/index.ts:192-198

```ts
/**
 * 主题设置 → `SConfigProvider` 的主题信封状态（首屏种子）。
 *
 * 信封里还有 `size` / `spacing` 等本 store 不管的维度，那部分由
 * `SThemeCustomizer` 编辑后自行持久化，首屏种子只补「预设 + 明暗」这两项，
 * 其余字段缺失时由 provider 走自己的默认值。
 */
```

### N-127 · src/store/modules/theme/index.ts:206-211

```ts
/**
 * 滤镜（P2-10）：灰色 / 色弱写在 `<html>` 的 `style.filter` 上。
 *
 * 两个开关互斥 —— 与色弱同时打开的「灰色」必须显式退出，否则后开的滤镜
 * 永远被先开的那个遮蔽；`grayscale` 优先，只由它自己让位，避免来回抢。
 */
```

### N-128 · src/store/modules/theme/index.ts:218-226

```ts
/**
 * 主题**设置表 + 预设表 + 布局设置**（应用级数据）。
 *
 * - 主题的**运行时状态**（当前 base/primary/radius/mode、明暗切换、持久化、
 *   自定义 preset）由 `@vean/ui` 的 `SConfigProvider` 持有，消费方通过
 *   `useTheme()` 读取与修改 —— 应用层不自建 mode 状态。
 * - 本 store 只管「应用自己的外观/布局开关」：布局几何、动画、水印、滤镜、
 *   显隐，持久化到 localStorage（key `theme-settings`）。
 */
```

### N-129 · src/store/modules/theme/index.ts:238-243

```ts
/**
 * 传给 `SConfigProvider` 的 `theme` prop。
 *
 * 不传 `mode` —— 明暗偏好由 provider 内部状态 + `persistTheme` 信封管理，
 * 避免两处真值。
 */
```

### N-130 · src/store/modules/theme/index.ts:251-257

```ts
/**
 * 当前预设对应的**完整可编辑主题状态**（引擎选项 + 明暗偏好）。
 *
 * 两个消费方：`src/app.ts` 启动时 `seedPresetState()` 种信封；主题抽屉
 * 切预设时 `applyPresetState()` 广播。带上 `mode` 是为了不覆盖用户在
 * `SThemeModeSegment` 里选的明暗（该值由 `src/app.vue` 从信封单向同步而来）。
 */
```

## shared 纯函数

### N-131 · src/shared/api-proxy.ts:1-12

```ts
/**
 * 多 baseURL 代理（v3 §4.3 / P2-18）：`/_p/{key}` 前缀代理。
 *
 * 约定（.env）：
 * - `API_PROXY_TARGETS`（server）：`key=origin,key2=origin2`，origin **不含路径**，
 *   只表示「去哪个上游」。`ubean.config.ts` 据此生成 `routeRules`。
 * - `VITE_API_PROXY_KEYS`（public）：客户端只拿得到 key 列表，拼出 `/_p/{key}`
 *   前缀请求；真实 origin 永不下发到浏览器。
 *
 * 纯函数模块：server（config）、client（请求实例）、测试三方共用，不引任何
 * 运行时依赖（`ubean.config.ts` 在 Node 里被 config loader 直接求值）。
 */
```

### N-132 · src/shared/api-proxy.ts:38-44

```ts
/**
 * 解析 `key=origin,key2=origin2`。
 *
 * - 逐项容错：缺 key / 非法 key / 非 http(s) origin 的条目直接丢弃，不让一条
 *   手滑的配置打断整个服务启动。
 * - 同 key 后写覆盖先写（便于按环境追加覆盖）。
 */
```

### N-133 · src/shared/api-proxy.ts:87-93

```ts
/**
 * key → routeRules：`/_p/{key}/**` 代理到 `{origin}/**`。
 *
 * 目标用 `/**` 而不是写死 `/api/**`：转发时框架把规则前缀之后的后缀原样接到
 * 目标 pathname 上（`applyPathTransform`），所以 `/_p/default/api/auth/login`
 * → `{origin}/api/auth/login`，同一份配置对任意后端挂载前缀都成立。
 */
```

### N-134 · src/shared/api-proxy.ts:106-121

```ts
/**
 * 浏览器专用演示页的 SSR 豁免（P4-01）。
 *
 * ubean 的 dev server 会对每个 HTML 请求在 Node 里预渲染整棵应用树
 * （AGENTS.md 的已知陷阱：`import.meta.server === false` 且没有 `window`）。
 * `src/pages/plugin/**` 的第三方集成库都在模块求值期就碰浏览器 API
 * （`new WangEditor`、`window.HTMLCanvasElement`…），预渲染必然抛错。
 *
 * 这些页面本来就只是本地演示、没有 SSR 价值，统一按 URL 前缀降级为 CSR：
 * `routeRules['/plugin/**'] = { ssr: false }`。框架语义见 `@ubean/routes` 的
 * `resolveSelectSsr` —— `ssr === false` → `mode: 'csr'`，既不跑 loader 也不渲染，
 * 只回 CSR shell，由客户端路由挂载页面。
 *
 * **注意 routeRules 的 key 是请求路径**（`createRouteRulesMiddleware` 用
 * `c.req.path` 匹配），不是源文件路径。
 */
```

### N-135 · src/shared/api-route-sync.ts:3-16

```ts
/**
 * 路由 ↔ `api` 表对账（§5.2 第 5 条）。
 *
 * **为什么需要**：RBAC 权限码是 `api:${method}:(${path})`，权限点挂在 `api` 行上。
 * 路由存在但 `api` 表没有对应行 → 接口**没有任何权限点可以授予**，只能靠 super 角色
 * 绕过 —— 也就是「接口裸奔」（authorization.md §4.3）。两张表手工维护必然漂移，
 * 所以在启动时把真实注册的路由与 `api` 表对账。
 *
 * **为什么只警告不自动写库**：启动期写库要处理 id 生成、审计字段、幂等键、与迁移的
 * 先后顺序；漏一行数据的代价只是多一条 warning。`seedApis` 是权威清单，对账只负责
 * **发现**漏登记。
 *
 * 本模块是纯函数（不 import db），便于单测；`src/server.ts` 负责收集 + 查询 + 打印。
 */
```

### N-136 · src/shared/api-route-sync.ts:58-61

```ts
/**
 * 路由注册钩子回传的是 hono 模板（`/api/user/:id`），带 `/api` 挂载前缀；
 * 权限码里的 path 不含该前缀 → 剥一次。
 */
```

### N-137 · src/shared/api-route-sync.ts:66-75

```ts
/**
 * `api` 表行的候选键（可能命中多个）。
 *
 * 这里比路由侧宽容：`api` 表存的是人手录入/seed 的路径，可能写成
 * `user/list`（无前缀）、`/user/list`（无 `/api` 前缀）或 `/api/user/list`（完整）。
 * 剥一次前缀是 `buildApiPermissionCode` 的既有行为（生成权限码时同样会剥），
 * 但 `/api/list` 这种**真正以 `/api` 开头的业务路径**（接口资源模块挂在
 * `/api/api/**`）剥完就丢了信息，所以同时给出「剥」与「不剥」两种候选，
 * 任一命中即算登记过。
 */
```

### N-138 · src/shared/api-route-sync.ts:97-102

```ts
/**
 * 对账（纯函数）。
 *
 * - `missing`：真实路由的归一键不在「`api` 表全部候选键」集合里；
 * - `stale`：`api` 行的**全部**候选键都不在真实路由集合里。
 */
```

### N-139 · src/shared/auth.ts:7-11

```ts
/**
 * 认证工具层（v3 §6.4，unify 自研 JWT 首版）：
 * - 签发/校验用 hono/jwt（HS256），密码哈希用 bcryptjs；
 * - 令牌黑名单走 `useKV`（dev 内存 driver，演进 v3.1+ 换 Redis driver），键 `blacklist:${token}`。
 */
```

### N-140 · src/shared/common.ts:1-7

```ts
/**
 * 通用纯函数（v3 §5.7，P3-02）。
 *
 * 与 `src/shared/pagination.ts` 同层：**零依赖 + 零副作用**，前后端与测试
 * 三方共用。这一层刻意不放 `t()` 之类需要运行时上下文的东西 —— 所有需要
 * i18n 的应用层逻辑在 `src/composables/` 里。
 */
```

### N-141 · src/shared/common.ts:9-22

````ts
/**
 * 过滤查询参数里的空值（`undefined` / `null` / `''`）。
 *
 * 为什么需要：表格搜索卡的表单字段在"未填"时是空串，直接拼进 query 会让
 * 后端把 `keyword=` 当成"搜索空关键字"从而命中 0 行；`sort=` / `enabled=`
 * 同理会把有效默认值覆盖掉。
 *
 * 返回 `Partial<T>` 而非 `T` —— 调用处应把它当作"全部可选"的一包查询条件。
 *
 * ```ts
 * filterValidQuery({ keyword: '', current: 1, size: 10 })
 * // → { current: 1, size: 10 }
 * ```
 */
````

### N-142 · src/shared/error.ts:6-12

```ts
/**
 * 应用错误类（v3 §6.1）：携带业务码键的结构化错误。
 *
 * handler / service 中 `throw new AppError('RESOURCE_NOT_FOUND', '...')`，
 * 由全局错误中间件（src/middleware/03.error.ts 经 onError）统一转成
 * `{ code, message, data: null }` 响应。
 */
```

### N-143 · src/shared/i18n.ts:1-13

```ts
/**
 * locale → 文档属性（`<html lang>` / `dir`）的纯逻辑 + 客户端同步。
 *
 * **为什么需要**：`src/app.ts` 的 `defineApp({ head: { htmlAttrs: { lang } } })`
 * 是**构建期静态值**（写死 `DEFAULT_LOCALE`），页面里的语言切换不会改它。
 * 组件文案、标题都会跟着 i18n 走，只有 `<html lang>` 会一直停在初始语言 ——
 * 对屏幕阅读器（朗读语言）、浏览器翻译提示、CSS `:lang()` 都是错的。
 *
 * `dir` 同理：`zh` / `en` 都是 `ltr`，但本文件按**全局**规则解析，13 个 Vean
 * 语言包里的 `ar` / `ru` 等（RTL 集合）切过去时自动变 `rtl`。
 * 与 `@vean/aria/locale` 的 `resolveLocaleDirection()` 同一份 RTL 集合
 * （`ar/he/fa/ur/yi/ps/sd/ug/ku/dv`，按主语言码匹配）。
 */
```

### N-144 · src/shared/i18n.ts:35-41

```ts
/**
 * 把当前 locale 同步到 `<html lang>` / `<html dir>`（客户端副作用）。
 *
 * 无 `document` 时静默返回 —— ubean dev 的 HTML 请求会在 Node 里预渲染执行
 * 应用（`src/app.vue` 的 watcher 也会跑），那里没有 DOM（同 `src/router/guard.ts`
 * 的教训：判据是能力检测，不是 `import.meta.server`）。
 */
```

### N-145 · src/shared/iframe.ts:1-16

```ts
/**
 * 外链 / 内嵌页地址解析（P3-07）。
 *
 * 纯函数，被三处共用：`src/pages/(builtin)/iframe/index.vue`（内嵌页 `?url=`）、
 * `src/layouts/default.vue` 的 `onMenuSelect`（`menuType: 'link'` 的新窗口打开）、
 * 以及单测。
 *
 * 为什么放在 `src/shared/`：布局、页面、测试都要同一份判定；写在组件里就变成
 * 「每个使用点各写一遍正则」，迟早漂移。
 *
 * 只放行 `http:` / `https:`：
 * - `javascript:` 在 `iframe.src` / `window.open` 上会被浏览器拦截，但属于
 *   典型的注入面，必须在数据入口就砍掉；
 * - `data:` / `blob:` 可能被当成下载或渲染本地内容，一律不接受；
 * - 相对路径（`/foo`）不是外链语义，同样拒绝 —— 内部导航请用 `path`。
 */
```

### N-146 · src/shared/layout-matrix.ts:1-36

```ts
/**
 * 「布局模式 × 配置项」矩阵（P2-20 PoC）。
 *
 * ## 为什么要有这个模块
 *
 * 主题抽屉的开关是**笛卡尔积**：6 种布局模式 × 19 个配置项 = 114 种组合，
 * 其中相当一部分在 Vean 里根本不生效（侧栏都没有时谈侧栏宽度毫无意义）。
 * 这些组合不会报错、不会崩，只会让某个开关**默默无反应**，typecheck / lint /
 * build / 视觉回归全绿。
 *
 * 所以把「哪些组合有效、生效值是什么、为什么无效」从 `SAppShell` 的隐式行为
 * 提成**显式的纯函数矩阵**：
 * - `resolveLayoutMatrix()` 是运行时真值（布局组件据此下发 props）；
 * - `describeLayoutMatrix()` 渲染成 Markdown 表（`docs/v3-task.md` 直接抄）。
 *
 * ## 事实来源（Vean 0.50 源码，改版即回归）
 *
 * - `packages/ui/src/components/app-shell/shared.ts` 的 `appShellSkeletons`：
 *   每个 `AppShellMode` 的 `orientation` / `sidebarVisible` / `collapsible` /
 *   `menuPlacement` / `logoPlacement` / `stableSidebar`。
 * - `app-shell.vue` 模板：`v-bind="layoutProps"` 在前，随后
 *   `:orientation` / `:sidebar-visible` / `:collapsible="skeleton.collapsible"`
 *   / `:sidebar-width` / `:collapsed-sidebar-width` 覆盖 ⇒ **本应用设置的
 *   `collapsible` 不生效**；`breadcrumbVisible` 另需 `menuPlacement==='sidebar'
 *   && logoPlacement==='sidebar'`。
 * - `app-shell.vue` 的 `resolveShellWidths(size, columns, override)` 写成
 *   `override.sidebarWidth ?? columnsWidth(tree)`：**四个分栏模式的侧栏宽度
 *   是推导值**（`resolveSplitNavSidebarColumns()` 按「当前激活的一级菜单有没有
 *   子菜单」决定轨道/面板列是否存在），一旦应用在 `layoutProps` 里下发
 *   `sidebarWidth` 就会短路掉推导、侧栏变固定宽度。所以矩阵对这四个模式
 *   **不下发**这两个键（`derivesSidebarWidth`）。
 * - `app-shell.vue`：`isMobile` 时骨架固定为 `sidebar`，与 `mode` 无关。
 *
 * **版本哨兵**：`APP_SHELL_MATRIX_VERSION` 每次改动同步 bump；改动矩阵语义时
 * 同步更新 `describeLayoutMatrix()` 的断言基线（测试里会钉住版本号）。
 */
```

### N-147 · src/shared/layout-matrix.ts:45-50

```ts
/**
 * 矩阵的列（配置项维度）。
 *
 * 顺序即文档表格顺序：**布局 → 尺寸 → 显隐 → 行为**。
 * 新增抽屉开关时在此登记，避免出现「只在面板里有、矩阵里查不到」的孤儿开关。
 */
```

### N-148 · src/shared/layout-matrix.ts:102-108

```ts
/**
 * 单个壳模式的能力（= `appShellSkeletons` 的可观察后果）。
 *
 * 不用 `AppShellMode` 作 key 而用 `LayoutModeName`：能力随**应用**模式而非
 * shell 模式声明，一个 shell 模式只对应一个应用模式（`mapLayoutMode` 是单射），
 * 但这样新增应用模式时若忘了补能力表，`Record<...>` 会立刻报缺失键。
 */
```

### N-149 · src/shared/layout-matrix.ts:120-131

```ts
/**
 * 侧栏宽度是否由骨架**推导**（而不是直接采用应用设置）。
 *
 * 四个分栏模式（`dual-vertical` / `vertical-horizontal` /
 * `horizontal-vertical` / `horizontal-dual-vertical`）的侧栏由
 * `SSplitNav` 渲染「轨道 + 面板」列，列的存在取决于当前激活的一级菜单
 * **有没有子菜单** —— 所以宽度必须由 `resolveSplitNavSidebarColumns()`
 * 现算。应用若在 `layoutProps` 里下发 `sidebarWidth` /
 * `collapsedSidebarWidth`，`resolveShellWidths()` 的 `override` 会短路掉
 * 推导（`override.sidebarWidth ?? columnsWidth(tree)`），于是侧栏变成固定
 * 宽度：叶子菜单也占着面板的宽度，激活有子菜单的一级菜单时又对不上。
 */
```

### N-150 · src/shared/layout-matrix.ts:222-227

```ts
/**
 * 内容区是否自带滚动容器。
 *
 * `scrollBehavior: 'content'` 时页脚必须跟内容一起滚（否则页脚被固定在视口
 * 底部、内容从它下面穿过），Vean 用 `fixedFooter` 表达这个需求。
 */
```

### N-151 · src/shared/layout-matrix.ts:233-240

```ts
/**
 * 非生效态的原因分类。
 *
 * `degraded` 只把 `mode` 计入「该模式的固有限制」：
 * `user`（用户自己关的）与 `viewport`（桌面用不到移动端宽度）不该让抽屉报
 * 「当前模式不支持」。`dependency` 是「本应用根据其他设置现算」—— 既不是模式
 * 限制，也不是用户没开，所以同样不计入 `degraded`。
 */
```

### N-152 · src/shared/layout-matrix.ts:263-268

```ts
/**
 * 可直接 `v-bind` 到 `SAppShell` 的 props。
 *
 * 这是矩阵的**运行时效用**：`cells` 是给人看的诊断，`layoutProps` 是给壳的
 * 真值（已应用 forced 覆盖）。两者用同一批局部变量构建，不会走神。
 */
```

### N-153 · src/shared/layout-matrix.ts:277-285

```ts
/**
 * 侧栏展开宽度。
 *
 * **分栏模式不下发**（`derivesSidebarWidth` 为真时缺省）：壳的
 * `resolveShellWidths()` 写成 `override.sidebarWidth ?? columnsWidth(tree)`，
 * 一旦给了值就短路掉「按当前列数推导」的逻辑，侧栏会变成固定宽度 ——
 * 激活叶子菜单时仍占着面板宽度，激活有子菜单的一级菜单时又对不上。
 * 缺省（`undefined`）时才由壳按轨道/面板列数现算。
 */
```

### N-154 · src/shared/layout-matrix.ts:307-314

```ts
/**
 * 顶栏菜单（`top` 模式）是否把放不下的条目收进末尾的「更多」弹层。
 *
 * `STreeNav` 的 `collapsible` **默认 false**（`TreeNavCompactProps` 的
 * `@defaultValue false`），不开就只是一条横向导航：条目超出容器时既不换行也
 * 不收缩，直接把顶栏撑破（实测容器 1002px、导航条 1311px，溢出 309px）。
 * 开了之后 `TreeNavCompact` 会把尾部的条目逐个移进「更多」弹层。
 */
```

### N-155 · src/shared/layout-matrix.ts:320-328

```ts
/**
 * 下发给 `SAppShell` 的 `menuProps`。
 *
 * 目前只有一件事：给**顶栏菜单**（`top` 骨架的 `STreeNav`）开容器超长收缩。
 * 分栏/侧栏模式渲染的是 `STreeMenu` / `SSplitNav`，没有「更多」弹层这回事，
 * 下发 `treeNav` 也无人消费，所以只有 `top` 模式才给。
 *
 * `moreLabel` 由调用方传 i18n 文案：矩阵是纯函数，不该去碰 i18n 上下文。
 */
```

### N-156 · src/shared/layout-matrix.ts:356-360

```ts
/**
 * 核心：解一个「模式 × 配置项」组合。
 *
 * 纯函数，无 DOM / 无 store —— 所以能在 node 环境里跑矩阵全组合测试（P2-20）。
 */
```

### N-157 · src/shared/layout-matrix.ts:529-533

```ts
/**
 * 渲染 Markdown 表（6 模式 × 19 维），供 `docs/v3-task.md` 直接引用。
 *
 * 单元格记号：`✅` 生效 / `🔒` 被骨架覆盖（forced）/ `—` 失效（inert）。
 */
```

### N-158 · src/shared/pagination.ts:1-6

```ts
/**
 * 分页 / 排序参数解析（unify 范式）。
 *
 * 列表查询约定：`page`（默认 1）、`pageSize`（默认 10）、
 * `sort='field1,-field2'`（默认升序，`-` 前缀表示降序）。
 */
```

### N-159 · src/shared/pagination.ts:36-41

```ts
/**
 * 从排序串解析出 drizzle 列引用（列表查询专用）。
 *
 * `sort='-createdTime'` + 表的列字典 → { column, isDesc }；
 * 字段不在列字典中时回落到 fallback 列，非法输入不炸接口。
 */
```

### N-160 · src/shared/permission-cache.ts:3-19

```ts
/**
 * 用户权限码缓存（§5.2 鉴权热路径优化）。
 *
 * **为什么需要**：RBAC 中间件对每个已登录请求都要判定权限码。改造前
 * `checkUserHasPermission` 每次三查（permission → user_role → role_permission），
 * 而 JWT 里不带权限码，等于每个请求都打三遍库。这里把「用户 → 权限码集合」
 * 缓存进 `useKV`（dev 内存 driver，prod 可换 Redis driver），热路径退化为一次
 * KV 读。
 *
 * **失效策略**：写操作显式失效 + TTL 兜底（二者缺一不可）。
 * - 显式失效覆盖正常路径：角色/权限/用户-角色/组织-角色 变更后立刻清对应键；
 * - TTL 是兜底网：漏掉的失效路径最多脏 `PERMISSION_CACHE_TTL` 秒。
 *
 * 本模块**不 import 任何 db / service**（纯 KV 逻辑，loader 由调用方注入），
 * 避免 `shared → services → db` 的反向依赖；反向查用户、失效编排在
 * `permission.service` / `role.service` 里做。
 */
```

### N-161 · src/shared/permission-cache.ts:39-44

```ts
/**
 * 读缓存，未命中则 `loader` 回源并写回。
 *
 * `loader` 是同步的（drizzle better-sqlite3 同步 API），回源失败时异常向上抛，
 * 不写半截缓存。
 */
```

### N-162 · src/shared/permission-cache.ts:76-81

```ts
/**
 * 清空整个权限码命名空间。
 *
 * 权限点自身变更（改 code / 删除）无法廉价反查到用户集合，直接全清 ——
 * 权限点是低频管理操作，全清比逐个反查更简单也更不容易漏。
 */
```

### N-163 · src/shared/permission.ts:3-12

```ts
/**
 * 权限判定纯函数（v3 §4.6）。放在 `src/shared/` 而非 `@/directives/auth`：
 * 路由守卫（`src/router/guard.ts`）与指令（`v-auth`）共用同一判定，且纯函数
 * 可单测（`test/specs/shared/permission.test.ts`）—— 指令模块带 Vue 运行时依赖，
 * 不适合被守卫静态引入。
 *
 * 两条通道粒度不同：
 * - **权限码**（`hasPermissionCode`）：`userInfo.buttons`，按钮级；
 * - **角色码**（`hasRole`）：`userInfo.roles`，路由/菜单级。
 */
```

### N-164 · src/shared/permission.ts:17-23

```ts
/**
 * 角色码判定：超级角色恒通过；`required` 为空视为「无需判定」；
 * 否则取用户角色与所需角色码的交集。
 *
 * @param roles 用户角色码（`userInfo.roles`）
 * @param required 需要的角色码（任一命中即可）
 */
```

### N-165 · src/shared/permission.ts:31-39

```ts
/**
 * 权限码判定：所需的任一枚命中即可；`required` 为空视为放行。
 *
 * 不做超级角色特判 —— seed 已把全量权限授予 super 角色，`buttons` 是全量
 * 权限码；特判反而会让「权限码被回收」在超管身上测不出来。
 *
 * @param codes 用户权限码（`userInfo.buttons`）
 * @param required 需要的权限码
 */
```

### N-166 · src/shared/response.ts:4-7

```ts
/**
 * 统一响应契约（v3 §6.1）：所有 `/api/**` 响应恒为 `{ code, message, data }`。
 * 由 src/middleware/00.response.ts 重写 `c.json` 自动包装，handler 只写业务数据。
 */
```

### N-167 · src/shared/route-exist.ts:1-13

```ts
/**
 * NotFound 落点判定：404 vs 403（P3-07，v3 §4.2「路径存在但无权限 → 403」）。
 *
 * 两种权限模式的区别决定了这个判定只能有一半靠本地：
 * - **static**：全部路由在本地路由表里一次性注册，能导航到的都在表里；
 *   落到 `NotFound` 就是真 404，与权限无关 → 不查、不判。
 * - **dynamic**：路由由 `GET /api/menu/user` 按权限下发。菜单里存在、但当前
 *   用户无权 → 路由没被注册 → 落到 `NotFound`。此时必须反查一次后端
 *   （`POST /api/menu/exist-path`）：路径**存在** → 403（无权限），
 *   不存在 → 真的 404。
 *
 * 抽成纯函数是为了能单测（守卫本身依赖 pinia / localStorage 跑不起来）。
 */
```

### N-168 · src/shared/route.ts:4-9

```ts
/**
 * hono 路由匹配辅助（RBAC 中间件用）。
 *
 * `matchedRoutes(ctx)` 拿到的是含 `:param` 的路由模板，需要和实际请求路径做
 * 模板匹配（`:id` 匹配单个非 `/` 段）才能确定命中的是哪条路由。
 */
```

### N-169 · src/shared/route.ts:23-35

````ts
/**
 * 归一化接口路径为权限码里的 path 段。
 *
 * 权限码范式 `api:${method}:(${path})` 里的 path **不含 `/api/` 前缀**，且用
 * **路由模板**（`[id]`）而非请求路径 —— 两边任何一处不统一，权限码就匹配不上：
 *
 * ```
 * 中间件（请求 /api/user/123）  api:get:(/user/123)   ← 错，永远匹配不到 seed
 * 中间件（路由模板）           api:get:(/user/[id])  ← 对
 * ```
 *
 * 接口管理页录入的 `api.path` 可能带 `/api/` 前缀或写成 `:id`，这里一并归一。
 */
````

### N-170 · src/shared/route.ts:47-56

```ts
/**
 * 剥掉**已解析**路径里的 locale 前缀（`/en/about` → `/about`）。
 *
 * 与 `normalizeRoutePath` 的区别：后者剥的是路由**模板**里的参数段
 * （`/:locale(en)?/about`），本函数剥的是实际地址里的具体语言码。两者都需要的
 * 场景是「拿实际路径去比对菜单里存的干净路径」—— 菜单的 `routePath` 一律无
 * locale 前缀（`prefix_except_default` 下默认语言无前缀，其它语言由运行时加上）。
 *
 * 只剥首段且必须整段等于某个 locale（`/en` 会剥，`/english` 不会）。
 */
```

### N-171 · src/shared/route.ts:66-79

```ts
/**
 * 剥掉 vue-router 路径里的 locale 参数段（`/:locale(en)?/about` → `/about`）。
 *
 * **为什么需要**：i18n 策略不是 `no_prefix` 时，ubean 把每条页面路由注册在带
 * locale 参数段的 path 上（`prefix_except_default` → `/:locale(en)?/about`）。
 * `router.getRoutes()` 返回的 `route.path` **就是这种模板字符串**，直接拿去
 * `router.push()` 会把字面量 `/:locale(en)?/about` 当成真实地址 → 404。
 *
 * 剥完的路径同时是 locale 无关的：`prefix_except_default` / `prefix_and_default`
 * 策略下服务端与客户端路由都接受无前缀路径（落点语言跟随 locale cookie）。
 *
 * 只剥**首段**且只在它是 `:locale(...)` 形式时剥（不改具名业务参数如 `/user/:id`）。
 * `no_prefix` 策略下 `route.path` 本就没有该段，此函数是恒等变换。
 */
```

### N-172 · src/shared/route.ts:89-94

```ts
/**
 * 读取必填路径参数（ubean 文件路由 `[id].ts` → `:id`）。
 *
 * ubean 的 handler 泛型不携带具体路径，`c.req.param()` 返回 `string | undefined`；
 * 统一在这里做存在性守卫（抛 PARAM_MISSING），调用方拿到确定的 string。
 */
```

### N-173 · src/shared/tab.ts:3-26

```ts
/**
 * 「这条路由该不该出现在页签栏」的单一判定（P4-03）。
 *
 * ## 为什么单独抽一个模块
 *
 * 页签栏是后台壳（`default` 布局）的一部分，而 `blank` 布局的页面
 * （登录 / 403 / 404 / 500）压根不渲染这个壳 —— 把它们的路由加进页签，会出现
 * 「点了跳到空白页」的假页签：登录成功后页签栏里赫然挂着一个「登录」，且点它
 * 会被守卫弹回首页。实测症状就是登录后页签栏 `登录 | 工作台`。
 *
 * 判定**只看布局**，不看 `requiresAuth`：登录页与 500 页都是公开页，但它们
 * 已经被布局这一条排除；反过来，将来若有需要登录却不该进页签的页面，布局
 * 仍是它自己的语义声明，不需要再加一条白名单。
 *
 * 这是**跨层契约**：静态页的 `layout` 来自 `definePage({ layout })`（ubean
 * 写进 `meta.layout`），dynamic 路由的来自菜单行的 `routeLayout`
 * （`transformMenuToRoute` 写进 `meta.layout`）。两份都不写时**是 `default`**，
 * 所以判定写成「显式声明为 blank 才排除」，而不是「等于 default 才收」——
 * 后者会把 `undefined` 一起排除掉。
 *
 * `scripts/menu-sync.ts` 的 `isMenuPage()` 用同样的 `page.layout === 'blank'`
 * 判定把这类页面挡在菜单外，两处语义一致（那边读的是扫描器的 `page.layout`，
 * 这边读的是路由 meta，来源同一条定义）。
 */
```

### N-174 · src/shared/table.ts:1-13

```ts
/**
 * 表格数据适配（v3 §5.7，P3-02）。
 *
 * `usePaginatedTable`（`@vean/ui`）要求 `transform` 把接口响应映射成统一的
 * `PaginationResult`（`{ page, pageSize, total, list }`）；本后端列表接口返回的
 * 却是 `{ current, size, total, list }`（见 `src/schema/_shared.ts` 的
 * `paginationQuerySchema`）。这一层做**唯一一次**字段改名，页面不再各自手写
 * `{ page: data.current, ... }`。
 *
 * 空页兜底是刻意的：`usePaginatedTable` 把 `transform` 的返回直接赋给
 * `tableData`，列表失败时（`flatApi` 永不抛异常，只在 `error` 上报）必须给出
 * 形状合法的空页，否则表格会拿到 `undefined`。
 */
```

### N-175 · src/shared/table.ts:28-33

```ts
/**
 * 页面查询对象约束：`page` / `pageSize` 由分页组件驱动，其余为业务搜索字段。
 *
 * 与 `src/composables/use-table-operate.ts` 的 `TableQuery` 同形状，这里单独声明
 * 是为了让 `src/shared` 不反向依赖 `src/composables`。
 */
```

### N-176 · src/shared/table.ts:40-52

````ts
/**
 * 页面查询对象 → 列表接口 query（`page` / `pageSize` 改名 `current` / `size`）。
 *
 * 与 `toTablePagination` 互逆，两处改名各自只发生一次：页面里不再手写
 * `{ current: query.page, size: query.pageSize }`。
 *
 * 泛型保留其余字段，调用方可以直接把它喂给 typed client 的 `query`：
 *
 * ```ts
 * api: async () =>
 *   (await flatApi.get('/user/list', { query: toPageQuery(filterValidQuery(query.value)) })).data
 * ```
 */
````

### N-177 · src/shared/table.ts:59-64

```ts
/**
 * `{ current, size, total, list }` → `@vean/ui` 的 `PaginationResult`。
 *
 * `defaultTableTransform` 是它更常用的别名形态，页面直接把它交给
 * `usePaginatedTable({ transform })`。
 */
```

### N-178 · src/shared/table.ts:74-84

````ts
/**
 * `usePaginatedTable` 的 `transform`（应用层范式，v3 §5.7）。
 *
 * ```ts
 * const { tableData, fetchData } = usePaginatedTable({
 *   api: async () => (await flatApi.get('/user/list', { query: toPageQuery(query.value) })).data,
 *   transform: defaultTableTransform,
 *   columns: () => [...]
 * });
 * ```
 */
````

### N-179 · src/shared/theme-preset.ts:8-25

```ts
/**
 * 主题预设 ↔ `@vean/ui` 主题信封的桥（P2-10）。
 *
 * 为什么需要这一层：Vean 的主题真值在 `SConfigProvider` 的内部状态 + 单一
 * 持久化信封 `__VEAN_THEME`（`persistTheme`），**不**走 props；而 `useTheme()`
 * 在 `src/app.vue`（provider 的祖先）里取不到上下文 —— provider 在自己的
 * `setup` 里才 `provide`，后代才 inject 得到。所以抽屉里「改 base/primary/
 * radius/mode」只能经组件（`SThemeCustomizer` / `SThemeModeSegment`）走
 * `useTheme()`；store 侧只做两件事：
 *
 * 1. **首次访问**把应用预设种进信封（`seedPresetState`）—— provider 初始化时
 *    读一次，于是默认外观来自 `themePresets` 而不是库的硬编码默认值；
 * 2. **切预设**时写「待应用」信号（`requestPreset`），由 provider 内层的
 *    `<ThemeBridge>` 订阅后调 `useTheme().setThemeState()` 落地 —— 那是唯一
 *    同时改生效样式**和**信封的入口。
 *
 * 已有信封（用户手动选过主题）时绝不覆盖：预设只该是首访默认值。
 */
```

### N-180 · src/shared/theme-preset.ts:35-39

```ts
/**
 * 仅当尚无持久化信封时写入（幂等、SSR 安全）。
 *
 * 必须在挂载 `SConfigProvider` 之前调用（`src/app.ts` 顶层）。
 */
```

### N-181 · src/shared/theme-preset.ts:50-56

```ts
/**
 * 「切预设」的请求信号 —— 见文件头「切预设」流程。
 *
 * 用模块级 `shallowRef` 而不是 DOM `CustomEvent`：事件的 `detail` 是 `unknown`，
 * 落地时必须断言才能拿回 `ThemeSettingsState`，而本仓库 lint 禁 `as T`；
 * 信号既保留类型，又天然是响应式（provider 内层的 `<ThemeBridge>` 用 `watch` 消费）。
 */
```

### N-182 · src/shared/uuid.ts:1-6

```ts
/**
 * UUID v7 生成器（P1-08：所有表主键为 UUID v7 字符串）。
 *
 * 单调序列保证同一毫秒内不重复且趋势递增（对 SQLite/PG 的 B-tree 插入友好）。
 * 格式：`xxxxxxxx-xxxx-7xxx-8xxx-xxxxxxxxxxxx`（版本 7 + 变体位）。
 */
```

### N-183 · src/shared/validate.ts:6-15

```ts
/**
 * 统一参数校验中间件（v3 §6.1，P1-07）。
 *
 * `hono-openapi` 的裸 `validator` 在校验失败时返回标准 400 结构
 * `{ data, error, success: false }`，与 v3 业务码语义不一致。
 * 这里经 hook 把 Standard Schema issues 归一为
 * `{ code: '3000', message, data: issues }`（HTTP 200，业务码 PARAM_INVALID）。
 *
 * OpenAPI 元数据由 `validator` 内部 resolver 透传，`describeRoute` 可照常声明 400 响应。
 */
```

### N-184 · src/shared/vean-locale.ts:6-27

````ts
/**
 * 把应用 locale key（`zh` / `en`，见 `@/constants` 的 `APP_LOCALES`）对齐到
 * Vean 的组件内置文案。
 *
 * **为什么需要这一步**：`@vean/aria/locale` 出厂只注册两个 key —— `en`
 * 与 `zh-CN`（`node_modules/@vean/aria/dist/locale/locales.js` 里的
 * `{[en.key]: en, [zhCN.key]: zhCN}`），而 `resolveLocaleRegistry()` 对**未知
 * key 静默回落到 `en`**：
 *
 * ```
 * resolveLocaleRegistry('zh').key        // 'en'（回落！）
 * resolveLocale('zh').table.emptyTitle   // 'No data'（应为「暂无数据」）
 * ```
 *
 * 也就是说，仅把 locale 目录改成 `zh.json` 会让分页、表格空态、标签页等
 * **Vean 组件内部文案全部变英文**，且不报任何错。这里把 `zh-CN` 的消息以
 * `zh` 为 key 再注册一份补上。
 *
 * 放在 `@/shared/` 而非 `@/locales/`：ubean 的 locale 扫描 glob 覆盖
 * `.ts`（`**\/*.{json,json5,yaml,yml,js,mjs,cjs,ts,mts,cts}`），把本文件放进
 * `src/locales/` 会被当成一个名叫 `vean` 的 locale 收录进 `.ubean/i18n.d.ts`。
 */
````

### N-185 · src/shared/vean-locale.ts:29-35

```ts
/**
 * Vean 出厂的 **13 个语言包**（`node_modules/@vean/aria/dist/locale/langs/`）。
 *
 * 与 `@/constants` 的 `APP_LOCALES` 是两件事：`APP_LOCALES` 是**本应用**
 * 提供 JSON 文案的语言（当前 `zh` / `en`），这里是**组件库**自带的文案包。
 * 但两者必须键连起来（见 `APP_LOCALE_PACK_MAP`），否则组件文案会静默变英文。
 */
```

### N-186 · src/shared/vean-locale.ts:54-59

```ts
/**
 * 应用 locale → Vean 语言包。
 *
 * 裸码（`zh`）与语言包码（`zh-CN`）不一致时**必须**在此声明，否则
 * `resolveVeanLocalePack()` 会退化成「按同名包精确匹配」而找不到 `zh-CN`。
 */
```

### N-187 · src/shared/vean-locale.ts:65-69

```ts
/**
 * 语言包加载器：**全部走 `() => import(...)`**，Vite 才能把它切成独立 chunk。
 * 只有被 `registerVeanLocalePack()` 真正请求到的包才会进入客户端产物 ——
 * 13 个包合计 ~45 kB，静态 import 会白送进首屏。
 */
```

### N-188 · src/shared/vean-locale.ts:94-99

```ts
/**
 * 应用 locale → 语言包（纯函数，无副作用）。
 *
 * 解析顺序：① 显式映射表（`zh` → `zh-CN`）→ ② 与包同名的精确匹配
 * （`ja` / `ko` / `pt-BR` / `zh-TW` …）→ ③ `null`（未知语言，调用方决定回落）。
 */
```

### N-189 · src/shared/vean-locale.ts:108-114

```ts
/**
 * 同步补注册出厂语言包（须在 `SConfigProvider` 解析 locale **之前**执行，
 * 见 `src/app.ts` 的调用点）。
 *
 * 只处理 `zh-CN` 一个包：出厂已注册的 `en` 恰好就是应用侧裸码 `en`，无需再注册；
 * 其余 11 个包不在本应用 `APP_LOCALES` 里，走 `registerVeanLocalePack()` 按需加载。
 */
```

### N-190 · src/shared/vean-locale.ts:119-127

```ts
/**
 * 按需注册任意一个出厂语言包（13 个包全支持），把包消息挂到 `appLocale` 键上。
 *
 * 用于「应用新增了非 `zh` / `en` 的语言」场景：客户端 setup 阶段无法同步
 * `import()`，所以语言切换时要先 `await registerVeanLocalePack(code)` 再切
 * vue-i18n 的 locale，否则组件文案会在包加载完成前回落到 `en`。
 *
 * @returns 是否注册成功（`false` = 该语言没有对应的 Vean 出厂包）
 */
```

### N-191 · src/shared/watermark.ts:1-9

```ts
/**
 * 水印内容派生的纯逻辑（P2-12）。
 *
 * 优先级与 v2 一致：**用户名 → 实时时间 → 自定义文本**，命中即返回。
 * 定时器只在「水印可见 且 开启时间」时创建，其余情形省掉一个 interval。
 *
 * 时间格式化用 `@vueuse/core` 的 `useDateFormat`（dayjs token 语法），
 * 因此这里只需要维护「是否该跑定时器」这一层判断，本文件保持零依赖纯函数。
 */
```

### N-192 · src/shared/watermark.ts:20-25

```ts
/**
 * 是否需要一个会随时间推进的水印。
 *
 * 三个条件缺一，水印内容就是静态的，挂定时器纯属浪费：
 * 不可见（不渲染）、没开时间（内容不变）、时间格式为空（派生不出内容）。
 */
```

### N-193 · src/shared/watermark.ts:30-37

```ts
/**
 * 按「用户名 → 时间 → 文本」优先级派生水印文案。
 *
 * @param source 水印配置
 * @param userName 当前登录用户名（未登录传空串）
 * @param timeText 已格式化的当前时间（`useDateFormat` 的结果；不格式化时传空串）
 * @returns 渲染到水印上的文本，空串表示不渲染
 */
```

## schema（Valibot 契约）

### N-194 · src/schema/_form.ts:3-17

```ts
/**
 * operate 表单的**跨域公共片段**（P3-03）。
 *
 * 为什么不直接用 `*.createSchema`：`useForm`（`@vean/ui`）通过
 * `@tanstack/form-core` 的 `DeepKeys<Values>` 推导字段名，而
 * `v.optional(v.string())`（不含默认值，如 `userUpdateSchema.password`）会把
 * 字段推成 `string | undefined`，TanStack 的 `DeepKeys<unknown>` 退化为
 * `never[]` —— `SFormField` 的 `name` 与插槽类型随即整体失效。所以表单只接
 * **每个键都有值**的 schema；各域自己的表单 schema 放在各自域文件里，复用
 * `create` schema 的同一个字段对象（值域不会两份漂移）。
 *
 * 本文件同时放「行数据 → 表单值」的公共换算：`null` → 空串，`SInput` /
 * `SSelect` 的 `modelValue` 是 `string`，收 `null` 会退化成非受控；表单一律用
 * 空串表达「未填」，提交时再还原成 `null`。
 */
```

### N-195 · src/schema/_form.ts:27-36

```ts
/**
 * 「可为空文本」字段。
 *
 * **不用 `_shared.ts` 的 `descriptionSchema`**：它是
 * `v.optional(v.nullable(v.string()), null)`，输入类型含 `undefined`，而
 * `useForm` 的 `onSubmit` 回调收到的是 `InferStandardSchemaInput`（输入类型）——
 * 拿它去构造 DTO（输出类型）会报 `string | null | undefined` 不可赋值给
 * `string | null`。表单里该字段总有一个确定值（空串或字符串），故这里用
 * `v.nullable(v.string())`：值域与 DTO 一致，且不引入 `undefined`。
 */
```

### N-196 · src/schema/_search.ts:9-20

```ts
/**
 * 搜索表单的**跨域公共片段**（P3-03）。
 *
 * 与 operate 表单同约束：`useForm`（`@vean/ui`）走 `@tanstack/form-core` 的
 * `DeepKeys<Values>` 推导字段名，`v.optional(v.string())`（无默认值）会让推导
 * 退化成 `never[]`，因此搜索字段一律**带默认值**（`v.string()` / 带空串的
 * `picklist`）。每个域自己的搜索表单 schema 放在各自的域文件里，这里只留
 * 真正被多处复用的枚举值域与文本字段工厂。
 *
 * 值域刻意取自 `@/constants/manage`（不引 `./_shared`）：后者会连带把 drizzle
 * 拉进客户端产物。
 */
```

### N-197 · src/schema/_search.ts:22-28

```ts
/**
 * 「全部」选项的**表单值**：空串，发请求前被 `filterValidQuery` 剔除。
 *
 * 注意它与 `SEARCH_ANY_SELECT_VALUE` 的分工：空串是**数据层**的哨兵值
 * （schema / query 用它表示「不过滤」），但**不能**直接当 `SSelect` 的选项值，
 * 原因见 `SEARCH_ANY_SELECT_VALUE`。
 */
```

### N-198 · src/schema/_search.ts:31-41

```ts
/**
 * 「全部」选项的**渲染值**：`'all'`，仅供 `SSelect` 使用。
 *
 * 为什么不能用空串：`@vean/aria` 把空串保留给「未选择」语义 ——
 * `shouldShowPlaceholder(v)` 判定 `isNullish(v) || v === '' || []`，而
 * `SelectItem` 在 `setup` 里对 `value === ''` 直接 `throw Error('A <SelectItem />
 * must have a value prop that is not an empty string...')`。
 * 后果不是「选项渲染不出来」而是整个选项组件挂载失败（控制台满屏报错），
 * 且选中具体状态后再也回不到「全部」。因此下拉里用非空哨兵值，
 * 在**提交边界**（`useManageOptions` 的 `fromSelectValue`）转回空串。
 */
```

### N-199 · src/schema/_shared.ts:23-31

```ts
/**
 * 服务端 Valibot DTO 的公共片段（v3 §6.1）。
 *
 * 服务端校验用 Valibot（与前端校验、hono-openapi resolver 同栈）；
 * 13 表的 `enabled` 用 `'Y' | 'N' | 'D'` 软删约定（v3 §6.1 数据模型约定，P1-08）。
 *
 * 约定：值域常量与可复用 schema 都带 OpenAPI `description`，供
 * `@valibot/to-json-schema` 生成 `.ubean/openapi.d.ts` 的字段说明。
 */
```

### N-200 · src/schema/_shared.ts:112-117

```ts
/**
 * 成功响应的 `data` 恒为 `null`（登出 / 删除 / 批量删除 / 分配关系等无返回值的端点）。
 *
 * 统一响应契约 `{ code, message, data }` 由 `src/middleware/02.response.ts` 包装，
 * 路由只声明业务 `data`，故这里描述的就是「无业务数据」。
 */
```

### N-201 · src/schema/_shared.ts:133-136

```ts
/**
 * 分页响应包装（`{ total, current, size, list }`，与前端 `src/shared/table.ts` 的
 * `PageResult<Item>` 同形状）。
 */
```

### N-202 · src/schema/api.ts:16-26

```ts
/**
 * 接口（API）资源契约（v3 §6.3，unify api.service 范式）。
 *
 * 一个接口域一个文件，装三件事：服务端请求 schema、搜索表单 schema、operate
 * 表单 schema 及默认值。命名约定：`apiXxxSchema` = 服务端请求，
 * `apiSearchFormSchema` = 搜索表单，`apiFormSchema` = operate 表单。
 *
 * `update` 由 `create` 推导（`partial`）：新增与更新的值域只声明一份，不会
 * 两份漂移。`partial` 会去掉默认值，未传字段交由服务层 `dto.x ?? current.x`
 * 保留原值。
 */
```

### N-203 · src/schema/auth.ts:22-27

```ts
/**
 * 认证域 DTO（v3 §6.3/§5.5）。
 *
 * 同一份 Valibot 声明同时驱动服务端校验与登录页表单（P3-05 契约）：表单
 * schema 通过 `...serverSchema.entries` 复用服务端字段对象，错误消息必然同源。
 */
```

### N-204 · src/schema/auth.ts:66-71

```ts
/**
 * 重置密码请求（未登录，图形验证码代替短信验证码）。
 *
 * 无短信通道（demo 无短信服务商），重置凭证用图形验证码承担，语义与 v2
 * `reset-pwd` 页面一致（v2 用手机号 + 短信码）。
 */
```

### N-205 · src/schema/auth.ts:79-85

```ts
/**
 * `POST /api/auth/error` 的演示码入参（P3-06）。
 *
 * `code` 只接受 `demoErrorCodeMap` 里登记的三个演示码，缺省（空串）回落到
 * `SYSTEM_ERROR`，让「请求演示页」能逐条触发请求层的四类分派
 * （静默登出 / 弹窗登出 / 刷新重放 / 普通报错）。
 */
```

### N-206 · src/schema/auth.ts:99-109

```ts
/**
 * 登录页表单 schema 是**服务端 schema 的超集**：`useForm`（`@vean/ui`）直接吃
 * valibot（Standard Schema），前端不再手写「非空 / 长度 / 邮箱格式」这套重复
 * 校验 —— 只保留服务端没有的「确认密码一致」。
 *
 * **字段名与类型必须宽兼容服务端 schema**：`useForm` 用
 * `@tanstack/form-core` 的 `DeepKeys<Values>` 推导字段名，一旦引入
 * `undefined` 成员（`v.optional(…)` 且无默认值）会整体退化成 `never[]`，
 * `SFormField` 的 `name` 与插槽类型随之失效。所以这里一律「每个键都有值」，
 * 用空串表达「未填 / 未用」；提交前折算成 DTO 时再把空串去掉。
 */
```

### N-207 · src/schema/auth.ts:122-132

```ts
/**
 * 注册表单（服务端 `registerSchema` + 确认密码）。
 *
 * `email` 服务端是 `v.optional(...)`，表单里放宽成 `v.string()`（空串 = 未填）
 * —— 这样「不填邮箱」不再触发邮箱格式错误，提交前 `|| undefined` 归一后再交给
 * 服务端同一份规则。
 *
 * 「两次密码一致」是服务端没有的规则，用 `v.forward` + `v.partialCheck` 把
 * issue 挂到 `confirmPassword` 字段上（无字段路径的 issue 会落到 `_form` 键，
 * 弹窗/表单里没地方渲染）。
 */
```

### N-208 · src/schema/auth.ts:178-183

```ts
/**
 * `@vean/ui` 的 `useForm` 以 `defaultValues` 为基准（`handleReset` 也回这里），
 * 与各 manage 域的 `emptyXxxForm` 同一套路。
 *
 * 演示账号预填：密码登录带 `admin` / `123456`（与 v2 一致），其余留空。
 */
```

### N-209 · src/schema/auth.ts:236-242

```ts
/**
 * 按钮级权限码列表（v3 §4.6：`userInfo.buttons` + `hasAuth(code)` + `v-auth`）。
 *
 * 与 `roles` 的分工：`roles` 是角色码（粗粒度、做路由/菜单级判定），
 * `buttons` 是权限码（细粒度、做按钮级判定）。超级管理员拿到全量权限码，
 * 前端只需按 `buttons.includes(code)` 判定，不再逐个角色推导。
 */
```

### N-210 · src/schema/dict-item.ts:28-32

```ts
/**
 * 字典项契约（v3 §6.3，unify dict-item 范式）。
 *
 * `update` 一律由 `create` + `partial` 推导，值域只声明一份。
 */
```

### N-211 · src/schema/dict.ts:16-20

```ts
/**
 * 字典契约（v3 §6.3，unify dict.service 范式）。
 *
 * `update` 一律由 `create` + `partial` 推导，值域只声明一份。
 */
```

### N-212 · src/schema/menu.ts:34-39

```ts
/**
 * 菜单契约（v3 §6.3，unify menu.service 范式）。
 *
 * 路由相关字段单独抽成 `routeFields`：新增与更新共用同一份值域，只有默认值
 * （新增带 `null` / `{}`，更新不带）与可选性不同。
 */
```

### N-213 · src/schema/menu.ts:145-155

```ts
/**
 * 菜单树节点 schema。
 *
 * 递归 schema 必须用 `metadata({ ref })` 显式命名，否则 OpenAPI 类型生成会失败：
 * `@standard-community/standard-json` 生成的 `$defs.0` 会被
 * `convertToOpenAPISchema` 的递归提前捕获并转成 `#/components/schemas/0`，
 * 但 `children.items` 里的 `$ref` 仍是 `#/$defs/0` —— 悬空引用，
 * `hono-openapi` 报 `Can't resolve $ref at #/components/schemas/0/properties/children/items`。
 * 加 `metadata({ ref: 'MenuTree' })` 后 `$defs/0` 变成 `{ $ref: '#/components/schemas/MenuTree' }`，
 * 由 `convertToOpenAPISchema` 正确上提为 `components.schemas.MenuTree`。
 */
```

### N-214 · src/schema/menu.ts:268-282

```ts
/**
 * 菜单源数据（`src/menus/menus.json` 的 `menus` 数组），也是 static / dynamic 两种
 * 模式的**统一中间表示** `AppMenu`（`docs/v3-menu-route-modes.md` §4.1/§4.3）。
 *
 * 与 `menuCreateSchema` 是两回事：那是管理端表单（人手填），这是仓库里的源
 * 文件（`pnpm menu:sync` 生成 + 人工调层级/标题）。字段与 `menuRowFields` 对齐，
 * 但**可选字段允许缺省或 null** —— JSON 里没写就是没有，不必逐个写出；同时
 * 放宽到可空，`MenuResource` 才能直接当 `AppMenu` 用（dynamic 模式的输入是
 * 完整的数据库行，含 `enabled` 与审计字段，多出的字段不影响结构兼容）。
 *
 * 为什么需要它：`resolveJsonModule` 把 JSON 字面量放宽成 `string`，直接
 * `import menus.json` 得不到 `menuType` 这类窄类型。过一遍 schema 才拿到
 * `MenuSource`（与 `src/utils/route-meta.ts` 收窄 `RouteMeta` 同一个套路：信任
 * 边界只在一处，其余地方不进 `as` 断言）。顺带为人手编辑把关。
 */
```

### N-215 · src/schema/org.ts:15-19

```ts
/**
 * 组织契约（v3 §6.3，unify org.service 范式）。
 *
 * `update` 一律由 `create` + `partial` 推导，值域只声明一份。
 */
```

### N-216 · src/schema/permission.ts:16-22

```ts
/**
 * 权限点契约（v3 §6.3，unify permission.service 范式）。
 *
 * `name` / `code` 只有 `resourceType === 'other'` 时才是权威值；绑定
 * `menu` / `api` / `button` 资源时由服务端 `resolveResourceBinding` 推导，
 * 故两者在新增里也是可选。
 */
```

### N-217 · src/schema/permission.ts:99-105

```ts
/**
 * 权限点新增 / 编辑表单。
 *
 * `name` / `code` 只有 `resourceType === 'other'` 时才是权威值；绑定
 * `menu` / `api` / `button` 资源时由服务端（`resolveResourceBinding`）推导，
 * 客户端传空串即可（服务端 create schema 里两者也是 optional）。
 */
```

### N-218 · src/schema/profile.ts:16-28

```ts
/**
 * user-center（个人中心）表单契约（P3-09）。
 *
 * 与 `src/schema/auth.ts` 的分工：认证域 schema 管「登录 / 注册 / 重置密码」
 * （服务端对应 `src/routes/api/auth/**`）；这里是**登录后**的个人资料与修改
 * 密码，两者共用同一套 valibot 约定（P3-05 的 StandardSchema 复用方式）。
 *
 * 服务端 `PUT /api/auth/profile` 的 DTO 是 `userUpdateSchema` 的子集
 * （`fullName` / `email` / `phone` / `description` / `homePath`，都可空），
 * 所以这里**不新造服务端规则**，只补两件服务端没有的事：
 * 1. 空串与「有值」的形状校验（邮箱 / 手机号格式）—— 服务端只校验类型；
 * 2. 密码一致的跨字段校验（`confirmPassword`，同 `registerFormSchema` 的写法）。
 */
```

### N-219 · src/schema/profile.ts:35-40

```ts
/**
 * 服务端可空文本字段：`null` 或空串都视为「清空」，非空时跑格式校验。
 *
 * 服务端收到的是 `null`（`toUpdateProfilePayload` 已把空串转成 `null`），
 * 但表单回填/手写请求可能给空串，所以两种都接受 —— 校验规则与表单侧共用一个正则。
 */
```

### N-220 · src/schema/profile.ts:64-69

```ts
/**
 * `PUT /api/auth/profile` 的请求体 schema（前后端共用）。
 *
 * 比 `userUpdateSchema` 窄：不含 `password` / `enabled` / `roleIds` —— 个人中心
 * 不允许改自己的状态与角色（那是 manage 页的职责）。
 */
```

### N-221 · src/schema/profile.ts:138-143

```ts
/**
 * 表单值 → 接口载荷。
 *
 * 一律 `trim()` 后转 `null`：表单里「删掉内容」应当清空字段，而不是写入空串
 * —— 空串会污染列表的 `'-'` 占位判断（见 manage 页的字段渲染）。
 */
```

### N-222 · src/schema/system.ts:4-9

```ts
/**
 * 系统域 DTO（v3 §6.3）。
 *
 * `src/schema/` 是前后端**唯一契约源**：Valibot schema 即运行时校验器，
 * 推导类型即 DTO。前后端同进程，直接相对路径 import，不做构建、不独立发包。
 */
```

### N-223 · src/schema/user.ts:15-20

```ts
/**
 * 用户契约（v3 §6.3，unify user.service 范式；`password` 只进不出）。
 *
 * `update` 由 `create` + `partial` 推导；`enabled` 只在更新时可用（新增一律
 * 由服务端置 `'Y'`），故单独并入。
 */
```

### N-224 · src/schema/user.ts:134-140

```ts
/**
 * 用户新增 / 编辑表单。
 *
 * `password` 用「空串 = 不改」语义：新增时必填（服务端 `userCreateSchema`
 * 强制），编辑时留空即从提交载荷里剔除。**不在 schema 层做条件必填** ——
 * 跨字段 refine 的 issue 无字段路径，会落到 `_form` 键，弹窗里没地方渲染。
 */
```

## services / request / db

### N-225 · src/db/index.ts:12-27

```ts
/**
 * 数据库接线（v3 §6.2，P1-02）。
 *
 * ubean 的 `Database` 面是裸 `{ sql, exec, close }`；框架对 connector 的处理是：
 * 全局 `$db0Create` 未注册时**静默回落内存库**，因此必须在任何 defineDatabase
 * 调用前 `registerDb0Create` 显式接线：
 * - dev（默认）：SQLite 文件库（better-sqlite3，`?` 定位参数，同步驱动包一层 Promise）；
 * - prod：PostgreSQL（postgres-js，`$1` 定位参数）。
 *
 * 连接目标由 `DATABASE_URL` 决定：`file:` 前缀 → SQLite，其余 → Postgres；
 * 未设置时回落 `<cwd>/.data/dev.sqlite3`。
 *
 * 类型化查询走 `appDb`（drizzle 实例，复用同一条底层连接，不额外建池）：
 * - SQLite：drizzle-orm/better-sqlite3（同步 API，与 ubean Database 的 Promise 包装共存）；
 * - Postgres：drizzle-orm/postgres-js。
 */
```

### N-226 · src/db/index.ts:174-184

```ts
/**
 * 应用 drizzle 实例（类型化查询用）。
 *
 * 与 appDatabase 各自持有连接（ubean 不暴露内部连接，无法复用同一句柄）：
 * SQLite 是进程内文件库，两条连接共用 WAL 无冲突；Postgres 多一条池连接，可接受。
 * 服务层统一用 appDb；ubean 的 useDatabase()/appDatabase 仅框架侧（迁移账本等）使用。
 *
 * 实现说明：SQLite 与 Postgres 的 drizzle builder 类型不兼容（union 会让链式方法坍塌为
 * never/不可调用），而 v3 首版运行时以 SQLite 为准（生产接入 PG 时再为 appDb 建独立
 * 类型入口），这里用受控断言把实例收敛为 BetterSQLite3Database 形状。
 */
```

### N-227 · src/db/migrations.ts:5-16

```ts
/**
 * SQLite 建表 DDL（与 src/db/schema 13 表一一对应，v3 §6.1）。
 *
 * 约定（P1-08）：
 * - 主键 text（UUID v7，应用层 createUuidV7 生成）；
 * - enabled 'Y'|'N'|'D' 默认 'Y'，'D' 为软删；
 * - 审计四字段 createdBy/updatedBy/createdTime/updatedTime；
 * - 时间存本地时间字符串（drizzle text 列，default datetime('now','localtime')）。
 *
 * 注意：ubean runMigrations 的 Migration.up 是**纯 SQL 字符串**（直接 db.exec），
 * 不是回调。PostgreSQL 方言差异（uuid/jsonb/now()）上线前按 DATABASE_URL 裁剪。
 */
```

### N-228 · src/db/migrations.ts:190-201

```ts
// 0003：api 表自然键 + 鉴权链路索引（§5.1 / §5.2 配套）。
//
// 一、修已知漂移。seed 是 `INSERT OR IGNORE`，而 api 行的**主键是 id**：
//     `A_auth_refresh` / `A_api_list` 这两个 id 在旧库里已存在（指向错误路径），
//     新 seed 同 id 不同 path → 会被 IGNORE 掉，漂移永远修不掉。
//     所以得在迁移里按 id 改回正确路径。（全新库迁移时这两行还不存在，UPDATE 空跑。）
//
// 二、自然键。`(method, path)` 唯一索引同时是治理幽灵行/重复登记的手段。
//
// 三、鉴权热路径索引。RBAC 链路是 user_id → user_role → role_permission → permission，
//     0002 的 uk_user_role/uk_role_permission 已覆盖最左前缀；这里补 permission.code
//     反查（按 code 直查权限点）与单列索引。
```

### N-229 · src/db/schema/menu.ts:7-10

```ts
/**
 * 菜单表（unify menu 移植，最宽的业务表）。
 * 路由菜单（menu/page）与按钮/权限点（button）共用一张表，parentId 组成树。
 */
```

### N-230 · src/db/schema/shared.ts:5-15

```ts
/**
 * 公共列（v3 §6.1 P1-08 数据模型约定）：
 * - 主键：UUID v7 字符串（应用层生成，趋势递增）；
 * - 软删/启用：`enabled` 'Y'|'N'|'D'（D = 已删除）；
 * - 审计四字段：createdBy/updatedBy/createdTime/updatedTime。
 *
 * SQLite 移植说明（源自 unify pg-core）：
 * - `timestamp mode:'string'` → `text`（ISO 字符串，DEFAULT 当前时间由应用层/默认表达式写入）；
 * - `jsonb` → `text({ mode: 'json' })`；
 * - boolean 语义列统一 `Y|N` 单字符（与 unify 一致）。
 */
```

### N-231 · src/db/seed-data.ts:14-21

```ts
/**
 * Seed 数据（v3 §6.2：dev 默认库带演示数据）。
 *
 * - 超级管理员 admin / 123456、普通用户 user / 123456（bcrypt 现场生成）；
 * - 菜单树（目录/菜单 + 按钮）+ 权限码 + API 清单 + 字典；
 * - 权限码范式 `api:${method}:(/${path})`，与 RBAC 中间件一致；
 * - 固定主键（U_/R_/M_/P_/A_/D_/DI_ 前缀）保证幂等与关系稳定。
 */
```

### N-232 · src/db/seed-data.ts:64-73

```ts
/**
 * 菜单种子 = 仓库里的菜单源数据（`src/menus/menus.json`），不在这里另写一份。
 *
 * 为什么必须同源（`docs/v3-menu-route-modes.md` §4.2）：菜单有两份就必然漂移。
 * 改造前这里手写着 6 行 `routeName: 'home' / 'system_user'`（legacy elegant-router
 * 的命名）与 `routeComponent: 'layout.base$view.home'`（指向已不存在的 `src/views`），
 * 而真实页面早就叫 `Index` / `ManageUserIndex`（`src/pages/manage/user/index.vue`）
 * —— two sources, guaranteed drift。现在 static 模式读同一份 JSON，seed 读这一份，
 * 漂移在结构上不可能发生。
 */
```

### N-233 · src/db/seed-data.ts:185-194

```ts
/**
 * API 清单（RBAC 权限码的资源来源）。
 *
 * **必须与 `src/routes/api/**` 的真实路由一一对应**（§5.2-5）：路由有了而这里没有，
 * 该端点就没有权限点可授予，只剩 super 角色能访问 —— 「接口裸奔」（authorization.md §4.3）。
 * 修复前的三处漂移：`/auth/token/refresh`（实际 `/auth/refresh-token`）、
 * `/api-resource/list`（实际 `/api/list`），以及 12 个完全没登记的端点。
 *
 * 启动时 `src/server.ts` 会拿真实路由与这张表对账，新增端点忘了登记会打 warning。
 */
```

### N-234 · src/db/seed.ts:15-21

```ts
/**
 * Seed 执行器（幂等：INSERT OR IGNORE，可重复执行）。
 *
 * 数据本体在 ./seed-data.ts（纯数据，便于测试复用与检视）。
 * SQL 拼接安全性：表名/列名来自代码内白名单（toSnake 转换），值经
 * db.sql 的 escapeValue（单引号翻倍）转义——seed 无任何用户输入。
 */
```

### N-235 · src/request/factory.ts:15-28

```ts
/**
 * 请求实例工厂（v3 §5.4 / P2-18）。
 *
 * 每一个 baseURL（主实例 + 每个 `/_p/{key}` 代理实例）都从这里创建，
 * **共享同一套钩子与模块级状态**：
 *
 * - envelope 解包 + 业务码判定（`transform` / `isBackendSuccess`）
 * - Bearer 注入
 * - 令牌过期 → 单飞刷新（模块级 `refreshPromise`）→ 原配置重放
 * - 错误提示去重（模块级 `lastErrorMessage` / `lastErrorAt`）
 *
 * 共享单飞与去重状态是刻意的：多个 baseURL 指向同一套账号体系时，
 * 并发过期只应触发一次刷新、只弹一次提示。
 */
```

### N-236 · src/request/factory.ts:47-50

```ts
/**
 * refresh-token 响应的受信边界：裸 fetch 的响应体是 `unknown`，先做关键
 * 字段运行时校验，再集中「信任」一次（避免调用处散落 as 断言）。
 */
```

### N-237 · src/request/factory.ts:76-81

```ts
/**
 * 单飞刷新：并发过期只发一次 refresh，成功后本地凭据已更新。
 *
 * 刷新始终打在**主 baseURL**（账号体系在主服务上）；`/_p/{key}` 代理实例只是
 * 换后端数据源，不换身份中心。
 */
```

### N-238 · src/request/factory.ts:152-155

```ts
/**
 * 后端业务失败：过期码 → 单飞刷新后原配置重放（onRequest 会取新 token）；
 * 登出码 → 移交全局登出回调；其余 → 去重提示后按失败抛出。
 */
```

### N-239 · src/request/factory.ts:182-193

```ts
/**
 * 传输层错误（网络/超时/5xx）与**业务失败**共用同一入口。
 *
 * ⚠️ 业务失败必须跳过：`onBackendFail` 已经用后端 `message` 提示过，
 * 但 `@soybeanjs/fetch` 在 `onBackendFail` 返回空后仍会 `throw
 * new BackendError(backendErrorMsg)`，那条错误会再走一次本钩子。
 * 两处都提示的后果不只是「弹两次」—— 两条文案不同（后端 message
 * vs `backendErrorMsg` 的英文兜底），而 `notifyError` 的去重键是
 * **文案**，于是同一业务错误连发时永远命不中去重窗口，页面上会叠
 * 出 N 组双 toast。判据用包导出的 `BACKEND_ERROR_FLAG`（`error.code`
 * 即该值），不要去比对 message。
 */
```

### N-240 · src/request/factory.ts:212-220

```ts
/**
 * 按 baseURL 造一套 client。
 *
 * - `baseURL` 为空走同源：dev 下 ubean 同进程 Hono，`/api/**` 直接命中；
 *   生产由反向代理/同域部署承接。
 * - 代理实例传 `/_p/{key}`，请求落到 `routeRules.proxy` 转发到对应上游。
 * - `paths` 来自 `.ubean/openapi.d.ts`（仓库唯一 API 类型源）；第二泛型 `'/api'`
 *   是后端挂载前缀，须与路由前缀一致，否则类型路径整体对不上。
 */
```

### N-241 · src/request/index.ts:5-12

```ts
/**
 * 主请求层（v3 §5.4）。
 *
 * - `baseURL` 为空走同源：dev 下 ubean 同进程 Hono，`/api/**` 直接命中；
 *   生产由反向代理/同域部署承接（多环境差异见 docs/v3.md §4.3）。
 * - 多 baseURL（`/_p/{key}` 代理）见 `src/request/proxy.ts`；两者共用
 *   `src/request/factory.ts` 的钩子与单飞/去重状态。
 */
```

### N-242 · src/request/internal.ts:7-12

```ts
/**
 * 服务端内部直调（零网络开销，走 Hono `app.request()`）。
 *
 * 用途：cron 任务、Server Action、seed 脚本等**服务端进程内**要调自己的 API
 * 的场景 —— 不必走 loopback HTTP。
 */
```

### N-243 · src/request/proxy.ts:6-13

```ts
/**
 * 多 baseURL 代理 client（v3 §4.3 / P2-18）：`/_p/{key}/**` 由
 * `routeRules.proxy` 转发到 `API_PROXY_TARGETS` 里对应的上游。
 *
 * 浏览器只拿得到 key（`VITE_API_PROXY_KEYS`），真实 origin 在服务端 `.env`；
 * 每个实例与主实例共用 `createApiClients` 的钩子（Bearer / 业务码 / 单飞刷新 /
 * 错误去重），不是「另起一个裸实例」。
 */
```

### N-244 · src/request/proxy.ts:26-31

```ts
/**
 * 按 key 取代理 client。
 *
 * 刻意对未配置的 key 返回 `null` 而不是抛错：调用点是页面级数据源切换，
 * 缺一个后端不该把整个页面打挂。
 */
```

### N-245 · src/services/auth.service.ts:23-29

```ts
/**
 * 认证服务（P1-04/P1-05，v3 §6.3/§6.4，unify auth.service 范式）。
 *
 * JWT 双 token（hono/jwt HS256）+ 黑名单（useKV，dev 内存 / prod 可换 Redis driver）：
 * - 登出: access token 拉黑 1h（覆盖剩余有效期），refreshToken 拉黑 7d；
 * - 刷新: 旧 refreshToken 立即拉黑防重放，签发新 token 对。
 */
```

### N-246 · src/services/auth.service.ts:61-67

```ts
/**
 * 带角色码 + 按钮权限码的用户安全视图。
 *
 * `roles` 供路由/菜单级判定与 `v-auth="['role']"`；`buttons` 是全量权限码，
 * 供按钮级 `hasAuth(code)` / `v-auth="['system:user:add']"`（P3-06）。超级管理员的
 * 权限码来自 `rolePermission` 关联表（seed 里已给全量），无需特例。
 */
```

### N-247 · src/services/auth.service.ts:94-98

```ts
/**
 * 密码登录（`grantType: 'pwd'`）。
 *
 * `captcha` 传入时先消费图形验证码（密码登录页可开启验证码开关）。
 */
```

### N-248 · src/services/auth.service.ts:127-132

```ts
/**
 * 验证码登录（`grantType: 'captcha'`）。
 *
 * 图形验证码代替 v2 的短信验证码承担凭证角色：校验通过即按用户名签发 token
 * 对（用户名不存在报 `USER_NOT_FOUND`）。
 */
```

### N-249 · src/services/auth.service.ts:183-188

```ts
/**
 * 生成微信绑定二维码（mock）。
 *
 * 无微信开放平台凭证，返回自建 ticket + 形似官方 qrconnect 的 url；
 * `ticket` 入 KV（TTL 5 分钟），绑定成功后单向消费。
 */
```

### N-250 · src/services/captcha.service.ts:4-13

```ts
/**
 * 图形验证码服务（P2-08，v3 §4.6）。
 *
 * 答案存在 `@ubean/server` 的 KV 存储里（`useKV('captcha')`，dev 内存 driver，
 * 演进换 Redis driver 与 token 黑名单同路），TTL 5 分钟、**一次性消费**：
 * 校验过即删除，避免同一验证码被重放。
 *
 * 图像是自绘 SVG（无第三方图形库依赖）：4 个去易混字符（无 `0/O/1/I`）
 * + 随机旋转/字号/颜色 + 干扰线，以 base64 data URL 返回，前端直接塞 `<img src>`。
 */
```

### N-251 · src/services/captcha.service.ts:97-101

```ts
/**
 * 校验验证码（大小写不敏感）并**一次性消费**。
 *
 * @throws AppError `CAPTCHA_EXPIRED` 不存在/已用/已过期；`CAPTCHA_INVALID` 不匹配
 */
```

### N-252 · src/services/menu.service.ts:12-15

```ts
/**
 * 菜单服务（P1-07，unify menu.service 范式）。
 * v3 简化: 路由定义冲突校验保留 routeName/routePath 唯一性；权限码由 permission 服务解析。
 */
```

### N-253 · src/services/menu.service.ts:102-113

```ts
/**
 * 目录前缀校验（M-09）：目录与其子项的 `routePath` 必须同前缀。
 *
 * 目录是纯分组节点、没有对应路由，路径分家在导航上看不出来 —— 这是它唯一能
 * 自检的地方。与 `src/store/modules/menu/shared.ts` 的 `validateMenuRoutes`
 * 同一规则，但那个跑在 dev 启动期的菜单源快照上，这个跑在**写入时**的库上
 * （管理页新增/改父/改路径都能当场拦住）。
 *
 * 两个方向各查一次，不递归：
 * 1. 本条是目录 → 它现有的子项必须落在它下面（改目录路径时拦住）；
 * 2. 本条有父目录 → 本条路径必须落在父目录下面（改父/改路径时拦住）。
 */
```

### N-254 · src/services/permission.service.ts:12-26

```ts
/**
 * 权限服务（P1-07，unify permission.service 范式）。
 *
 * 权限码约定（P1-06 RBAC）:
 * - API 权限码: `api:${method.toLowerCase()}:(path)`（与中间件生成的权限码一致）
 * - 菜单权限码: `menu:${menuType}:${code}`
 * - 其他: 直接用录入的 code
 *
 * **enabled 过滤（§5.1）**：鉴权链路上的每次查询都必须带 `enabled = 'Y'` 条件，
 * 否则停用的角色/权限点仍然放行 —— 停用只是列表里变灰、鉴权却照旧，是静默的最坏情况。
 *
 * **缓存（§5.2）**：`checkUserHasPermission` 是每个已登录请求的热路径，权限码集合
 * 走 `src/shared/permission-cache.ts` 的 KV 缓存；权限点自身变更（改动 code / 删除）
 * 无法廉价反查受影响用户，直接全清缓存（权限点是低频管理操作）。
 */
```

### N-255 · src/services/permission.service.ts:208-213

```ts
/**
 * 用户是否拥有某权限码（RBAC 中间件核心查询）。
 *
 * 判定完全基于缓存里的**权限码集合**（一次 KV 读），不再每次三查库：
 * 该用户可见的权限码集合已经过 enabled 过滤，成员判定与旧实现等价。
 */
```

### N-256 · src/services/permission.service.ts:225-229

```ts
/**
 * 权限码集合回源（同步三查，缓存未命中时调用）。
 *
 * 三处 enabled 过滤缺一不可：角色停用、权限点停用、软删（D）都不该再放行。
 */
```

### N-257 · src/services/role.service.ts:12-20

```ts
/**
 * 角色服务（P1-07，unify role.service 范式）。
 *
 * **enabled 过滤（§5.1）**：`getRolesByUserId` 只返回启用中的角色 —— 停用的角色
 * 不得继续参与鉴权（否则停用只是可见性变更，不是权限变更）。
 *
 * **缓存失效（§5.2）**：任何改动「某角色持有哪些权限」或「某用户持有哪些角色」
 * 的操作都会影响权限码集合，必须同步失效对应缓存，否则停权后旧 token 仍然放行。
 */
```

### N-258 · src/services/user.service.ts:14-23

```ts
/**
 * 用户服务（P1-07，unify user.service 范式）。
 * 列表永不返回 password；分配角色 = delete + insert 全量替换。
 *
 * 依赖 `roleService` / `permissionService` 只用于 `getProfile`（P3-09 个人中心），
 * 二者都不 import 本模块，无循环依赖。
 *
 * **缓存失效（§5.2）**：角色分配 / 停用用户后必须清该用户的权限码缓存，
 * 否则旧 token 在 TTL 内仍按旧权限放行。
 */
```

### N-259 · src/services/user.service.ts:92-99

```ts
/**
 * 当前用户的个人资料视图（P3-09）。
 *
 * 比 `getUserById` 多的是展示所需的角色码 / 按钮权限码（个人中心要显示
 * 「我有哪些角色和权限」），少的是 `password`。与 `authService.getUserInfo`
 * 同构，但后者是**登录态**语义（还带 `homePath` 等），这里是**自助编辑**
 * 语义的返回值，放在 user 域避免路由层跨服务拼装。
 */
```

## constants / utils / composables

### N-260 · src/composables/use-echarts.ts:36-43

```ts
/**
 * echarts 按需注册（P3-01 起，v2 `hooks/common/echarts.ts` 的移植）。
 *
 * 注册清单是工作台 + `/plugin/charts/echarts` 演示页的并集：折线 / 饼 / 柱 /
 * 雷达 / 散点 / 象形柱 / 仪表 + 标题 / 图例 / 提示 / 网格 / 工具箱 / 数据集 / 变换
 * + Canvas 渲染器。新增图表类型时**在这里加一行**，不要在页面里
 * `import 'echarts'`（整包会把体积从 ~100 kB 推到 ~1 MB gzip）。
 */
```

### N-261 · src/composables/use-echarts.ts:90-101

```ts
/**
 * 图表生命周期钩子（v3 §4.6：v2 `useEcharts` 保留）。
 *
 * 负责三件事：容器尺寸就绪后 init、尺寸变化 resize、明暗切换重建实例
 * （echarts 的主题只在 init 时生效，切主题必须 dispose + init）。
 *
 * 只在容器**有真实尺寸**时 init —— 隐藏容器（页签切走 / 折叠）里 init 会
 * 得到 0×0 画布，`resize()` 也救不回来。
 *
 * `target` 由调用方提供（页面里是 `useTemplateRef<HTMLElement>('chart')`），
 * 这样模板上的 `ref="chart"` 与脚本里的变量同源，不需要额外把 ref 名再暴露一遍。
 */
```

### N-262 · src/composables/use-echarts.ts:187-190

```ts
/**
 * 增量更新（异步数据回来时调用）：patch 结果并入本地 options 再 setOption，
 * 保证 `render()` 在重建（切主题）时用的是最新数据。
 */
```

### N-263 · src/composables/use-hydrated.ts:4-30

```ts
/**
 * 客户端挂载门控（水合一致性工具）。
 *
 * ## 解决什么问题
 *
 * 应用是 SSR 首屏 + 客户端水合。任何**服务端算不出、客户端却算得出**的首屏
 * 数据，都会让两侧渲染出不同的 DOM，Vue 只能报
 * `Hydration node/text/attribute mismatch` 并丢弃部分服务端 DOM 重新渲染 ——
 * 表现为首屏闪一下，且控制台一片红。这类数据的来源只有两个：
 *
 * 1. `localStorage`（页签列表、登录用户信息、主题偏好）；
 * 2. 服务端被早退跳过、客户端才执行的逻辑（路由守卫里的用户信息/菜单初始化）。
 *
 * ## 怎么用
 *
 * 把「只在浏览器成立」的值包一层：`const hydrated = useHydrated()`，
 * 首屏渲染时读 `hydrated.value ? 真值 : 占位值`，两侧即一致。**不要**用它去
 * 包服务端本就能算出来的东西（菜单树的 static 分支、i18n 文案）—— 那是纯粹
 * 多一层无谓的分支。
 *
 * `computed` 重算不产生额外渲染成本：水合后 `mounted` 变 true，依赖它的
 * computed 自然重算一次，正好把真实数据填进 DOM。
 *
 * 判定用 `onMounted` 而不是 `import.meta.client`：后者在 ubean 的 dev 预渲染
 * 上下文里**是 `false` 但 `window` 不存在**（见 AGENTS.md「已知陷阱」），
 * 拿它当判据会在服务端走进客户端分支。判据必须是能力检测。
 */
```

### N-264 · src/composables/use-hydrated.ts:41-49

```ts
/**
 * 派生一个「水合前用占位值、水合后用真值」的 computed。
 *
 * 比在每个组件里手写 `mounted.value ? a : b` 更省事，也把「首屏占位」这件事
 * 显式命名出来。`fallback` 必须与服务端渲染结果一致（通常是空串 / `'-'` / `'U'`）。
 *
 * @param source 真实值（依赖 `localStorage` 或客户端才有的数据）
 * @param fallback 服务端与水合前使用的占位值
 */
```

### N-265 · src/composables/use-manage-options.ts:6-23

```ts
/**
 * 管理端下拉选项（P3-03）。
 *
 * 与 `src/constants/manage.ts` 的分工：常量层放**值域**（可被测试直接断言，
 * 且不引入 vue-i18n 依赖），这里做「值 → 文案」的渲染层拼接。
 *
 * 文案一律写成静态字面量 key，**不能**用 `t(labelKeys[value])` 这类动态取值：
 * `scripts/remove-i18n` 只能内联字面量 key，动态调用会留下无法裁剪的 `useI18n`
 * 装配（`test/specs/scripts/remove-i18n.test.ts` 断言 `plan.leftovers === []`）。因此下面每个
 * 选项列表都穷举 `value` 与 key 的配对。
 *
 * 必须在 setup 里调用（用到 `useI18n()`）。
 *
 * **「全部」选项的哨兵值**：下拉里用 `SEARCH_ANY_SELECT_VALUE`（`'all'`）而不是
 * 表单层的空串 —— `@vean/aria` 的 `SelectItem` 对 `value === ''` 会直接抛错
 * （空串被保留给 placeholder/未选择语义）。两个值在
 * `fromSelectValue` / `toSelectValue` 这对边界函数上互相转换。
 */
```

### N-266 · src/composables/use-manage-options.ts:96-101

```ts
/**
 * `SSelect` 的选项值 → 表单值（`'all'` → `''`）。
 *
 * 搜索表单的默认值 / schema 仍以空串表示「全部」，只有下拉渲染层用哨兵值，
 * 提交前在这里转回来，`filterValidQuery` 照旧把空串剔除。
 */
```

### N-267 · src/composables/use-manage-options.ts:106-111

```ts
/**
 * 表单值 → `SSelect` 的选项值（`''` → `'all'`）。
 *
 * 给 `:model-value` / `:default-value` 之类的受控绑定用；`v-model` 场景下
 * 用 `useSearchSelectValue` 更省事。
 */
```

### N-268 · src/composables/use-table-operate.ts:6-17

```ts
/**
 * 表格 operate 弹窗 / 搜索 / 刷新范式（v3 §5.7，P3-02）。
 *
 * 从 `soybean-unify/apps/admin/src/composables/table.ts` 重写而来，差异：
 * - 深度克隆用内建 `structuredClone`，不引入 `klona`（本仓无该依赖）；
 * - `t()` 只能在 setup 上下文用 → 走 `useI18n()`，不再有 unify 的
 *   模块级 `I18N_FLAG` 开关；
 * - 查询默认值类型放宽为 `Record<string, unknown>` 的普通对象。
 *
 * 与 `usePaginatedTable`（`@vean/ui`）的分工：后者管**数据与分页**，
 * 这里管**交互**（新增/编辑弹窗开关、批量选中、搜索/重置/刷新）。
 */
```

### N-269 · src/composables/use-table-operate.ts:26-31

```ts
/**
 * 管理页（8 套 CRUD 列表页）的查询状态：分页字段 + 排序 + 各页自己的搜索字段。
 *
 * 用 type 别名而非 `interface ... extends TableQuery`：`useTableOperate<T extends
 * TableQuery>` 要求索引签名，interface 不会从父接口继承它。
 */
```

### N-270 · src/composables/use-table-operate.ts:65-68

```ts
/**
 * 克隆查询默认值。用内建 `structuredClone`（Node 17+ / 全部现代浏览器）；
 * `toRaw` 先脱掉 reactive 代理，否则克隆出来的是 Proxy（会随 search 表单漂移）。
 */
```

### N-271 · src/composables/use-table-operate.ts:84-87

```ts
/**
 * 刷新按钮的 loading：请求期间**立即**跟手（0ms），结束后再拖 500ms ——
 * 否则快速的本地查询会让按钮闪一下，看起来像"没点到"。
 */
```

### N-272 · src/composables/use-vchart.ts:10-23

```ts
/**
 * VChart 生命周期（P4-01，v2 `hooks/common/vchart.ts` 的移植）。
 *
 * 与 `useEcharts` 同构：容器尺寸就绪才创建实例、尺寸变化 resize、明暗切换
 * 销毁重建。差异只在库本身：
 *
 * - VChart 实例的尺寸跟随容器，`resize()` 在 0×0 时会抛错，因此尺寸归零
 *   只销毁不重建（`canRender()`）；
 * - 主题用 `ThemeManager.setCurrentTheme()` 全局切换，**必须**在 new 之前设置，
 *   否则沿用上一个实例的主题。
 *
 * 主题 JSON 是运行时数据（不是样式），直接 import；`ECharts` 侧的 `backgroundColor`
 * 透明处理在 VChart 无对应项，改用 `background: 'transparent'` spec 字段由页面决定。
 */
```

### N-273 · src/composables/use-vchart.ts:42-48

```ts
/**
 * VChart 生命周期钩子。
 *
 * `target` 由调用方提供（页面里是 `useTemplateRef<HTMLElement>('chart')`）。
 * `specFactory` 里可以放任意 `ISpec`，不做类型收窄 —— VChart 的 spec 是
 * 按 `type` 分派的联合体，页面各自知道自己要什么。
 */
```

### N-274 · src/constants/error-code.ts:1-14

```ts
/**
 * 业务错误码表（v3 §6.1 统一响应契约）。
 *
 * 响应格式恒为 `{ code, message, data }`：`0000` 表示成功，其余为业务码。
 * HTTP 状态码只表达传输层结果（业务错误同样返回 200），前端按 code 分类处理。
 *
 * 分段约定（与 soybean-unify 对齐）：
 * - `0000` 成功
 * - `1000-1999` 系统错误
 * - `2000-2999` 认证错误
 * - `3000-3999` 参数错误
 * - `4000-4999` 业务错误（资源 / 权限 / 限流 / 数据一致性）
 * - `8888 / 7777 / 9999` 演示码（登出 / 弹窗登出 / 过期刷新），供前端错误处理演示页使用
 */
```

### N-275 · src/constants/index.ts:1-6

```ts
/**
 * 应用常量。
 *
 * 版本号在此声明而不是 `import pkg from '../package.json'`：
 * JSON import 会把整个 package.json 打进产物，且 SSR/客户端两份模块图各持一份。
 */
```

### N-276 · src/constants/index.ts:18-28

```ts
/**
 * 应用 locale 列表。
 *
 * 刻意用裸语言码 `zh` / `en` 而不是 `zh-CN` / `en-US`：ubean 把 locale code
 * 直接当作 URL 前缀（`strategy: 'prefix_except_default'`），裸码让路径更简洁
 * （`/en/...` vs `/en-US/...`）。
 *
 * 注意：Vean（`@vean/aria/locale`）出厂只注册 `en` 与 `zh-CN`，且未知 key
 * **静默回落到 `en`**。所以 `zh` 必须用 `registerVeanLocales()` 补注册（见
 * `@/shared/vean-locale`，在 `src/app.ts` 调用），否则组件内置文案会变英文。
 */
```

### N-277 · src/constants/index.ts:35-42

```ts
/**
 * locale → 展示名（**各语言的原生写法**，切语言时不变形）。
 *
 * 语言下拉的单一来源：`APP_LOCALES` 加一项 + 此处补一行即可，
 * 不要在视图里写 `if (value === 'zh')` 这类硬编码分支。
 * （`ubean.config.ts` 的 `i18n.locales[].name` 是服务端中间件/head 用的元数据，
 * 客户端下拉不读它：那份配置只在 Node 侧可用，客户端要另起运行时请求。）
 */
```

### N-278 · src/constants/layout.ts:1-8

```ts
/**
 * 布局模式（v2 语义名）与 Vean 壳模式的映射（P2-01 / P2-20）。
 *
 * 放在 `constants/` 而不是 theme store：`src/shared/layout-matrix.ts` 与
 * `src/components/theme-drawer/**` 都要读这张表，它们不该为此把 pinia store
 * 拖进依赖图。theme store 仍 re-export（`LAYOUT_MODES` / `mapLayoutMode` /
 * `LayoutModeName`），旧引用不必改。
 */
```

### N-279 · src/constants/layout.ts:11-19

```ts
/**
 * key 用 v2 命名（`vertical` / `horizontal` / …），`shell` 是 `@vean/ui` 的
 * `AppShellMode`（6 模式）。菜单、持久化与 i18n 都用 v2 名（与 v3-task 表述
 * 一致），传给 `SAppShell` 前经 `mapLayoutMode()` 翻译。
 *
 * `mobile` 标记该模式在 <768px 下是否需要退化为纯侧栏（Vean 的
 * `app-shell.vue` 在移动端本来就固定渲染 `sidebar` 骨架，见
 * `resolveShellCapabilities()`：矩阵把这件事显式化，而不是靠隐式副作用）。
 */
```

### N-280 · src/constants/manage.ts:1-13

```ts
/**
 * 管理端常量（P3-03）。
 *
 * 刻意**不**从 `@/db/schema/shared`（drizzle）或 `@/schema/_shared`（valibot）
 * 取值：那两份会分别把 drizzle-core / valibot 拉进客户端产物。这里的值域是
 * 稳定的字符串契约，`test/specs/constants/manage.test.ts` 断言它们与 schema 一致，
 * 用一条测试换掉一份运行时依赖。
 *
 * 标签**不在这里**：文案必须以静态字面量 key 的 `t()` 调用形式写在组件/组合式
 * 函数里，才能被 `scripts/remove-i18n` 内联（`test/remove-i18n.test.ts` 断言
 * `plan.leftovers === []`）。把 key 存进常量表再用 `t(table[key])` 取值会留下
 * 无法裁剪的 `useI18n` 装配，因此常量层只保留**值域**与**语义色**。
 */
```

### N-281 · src/constants/manage.ts:37-40

```ts
/**
 * 菜单类型 → 允许的子菜单类型（父级选择器过滤用，与后端
 * `src/services/menu.service.ts` 的 `validateParent` 约束一致）。
 */
```

### N-282 · src/constants/service.ts:3-11

```ts
/**
 * 请求层业务码配置（v3 §5.4，来自 `.env` 的 `VITE_SERVICE_*`）。
 *
 * 与服务端 `src/constants/error-code.ts` 对齐：
 * - `0000` 成功；
 * - `2001` 令牌过期 → 单飞刷新 + 重放；
 * - `2000/2002/2003` 未授权类 → 弹窗确认后登出；
 * - 其余登出码 → 静默登出。
 */
```

### N-283 · src/constants/theme.ts:1-6

```ts
/**
 * 主题 / 布局的可选项常量（P2-10 ~ P2-15）。
 *
 * `label` 一律是 **i18n key**（不是文案字面量）：这些表要进主题抽屉，
 * 切语言时必须由 `t()` 解析。真正的文案只在 `src/locales/{zh,en}.json`。
 */
```

### N-284 · src/constants/theme.ts:36-42

```ts
/**
 * 水印时间格式（7 种，对齐 v2 `watermarkTimeFormatOptions`）。
 *
 * `value` 直接就是 `@vueuse/core` `useDateFormat` 的 format 串（内部走 dayjs
 * token），所以 label 与 value 同字面量 —— 这是「格式串本身即展示」的场景，
 * 不进 i18n。
 */
```

### N-285 · src/utils/auth.ts:4-10

```ts
/**
 * 认证凭据的本地缓存与全局登出回调（v3 §5.5）。
 *
 * 请求层（`src/request`）与 auth store（`src/store/modules/auth`）互相依赖会造成
 * 循环引用 —— 请求层只碰这里：同步的 token 存取 + 由 store 在启动时注册的
 * `handleLogout` 回调。store 负责真正的状态重置与跳转。
 */
```

### N-286 · src/utils/auth.ts:63-67

```ts
/**
 * 请求层统一登出入口。
 *
 * @param silent true = 不弹确认框直接登出（刷新失败/登出码）；false = 走 store 的弹窗确认
 */
```

### N-287 · src/utils/auth.ts:78-84

```ts
/**
 * 注册「登录态刚被清空」的收尾动作（守卫在拿到 router 实例时注册）。
 *
 * `authStore.resetStore()` 只清状态、不碰路由；跳登录页需要 router 实例，
 * 而实例只有守卫与组件拿得到 —— 用回调把它注入进来，store 就不必依赖
 * `@/router`（那会形成 `store → @/router → guard → store` 模块环）。
 */
```

### N-288 · src/utils/route-meta.ts:4-11

```ts
/**
 * `RouteMeta`（继承 `Record<PropertyKey, unknown>`，取值是 unknown）→
 * `AppRouteMeta` 的单一受信边界：逐字段运行时收窄，无 as 断言。
 *
 * vue-router 的 RouteMeta 带全量 unknown 索引签名，整对象直接赋给
 * AppRouteMeta 在结构上不可赋值（unknown ↛ string|undefined），字段访问
 * 却又拿不到具体类型 —— 用本函数一次收窄，全仓只此一处。
 */
```

### N-289 · src/utils/storage.ts:3-17

```ts
/**
 * SSR 安全的 localStorage 封装。
 *
 * ubean 是全栈框架（SSR），store 初始化会在服务端执行 —— 直接碰
 * `localStorage` 会炸。所有存取都先判「有没有 localStorage」。
 * key 统一加 `VITE_STORAGE_PREFIX` 前缀，避免同域多应用互踩。
 *
 * ⚠️ 判据是**能力检测**，不是 `import.meta.client`（P4-02 实测教训）。
 * ubean 0.6.0 从不定义 `import.meta.client` / `import.meta.server`：dev
 * 按需转换的模块与 `vp build` 的产物里都原样留下 `import.meta.client`，
 * 浏览器求值即 `undefined`。用它当判据会让 `isClient()` 恒假 → 全应用
 * **静默丢掉所有 localStorage 读写**：token / 用户信息 / 主题设置 / 页签
 * 全部刷新即失，且不报错。同源教训见 `src/router/guard.ts` 与
 * `src/shared/i18n.ts`（都用能力检测）。
 */
```

## pages

### N-290 · src/pages/(builtin)/iframe/index.vue:8-22

```vue
/** * iframe 内嵌外链页（P3-07，v3 §4.2 的 `(builtin)/iframe/[url].vue`）。 * * 地址来源：`?url=` 查询串。dynamic
模式下菜单行 `iframeUrl` 无法映射成路由 * 参数（URL 含 `//`、`?`，当路径段会被 router 拆碎），所以`transformMenuToRoute`
* 生成的是一条 `redirect: { path: '/iframe', query: { url } }` 的路由；静态声明 * 或手动使用也一律走同一条 query 通道。
* * 安全：只接受 `http(s)` 协议（`javascript:` / `data:` 会被浏览器拒绝执行脚本 * 但也可能被当作下载，一律拦掉）；无
sandbox 是刻意的 —— 内嵌页需要自己的 * 脚本与存储，sandbox 会让常见站点白屏。此处只做协议白名单。 * * ⚠️ `requiresAuth:
false` 写在 `meta` 里而非顶层：ubean 生成器只发射顶层 * `requiresAuth: true`，`false` 会被静默丢弃（详见
`src/pages/(builtin)/login.vue`）。 */
```

### N-291 · src/pages/(builtin)/login/index.vue:10-14

```vue
/**
 * 模块注册表与标题 key 放**模块作用域**（普通 `<script>` 块）：
 * 放 setup 里会让对象被 Vue 响应式包装，`<component :is>` 会警告
 * "made a reactive object"。
 */
```

### N-292 · src/pages/(builtin)/login/index.vue:41-61

```vue
/** * 登录页（v3 §4.6）：单路由多模块壳。 * * `/login?module=<模块>` 切换子组件（密码登录 / 验证码登录 / 注册 / 重置密码
/ * 绑定微信），与 v2 的 `views/_builtin/login/modules/*` 结构对齐 —— 5 个模块 *
共用一条路由，回跳参数（`?redirect=`）在切换过程中由 `gotoLoginModule` * 原样保留。布局走 `blank`（无壳），登录成功进入
default 布局。 * * 外观对照 soybean-unify：`WaveBg` 背景装饰 + 居中 `SCard`，卡片头部放 * 品牌 logo 与明暗切换，宽度靠
`ui.root` 的 `max-w-96` 约束（`SCard` 自身 * 没有默认宽度）。 * * ⚠️ `requiresAuth: false` 必须写在 **`meta`
里**，不能写成顶层字段。 * ubean 0.6.0 的生成器只发射顶层 `requiresAuth: true` * （`@ubean/vue/dist/generator.js` 的
`renderRouteRecord`： * `if (page.pageMeta?.requiresAuth === true)`），`false` 被静默丢弃， * 于是 `to.meta.requiresAuth
=== false` 永假 → 未登录访问登录页会被守卫 * 无限重定向到登录页（真实浏览器里表现为渲染进程 100% CPU 卡死）。 * `meta`
是逐字透传的（`computeMeta()`），所以只有这条路径可靠。 * 回归保护见 `test/specs/guards/page-meta-guard.test.ts`。 */
```

### N-293 · src/pages/(builtin)/login/modules/bind-wechat.vue:10-20

```vue
/** * 绑定微信（v3 §4.6）。 * * ⚠️ 本模块**需要登录态**：绑定是账号级操作，服务端 `GET/POST * /api/auth/bind-wechat`
走默认鉴权；未登录时只提示去登录，不发请求 * （避免 401 触发全局登出回调）。 * * mock 说明：无微信开放平台凭证，服务端
`wechat-qrcode` 只下发 ticket + * 形似 `qrconnect` 的 url；这里用 ticket 派生 21×21 伪点阵（含三个定位角） *
作占位二维码，「模拟扫码」提交 ticket 完成绑定。 */
```

### N-294 · src/pages/(builtin)/login/modules/code-login.vue:11-18

```vue
/** * 验证码登录（v3 §4.6 / §5.7 P3-05）。 * * v3 无短信通道 —— 短信验证码的凭证角色由**图形验证码**承担（见 *
`src/services/captcha.service.ts`）：用户名 + 图形验证码即完成登录， * 服务端按 `grantType: 'captcha'`
分支处理。表单校验走 `codeLoginFormSchema` * （服务端 `loginSchema` 的 captcha 分支同一份声明）。 */
```

### N-295 · src/pages/(builtin)/login/modules/pwd-login.vue:10-18

```vue
/** * 密码登录（v3 §4.6 / §5.7 P3-05）。 * * 校验交给 `useForm` + `src/schema/auth.ts` 的 `passwordLoginFormSchema` —— *
与服务端 `loginSchema` 的 pwd 分支**同一份 valibot 规则**，前端不再手写 * 「非空」判断。服务端业务错误（如 `2009`
用户名或密码错误）由请求层统一 * toast，这里 catch 住不重复提示。成功后回跳 `?redirect=` 指向的来源页， * 否则用户
`homePath`。 */
```

### N-296 · src/pages/(builtin)/login/modules/register.vue:10-19

```vue
/** * 注册（v3 §4.6 / §5.7 P3-05）。 * * 后端 `/api/auth/register` 是「注册即登录」：直接返回 token 对，因此注册 *
成功后无需再走一次登录，落库后按 `?redirect=` / `homePath` 回跳。 * * 校验走 `registerFormSchema` —— 服务端
`registerSchema` 的超集：用户名长度、 * 密码长度、邮箱格式两边同一份声明，多出的只有「两次密码一致」。`email` 在 *
表单里是普通字符串（空串 = 未填），提交前 `|| undefined` 归一。 */
```

### N-297 · src/pages/(builtin)/login/modules/reset-pwd.vue:10-18

```vue
/** * 重置密码（v3 §4.6 / §5.7 P3-05）。 * * 未登录态页面，凭证用图形验证码（无短信通道，与 v2 `reset-pwd` 语义一致）。
* 成功后**不**自动登录，回到密码登录模块让用户用新密码登录。 * * 校验走 `resetPasswordFormSchema`（服务端
`resetPasswordSchema` + 确认密码）。 * `captchaId` 不在表单里填，由拉取结果回写（见下方 `watch`）。 */
```

### N-298 · src/pages/(builtin)/login/use-login.ts:7-16

```ts
/**
 * 登录页公共逻辑（v3 §4.6）。
 *
 * 登录页是**单路由多模块**：`/login?module=<模块>` 决定渲染哪个子组件，
 * 与 v2 的视图层结构一致（对应 `src/pages/(builtin)/login/modules/*`） —— 免去为 5 个
 * 页面各建一条路由，回跳（`?redirect=`）与页签语义也更简单。
 *
 * 表单校验（P3-05）在各自模块里由 `useForm` + `src/schema/auth.ts` 的
 * valibot schema 承担，本文件只管路由/回跳/验证码这三件与校验无关的事。
 */
```

### N-299 · src/pages/(builtin)/login/use-login.ts:38-44

```ts
/**
 * 模块切换器：`replace` 而非 `push`（不污染历史），并保留 `?redirect=` 等既有
 * query —— 在注册/重置密码之间来回切换时回跳目标不丢。
 *
 * 做成 composable（而不是收 `router` 参数的裸函数）：调用点全在组件 setup 里，
 * 拿到的函数直接给模板用，`useRouter()` 只在 setup 期求值一次。
 */
```

### N-300 · src/pages/(builtin)/login/use-login.ts:60-63

```ts
/**
 * 回跳目标：`query.redirect`（守卫写入的来源页）优先，其次用户 `homePath`。
 * 只接受站内绝对路径，避免开放重定向。
 */
```

### N-301 · src/pages/(builtin)/login/use-login.ts:77-80

```ts
/**
 * 图形验证码（验证码登录 / 重置密码共用）：拉取即刷新，`captchaId` 随表单
 * 提交、服务端校验一次即消费 —— 校验失败后必须重新拉取。
 */
```

### N-302 · src/pages/403.vue:7-13

```vue
/** * 403 无访问权限（P3-06 引入，P3-07 改用统一异常壳）。 * * 触发点：`src/router/guard.ts` 的路由级 `meta.roles`
判定不命中 → * 重定向到这里并带上 `?from=`。角色判定复用 `@/shared/permission` 的 * `hasRole`，与 `v-auth:role`
指令同一份纯函数。 */
```

### N-303 · src/pages/404.vue:5-11

```vue
/** * 404 页面不存在（P3-07：改用统一异常壳）。 * * 命中路径：路由表里没有的路径（`ubean.config.ts` 的 *
`routing.notFoundRouteComponent: '404.vue'`）。守卫对 dynamic 模式做过一次 * 「初始化后重跳原路径」的补偿，所以真 404
不会被菜单未就绪误判。 */
```

### N-304 · src/pages/500.vue:8-22

```vue
/** * 500 服务异常（P3-07）。 * * 本仓是 SPA + 服务端 API 的形态，「服务端渲染失败」这条路径不存在 * （`ubean.config.ts`
的 `ssr: false`），所以 500 页不是自动跳转目标，而是： * 1. 业务侧遇到不可恢复错误时可主动 `push('/500')` 的可视化出口；
* 2. 请求层 `SYSTEM_ERROR` / 网络异常时给用户的「重试」落点 —— 页面把来源 *
（`?from=`）透传出来，重试即重新导航回原路径。 * * 必须 `requiresAuth:
false`：系统异常时用户可能刚好处于登录态失效状态， * 再被守卫推去登录页会掩盖真实错误。 * * ⚠️ 写在 `meta`
里而非顶层：ubean 生成器只发射顶层 `requiresAuth: true`， * `false` 会被静默丢弃（详见 `src/pages/(builtin)/login.vue`
的说明）。 */
```

### N-305 · src/pages/_placeholder.vue:4-9

```vue
/** * 动态菜单缺页占位视图（menu store 的 `transformMenuToRoute` 兜底）。 * * dynamic 路由模式下，菜单指向的 `view.*`
组件尚未在 `src/pages/**` * 实现时落到这里（P2-04 的 dev 告警会列出缺页清单）。 */
```

### N-306 · src/pages/about/modules/dependencies.ts:1-10

```ts
/**
 * about 页的构建期注入数据。
 *
 * 依赖清单在构建期由 `scripts/dependency-manifest.ts` 解析（见 `vite.config.ts` 的
 * `define`），这里只做「自由变量 → 具名导出」的桥接与运行时兜底，**不引入 `yaml`**：
 * 浏览器侧拿到的已是最终表格数据，构建期解析器不进客户端产物。
 *
 * 兜底分支只在非 vite/vitest 环境（如直接被 node require）命中，正常构建与测试
 * 都走注入值。`declare const` 由 `src/typings/env.d.ts` 提供。
 */
```

### N-307 · src/pages/function/hide-child/index.vue:7-16

```vue
/** * 隐藏子菜单（P3-06，v3 §4.6）。 * * 一个视图挂 4 条路由：`/function/hide-child`（父，菜单位）+ 三个 * `hideInMenu:
true` 的子页。三个子页声明了 * `meta.activeMenu: 'FunctionHideChildIndex'` —— 布局的 `activeMenuValue` *
优先取它，因此访问隐藏子页时侧栏高亮仍停在父菜单上（而不是全灭）。 * 这是 v2「隐藏子菜单」演示的核心行为，不需要父路由
`redirect`（ubean 的 * `PageMeta` 没有 `redirect` 字段，父级重定向在本仓不可用）。 */
```

### N-308 · src/pages/function/hide-child/modules/hide-child-panel.vue:6-13

```vue
/** * 隐藏子菜单的共享内容块（P3-06）。 * * 三个隐藏子页（one/two/three）是同一视觉模板的三份实例：路由各自独立 *
（各占一个页签），但菜单里不可见（`hideInMenu: true`），侧栏高亮由 * `meta.activeMenu` 指回父菜单
`/function/hide-child`。 * 收敛成这个组件，避免三份重复的卡片骨架。 */
```

### N-309 · src/pages/function/multi-tab/index.vue:7-17

```vue
/** * 多标签页（P3-06，v3 §4.6「多标签」）。 * * 本页声明 `multiTab: true`：tab store 的 `addTab` 用 *
`to.fullPath`（而非路由名）作为页签 value，所以**同一路由的不同 query 会 *
各自成为一个页签**。页签切换时本页不会重挂载（同一路由记录，仅 query 变）， * 因此必须用 `useRoute().query`
的响应式读取，而不是在 setup 里取一次快照。 * * 不在本页展示「路由 params」——本页无动态段；`RouteParamForm` 的 params *
演示在菜单管理弹窗里（P3-03）。 */
```

### N-310 · src/pages/function/request/index.vue:7-19

```vue
/** * 请求演示（P3-06，v3 §4.6：对接真实错误码端点 `POST /api/auth/error`）。 * *
演示的是**请求层的错误分派**，不是页面自己的 try/catch： * `src/request/factory.ts` 的 `onBackendFail` 按业务码分流 —— *
- 普通失败 → `toast.error`（3s 内相同文案去重） * - 登出码（8888）→ 清会话 + 静默 toast * - 弹窗登出码（7777）→ 清会话 +
`dialog.warning` * - 过期码（9999）→ 单飞刷新令牌后**重放原请求**（重放仍失败才提示） * * 所以这里的按钮**故意不
catch**，只负责发请求；错误可见性全部来自请求层。 * 若把调用包进 `try/catch` 会吞掉请求层的 toast，演示就假了。 */
```

### N-311 · src/pages/function/super-page/index.vue:7-14

```vue
/** * 超管可见页（P3-06，v3 §4.6）。 * * 路由声明 `meta.roles: ['super']` —— 守卫（`src/router/guard.ts`）用 *
`@/shared/permission` 的 `hasRole` 判定：非 super 访问直接重定向到 403， *
**正常路径下非超管根本进不到本组件**。所以这里不再做二次拦截，只展示 * 当前身份与「为什么能看到」的说明。 */
```

### N-312 · src/pages/function/tab/index.vue:7-16

```vue
/** * 标签页操作（P3-06，v3 §4.6「function：标签页」）。 * * 全量演示 tab store 的对外能力： * - 跳转（首页 / 多标签页 /
超管页）—— 页签由 `afterEach` 守卫自动补； * - `closeAndSwitch` 关闭当前页签并落到相邻页签； * - `removeTab`
按「路由名」关闭指定页签（普通页 tab value = 路由名）； * - `switchTab` 在多标签页之间切换激活； * - 404：`addTab` 对
`NotFound` 直接返回，所以 404 不进页签。 */
```

### N-313 · src/pages/function/toggle-auth/index.vue:7-18

```vue
/** * 切换权限（P3-06，v3 §4.6）。 * * 演示「角色/按钮权限」在真实账号上的差异： * - `admin`（角色 `super`）→
路由级全通、`buttons` 为全量权限码； * - `user`（角色 `user`）→ 无 `system:user:*` 权限码，`function/super-page` *
声明了 `meta.roles: ['super']`，切到 user 访问会落 403。 * * 切换账号 = 重新登录 + **整页重载**：`v-auth` 指令只在
`mounted` 判定一次 * （与 v2 语义一致），动态重建指令不如直接 reload 干净；菜单树也随重载重新 * 初始化。按钮示例用
`v-auth` 静态字面量数组写法。 */
```

### N-314 · src/pages/home/modules/greeting-banner.vue:21-25

```vue
/** * 服务端 / 水合前空串（`userInfo` 来自 `localStorage`，见 * `@/composables/use-hydrated`）。不门控会让首屏渲染
`早安，, ...`、水合渲染 * `早安，admin, ...`，报 `Hydration text content mismatch`。 */
```

### N-315 · src/pages/index.vue:9-14

```vue
/** * 首页工作台（P3-01）：问候横幅 / 4 统计卡 / 折线 + 饼图 / 项目动态 / 创意横幅。 * * 数据全为本地静态 mock（与 v2
对齐，不新增端点）；重模块放 `src/pages/home/modules/` * （login 页先例），页面只做组合与路由 meta。 */
```

### N-316 · src/pages/manage/api/index.vue:17-27

```vue
/** * 接口管理页（P3-03，8 套 CRUD 的**参照实现**）。 * * 职责分层： * - `usePaginatedTable`（`@vean/ui`）：数据与分页；
* - `useTableOperate`：交互状态（弹窗 id、多选、搜索/重置/刷新）； * - `ManagePage`：骨架（搜索卡槽位 / 表头操作 / 表格
/ 分页）； * - `ApiSearch` + `ApiOperate`：本域字段。 * * 复用到其他域时只需改：`query` 字段、`api`
回调、列定义、两个子组件。 */
```

### N-317 · src/pages/manage/api/modules/api-operate.vue:10-19

```vue
/** * 接口新增 / 编辑弹窗（P3-03）。 * * 8 套 operate 弹窗同形，本文件是**参照实现**： * 1. `operateId` 变化 →
拉详情（编辑）或 `form.reset(空表)`（新增）； * 2. `useForm({schema, defaultValues})` 的 `defaultValues`
在**组合时**固化， * 所以回填只能走 `form.reset(values)`（TanStack 的 `reset` 会把 * `defaultValues` 一并替换成新值，见
`FormApi.js:127`）； * 3. 提交成功后 `open=false` + `toast.success` + `emit('success')` 通知列表刷新。 */
```

### N-318 · src/pages/manage/api/modules/api-search.vue:10-15

```vue
/** * 接口搜索卡（P3-03）。 * * `useForm` 在这里调用（`SFormField` 靠它的 `provide` 解析字段类型）， *
提交/重置后把值交给父级页面去合并进表格 query。 */
```

### N-319 · src/pages/manage/dict-item/index.vue:19-24

```vue
/**
 * 字典项管理页（P3-03）。
 *
 * 支持 `?dictId=<id>` 预置筛选（字典页的「查看字典项」入口）。`dictId` 列只存
 * id，需要一份 `GET /api/dict/all` 的 id → 名称映射。
 */
```

### N-320 · src/pages/manage/dict-item/modules/dict-item-search.vue:9-15

```vue
/** * 字典项搜索卡（P3-03）。 * * `initialDictId` 来自 URL 的 `?dictId=`（字典页「查看字典项」入口），作为 *
`defaultValues` 的初值 —— 这样「重置」也会回到该筛选，符合从字典页跳过来的 * 语境。 */
```

### N-321 · src/pages/manage/dict/index.vue:18-23

```vue
/**
 * 字典管理页（P3-03）。
 *
 * 额外提供「查看字典项」跳转：`/manage/dict-item?dictId=<id>`，由字典项页读取
 * query 预置筛选，省去手抄 dictId。
 */
```

### N-322 · src/pages/manage/menu/index.vue:17-22

```vue
/** * 菜单管理页（P3-03）。 * * `parentId` 列只存 id，需要一份 `GET /api/menu/all` 的 id → 名称映射才能显示； *
同一份全量列表也传给 `MenuOperate` 做父级选择与组件名候选。 */
```

### N-323 · src/pages/manage/menu/modules/menu-operate.vue:13-22

```vue
/** * 菜单新增 / 编辑弹窗（P3-03）。 * * 菜单类型决定字段可见性与提交内容，参照 unify 的 `clearFieldsByMenuType`： *
切换类型时把不适用字段清空，避免脏数据进入后端（后端 * `src/services/menu.service.ts` 的 `validateMenuTypeConstraints`
会拒绝）。 * * `menuType` / `routePath` / `routeQueries` / `routeParams` 都从 * `form.useSelector` 读（`form.state` 是
TanStack Store 快照，无 Vue 响应性）。 */
```

### N-324 · src/pages/manage/menu/modules/route-param-form.vue:6-12

```vue
/**
 * 路由参数 / 查询编辑器（P3-03）。
 *
 * 值域是 `Record<string, string>`（后端 `routeParams` / `routeQueries` 的 DTO 形
 * 状）。行内编辑用局部数组，避免每次按键都重建 record 造成父级表单抖动；
 * 回写用 `JSON.stringify` 比对，防止 `watch` 来回互相触发。
 */
```

### N-325 · src/pages/manage/org/index.vue:18-23

```vue
/** * 组织管理页（P3-03）。 * * `parentId` 列只存 id，需要一份 `GET /api/org/all` 的 id → 名称映射；同一份 * 列表也传给
`OrgOperate` 做父级候选。 */
```

### N-326 · src/pages/manage/org/modules/org-operate.vue:10-14

```vue
/** * 组织新增 / 编辑弹窗（P3-03）。 * * 父级选择器排除自身，避免自环（后端 `org.service` 也会拦，但前端先挡掉更直观）。
*/
```

### N-327 · src/pages/manage/permission/modules/permission-operate.vue:10-20

```vue
/** * 权限点新增 / 编辑弹窗（P3-03）。 * * 资源绑定：`resourceType` 为 `menu` / `api` 时必须选 `resourceId`，后端会据此
* 推导 `name` / `code`（见 `src/services/permission.service.ts` 的 * `resolveResourceBinding`）；`other` 则手工填 `name`
/ `code`。 * * 刻意不提供 `button` 选项：schema 与种子数据里有这个取值，但 * `resolveResourceBinding` 只认 `other` /
`api` / `menu`，选了会被后端拒绝。 * 搜索卡仍保留 `button`，以便过滤历史数据。 */
```

### N-328 · src/pages/manage/role/modules/permission-picker.vue:8-16

```vue
/** * 权限点选择器（P3-03，角色弹窗内嵌）。 * * 权限点动辄上百条，用 `SSelect multiple` 会撑爆下拉；这里改成子弹窗里的 *
「关键词过滤 + 表格多选」，草稿态与确认态分离 —— 关闭弹窗不改动外部选中集。 * * 选中集用 `string[]`（id）而不是
`Set`：`STable` 的 `v-model:selected` 契约 * 就是 key 数组，来回转换只会引入不一致。 */
```

### N-329 · src/pages/manage/role/modules/role-operate.vue:12-18

```vue
/** * 角色新增 / 编辑弹窗（P3-03）。 * * 权限点不用 `SSelect multiple`（上百条会撑爆下拉），改为「已选 N 项」+ 按钮 *
打开 `PermissionPicker`。当前选中集从 `form.useSelector` 读（`form.state` * 是 TanStack Store 快照，没有 Vue
响应性），写回走 `form.setFieldValue`。 */
```

### N-330 · src/pages/manage/user/index.vue:17-25

```vue
/** * 用户管理页（P3-03）。 * * 与 `src/pages/manage/api/index.vue` 同范式，差异： * - 搜索条件有 5
个字段（`UserSearchFormDTO`）； * - `roles` 列只有 `{id}`（`userService.getUserList` 的输出），需要一份 * `GET
/api/role/all` 的 id → 名称映射才能显示； * - 编辑时把行上的 `roles` 一并传给弹窗（详情接口不返回角色关联）。 */
```

### N-331 · src/pages/manage/user/index.vue:30-35

```vue
/** * 表格查询状态：分页字段（`ManagePageQuery`）+ 搜索字段（`UserSearchFormDTO`）。 * * 交叉而非用服务层的
`UserQuery`：搜索表单的 `enabled` 允许空串（= 全部）， * 服务层 DTO 只收 `'Y' | 'N' | 'D'`；`filterValidQuery`
会在提交前把空串剔掉。 */
```

### N-332 · src/pages/manage/user/modules/user-operate.vue:11-20

```vue
/** * 用户新增 / 编辑弹窗（P3-03）。 * * 与 `api-operate.vue` 同形，额外两处： * -
密码只在新增时必填（`manage.user.createPasswordRequired`），编辑留空表示不改； * - 角色用 `SSelect multiple`，选项来自
`GET /api/role/all`。 * * 空串 → `null` 的还原在提交时统一做：表单一律用空串表达"未填"（`SInput` * 的 `modelValue` 是
`string`），后端 DTO 的可选字段是 `string | null`。 */
```

### N-333 · src/pages/manage/user/modules/user-operate.vue:26-31

```vue
/** * 正在编辑的用户的角色 id 列表。 * * 由列表页从行数据带过来：`GET /api/user/:id` 不返回角色关联（只有列表行 * 带
`roles: [{id}]`），若在这里再查列表会多打一次请求且要处理分页。 */
```

### N-334 · src/pages/manage/user/modules/user-search.vue:10-15

```vue
/** * 用户搜索卡（P3-03）。 * * `useForm` 在这里调用（`SFormField` 靠它的 `provide` 解析字段类型）， *
提交/重置后把值交给父级页面去合并进表格 query。 */
```

### N-335 · src/pages/multi-menu/first/second-new/index.vue:10-15

```vue
/** * 多级菜单演示 · 二级（有子菜单）（P3-10）。 * * 「有子菜单的二级」在文件式路由里没有额外语法：一条平级记录 +
`menuParent` * 指回一级即可，树形菜单会自动把它渲染成可展开的分组（`children` 非空）。 */
```

### N-336 · src/pages/multi-menu/first/second-new/third/index.vue:10-18

```vue
/** * 多级菜单演示 · 三级（P3-10）。 * * `menuParent: 'MultiMenuFirstSecondNewIndex'` 指回「二级（有子菜单）」——
三级嵌套 * 因此成立：一级 › 二级 › 二级(有子) › 三级，本页是第二级分组的子项。 * * 注意父名取的是 ubean
由目录链推导的路由名（`/multi-menu/first/second-new` → * `MultiMenuFirstSecondNewIndex`），不是文件名拼音。 */
```

### N-337 · src/pages/multi-menu/index.vue:7-13

```vue
/** * 多级菜单演示 · 一级（P3-10）。 * * 菜单树形（一级 › 二级 › 二级(有子) › 三级）由 `meta.menuParent` 声明建出， *
侧栏会在本项下展开两级子菜单 —— 这就是 v2「多级菜单」演示的等价行为， * v3 用文件目录 + 显式父声明表达（ubean 的
`PageMeta` 没有嵌套语法）。 */
```

### N-338 · src/pages/multi-menu/index.vue:27-34

```vue
/** * 多级菜单演示 · 一级（P3-10，v3 §4.6「保留（文件目录天然表达）」）。 * *
四个页面在磁盘上是平级的（文件式路由不产生嵌套），层级靠 * `meta.menuParent` 显式声明而不是从 path 前缀猜：前缀推断会把
`/manage/*` * 八套管理页也折叠进一个大目录，那是导航结构的改变，不该由演示页决定。 * 建树在
`src/store/modules/menu/index.ts` 的 `buildStaticMenuTree()`。 */
```

### N-339 · src/pages/multi-menu/modules/multi-menu-panel.vue:9-20

```vue
/** * 多级菜单演示的共享内容块（P3-10）。 * * 四个页面（一级 + 二级 + 二级(有子) + 三级）是同一模板的四份实例， *
收敛成这个组件，避免四份重复的卡片骨架。 * * 层级链由菜单树现算，而不是读路由 —— 证据是**建树结果**： * 菜单是从
`meta.menuParent` 声明出来的，不是从 path 前缀猜出来的。 * * 高亮值与链路同源：`meta.activeMenu`
优先（隐藏子页指回父菜单）， * 与 `src/layouts/default.vue` 的 `activeMenuValue` 同一判据。 */
```

### N-340 · src/pages/plugin/barcode/index.vue:8-13

```vue
/** * 条形码演示（P4-01）。 * * JsBarcode 直接写 SVG 元素的子节点，必须在元素挂载后调用；明暗切换时重新 * 生成 ——
有几组配置用了固定深色，深色背景下会看不见。 */
```

### N-341 · src/pages/plugin/charts/antv/index.vue:11-24

```vue
/**
 * AntV G6 关系图演示（P4-01，v2 `charts/antv/index.vue` 的移植）。
 *
 * 与 v2 的差异：
 * - `window.$message?.success` → `@vean/ui` 的 `toast.success`；
 * - 点击回调用 `event.target.id` 拿节点 id（v2 是
 *   `event.target as unknown as HTMLElement`，把 G6 的图形 `Element` 硬转成
 *   DOM `Element` 再读 `.id` —— 本仓禁 `as T` 断言，而且 G6 的 `Target`
 *   本来就带 `id`，不需要断言）；
 * - G6 的主题色来自 `useTheme()` + `@vean/theme` 的 `resolveTokenColor()`
 *   （G6 要具体颜色值，不能吃 CSS 变量），并跟随明暗模式重算；
 * - `ref<CustomGraphData>() as Ref<CustomGraphData>` 的双重断言 →
 *   `shallowRef<CustomGraphData>({ nodes: [], edges: [] })`。
 */
```

### N-342 · src/pages/plugin/charts/antv/index.vue:33-39

```vue
/** * 取 G6 图形元素的 id。 * * `IPointerEvent['target']` 的类型是 `Target = Document | Element`，而 G6 的 * `Element`
是 canvas 图形对象（不是 DOM 元素），其类型里**没有** `id` —— 但 * 运行时每个图形都有。这里用类型守卫读，避免 `as`
断言（本仓 eslint 禁 `as T`）。 */
```

### N-343 · src/pages/plugin/charts/antv/modules/antv-flow.vue:11-23

```vue
/** * G6 画布容器（P4-01，v2 `modules/antv-flow.vue` 的移植）。 * * 与 v2 的差异： * - `vResizeObserver` 来自
`@vueuse/components`（v3 未安装）→ 改用 * `useElementSize` + `watch`； * - 画布不再用固定
`id="antv-flow"`（一个页面放两个实例就撞 id 了）→ 直接把 * `containerRef` 的元素交给 G6； * - 工具条与图例从 naive-ui
换成 `@vean/ui`（`SButton` / `SPopover` / `SIcon`）， * 图标用 iconify 名而不再是 `icon-*` 组件语法； * - v2 的 `try {}
catch {}` 空捕获换成「元素不在图里就不设选中态」的显式判断； * - 主题色由 `palette` 传入（G6 需要具体颜色字符串，不是
CSS 变量）。 */
```

### N-344 · src/pages/plugin/charts/antv/modules/antv-g6-flow.ts:7-19

```ts
/**
 * AntV G6 流程图（P4-01，v2 `modules/antv-g6-flow.ts` 的移植）。
 *
 * 与 v2 的差异：
 * - 主题色不再从 `useThemeStore()` 取（v3 无该 store），改为构造时传入的
 *   `palette`（`primary` / `destructive` 的完整 CSS 颜色，由调用方从
 *   `@vean/theme` 的 `resolveTokenColor()` + `useTheme()` 状态算出来）——
 *   G6 要的是具体颜色字符串，不是 CSS 变量，所以必须在 Vue 侧解析；
 * - `import type { Canvas } from '@antv/g6/lib/runtime/canvas'` 在本版
 *   **不存在**（g6 5.1.1 无该深路径）→ 从 `@antv/g6` 根导入 `Canvas`；
 * - tooltip 的 HTML 换行由内联样式负责（G6 的 tooltip 挂在 canvas 容器外，
 *   UnoCSS 的类名对它无效，v2 的注释也提到过这点）。
 */
```

### N-345 · src/pages/plugin/charts/antv/modules/antv-g6-flow.ts:165-170

```ts
/**
 * tooltip 的 HTML。
 *
 * G6 把 tooltip 节点插在 canvas 容器的**外层**，UnoCSS 的作用域覆盖不到，
 * 因此这里只能写内联样式（v2 的同名注释也是这个原因）。
 */
```

### N-346 · src/pages/plugin/charts/antv/modules/types.ts:13-19

```ts
/**
 * 流程图节点数据。
 *
 * `NodeData` 自身带 `[key: string]: unknown` 索引签名，所以自定义字段（`name`
 * 等）虽然能写进去，但读出来是 `unknown`。这里把用到的字段显式声明成精确
 * 类型，避免每处取值都要窄化。
 */
```

### N-347 · src/pages/plugin/charts/echarts/index.vue:16-24

```vue
/** * ECharts 演示（P4-01）。 * * 与 v2 的差异： * - 用 v3 的 `useEcharts(target, factory)`（`target` 是模板 ref，v2
是零参版本）； * - 仪表盘时钟的 `setInterval` 只在 `onMounted` 起、`onUnmounted` 清（v2 在 * setup
里直接起，组件报错也照跑）； * - `v2` 的 `min-800px`/`h-400px` 这类长度改成 UnoCSS 的 `h-100`（= 400px）。 */
```

### N-348 · src/pages/plugin/charts/index.vue:6-11

```vue
/** * 图表分组落地页（P4-01）。 * * 分组在侧栏里是一个父节点，点进来要能看到本组全部子页 —— 文件式路由没有 *
「无视图目录」的概念，所以每个分组自己带一个真实页面。 */
```

### N-349 · src/pages/plugin/charts/vchart/data.ts:9-16

```ts
/**
 * 从自定义 mark 的回调上下文里读出画布尺寸。
 *
 * vchart 的 `IModelMarkAttributeContext` 只声明了 `[key: string]: unknown`，
 * 且不对外导出；这里用类型守卫逐层读 `ctx.vchart.getChart().getCanvasRect()`，
 * 避免 `as` 断言（本仓 eslint 禁 `as T`）。取不到时返回 `undefined`，由调用方
 * 决定回退值。
 */
```

### N-350 · src/pages/plugin/charts/vchart/index.vue:14-22

```vue
/** * VChart 演示（P4-01）。 * * 与 v2 的差异：v2 的 `liquid` 与 `circularProgress` 两个演示依赖 *
`registerLiquidChart()` —— 本仓只 `import VChart from '@visactor/vchart'` * （`use-vchart.ts`
里不额外注册图表类型），`vchart-all` 只内建了 * wordCloud / histogram / bar / area 等常用图，液面图与环形进度图在本版 *
**不注册**。因此这里砍掉两个演示，保留 5 个能跑的。 */
```

### N-351 · src/pages/plugin/copy/index.vue:7-12

```vue
/** * 文本复制演示（P4-01）。 * * 分两块：`useClipboard` 手写流程（能看清"复制了什么、失败为什么"）与 * `@vean/ui` 的
`SClipboard` 现成按钮（属性里已带复制态与降级处理）。 */
```

### N-352 · src/pages/plugin/editor/markdown/index.vue:8-17

```vue
/** * Markdown 编辑器（vditor，P4-01）。 * * 与 v2 的差异： * - `useThemeStore().darkMode` → `@vean/ui` 的
`useTheme().effectiveMode`； * - v2 用 `watch(..., v => vditor.setTheme(...))` 但**在 `onUnmounted` 里才停 * 监听**，且
`vditor` 引用没销毁（编辑器实例与 DOM 一起泄漏）→ 这里统一在 * `onUnmounted` 销毁实例、停 watch； * - vditor
的主题切换是命令式的（`setTheme`），不会自己跟着 CSS 变量走。 */
```

### N-353 · src/pages/plugin/editor/rich-text/index.vue:7-16

```vue
/** * 富文本编辑器（wangEditor，P4-01）。 * * 与 v2 的差异： * - 主题由 CSS 变量接管：把工具栏与编辑区的背景改成
`inherit`，容器跟着 * `@vean/ui` 的 `--vean-card` 走，不用再单独判断明暗； * - `z-index` 从 10 提到
`var(--vean-z-toast)` 之下 —— 下拉面板要盖住卡片， * 但不能盖住 toast； * - v2 没销毁实例 → 这里 `onUnmounted` 调
`destroy()`。 */
```

### N-354 · src/pages/plugin/excel/index.vue:10-20

```vue
/** * Excel 导出演示（P4-01）。 * * 与 v2 的差异： * - 数据来自**真实接口**（`/api/user/list`，一次取 100 条 —— 服务端
`size` 上限 100）， * 不是假数组 —— * 导出的表格就是用户管理页看到的东西； * - xlsx 的 `aoa_to_sheet`
需要纯文本二维数组，枚举值（启用状态）先经 i18n * 转成可读文案再写入，否则导出的是 `Y` / `N`； * - `!cols`
宽度按各列字符数估算，不写死像素。 */
```

### N-355 · src/pages/plugin/gantt/dhtmlx/index.vue:10-22

```vue
/** * DHTMLX 甘特图演示（P4-01，v2 `gantt/dhtmlx/index.vue` 的移植）。 * * 与 v2 的差异： * - `NCard` + `#header-extra`
里的 `NTabs type="segment"` → `SCard` 的 `extra` 槽 * + `SSegment`（`items` 是 required，`v-model:modelValue` 直接是
`TimeType`）； * - 时间粒度切到别的页签再回来时会重建 —— dhtmlx 的 `zoom` 扩展是**全局单例** * （挂在 `gantt.ext`
上），多个实例互相覆盖，所以这里 `onUnmounted` 里清掉 * DOM 内容，避免残留状态； * - 任务条 / 表格文案来自 `t()`（v2
是硬编码中文）。 * * 注意：dhtmlx-gantt 的 `gantt` 是模块级单例，一个页面只应实例化一次。 */
```

### N-356 · src/pages/plugin/gantt/vtable/index.vue:11-21

```vue
/**
 * VTable Gantt 的三种用法（P4-01，v2 `views/plugin/gantt/vtable/index.vue` 的移植）。
 *
 * 与 v2 的差异：
 * - `useThemeStore().darkMode` → `useTheme().effectiveMode`（v3 无 theme store）；
 * - 去掉全部 `any` 与 `as` 断言：`format` 收 `DateFormatArgumentType`，
 *   `customLayout` 收 vtable 的 `CustomRenderFunctionArg` / gantt 的
 *   `TaskBarCustomLayoutArgumentType`，容器 ref 用 `useTemplateRef<HTMLElement>`；
 * - 三个实例在 `onUnmounted` 里 `release()`（v2 只停 watch，没释放 canvas）；
 * - `NSpace` / `NCard` / 全局 `WebSiteLink` → `SCard` + `PluginDocLinks`。
 */
```

### N-357 · src/pages/plugin/icon/index.vue:6-13

```vue
/** * 图标展示（P4-01）。 * * v2 用 `SvgIcon` + 本地 svg collection + `CustomIconSelect`；v3 没有本地 svg *
集合（也没有自定义图标选择器组件），所以这里只做两件事： * 1. 用 `@vean/ui` 的 `SIcon`（内含 `@iconify/vue`）铺一个
iconify 图标网格； * 2. 给出「怎么用」的代码片段 —— 复制即用，比一个只能看的选择器更有价值。 */
```

### N-358 · src/pages/plugin/index.vue:6-15

```vue
/** * plugin 演示总入口（P4-01，v3 §5.8）。 * * 侧栏里 plugin 是一棵树（分组靠
`meta.menuParent`），本页只是给「点父级菜单」 * 之外的入口一个可用落地页：按分组列出全部子页，点击直达。 * * 链接清单与
`src/pages/plugin/**` 一一对应；这里刻意用静态数组而不是从 * `router.getRoutes()` 反查 ——
演示页的导航顺序是人工编排的，反射出来的 * 顺序会跟着 meta.order 变，反而不稳定。 */
```

### N-359 · src/pages/plugin/map/components/baidu-map.vue:6-12

```vue
/** * 百度地图（P4-01）。 * * `window.HOST_TYPE = '2'` 是百度 GL 分支的开关，必须在脚本加载**前**设置； * v2
把它写在模块顶层（import 时执行）—— 这是对的，但副作用发生在模块求值期。 * 这里保留同一时机，并靠 `map-sdk.d.ts` 里的
`Window` 声明让它有类型。 */
```

### N-360 · src/pages/plugin/map/components/gaode-map.vue:6-11

```vue
/** * 高德地图（P4-01）。 * * SDK 是 UMD 包，`useScriptTag` 注入后从全局 `AMap` 取构造器；类型见 *
`map-sdk.d.ts`。脚本按 URL 去重，三个地图组件切换时不会重复注入。 */
```

### N-361 · src/pages/plugin/map/components/tencent-map.vue:6-11

```vue
/** * 腾讯地图（P4-01）。 * * `new TMap.Map(...)` 的实例没有后续操作，因此故意不赋值 —— 加上 * `no-new`
抑制注释说明这是有意为之（否则 lint 会拦）。 */
```

### N-362 · src/pages/plugin/map/index.vue:8-16

```vue
/** * 地图插件（P4-01）。 * * 与 v2 的差异： * - `NTabs type="line"` → `STabs`（`items` 必填，面板内容走 `#content`
插槽）； * - 地图容器给固定高度：三方 SDK 都要**有尺寸的**容器才肯渲染，v2 靠布局撑满， * 这里写死 `h-150` 避免在无
`h-full` 上下文的页面里塌成 0； * - SDK 加载与地图实例由各子组件自己管（`useScriptTag` 按 URL 去重）。 */
```

### N-363 · src/pages/plugin/map/index.vue:27-32

```vue
/** * 三张地图，值为 SDK 名。 * * 三个子组件都会挂载（`STabs` 的内容面板按 `hidden` 切换），地图 SDK 各自注入； *
`useScriptTag` 内部按 `script[src]` 去重，切换 tab 不会重复下载。 */
```

### N-364 · src/pages/plugin/map/map-sdk-globals.d.ts:1-11

```ts
/**
 * 地图 SDK 的全局类型声明（P4-01）。
 *
 * 三个 SDK 都是通过 `<script>` 注入的 UMD 包，挂在全局作用域上、**没有 npm
 * 类型包**。这里只声明地图页真正用到的构造器与方法，够用就好；不要让
 * `@types/*` 这类依赖为了三个演示页进入依赖树。
 *
 * 注意：这些名字必须写在 `declare global` **里面**。文件末尾有 `export {}`，
 * 所以文件本身是模块；写在模块作用域的 `declare const` 只是模块局部变量，
 * 组件里看不到。
 */
```

### N-365 · src/pages/plugin/map/map-sdk.ts:1-9

```ts
/**
 * 地图演示用的 JS SDK 直连地址（P4-01）。
 *
 * v2 把这些放在 `src/constants/map-sdk.ts`，但只有 plugin 地图页用得到 —— 放在
 * 插件模块内，避免 `src/constants/**` 被 plugin 的第三方细节污染。
 *
 * ⚠️ 这里的 key 是沿用 v2 的公开 demo key，仅够演示页用；真实项目请换自己的 key
 * 并改用环境变量注入。
 */
```

### N-366 · src/pages/plugin/modules/plugin-doc-links.vue:6-11

```vue
/**
 * 演示页的「外部链接」行（P4-01）。
 *
 * v2 的 `GithubLink` / `WebSiteLink` 是全局注册的自定义组件，v3 没有这套全局
 * 组件；这里收成一个局部组件，免得每个插件页各写一遍 `<a>` 结构。
 */
```

### N-367 · src/pages/plugin/modules/plugin-group.vue:5-13

```vue
/** * 分组落地页的公共列表（P4-01）。 * * `/plugin/charts`、`/plugin/editor`、`/plugin/gantt`
三个分组页在侧栏里是父节点， * 点进去看到的只是「本组有哪些页」，结构完全一样 —— 收成一个组件。 * * 文案由调用方传入
`t()` 的结果（本仓 `test/specs/scripts/remove-i18n.test.ts` 禁动态 i18n key， * 子组件里不能再 `t(props.key)`）。 */
```

### N-368 · src/pages/plugin/pdf/index.vue:7-17

```vue
/** * PDF 预览（P4-01）。 * * 与 v2 的差异： * - v2 的 `useLoading` 来自 `@sa/hooks`（v3 无此包）→ 换本地 `ref`； * -
`NSkeleton text :repeat="12"` → `v3` 的 `SSkeleton` 没有 `text`/`repeat`， * 改为手写 12 个骨架条； * - `ButtonIcon
tooltip-content="…"` → `SButtonIcon` 没有 `tooltipContent`， * 外面套 `STooltip`； * - `NPagination
page-count/page-size` → `SPagination total/pageSize`。 */
```

### N-369 · src/pages/plugin/pinyin/index.vue:9-18

```vue
/**
 * 拼音标注演示（P4-01）。
 *
 * v2 用 `pinyin-pro` 的 `html()` 生成带 `<span>` 的字符串，再过 `dompurify`
 * 后 `innerHTML` 写入。v3 不引 dompurify（多一个依赖只为洗一个自己生成的
 * 字符串，不划算），改成 `pinyin(text, { type: 'all' })` 拿结构化结果，用
 * 模板渲染 —— 没有 innerHTML 就没有 XSS 面，也不需要 sanitize。
 *
 * 非中文字符的 `pinyin` 为空串，此时只渲染原文（否则会在英文字母上方留空行）。
 */
```

### N-370 · src/pages/plugin/print/index.vue:7-12

```vue
/** * 打印演示（P4-01）。 * * print-js 两种模式：`type: 'json'` 用 `properties` 指定列打印表格， * `type: 'image'`
打印图片列表。都靠新建 iframe 完成，无需额外处理。 */
```

### N-371 · src/pages/plugin/swiper/index.vue:7-16

```vue
/** * 轮播示例（P4-01）。 * * 与 v2 的差异： * - 只留一个轮播实例 + `SSegment` 切换配置（v2 是 8 张卡竖排，滚动太长）；
* - `SwiperCore.use` 的全局注册改为组件级 `modules`，避免污染其它页面的 chunk； * - `NCard/NSpace` → `SSegment` +
UnoCSS； * - `v-bind="options"` 会被 Swiper 的 props 类型拒绝（Swiper 的 props 是逐个 * 声明的，不接受任意对象）→
显式展开成独立 prop。 */
```

### N-372 · src/pages/plugin/typeit/index.vue:10-15

```vue
/** * 打字机演示（P4-01）。 * * TypeIt 实例持有内部定时器，必须 `destroy()`；v2 版本只 `.go()` 没销毁， *
离开页面后循环动画还在跑。这里补上卸载清理。 */
```

### N-373 · src/pages/plugin/video/index.vue:8-13

```vue
/** * 视频播放器演示（P4-01）。 * * xgplayer 的样式是独立 CSS 文件，必须显式引入；播放器实例要 `destroy()`， *
否则离开页面后 video 元素与事件监听会留在 DOM 里。 */
```

### N-374 · src/pages/plugin/vtable/data.ts:1048-1054

```ts
/**
 * Pivot Table 的数据（P4-01）。
 *
 * v2 是运行时 `fetch('https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/North_American_Superstore_Pivot_data.json')`
 * —— 演示页依赖外部 CDN 会在离线 / 内网环境下白屏。这里改为构建期抽样落地的
 * 静态数据（450 行，覆盖 3 个 Category × 50 个 City × 3 个指标）。
 */
```

### N-375 · src/pages/plugin/vtable/data.ts:1508-1515

```ts
/**
 * Pivot Chart 的数据（P4-01）。
 *
 * v2 是运行时 `fetch('...North_American_Superstore_Pivot_Chart_data.json')`（1.6MB），
 * 这里改为构建期分层抽样后的静态数据（216 行 = 9 个 Segment-Indicator × 4 个
 * Region × 3 个 Category × 2 行），保证 9 个图例项都能出现。每行只带自己那一个
 * 指标列（Quantity / Sales / Profit 之一），与 v2 远程数据的形状一致。
 */
```

### N-376 · src/pages/plugin/vtable/index.vue:34-45

```vue
/**
 * VTable 四种表格形态的演示（P4-01，v2 `views/plugin/vtable/index.vue` 的移植）。
 *
 * 与 v2 的差异：
 * - `useThemeStore().darkMode` → `useTheme().effectiveMode`（v3 无 theme store）；
 * - 两张 pivot 表的 records 从远程 fetch 改为本地静态数据（演示页不该依赖外部
 *   站点可用性，也避免演示页偷偷发请求）；
 * - 去掉 `any` / `as` 断言：`@visactor/vue-vtable` 的表格组件类型是
 *   `DefineComponent<Record<string, never>, ...>`（props / emits 全无类型），
 *   所以模板属性不参与类型检查，实例方法改用运行时类型守卫；
 * - `NSpace` / `NCard` / 全局 `WebSiteLink` → `SCard` + `PluginDocLinks`。
 */
```

### N-377 · src/pages/plugin/vtable/index.vue:139-144

```vue
/** * 分组标题背景色。 * * `args.table` 是表格实例，`getGroupTitleLevel(col, row)` 给出该单元格所处分组 * 层级（0
起），据此在取色池里轮转。层级取不到时用白色兜底。 */
```

### N-378 · src/pages/user-center/modules/password-form.vue:9-17

```vue
/** * 修改密码卡（个人中心）。 * * `changePasswordFormSchema` 用 `v.forward(v.partialCheck(...))` 做「两次输入一致」 *
的跨字段校验 —— 与登录页注册表单同一写法；错误键落在 `confirmPassword` 上， *
所以模板里只需渲染三个字段，不需要额外的手写比较。 * * 成功后不强制登出（后端旧 token 仍有效），只清空表单提示用户。 */
```

### N-379 · src/pages/user-center/modules/profile-card.vue:9-14

```vue
/** * 用户信息概览卡（个人中心左侧）。 * * 只读视图 —— 可编辑字段在右侧表单里，这里刻意不重复渲染输入控件，避免同一 *
份数据出现两个真相源（改表单后卡片不刷新、或卡片改了表单不认）。 */
```

### N-380 · src/pages/user-center/modules/profile-card.vue:24-30

```vue
/** * 水合前一律 `undefined`（服务端读不到 `localStorage`，见 * `@/composables/use-hydrated`）。 * *
卡片里**每一处**用户字段都走它，而不是直接用 `user` —— 名字/邮箱/角色标签 * 任意一处漏掉都会报 `Hydration text content
mismatch`。挂载后自动变为真值。 */
```

### N-381 · src/pages/user-center/modules/profile-card.vue:35-41

```vue
/** * 服务端 / 水合前一律 `'U'`。 * * `userInfo` 来自 `localStorage`，服务端读不到 —— 直接用真值会让 SSR 渲染 *
`'U'`、水合渲染 `'超'`，报 `Hydration attribute mismatch`（见 * `@/composables/use-hydrated`）。 */
```

### N-382 · src/pages/user-center/modules/profile-form.vue:11-21

```vue
/** * 个人资料编辑卡（个人中心）。 * * 复用点：schema 来自 `@/schema/profile`（`profileFormSchema`），提交时经 *
`toUpdateProfilePayload` 把空串转 `null` 再交给 `PUT /api/auth/profile` * —— 校验规则与后端 `profileUpdateSchema`
是同一份代码（P3-05 的 StandardSchema 复用范式）。 * * 回填走 `form.reset(values)`：`useForm` 的 `defaultValues`
在组合时固化， * TanStack 的 `reset` 才会一并替换 `defaultValues`（否则「取消后回到初值」会回到 * 首次挂载时的旧快照）。
*/
```

### N-383 · src/pages/user-center/modules/profile-form.vue:27-34

```vue
/** * 是否已完成客户端挂载。 * * 表单初值来自 `localStorage` 里的用户信息，服务端读不到 —— 不门控就是 SSR * 渲染空
`value`、水合渲染真值，报 `Hydration attribute mismatch ... value=""` * （见
`@/composables/use-hydrated`）。门控后首屏两侧都是空值，挂载后再回填 * （下面的 `watch` 会跟着重新 `reset`）。 */
```

### N-384 · src/pages/user-center/profile.vue:6-12

```vue
/** * 个人中心 · 资料（P3-09）：左侧身份概览 + 右侧资料编辑与修改密码。 * * 为什么不用页签把「资料 /
密码」拆成两个视图：两块内容都不长，并排滚动比来回切 * 页签少一次记忆负担（用户改完资料常顺手想改密码）。settings
侧内容体量更大且 * 互不相关，才用 `STabs` 折叠。 */
```

### N-385 · src/pages/user-center/profile.vue:16-22

```vue
/** * 个人中心 · 资料页。 * * `hideInMenu: true`：个人中心从右上角头像下拉进入，不进侧边菜单 *
（菜单是「按职责分区」的导航，个人中心是「当前用户」的附属入口）。 * 两个子页互为平级，用切换按钮而非菜单表达。 */
```

### N-386 · src/pages/user-center/settings.vue:15-24

```vue
/** * 个人中心 · 设置（P3-09）。 * * **直接复用主题抽屉的四个面板组件**，不抄一遍二十多个开关：抽屉里的面板本就 *
没有抽屉依赖（各自只读 `themeStore`），所以同一份配置清单可以同时出现在 *
抽屉和整页两种容器里。这样新增一个主题配置项只需改一处，两边自动同步。 * * 差异只在容器：抽屉是 `SDrawer`，这里是
`SCard` + `STabs`；抽屉的 Tab 组件 * 用 `unmount-on-hide=false` 保持状态，这里同样设置，避免来回切 Tab 丢失滚动位置。 */
```

## scripts

### N-387 · scripts/dependency-manifest.ts:1-15

```ts
/**
 * 构建期依赖清单（about 页数据源，P3-08）。
 *
 * 为什么在 **Node 侧** 解析而不是在浏览器里：
 * 版本号的真实值只存在于 `pnpm-workspace.yaml` 的 `catalog` 段，解析它要带一个
 * YAML 解析器（`yaml` 约 30 kB gzip）。把解析搬到构建期，产物里只剩最终表格
 * 数据（`vite.config.ts` 通过 `define` 注入 `__DEPENDENCIES__`），`yaml` 也就
 * 只需要是开发依赖。
 *
 * 数据来源两处：
 * - `package.json` 的 `dependencies` / `devDependencies`（声明范围，多数是 `^x.y.z`）
 * - `pnpm-workspace.yaml` 的 `catalog` / `catalogs`（`catalog:` 协议的落点）
 *
 * 该模块只被 `vite.config.ts`、`vitest.config.ts` 与本目录测试引用，不进客户端图。
 */
```

### N-388 · scripts/dependency-manifest.ts:54-59

```ts
/**
 * 从任意值里读一个「字符串 → 字符串」对象字段。
 *
 * 缺失 / 类型不符 / 值非字符串时逐项跳过，永不抛错 —— YAML 与 package.json 都是
 * 外部数据，一处手写错误不该让整条构建流程挂掉。
 */
```

### N-389 · scripts/dependency-manifest.ts:76-80

```ts
/**
 * 从任意值里读一个「字符串 → 字符串记录」的两层对象字段（`catalogs.<name>`）。
 *
 * 非对象分支整体跳过（不产出空对象），保持结果只含真实存在的 catalog。
 */
```

### N-390 · scripts/dependency-manifest.ts:114-123

```ts
/**
 * 把 `package.json` 里的依赖版本声明解析成展示值。
 *
 * - 裸 `catalog:` → 按**包名**查默认 catalog（pnpm 的裸协议即「这个包在默认
 *   catalog 里的版本」）。
 * - `catalog:<name>` → 查该具名 catalog 里的同名包。
 * - 查不到 → 保留原串（宁可在页面上看到 `catalog:`，也不编造版本号）。
 * - 其余（`^1.2.3` / `npm:xxx@latest` / git 地址）原样显示：它们表达的是声明
 *   范围而非安装结果，改写反而失真。
 */
```

### N-391 · scripts/menu-sync.ts:7-34

```ts
/**
 * `pnpm menu:sync` —— 用页面文件补齐 `src/menus/menus.json`（文档 §5 的 P1）。
 *
 * 菜单源数据是人写的（层级、标题、图标、排序都是审美决定），但「哪些页面
 * 存在、路径是什么」是机器事实。本脚本只做这两件事之间的对账：
 *
 * - **新增**：页面有 `definePage` 标题却不在菜单里 → 追加一行（`order` 留
 *   `DEFAULT_ORDER` 待人工排）。
 * - **刷新派生字段**：`routePath` / `routeComponent` 从页面文件重算。这两个
 *   必须与文件系统一致，否则 `router.push` 跳错页 —— 所以它们不接受人工覆盖。
 * - **绝不改**：已有条目的 `name` / `icon` / `i18nKey` / `order` / `parentId` /
 *   各开关，一个字段都不动。
 * - **绝不删**：路由消失的条目只打警告并列出来，由人决定删还是留（可能是
 *   页面临时下线）。
 *
 * 「页面是否该进菜单」的判据（`hideInMenu` / `blank` 布局 / `requiresAuth: false`
 * / 无标题）在 `src/store/modules/menu/shared.ts` 与这里各有一份，两者必须一致 ——
 * 前者管运行时，后者管生成期。**不抽公共模块是刻意的**：本脚本要能被普通
 * `node` 直接执行，而 `@/` 别名模块（`@/schema/menu` 等）在 Vite 之外解析不了，
 * 抽出去就得多加一层构建步骤，不值得。
 *
 * 为什么不写机器产物 `_generated.json`（文档 §5.1 约束②）：那条约束要防的是
 * 「单文件双写导致人工字段被覆盖」。这里已经用「只写派生字段 + 只追加」把风险
 * 消掉了，多一个文件反而让「菜单到底在哪」变成两个地方。
 *
 * 运行方式：`node scripts/menu-sync.ts`（Node 原生 TS，无需构建）。因此**不能
 * import `@/` 别名模块** —— 下面的 `snake` 与字段清单是本脚本自带的副本。
 */
```

### N-392 · scripts/menu-sync.ts:36-42

```ts
/**
 * 与 `src/store/modules/menu/shared.ts` 的 `AppMenu` 对齐的字段顺序。
 *
 * 覆盖 `src/db/schema/menu.ts` 的全部列（除 `enabled` —— 那是 DB 的运行时状态，
 * 不该由菜单源文件管），这样手写的 `routeRedirect` / `routeQueries` / `description`
 * 等可选字段也能安全回写，不会被本脚本砍掉。
 */
```

### N-393 · scripts/menu-sync.ts:163-168

```ts
/**
 * 执行一次对账并写回 `src/menus/menus.json`。
 *
 * 抽成函数是为了让 P2 （`vite.config.ts` 的插件，监听
 * `src/pages/**` 变更）能直接复用，而不是再写一份。
 */
```

### N-394 · scripts/menu-watch.ts:4-20

```ts
/**
 * `menu:watch`（文档 §5.3 的 P2 / M-13）—— dev 期页面文件变更时自动跑 `pnpm menu:sync`。
 *
 * 只监听 `src/pages/**` 的**新增 / 删除 / 重命名**（`add` / `unlink`），因为只有这三类
 * 会改变「有哪些页面」这个机器事实。`change` 不触发：改标题/图标是人的审美决定，
 * 工具本来就不该覆盖（脚本的「只写派生字段」规则），而且每次存盘都扫全量页面太浪费。
 *
 * **必须防抖**：编辑器保存一次可能触发多个事件（尤其重命名 = unlink + add），
 * 且 `syncMenus` 要跑 `scanPages` 全量扫描。300ms 合并成一次。
 *
 * **必须防自触发**：`syncMenus` 写回 `src/menus/menus.json`，它不在 `src/pages/**`
 * 下所以不会自己触发自己；但如果将来把菜单源挪进页面目录，这个 watcher 会成环。
 *
 * 不接 `ubean.config.ts` 的 `modules`：那条路只在 `ubean build` CLI 的
 * `prepareBuild` 里被 `resolveModules` 解析，`vp dev`（裸 Vite）走的是
 * `vite.config.ts` 的 plugins —— 实测 `modules: [...]` 在 `vp dev` 下**完全不执行**。
 */
```

### N-395 · scripts/remove-i18n.ts:2-29

```ts
/**
 * `pnpm remove:i18n` —— 一键裁剪国际化（v3 §4.5「保留 `remove-i18n` 裁剪脚本」）。
 *
 * 给不需要多语言的模板用户用：把 `src/**` 里 `t('key')` / `$t('key')` 的**字面量
 * 调用**就地替换成默认语言（`src/constants/index.ts` 的 `DEFAULT_LOCALE`）文案，
 * 再拆掉 i18n 基础设施（`src/locales/`、`src/shared/vean-locale.ts`、
 * `ubean.config.ts` 的 `i18n` 段、语言切换 UI、`useI18n()` 装配）。
 *
 * 定位：**只处理可机械判定的部分**，跑完打印剩余人工项并以非 0 退出码收尾，
 * 让人工项永远可见（宁可报出来，也不要静默改错）。默认 dry-run，`--write` 才落盘。
 *
 * 处理范围：
 * 1. 字面量 `t('a.b')` → `'文案'`；带参 `t('a.b', { name })` → `` `文案：${name}` ``；
 * 2. 常量表里的 `label: 'a.b'` → 文案，并解包 `t(item.label)`（常量表把取值与
 *    展示文案放在同一条记录里，只能逐字段内联，不能整表删）；
 * 3. `*TitleKeys` 常量表（`Record<K, string>` 的 i18n key 表）→ `*Titles` 文案表，
 *    并把 `t(activeTitle)` 这类「t 包一个已翻译变量」的解包；
 * 4. 基础设施文件删除 + `app.ts` / `app.vue` / 布局 / 登录壳的定点改写（见 FILE_RULES）；
 * 5. 残留扫描：`useI18n`、动态 `t(…)`、`@/shared/vean-locale`、`setLocale` 等。
 *
 * 不处理（有意留下）：`i18nKey` / `title` 字段本身 —— 它们是数据（可来自后端菜单），
 * 去掉解析后就是普通文本字段，删字段属于业务改造，不在本脚本职责内。
 *
 * 用法：
 *   pnpm remove:i18n            # dry-run，只打印计划
 *   pnpm remove:i18n --write    # 落盘
 *   node scripts/remove-i18n.ts --root /tmp/copy --write
 */
```

### N-396 · scripts/remove-i18n.ts:41-47

```ts
/**
 * 残留扫描的「活跃 i18n API」模式。
 *
 * 只报「引用即报错」的东西：纯数据字段（`i18nKey` / `title` / `AppLocale`）与
 * 常量表（`APP_LOCALES` / `APP_LOCALE_LABELS` / `DEFAULT_LOCALE`）不算 —— 它们
 * 删掉解析后就是普通数据，留着无害，删字段属于业务改造。
 */
```

### N-397 · scripts/remove-i18n.ts:56-62

```ts
/**
 * 有意保留 `useI18n` 装配的文件（相对仓库根，POSIX 分隔）。
 *
 * `src/pages/plugin/**` 是第三方库集成示例页：它们整体保留、只是被 code-split，
 * 页面标题/说明走静态 `t('plugin.x')` 字面量属于产品行为，不做文案内联。
 * 与 `KEPT_ON_PURPOSE` 的区别：这里豁免的是「删掉会改变页面表现」的活代码。
 */
```

### N-398 · scripts/remove-i18n.ts:147-152

```ts
/**
 * 把源码里的字面量 `t('key')` / `$t('key')` 替换成文案。
 *
 * 只认字面量 key（含可解析的第二个参数对象）：动态 key（`t(meta.i18nKey)`）留给
 * `FILE_RULES` 的定点规则或人工处理 —— 机械替换猜不出运行时值。
 */
```

### N-399 · scripts/remove-i18n.ts:182-186

```ts
/**
 * i18n key 表 → 文案表：`const moduleTitleKeys: Record<K, string> = { a: 'x.y' }`
 * 变成 `const moduleTitles: Record<K, string> = { a: '文案' }`，并解包
 * `t(activeTitle…)`（该变量此后已经是文案，再包一层 `t()` 就错了）。
 */
```

### N-400 · scripts/remove-i18n.ts:235-242

```ts
/**
 * 常量表里的 `label: 'a.b'` → 文案。
 *
 * 选项表（主题抽屉的下拉/分段控件候选）把取值与展示文案放在同一条记录里：
 * `{ value: 'card', label: 'theme.tabVariant.card' }`。取值要留着做持久化，标签要换成
 * 文案，所以只能逐字段内联 —— 判据仍是「文案表里有这个 key」，纯数据字段
 * （`i18nKey` / `title`）不受影响。
 */
```

### N-401 · scripts/remove-i18n.ts:261-267

```ts
/**
 * `t(item.label)` → `item.label`。
 *
 * `inlineLabelFields` 之后 `label` 已经是文案，再包一层 `t()` 会把文案当 key 查
 * （vue-i18n 直接回显 key 并告警）。只解包「以 `.label` 结尾」的实参：
 * `t(node.i18nKey)` 这类真・动态 key 不在本规则职责内，由 `FILE_RULES` 定点处理。
 */
```

## test

### N-402 · test/integration/api.test.ts:1-9

```ts
/**
 * API 集成测试（P1-10，v3 §6.1/§6.3）。
 *
 * 前置：dev server 就绪（global-setup.ts 自起或复用 9527）。
 * 覆盖：健康检查、认证全链路（login/register/refresh/logout/user-info/modify-password）、
 * 图形验证码与验证码登录、重置密码、微信绑定（mock）、
 * RBAC（super 放行、普通用户按权限码）、8 套 CRUD 生命周期、分页/校验/错误归一。
 * 全部断言业务码 `{ code, message, data }` 结构。
 */
```

### N-403 · test/integration/api.test.ts:611-618

```ts
/**
 * 回归背景：中间件原先用具体请求路径拼权限码，`GET /api/user/123` 产出
 * `api:get:(/user/123)`，与登记的 `api:get:(/user/[id])` 永不相等。
 *
 * 这里**不靠 super**（super 在中间件里直接放行、看不到权限码），而是自建
 * 一个普通用户 + 角色 + 接口 + 权限点，走完整 RBAC 链路：普通用户先被拒
 * （`4003`），授权后同一请求放行 —— 若权限码仍用具体路径，授权也不会生效。
 */
```

### N-404 · test/integration/api.test.ts:1076-1081

```ts
/**
 * 多 baseURL 代理（P2-18）。
 *
 * dev 环境把 `default` 指回本进程（`API_PROXY_TARGETS=default=http://127.0.0.1:9527`），
 * 因此这里能真实验证「routeRules.proxy → 上游 → 原样回传」，不需要外部后端。
 */
```

### N-405 · test/integration/auth-hardening.test.ts:1-18

```ts
/**
 * 鉴权加固集成测试（authorization.md §5.1 + §5.2）—— 真实 HTTP。
 *
 * 覆盖两件在单测里测不到、只能端到端验证的事：
 *
 * 1. **enabled 过滤真的生效**：停用角色 / 停用权限点后，请求立刻 4003。
 *    改造前 `getRolesByUserId` 与权限码查询都没有 `enabled='Y'` 条件，停用只是
 *    列表里变灰，鉴权照旧放行 —— 静默失效，最坏的一类 bug。
 *
 * 2. **缓存失效真的即时而完整**：授权 / 撤权 / 停用 / 启用之间来回切换，每一步
 *    下一次请求就必须反映新状态。权限码缓存（§5.2）带 5 分钟 TTL，若写操作漏了
 *    失效，这些断言会以「TTL 内的旧状态」失败 —— 所以每个 `it` 都是一次失效回归。
 *    同一个 token 全程复用：token 里不嵌权限码，状态必须来自服务端。
 *
 * 与 `api.test.ts`（M-06）同一套自建 fixture 手法：不靠 super（super 在中间件里
 * 直接放行，看不到权限码），另建用户 + 角色 + 接口 + 权限点走完整 RBAC 链路。
 * fixture 按 runId 命名，并**先查后建**（权限码全局唯一，跨次运行会撞码）。
 */
```

### N-406 · test/integration/e2e.test.ts:5-20

```ts
/**
 * 真实浏览器回归（P4-02，v3 §5.9 中必须在真 DOM 里验证的部分）。
 *
 * 覆盖（这些能力在 node/jsdom 下测不到）：
 * - **应用能渲染**：P4-02 之前 `/login` 会无限重定向（`requiresAuth: false` 被
 *   ubean 生成器丢弃），headless Chrome 渲染进程 100% CPU 卡死，`page.evaluate()`
 *   永久挂起 —— 看起来像「浏览器环境不可用」，实为应用 bug。本用例的
 *   `gotoAndRead` 超时断言就是那条结论的回归保护。
 * - **登录成功 notification**（`toast.success`）。
 * - **页签持久化 + 跨用户清页签**（真 localStorage + 真路由跳转）。
 * - **主题设置生产缓存**（写 `theme-settings` → reload → `<html>` filter 生效）。
 * - **错误提示去重**：一次失败登录只应出现一条后端文案，且不应出现英文兜底。
 *
 * ⚠️ **需要本机有 Playwright 浏览器**。CI（ubuntu，无浏览器安装步骤）会整体跳过；
 * 纯逻辑 / 静态守卫的回归在 `test/specs/**` 的单测里，CI 必跑。跳过时不影响门槛。
 */
```

### N-407 · test/integration/e2e.test.ts:58-64

```ts
/**
 * 打开页面并**等到水合完成**。
 *
 * 必须等：ubean 是 SSR，首屏 HTML 里的 `<input>` 在客户端水合前**没有**
 * `v-model` 绑定 —— 那时 `fill()` 写进去的值不会被 Vue 感知（水合还可能把它
 * 覆盖回去），点提交自然什么都不发生。`networkidle` 覆盖水合期的 chunk 拉取。
 */
```

### N-408 · test/shared/api-client.ts:4-12

```ts
/**
 * 集成测试共用的 HTTP 客户端（`test/integration/**`）。
 *
 * `test/global-setup.ts` 自起（或复用）dev server 后把实际地址写进
 * `test/baseUrl.txt`，这里读它 —— 因此用例不硬编码 9527，也不管是自起还是复用。
 *
 * 所有端点经响应包装中间件输出统一信封 `{ code, message, data }`（v3 §6.1），
 * 所以 `api()` 直接按信封类型收，`okData()` 断言业务码 `0000` 并取出 `data`。
 */
```

### N-409 · test/shared/api-client.ts:20-25

```ts
/**
 * 发起一次 API 请求，返回 HTTP 状态码 + 已解析的信封。
 *
 * 注意：**不断言状态码**。后端对业务失败也返回 200 + 非 `0000` 业务码，
 * 只有未认证/路由不存在等才用 HTTP 码，所以断言留给用例自己按需写。
 */
```

### N-410 · test/specs/components/global-search.test.ts:10-15

```ts
/**
 * P2-11：全局搜索的数据整形守卫。
 *
 * 菜单树是唯一数据源：目录节点（无 `path`）必须被排除、父子顺序必须稳定
 * （分组顺序 = 首次出现顺序），否则搜索结果会出现「点进去 404 的目录项」。
 */
```

### N-411 · test/specs/composables/use-manage-options.test.ts:5-16

```ts
/**
 * 「全部」哨兵值的边界转换。
 *
 * 背景：`@vean/aria` 把**空串**保留给「未选择」语义（`shouldShowPlaceholder`
 * 判定 `isNullish(v) || v === '' || []`，且 `SelectItem` 在 `setup` 里对
 * `value === ''` 直接抛错）。搜索表单的数据层却一直以空串表示「全部」，两者
 * 冲突。折中办法是渲染层换一个非空哨兵值，只在提交边界转换 ——
 * 转换一旦错位，要么控制台满屏报错（空串漏进 `SSelect`），要么请求带上
 * `enabled=` 这类空参数（哨兵值漏进 query）。
 *
 * 这两个函数是唯一的转换点，因此必须双向可逆，且对真实值零影响。
 */
```

### N-412 · test/specs/composables/use-table-operate.test.ts:5-10

```ts
/**
 * `useTableOperate`（P3-02）：表格交互范式。
 *
 * 只测纯逻辑部分 —— operate 弹窗开关、选中集、查询重置、分页与 query 的双向
 * 同步。`t()` 只在 `usePageSizeOptions` 里用（需要 setup 上下文），不在覆盖范围。
 */
```

### N-413 · test/specs/constants/manage.test.ts:18-28

```ts
/**
 * 常量层与 schema 层的**值域一致性**护栏（P3-03）。
 *
 * `src/constants/manage.ts` 刻意不 import drizzle / valibot（那会把两份运行时
 * 依赖拉进客户端产物），代价是值域有两份声明：Constants 里一份供客户端渲染，
 * `src/schema/**` 与 `src/db/schema/**` 里一份供校验与服务端。
 *
 * 两份声明一旦漂移，症状是「前端下拉里能选的值，提交时被 valibot 拒绝」——
 * typecheck 看不到（两边都是 `readonly string[]`），只有跑起来才发现。
 * 本文件把那句注释里的承诺变成断言。
 */
```

### N-414 · test/specs/guards/env-flag-guard.test.ts:5-19

```ts
/**
 * ubean 运行时标志（`import.meta.client` / `import.meta.server`）的禁用守卫（P4-02）。
 *
 * **为什么需要这条守卫**：ubean 0.6.0 **从不注入**这两个标志。dev 按需转换的
 * 模块与 `vp build` 的产物里都原样留下 `import.meta.client`，浏览器求值即
 * `undefined`。于是 `isClient()` 这类判据恒假，应用会**静默丢掉所有
 * localStorage 读写** —— token / 用户信息 / 主题设置 / 页签刷新即失，且不报错。
 *
 * 唯一正确的写法是能力检测：`typeof localStorage !== 'undefined'`、
 * `typeof window === 'undefined'`、`typeof document !== 'undefined'`
 * （见 `src/router/guard.ts`、`src/shared/i18n.ts`、`src/utils/storage.ts`）。
 *
 * 这条用例把「一次真实浏览器排查」的结论固化成即时反馈：新增 `import.meta.client`
 * 会在单测阶段就红，而不是等到线上用户反馈「登录状态老丢」。
 */
```

### N-415 · test/specs/guards/import-guard.test.ts:5-17

```ts
/**
 * 客户端图文件的导入纪律（见 docs/v3.md §3.3「导入路径与构建」）。
 *
 * **为什么需要这条守卫**：`ubean` 主入口是聚合 barrel（shared / seo / pages /
 * markdown + Vue 内核 + islands + logger）。客户端模块为了取其中一个小符号而从
 * 它导入时，打包器会把整条聚合链带进客户端产物 —— ubean 官方实测两次：
 * `defineMatcher`（入口 chunk 45.2 → 111.9 kB gzip，+148%）、`schemaOrg`
 * （total +63.7%）。那两次都是 `pnpm analyze:check` 事后抓到的，要等一次完整
 * 构建；这条用例把同一判据变成即时反馈。
 *
 * 判据只看**裸主入口** `ubean`：`ubean/client`（客户端）、`ubean/server`
 * （服务端宏）、`ubean/build`（构建期）、`ubean/vite` 都不拦。
 */
```

### N-416 · test/specs/guards/locale-coverage.test.ts:6-13

```ts
/**
 * i18n key 护栏（P3-03）。
 *
 * `vue-i18n` 在 key 缺失时**不报错**：它把 key 原样渲染到界面上，只有在
 * 跑到那个页面并切到那个语言时才看得见。本仓 8 套 manage 页共享
 * `manage.*` 命名空间，漏一个 key 很容易在评审里滑过去，所以这里把
 * 「源码里出现的每一个 `t('x.y')` 都能在两个语言包里解析到」变成测试。
 */
```

### N-417 · test/specs/guards/page-meta-guard.test.ts:5-30

````ts
/**
 * `definePage` 顶层字段纪律（P4-02）。
 *
 * **为什么需要这条守卫**：ubean 0.6.0 的生成器（`@ubean/vue/dist/generator.js`
 * 的 `renderRouteRecord`）只发射两个顶层字段：
 *
 * ```js
 * if (page.pageMeta?.cache === true) parts.push(`    cache: true`);
 * if (page.pageMeta?.requiresAuth === true) parts.push(`    requiresAuth: true`);
 * ```
 *
 * 其余顶层字段（`requiresAuth: false` 尤其致命）被**静默丢弃**，而且 `cache` /
 * `requiresAuth` 发射在**路由记录顶层**而非 `meta` 里 —— vue-router 只认
 * `route.meta.*`，顶层是未知 key，守卫读不到。
 *
 * 真实后果：`src/router/guard.ts` 用 `to.meta.requiresAuth === false` 判公开页，
 * 顶层 `requiresAuth: false` 丢失后该判定永假 → 未登录访问 `/login` 被重定向到
 * `/login` → 无限重定向，浏览器渲染进程 100% CPU 卡死（Playwright 的
 * `page.evaluate()` 永久挂起，看起来像「浏览器环境不可用」）。
 *
 * 修法是写进 `meta`：`computeMeta()` 是 `const base = page.pageMeta?.meta ?? {}`，
 * 然后整体 `JSON.stringify` —— **`meta` 逐字透传**。
 *
 * `docs/v3.md` §4.2 把 `requiresAuth` 列为 `definePage` 合法顶层字段，与生成器
 * 实际行为不符；本用例以生成器行为为准。
 */
````

### N-418 · test/specs/guards/page-meta-guard.test.ts:39-42

```ts
/**
 * 页面私有目录：`modules/` 装搜索表单 / 操作弹窗等子组件，`components/` 装页面局部
 * 组件。两者都不是页面（ubean 扫描器同样忽略它们），因此不要求声明 `meta`。
 */
```

### N-419 · test/specs/request/factory.test.ts:4-20

```ts
/**
 * 请求层两条「隐形能力」的回归（P4-02，v3 §5.9）。
 *
 * ① **错误提示去重**：`notifyError` 按文案 + 3s 窗口去重。这条能力一旦破掉
 *    不会有类型错误、不会有异常，只是页面上多叠几个 toast —— 所以必须有断言。
 *    真实回归案例（P4-02 修）：`@soybeanjs/fetch` 在 `onBackendFail` 返回空后
 *    会 `throw new BackendError(backendErrorMsg)`，那条错误又走 `onError`，
 *    于是**一次业务失败弹两条文案不同的 toast**；文案不同 → 去重键不同 →
 *    连发时永远命不中窗口。修法是 `onError` 里按 `BACKEND_ERROR_FLAG` 跳过。
 *
 * ② **刷新令牌单飞**：模块级 `refreshPromise` 保证并发过期只发一次 refresh。
 *    没有它，10 个并发 401 会打 10 次刷新接口，后 9 次用已被轮换掉的
 *    refreshToken，直接把用户踢下线。
 *
 * 两条都靠模块级状态（`lastErrorMessage` / `refreshPromise`），所以每个用例
 * 都要 `vi.resetModules()` 拿一份全新的模块实例。
 */
```

### N-420 · test/specs/schema/form.test.ts:13-22

```ts
/**
 * 表单 schema 护栏（P3-03）。
 *
 * 8 套 operate 表单的"schema 加了字段、默认值忘了加"是个静默失败：`useForm`
 * 的 `defaultValues` 少一个键，该键的 `SFormField` 渲染出来就是空且不受控，
 * 只有手点进弹窗才会发现。这里把两件事变成测试：
 * 1. 每个表单的**默认值与 schema 键集合完全一致**（多/少都报错）；
 * 2. 枚举字段复用 `src/schema/_shared.ts` 的**同一个 schema 对象**
 *    （值域若抄两份，会表现成"前端能选、后端 3000"）。
 */
```

### N-421 · test/specs/schema/login-form.test.ts:20-28

```ts
/**
 * P3-05 的核心契约：**登录页表单与服务端共用同一份 valibot 声明**。
 *
 * 断言的是「同一份规则」而非「两份长得像」：表单 schema 通过
 * `...serverSchema.entries` 复用服务端字段对象，所以同一条错误消息必然同源。
 *
 * 每个用例都喂**完整对象**（缺键会先报 `Invalid key: Expected …`，把字段规则
 * 的比较淹掉）。
 */
```

### N-422 · test/specs/schema/profile.test.ts:15-23

```ts
/**
 * 个人中心表单契约测试（P3-09）。
 *
 * 重点不是「valibot 能跑」，而是两条本项目特有的约定：
 * 1. **空串合法**：表单里留空 = 清空该字段，不能在格式校验上被拦（邮箱/手机号）；
 * 2. **前后端共用同一份规则**：`profileUpdateSchema` 就是
 *    `src/routes/api/auth/profile.ts` 的 `validate('json', ...)` 入参，
 *    这里断言它的行为与表单侧一致。
 */
```

### N-423 · test/specs/schema/system.test.ts:5-8

```ts
/**
 * Phase 0 的样板测试：证明 vitest + valibot + `@/` 别名可用
 * （也是 CI `pnpm test` 闸门的第一条实际用例）。
 */
```

### N-424 · test/specs/scripts/dependency-manifest.test.ts:13-21

```ts
/**
 * 构建期依赖清单（about 页数据源）的契约。
 *
 * 重点防四类回归：
 * 1. `catalog:` 协议没被解析 —— 页面出现字面量 `catalog:`，看不出真实版本；
 * 2. 清单漏项 —— `package.json` 加了依赖但页面没显示；
 * 3. 结构收窄函数对畸形 YAML / JSON 抛错 —— 应当降级而不是让构建挂掉；
 * 4. 统计数字与条目数脱节。
 */
```

### N-425 · test/specs/scripts/remove-i18n.test.ts:22-29

```ts
/**
 * `remove-i18n` 裁剪脚本的守卫。
 *
 * 脚本是**一次性大范围改写**（13 个文件 + 删 4 个路径），改坏了 `pnpm typecheck`
 * 才报错 —— 而那时工作区已经脏了。这里把纯函数与「计划」钉死：dry-run 的输出
 * 必须等于 `--write` 的结果（两者共用 `planRemoveI18n`），且在本仓库上跑
 * 必须 0 残留、0 待确认。
 */
```

### N-426 · test/specs/services/permission-cache.test.ts:12-22

```ts
/**
 * 权限码缓存（§5.2）。
 *
 * 回归背景：`checkUserHasPermission` 是每个已登录请求的热路径，改造前每次三查
 * （permission → user_role → role_permission）。缓存后热路径退化为一次 KV 读，
 * 但**正确性完全依赖失效**：写操作没清键 → 停权后旧 token 在 TTL 内仍然放行。
 * 所以这里同时测「命中原样返回」与「失效后必然回源」。
 *
 * 注意 `useKV` 的命名空间是模块级单例（同名只按首次调用初始化，options 被忽略），
 * 所以每个用例前手动 `clear()`，不依赖调用顺序。
 */
```

### N-427 · test/specs/shared/api-proxy.test.ts:11-17

```ts
/**
 * P2-18：多 baseURL 代理配置的守卫。
 *
 * 这个模块同时被 `ubean.config.ts`（Node 配置加载）、客户端请求层、集成测试
 * 引用，是最容易「一处手滑、全局 404」的地方 —— 非法配置必须被丢弃而不是
 * 生成一条把请求打进死循环的规则。
 */
```

### N-428 · test/specs/shared/api-route-sync.test.ts:5-15

```ts
/**
 * 路由 ↔ `api` 表对账（§5.2-5）。
 *
 * 回归背景：`seedApis` 手工维护，与 `src/routes/api/**` 真实路由漂移而不自知 ——
 * 漂移的后果不是报错，而是「端点存在但没有任何权限点可授予」：非 super 用户
 * 永远 4003，或者该端点因为权限码对不上而裸奔。对账把这种静默漂移变成启动 warning。
 *
 * 关键点是**两侧都要归一**：`route:register` 钩子回传的 hono 模板是
 * `/api/user/:id`，而 `api` 表登记的是 `/user/[id]`；不归一的话
 * 全部带参端点都会被误报成 missing。
 */
```

### N-429 · test/specs/shared/common.test.ts:4-8

```ts
/**
 * `filterValidQuery`（P3-02）：
 * 表格搜索卡把空串字段直接拼进 query 时，后端会把 `keyword=` 当作"搜索空关键字"
 * 命中 0 行；`sort=` / `enabled=` 同理会覆盖掉有效默认值。
 */
```

### N-430 · test/specs/shared/i18n.test.ts:10-16

```ts
/**
 * `<html lang>` / `<html dir>` 派生的纯函数守卫。
 *
 * 为什么要单独测：`dir` 算错不会报错也不会崩，只会让 RTL 语言（阿拉伯语等）
 * 整页排版反向 —— typecheck / lint / build / bundle budget 全绿。这里把
 * 「`zh-CN` 也认成 zh 系」「`ar-EG` 也认成 RTL」这类边界钉死。
 */
```

### N-431 · test/specs/shared/iframe.test.ts:4-10

```ts
/**
 * 外链 / 内嵌页地址解析（P3-07）。
 *
 * `resolveExternalUrl` 是 `menuType: 'link'`（新窗口打开）与 `menuType: 'iframe'`
 * （内嵌页）共同的数据入口，也是唯一挡下 `javascript:` / `data:` 这类注入面的
 * 地方 —— 判定必须比「能被 `new URL` 解析」严格得多。
 */
```

### N-432 · test/specs/shared/layout-matrix.test.ts:14-20

```ts
/**
 * P2-20：布局模式 × 配置项矩阵的守卫。
 *
 * 这里的断言全部来自 Vean 源码事实（`appShellSkeletons`、`app-shell.vue` 模板的
 * 覆盖顺序、`showBreadcrumb` / `showTrigger` 的条件），而不是「跑起来看着对」。
 * 原因：这些组合失效时**不报错**——只是某个开关默默无反应，视觉回归和 CI 全绿。
 */
```

### N-433 · test/specs/shared/permission.test.ts:4-14

```ts
/**
 * 权限判定纯函数（`src/shared/permission.ts`）。
 *
 * 这两个函数被三处共用，行为必须一致：
 * - 路由级门禁：`src/router/guard.ts` 的 `to.meta.roles` → 不命中落 403；
 * - 指令：`src/directives/auth.ts` 的 `v-auth` / `v-auth:role` / `v-auth.super`；
 * - 组合式函数：`useAuth().hasAuth / hasAuthRole`。
 *
 * 守卫的这段判定逻辑在本文件里以 `shouldBlock` 复刻（守卫本身依赖
 * pinia/localStorage，无法直接单测），任何一边改了规则都应同步改这里。
 */
```

### N-434 · test/specs/shared/route.test.ts:9-16

```ts
/**
 * `normalizeRoutePath` 守卫（P3-11）。
 *
 * 回归背景：i18n 策略为 `prefix_except_default` 时，ubean 把每条页面路由
 * 注册在 `/:locale(en)?/about` 这样的 path 上；菜单树从 `router.getRoutes()`
 * 取 path 后原样 `router.push()`，会跳到字面量 `/:locale(en)?/about` → 404
 * （「点击菜单关于」的真实 bug）。
 */
```

### N-435 · test/specs/shared/route.test.ts:49-56

```ts
/**
 * API 权限码归一化（M-06）。
 *
 * 回归背景：`src/middleware/01.auth.ts` 原先用 `new URL(c.req.url).pathname`
 * 拼权限码，`GET /api/user/123` 产出 `api:get:(/user/123)`，而 seed 登记的是
 * `api:get:(/user/[id])` → 带路径参数的端点 RBAC 全部失效（要么误拒、要么在
 * 该权限被授予他人时误放）。根因是权限码要用**路由模板**而不是具体路径。
 */
```

### N-436 · test/specs/shared/route.test.ts:96-104

```ts
/**
 * `stripLocalePrefix`（M-08）。
 *
 * 回归背景：dynamic 模式落 `NotFound` 时要反查后端菜单表区分 403/404，
 * 而 `to.path` 是**已解析**的实际地址（`/en/about`），菜单表里存的是无前缀的
 * `/about` → 不剥就永远查不到，403 会退化成 404。
 *
 * 与 `normalizeRoutePath` 分工不同：后者剥路由**模板**里的 `:locale(en)?`。
 */
```

### N-437 · test/specs/shared/table.test.ts:6-10

```ts
/**
 * 表格分页字段改名（P3-02）：
 * 后端列表接口返回 `{ current, size, total, list }`，而 `@vean/ui` 的
 * `usePaginatedTable` 要 `{ page, pageSize, total, list }`。
 */
```

### N-438 · test/specs/shared/vean-locale.test.ts:5-24

````ts
/**
 * 应用 locale key ↔ Vean 组件内置文案的对齐守卫。
 *
 * **为什么需要这条守卫**（真实回归）：`@vean/aria/locale` 出厂只注册两个 key
 * —— `en` 与 `zh-CN`，而 `resolveLocaleRegistry()` 对**未知 key 静默回落到
 * `en`**，不抛错也不警告：
 *
 * ```
 * resolveLocaleRegistry('zh').key       // 'en'（回落！）
 * resolveLocale('zh').table.emptyTitle  // 'No data'（应为「暂无数据」）
 * ```
 *
 * 本项目把应用 locale 从 `zh-CN` 改成了更简洁的 `zh`（见 `@/constants`），
 * 若无人补注册，分页 / 表格空态 / 标签页等**组件内部文案会整体变英文**，
 * 且 typecheck、lint、build、bundle budget 全部绿灯 —— 没有任何闸门能发现。
 * 这条用例把「每个 APP_LOCALES 都能解析到自己」变成即时反馈。
 *
 * 补注册在 `@/shared/vean-locale`，由 `src/app.ts` 在启动时调用；这里在
 * 测试里显式调用一次，断言的是注册后的最终状态。
 */
````

### N-439 · test/specs/shared/vean-locale.test.ts:55-61

```ts
/**
 * 13 个出厂语言包的「存在性 + 可用性」守卫。
 *
 * `VEAN_LOCALE_PACKS` 是手写清单（`@vean/aria` 没有导出语言包枚举），写错
 * 一个码（`pt-br` 大小写、`zh-TW` 漏写）在 dev 下不会报错 —— 只有该语言切
 * 过去时组件文案静默变英文。这里逐个真的 `import()`，钉死包名与内容。
 */
```

### N-440 · test/specs/shared/watermark.test.ts:5-10

```ts
/**
 * P2-12：水印内容优先级与计时器开关的守卫。
 *
 * 这段逻辑与 UI 无关但极易回归：优先级写反只表现为「水印显示的不是预期那条」，
 * 视觉回归看不出来；计时器该停不停则是每小时一次的隐形 CPU 浪费。
 */
```

### N-441 · test/specs/store/build-static-menu-tree.test.ts:5-11

```ts
/**
 * 菜单建树 / 加载 / 校验的单测（`docs/v3-menu-route-modes.md` §4）。
 *
 * 这三个纯函数是 static（`src/menus/menus.json` + 路由表）与 dynamic
 * （`GET /api/menu/user`）两条路径的**公共收敛点**，所以它们的行为就是两种模式
 * 共同的行为 —— 这里测一遍等于两种模式都测了。
 */
```

### N-442 · test/specs/store/menu-transform.test.ts:5-15

```ts
/**
 * dynamic 菜单行 → 路由记录（P3-07 补 iframe 分支）。
 *
 * 覆盖三条分流：
 * - `menu` / `page`：有 `routePath` + `routeName` → 普通路由（缺页占位兜底）；
 * - `iframe`：不配 `routePath`，生成一条 `redirect → /iframe?url=` 的路由，
 *   让菜单项可跳转且 URL 不进路径段；
 * - `directory` / `link`：不产生路由（前者只是分组，后者由布局新窗口打开）。
 *
 * `views` 传空对象即代表「所有视图都缺失」，正好顺带验证占位兜底分支。
 */
```

### N-443 · test/specs/store/tab-store.test.ts:7-24

```ts
/**
 * 页签 store 的持久化与跨用户清理（P4-02，v3 §5.9）。
 *
 * 两条都是「不报错就悄悄坏掉」的能力：
 *
 * ① **持久化**：页签列表写 localStorage，刷新后恢复。P4-02 实测发现
 *    `src/utils/storage.ts` 曾用 `import.meta.client` 当判据（ubean 不注入该
 *    标志，恒 undefined），于是 `isClient()` 恒假 → 页签、token、主题设置全部
 *    刷新即失且不报错。这里的断言就是那条排查结论的固化。
 *
 * ② **跨用户清页签**：登出/换用户必须清空页签，否则新用户会看到上一个用户的
 *    页面痕迹（信息泄露）。走 `authStore.resetStore()` → `tabStore.resetStore()`
 *    这条真实链路，而不是直接调 `tabStore.resetStore()`。
 *
 * `ubean/client` 的缓存 API 是构建期虚拟模块，单测里必须 mock（默认 ESM loader
 * 不支持 `virtual:` 协议，会报 `Only URLs with a scheme in: file, data, and node
 * are supported`）。
 */
```

### N-444 · test/specs/store/tab-store.test.ts:34-38

```ts
/**
 * 造一个 `TabRouteLike`（store 只读 name / fullPath / meta）。
 *
 * 不需要 `as` 断言：`addTab` 的入参已收敛为最小结构（见 `./index.ts`）。
 */
```

### N-445 · test/specs/store/tab-store.test.ts:124-130

```ts
/**
 * 空白布局的页面不进页签栏。
 *
 * 登录页（`definePage({ layout: 'blank' })`）不渲染后台壳，却被 afterEach
 * 当普通路由加进了页签 —— 实测症状是登录后页签栏 `登录 | 工作台`，点「登录」
 * 还会被守卫弹回首页。403 / 404 / 500 同理。
 */
```

### N-446 · test/specs/store/theme-settings.test.ts:5-10

```ts
/**
 * P2-10：主题设置里两块「无 DOM 也能验证」的纯逻辑 —— 滤镜互斥、预设 → 主题信封。
 *
 * 放在这里而不是新增模块：这两个函数是 store 的对外契约（`src/app.ts` 与
 * `src/app.vue` 直接引用），导出位置就是它们的归属，测试跟着契约走。
 */
```

### N-447 · src/pages/(builtin)/login/components/split.vue:24

```vue
<!-- 左栏：品牌插画 + 毛玻璃，窄屏隐藏 -->
<div class="relative flex max-md:hidden items-center justify-center overflow-hidden md:flex-1 lg:flex-[2]">
```

**为什么不是 `hidden md:flex`**：本项目里 `hidden md:flex` 是**必失效**的组合。
`@vean/ui/dist/styles.css` 末尾有一条无 media 的 `.hidden{display:none;}`（offset 200667 / 202915），
它排在 Vite 注入的 UnoCSS 之后，同优先级下**后写的赢** —— `md:flex` 被压掉，元素在桌面端也保持 `display:none`。
实测：1200px 视口下左栏 `getBoundingClientRect().width === 0`、`getComputedStyle().display === 'none'`，
而 `element.matches('div.md\\:flex')` 是 `true`（选择器匹配 ≠ 样式生效）。

改法：用 `@vean/ui` 不定义的类 token，避开同优先级冲突 —— `flex max-md:hidden`
（`max-md:hidden` 只在 UnoCSS 产出，`@vean/ui` 里没有，两者不打架）。

同类陷阱：任何 `hidden <断点>:block|flex|grid` 在本项目都可能翻车，因为 `@vean/ui` 会带进无条件的
`.hidden` / `.block` / `.flex` / `.grid` 之一。写「窄屏隐藏」时优先用 `max-*:hidden`。

### N-448 · src/pages/(builtin)/login/index.vue:46-53

```ts
definePage({
  layout: 'blank',
  meta: {
    title: '登录',
    requiresAuth: false
  }
});
```

登录页**不加** `ssr: false`，SSR 豁免改走 `ubean.config.ts` 的 `routeRules`（见 N-449）。

试过 `definePage({ ssr: false })`，**实测无效**，响应头仍是 `X-SSR-Mode: ssr`。
按 0.6.4 的源码它本该生效：`node_modules/@ubean/vue/dist/vite.js:304` 解析出 `parsed.ssr`、
`:794` 把它写进路由 meta 的 `ssr` 字段，服务端 `resolveSelectSsr`
（`node_modules/@ubean/routes/dist/index.js:815`）也确实是 `input.pageSsr ?? input.routeRuleSsr` 的优先级。
dev 下 `page.pageMeta.ssr` 没被带到服务端（具体在哪一环丢失没有再往下追）。
结论：**SSR 豁免用 `routeRules`，它在 dev 与 build 两个环境都验证有效**。

### N-449 · src/shared/api-proxy.ts:86-106

```ts
/**
 * 登录页的 SSR 豁免规则（`ssr: false`）。
 *
 * 登录壳由 `themeStore.settings.loginLayout` 选择，该值来自 localStorage —— Node 预渲染读不到，
 * 只能渲染默认的 `card`。客户端首帧读到 `split` 后会与预渲染树做 hydration diff，
 * 结果是两个壳的 DOM 混在一棵树里（分栏内容被塞进窄卡片容器）。
 */
export const LOGIN_ROUTE_PREFIX = '/login';
```

**这是本次迁移最隐蔽的一处**。症状看起来纯 CSS：选了 `split` 布局后，分栏里的表单被挤在
一张窄卡片里居中显示（因为 `card` 的 `SCard` 根节点 `.max-w-96` 先渲染出来、`split` 的内容被塞进它里面）。

真实原因是 **hydration mismatch**：

1. dev server 对每个 HTML 请求在 Node 里预渲染（`ubean.config.ts` 的 `mode: 'fullstack'` + `ssr: false`
   仍会走 `createVueRenderer`，见 `docs/v3-task.md` 的 P4-01 条）；
2. 预渲染时 `localStorage` 不存在 → `themeStore.settings.loginLayout` 是默认值 `card` → 输出 `card` 壳的 DOM；
3. 浏览器 hydration 时读到 `loginLayout: 'split'` → 客户端 vdom 是 `split` 壳；
4. Vue 的 mismatch 处理是**保留旧节点 + 追加新节点**，不是清空重建。Playwright 读到的证据：
   ```
   root class = "relative flex-center size-full overflow-hidden bg-primary-200 dark:bg-primary-300 p-4"  ← card 的根
   root.children = [ 分栏左栏, 分栏右栏 ]                                                                ← split 的内容
   ```
   `#app` 里 `bg-gray-50`（split 根）计数为 0，两个壳的片段混在一棵树上。

控制台原文（`definePage({ ssr: false })` 那轮抓到的）：

```
[Vue warn]: Hydration class mismatch on JSHandle@node
  - rendered on server: class="flex flex-col items-stretch rounded-md border bg-card ... max-w-96"
  - expected on client: class="relative hidden items-center justify-center overflow-hidden md:flex md:flex-1 lg:flex-[2]"
  Note: this mismatch is check-only. The DOM will not be rectified in production due to performance overhead.
```

**排查教训**：DOM 出现「两套壳的属性混在一起」时，先查 hydration mismatch，不要先怀疑 CSS 优先级。
`definePage({ ssr: false })` 没生效浪费了两轮；直接改 `routeRules` 后 `X-SSR-Mode` 立刻从 `ssr` 变 `csr`，
SSR HTML 也从 `id="app"><div class="h-full">…` 变成 `id="app" data-ubean-ssr="false"></div>`（空壳）。

### N-454 · src/layouts/default.vue:292-297

```ts
/**
 * 注意入参是 **menu item 对象**，不是裸 value：`SDropdownMenu` 的 `select` 类型为 `[item: MenuOptionData<T>, event: Event]`。
 * 这里刻意不回退到 `unknown` —— 写错时 `item.value` 会当场报错，而不是像 `value === 'logout'` 那样恒为假、静默失效。
 */
function onUserMenuSelect(item: MenuOptionData<string>): void {
```

同款写法的第二处（`src/layouts/default.vue:334-335`，语言下拉）：

```ts
async function onLocaleMenuSelect(item: MenuOptionData<string>): Promise<void> {
  if (!isAppLocale(item.value) || item.value === locale.value) return;
```

**为什么会漏**：仓内另一个同名事件载荷确实是裸串 —— `SAppShell` 的 `AppShellEmits.select: [key: string, event?: Event]`（`src/layouts/default.vue:348` 的 `@select="onMenuSelect"` 写法正确、不要一起改）。两个组件同名事件语义不同，照了邻居的写法就会踩这里。参考实现 `soybean-unify` 的 `apps/admin/src/layouts/modules/layout-header/user-avatar.vue:39` 是按 item 取值（`switch (option.value)`），本次即对齐它。

**证据**：Playwright 真机点击头像下拉的「退出登录」，console 打出 `PROBE_USERMENU {"value":"logout","label":"退出登录"}`，而旧代码 `function onUserMenuSelect(value: unknown)` 里 `value === 'logout'` 对对象恒 false → 三个分支全不命中、静默 return；同页面 `page.evaluate` 直调 `useAuthStore().logout()` 则正常跳 `/login` 并清 token。同一 bug 还压着语言切换（旧 `onLocaleMenuSelect` 的 `typeof value !== 'string'` 直接 return，`docs/v3-task.md` 早有未修记录）。**测试盲点**：原有 e2e「登出清空页签」用动态 import 直调 store，绕过了下拉菜单，所以真实 HTTP 用例全绿也拦不住这个 bug。

### N-455 · src/shared/vean-locale.ts:62-68

```ts
/**
 * 运行时判定字符串是否是一个应用 locale。
 * 菜单 `@select` 把 item 的 `value` 交回来时类型只会收窄到 `string`，这是把 `string` 收回 `AppLocale` 的唯一入口（不收 `as` 断言）。
 */
export function isAppLocale(value: string): value is AppLocale {
  return APP_LOCALES.some(code => code === value);
}
```

**为什么需要它**：`MenuOptionData<T>` 的 `T` 在 `SDropdownMenu` 的 `@select` 上给不到字面量联合，`item.value` 只能是 `string`，而 `registerVeanLocalePack` / `setLocale` 要的是 `AppLocale` —— 没有运行时守卫就只能写 `as AppLocale`（`eslint.config.mjs` 禁 `as T`，仅 `as const` 例外）。写法与同文件的 `isVeanLocalePack()`（守 13 个出厂包）一致：`APP_LOCALES.some(code => code === value)`。

### N-456 · src/layouts/default.vue:305-315

```ts
/**
 * 登出前二次确认（对齐 `soybean-unify` 的 `dialog.warning`）。
 * `dialog.warning(title, data)` 在 `@vean/aria` 里是 `create({ ...data, title, type: 'warning' })` —— 文案只能走 `title`。
 * 未传 `cancelText` 时回落组件包内置的 `dialog.cancel`（随 locale 切换），所以这里不写死「取消」。
 */
function confirmLogout(): void {
  dialog.warning(t('common.logoutConfirm'), {
    confirmText: t('common.confirm'),
    onConfirm: () => void authStore.logout()
  });
}
```

**契约细节（读 `node_modules/@vean/aria/dist/components/dialog/state.js` 得到）**：`dialog.warning(message, data?)` 的签名看着像 UI 库常见的「message + 选项」，实际实现是 `create({ ...data, title: message, type: 'warning' })`；`DialogExternal` 的字段是 `Omit<DialogT, 'id' | 'type' | 'title'>`，即只开放 `description` / `content` / `footer` / `cancelText` / `confirmText` / `onCancel` / `onConfirm` / `onDismiss` / `icon` / `showCancel` / `showConfirm` / `ui` —— **没有独立 message 字段**，误传 `message` 不会渲染。

**取消键文案不要写死**：`DialogCompact` 的 `showCancel` 默认值是字符串 `'onlyWarning'`（即只有 warning 才显示取消），`cancelText` 缺省时回落组件包 locale 表里的 `dialog.cancel`（`node_modules/@vean/aria/dist/locale/langs/zh-CN.js` 的 `dialog:{cancel:'取消',confirm:'确认',…}`），会随 `SConfigProvider` 的 locale 切换。这里只自定义 `confirmText`（`t('common.confirm')`），取消键交给库里，切到英文时自动变 `Cancel`。

**为什么要有这个确认**：`authStore.logout()` 会清 token + 三个 store + 页签并跳 `/login`，是不可逆的一步；参考实现 `soybean-unify` 的 `apps/admin/src/layouts/modules/layout-header/user-avatar.vue:48` 同样先弹确认再重置。

`SDialogProvider` 由 `SConfigProvider` 内部渲染（`node_modules/@vean/ui/dist/components/config-provider/config-provider.js` 的 render 里 `c(r)` 即 dialog-provider），所以 `src/app.vue` 无需再手动挂 provider。

### N-457 · src/pages/(builtin)/login/components/layout-switcher.vue:9-17

```ts
/**
 * 登录页右上角的外观切换（与主题抽屉 → 通用 → 登录页布局写的是同一份 store 数据）。
 *
 * 独立成组件而不是写进三个壳：三套壳都要这一个下拉，复制三遍会漂移。
 */
defineOptions({ name: 'LoginLayoutSwitcher' });
```

**为什么登录页也要放一个**：换个外观得先登录、再从后台开抽屉改设置、再退到登录页看效果 —— 反馈回路太长。两处写的是同一个 `themeStore.settings.loginLayout`，改哪边另一边都跟着变（无新存储键）。

**位置放在壳外部而非 `SCard` 的 `#extra`**：`card` / `fullscreen` 两个壳原来把暗色模式切换放在 `SCard` 的 `#extra`，本次统一提到右上角与布局下拉并列（`absolute top-4 right-4 z-10 flex items-center gap-2`），`split` 壳本来就是右上角，三壳一致；`SCard` 的 `titleRoot: 'flex-1 justify-center'` 因此成为唯一的居中手段（原来靠 `#extra` 的宽度撑对称）。

**取值收窄**：`SSelect` 的 `v-model` 回传 `string | number`（`SelectCompact` 的 `T` 要显式给才行），这里复用主题抽屉的 `toSettingValue(value, layoutNames, DEFAULT_LOGIN_LAYOUT)` 收窄回 `LoginLayoutName`，不走 `as` 断言。`DEFAULT_LOGIN_LAYOUT` 是兜底：万一存进来的值不在候选表里（旧数据）也落回一个合法值。
