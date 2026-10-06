# soybean-admin v3.0 任务列表与状态跟踪

> 来源：`docs/v3.md`（soybean-admin v3.0 实现方案，提交 `1126c7fb`）
> 版本锚点：ubean 0.6.0 · Vean（`@vean/*`）0.50.0 · `@soybeanjs/fetch` 0.1.0 · `@soybeanjs/cli` 1.8.4 · Node >= 22 / pnpm 11.24.0
> 分支基线：`v3`（本地提交 `1126c7fb`，无 upstream；`main` = 全栈版，`lite` = 前端版）
> 最后更新：2026-10（Phase 0 实施后校准）

## 状态图例

| 标记 | 含义     |
| ---- | -------- |
| ⬜   | 未开始   |
| 🟡   | 进行中   |
| ✅   | 已完成   |
| ⛔   | 阻塞     |
| 🔁   | 机制替换 |

> 说明：本文件是 `docs/v3.md` 的**执行跟踪视图**。每个任务标注依据章节（`§`）便于回溯设计原文；`验收/备注` 列写该任务的完成判据或已确认的注意事项。
>
> **进度快照（2026-10）**：Phase 0 已完成 9/11（余 2 项 🟡 见下）—— `pnpm dev`/`build`/`preview` 三路通、`.ubean/` codegen 正常、typed client 打通真实 API、CI 四闸门齐备、git hooks 已接管。余下 🟡：`VITE_API_ENV`/`VITE_THEME_PRESET` 未加、两个代码风格 skill 未落成 lint 规则。Phase 1+ 全部 ⬜。

---

## 总览

| 阶段                     | 任务数 | ⬜ 未开始 | 🟡 进行中 | ✅ 已完成 | ⛔ 阻塞 |
| ------------------------ | ------ | --------- | --------- | --------- | ------- |
| 文档前置（v3.md 补全）   | 4      | 0         | 0         | 4         | 0       |
| Phase 0 — 地基           | 11     | 0         | 2         | 9         | 0       |
| Phase 1 — 后端内核       | 12     | 12        | 0         | 0         | 0       |
| Phase 2 — 前端架子       | 20     | 20        | 0         | 0         | 0       |
| Phase 3 — 业务页面       | 10     | 10        | 0         | 0         | 0       |
| Phase 4 — 插件演示与增值 | 5      | 5         | 0         | 0         | 0       |
| Phase 5 — 适配对接与发布 | 6      | 6         | 0         | 0         | 0       |
| 横切任务（跨 Phase）     | 6      | 4         | 0         | 2         | 0       |
| 待产出物 / 缺口          | 6      | 6         | 0         | 0         | 0       |
| **合计**                 | **80** | **63**    | **2**     | **15**    | **0**   |

---

## 文档前置（已完成）

| ID   | 任务                                                  | 依据        | 状态 | 验收/备注                                                               |
| ---- | ----------------------------------------------------- | ----------- | ---- | ----------------------------------------------------------------------- |
| D-01 | 补充 ubean 文件式约定速查（§3.3，含 23 条陷阱摘录）   | §3.3        | ✅   | 页面/API 约定、`.ubean/` codegen、内置端点、`defineEnv`、导入与构建陷阱 |
| D-02 | 补充本地已装 AI skills 索引（6 个 skill + 何时必读）  | §11.2       | ✅   | `~/.agents/skills/`；执行规约，非可选参考                               |
| D-03 | 校准版本锚点（ubean 0.6.0 / Vean 0.50.0 / cli 1.8.4） | §2 / §10    | ✅   | 全文去除 `0.4.x` / `SoybeanUI 0.30` / `createTheme` 等旧写法            |
| D-04 | 校准参考路径（三仓库对照 + Vean↔soybean-ui 术语）     | §11.1/§11.3 | ✅   | 明确 `soybean-ui/`（0.50.0）为首选源码参照；`soybean-ui3/` 勿参照       |

---

## Phase 0 — 地基（脚手架与工具链）

| ID    | 任务                                                                                                       | 依据       | 状态 | 验收/备注                                                                                                                                                                                                                        |
| ----- | ---------------------------------------------------------------------------------------------------------- | ---------- | ---- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| P0-01 | 单包工程重建：根目录平铺 `ubean.config.ts` + `vite.config.ts` + `src/`                                     | §3.1       | ✅   | v2 `packages/`、旧 `src/`、`index.html`、`.npmrc`、lockfile 已删；根配置全部重写                                                                                                                                                 |
| P0-02 | 工具链接管：vite-plus（`vp`）dev/lint/fmt/test + `@soybeanjs/cli`（`soy`）commit/changelog/release/cleanup | §4.7       | ✅   | `vp` 五条命令已跑通（fmt 53 files / lint 0 error）；`.vite-hooks/{pre-commit,commit-msg}` 已提交（`vp staged` + `soy git-commit-verify`）；已清掉 v2 遗留的 `pnpm sa git-commit-verify` 钩子；`prepare` = `vp config --no-agent` |
| P0-03 | ubean 骨架跑通（fullstack + ssr:false + ui/icon/pinia/i18n/routing）                                       | §9 P0      | ✅   | dev/preview/build 三路通；`.ubean/` 9 文件 codegen；`uno.css` 已在 `src/app.ts` 显式引入（否则 build 产物 CSS 仅 49 B）                                                                                                          |
| P0-04 | 路径别名 `@/*` → `./src/*`（vite-plus tsconfigPaths）                                                      | §3.1       | ✅   | **勘误：不是 `#/`** —— ubean 无内置别名约定，官方样例统一 `@/*`；`.ubean/*` 走 `~ubean/*`                                                                                                                                        |
| P0-05 | `src/schema/` 建立（Valibot DTO，单一契约源）                                                              | §3.1/§9 P0 | ✅   | `src/schema/system.ts` + 4 个 vitest 用例；前后端同进程，相对路径 import                                                                                                                                                         |
| P0-06 | `.ubean/openapi.d.ts` codegen + `@soybeanjs/fetch` typed client 打通                                       | §5.4/§9 P0 | ✅   | `src/request/client.ts`（`toFlatTypedClient<paths,'/api'>`）+ `internal.ts`；浏览器实测 `flatApi.get('/system/health')` 取到真实数据                                                                                             |
| P0-07 | 版本与工具链对齐（前置校验）                                                                               | §9 P0/§3.3 | ✅   | engines Node >=22.0.0 / pnpm >=11.24.0；锁 ubean@0.6.0、`@vean/*`@0.50.0、fetch@0.1.0、cli@1.8.4；catalog `vite: npm:@voidzero-dev/vite-plus-core@1.0.0` 为**必需**（否则 `transformWithOxc` 报错）                              |
| P0-08 | env 精简并改用 `defineEnv()` 声明                                                                          | §5.10/§3.3 | 🟡   | **勘误：`defineEnv()` 只读 `process.env`**，客户端走 `import.meta.env.VITE_*` → 已拆 `src/env.ts` + `src/env.server.ts`；`VITE_API_ENV`/`VITE_THEME_PRESET` 尚未加                                                               |
| P0-09 | CI：typecheck + build + bundle 基线 + 客户端导入守卫                                                       | §4.7/§3.3  | ✅   | `.github/workflows/ci.yml`（5 步）；守卫 `src/shared/import-guard.test.ts`；基线 `benchmarks/bundle-baseline.json`                                                                                                               |
| P0-10 | 代码风格对齐：lint 规则 = `vue-sfc-structure` + `typescript-functional-style`                              | §11.2      | 🟡   | `@soybeanjs/eslint-config-vue` + `@soybeanjs/oxc-config` 已接；两个 skill 的规则**尚未逐条落成 lint 约束**                                                                                                                       |
| P0-11 | 删除 mock：`src/service/api/*` 手写 API 层 + Apifox mock                                                   | §3.1/§4.3  | ✅   | v2 `src/` 全树已删，无 mock 残留；dev 即跑真后端（Vite middlewareMode + Hono 同进程）                                                                                                                                            |

**Phase 0 出口判据**：`pnpm dev` 起全栈骨架、`.ubean/` codegen 正常、typed client 可调通一条真实 API、CI 三闸门（typecheck/build/bundle 基线）绿灯。

---

## Phase 1 — 后端内核（仅 main 分支）

| ID    | 任务                                                          | 依据      | 状态 | 验收/备注                                                                                                                                          |
| ----- | ------------------------------------------------------------- | --------- | ---- | -------------------------------------------------------------------------------------------------------------------------------------------------- |
| P1-01 | Drizzle 13 表 + 迁移 + seed（移植 unify）                     | §6.1/§6.2 | ⬜   | user/role/permission/api/menu/org/dict/dict-item + 4 关系表                                                                                        |
| P1-02 | db0 connector 显式接线                                        | §6.2      | ⬜   | dev SQLite（better-sqlite3）/ prod Postgres（postgres-js）；**默认内存实现必须显式替换**                                                           |
| P1-03 | 统一响应 + 错误 + 业务码                                      | §6.1      | ⬜   | `c.json` 重写为 `{code,message,data}`；AppError + error 中间件；8888/7777/9999                                                                     |
| P1-04 | auth 模块（7 端点）                                           | §6.3/§5.5 | ⬜   | login（pwd/captcha）、register、token/refresh、logout、user-info、captcha、`POST /error`                                                           |
| P1-05 | JWT 双 token + 黑名单                                         | §6.4      | ⬜   | `useCacheStore`（dev 内存 / prod Redis driver）；登出拉黑 refreshToken                                                                             |
| P1-06 | RBAC 中间件 `src/middleware/01.auth.ts`                       | §6.1/§2   | ⬜   | Bearer → verifyToken（黑名单+用户状态）→ 权限码 `api:${method}:${template}` 匹配                                                                   |
| P1-07 | 8 套 CRUD（menu/role/user/permission/api/org/dict/dict-item） | §6.3      | ⬜   | 含 role 菜单/按钮权限分配、user 分配角色                                                                                                           |
| P1-08 | 数据模型约定                                                  | §6.1      | ⬜   | UUID v7 字符串主键、`enabled: 'Y'\|'N'\|'D'` 软删、审计四字段                                                                                      |
| P1-09 | OpenAPI 文档端点                                              | §6.1      | ⬜   | `/_openapi.json` + `/_scalar`（dev 自动挂载）                                                                                                      |
| P1-10 | 集成测试 ≥40 例                                               | §9 P1     | ⬜   | 参照 `ubean/examples/ubean-test/`（38 例范式）                                                                                                     |
| P1-11 | 服务端全局 hooks `src/server.ts`（`defineServer`）            | §6.1      | ⬜   | requestId / 日志 / 错误映射                                                                                                                        |
| P1-12 | **硬性约束**：所有 API 路由必须 `defineHandler` 包装          | §6.1      | ⬜   | `defineHandlerMeta` 只装 requiresAuth/cache/rateLimit；OpenAPI 元数据走 `describeRoute`；它们**不是宏**，当宏调用会被 build strip → 运行时语法错误 |

**Phase 1 出口判据**：`/_scalar` 可见完整 API、认证链路（登录→刷新→登出拉黑）e2e 通过、RBAC 生效、集成测试 ≥40 例全绿。

---

## Phase 2 — 前端架子

| ID    | 任务                                                              | 依据      | 状态 | 验收/备注                                                                                                                                                                                                                  |
| ----- | ----------------------------------------------------------------- | --------- | ---- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| P2-01 | `SAppShell` 6 模式布局承接 + v2 mode 映射表                       | §5.2      | ⬜   | vertical→`sidebar`、vertical-mix→`dual-vertical`、horizontal→`top`、top-hybrid-sidebar-first→`vertical-horizontal`、top-hybrid-header-first→`horizontal-vertical`、vertical-hybrid-header-first→`horizontal-dual-vertical` |
| P2-02 | theme store → `layoutProps` 映射                                  | §5.2/§5.6 | ⬜   | shell 自持 open/orientation/sidebarVisible/isMobile/pxToRem；应用层只喂配置面                                                                                                                                              |
| P2-03 | 菜单驱动路由/页签/标题一元模型（static + dynamic 双模式）         | §5.3/§4.2 | ⬜   | dynamic 模式 `GET /api/menu/user` → `transformMenusToAutoRoutes`                                                                                                                                                           |
| P2-04 | 动态路由一致性启动断言                                            | §5.3      | ⬜   | routeName/routePath 与页面路由表比对，防漂移                                                                                                                                                                               |
| P2-05 | tab store 对接 `SAppShell` 内置页签                               | §4.4/§5.2 | ⬜   | `tabs` + `v-model:tabValue` + `tabClick`/`tabClose` 回写 store                                                                                                                                                             |
| P2-06 | keep-alive + reload + 多标签                                      | §4.2      | ⬜   | `useCacheViews`/`enablePageCache`/`excludePageCache`/`invalidatePageCache` + route store cachedRoutes                                                                                                                      |
| P2-07 | 请求层（Bearer/解包/业务码/错误去重/token 刷新并发去重 + 重放）   | §5.4/§4.3 | ⬜   | **v2 有、unify 缺**——必须接线；全部逻辑 ≤150 行；`createInternalAdapter` 服务端直调                                                                                                                                        |
| P2-08 | 登录/注册/验证码/重置密码/绑定微信 5 模块前端                     | §4.6      | ⬜   | 对接 Phase 1 真实签发 token                                                                                                                                                                                                |
| P2-09 | i18n 双语（`@ubean/i18n`）+ `remove-i18n` 脚本                    | §4.5      | ⬜   | `src/locales/` JSON；`.ubean/i18n.d.ts` 类型生成；`@vean/aria/locale` 13 语言包                                                                                                                                            |
| P2-10 | 暗色 + 主题抽屉                                                   | §5.6      | ⬜   | 外观 Tab = `SThemeCustomizer`；布局/通用/操作 3 Tab 应用层实现；`useColorMode` → `.dark`                                                                                                                                   |
| P2-11 | 全局搜索 `SCommand`                                               | §4.1      | ⬜   | 菜单模糊搜索 + 键盘导航 + 高亮                                                                                                                                                                                             |
| P2-12 | 水印 `SWatermark` + `watermarkContent` 派生                       | §4.1      | ⬜   | 文本/用户名/实时时间 7 格式；定时器按需运行                                                                                                                                                                                |
| P2-13 | 移动端抽屉适配（<768px）                                          | §4.1      | ⬜   | 恒以 `sidebar` 骨架渲染全量菜单树抽屉；`v-model:mobileOpen` 受控；布局备份恢复留 app store                                                                                                                                 |
| P2-14 | 面包屑/头部/logo/折叠触发                                         | §4.1      | ⬜   | 面包屑默认由 items+激活值派生；下拉切换兄弟菜单需应用层包装                                                                                                                                                                |
| P2-15 | 页面切换动画 7 种 + 滚动模式（wrapper/content、固定头/页签/底部） | §4.1      | ⬜   | 经 `layoutProps` 转发内部 `SLayout`；+ view transitions                                                                                                                                                                    |
| P2-16 | 路由守卫链（auth/title/progress）+ 首屏 loading 主题色联动        | §5.1      | ⬜   | `progress` 来自 `@vean/ui`，`SConfigProvider` 已自动挂 Provider，无需手动包                                                                                                                                                |
| P2-17 | `v-auth` 指令 + `useAuth().hasAuth(code)`                         | §4.2      | ⬜   | v2 无指令、v3 补上                                                                                                                                                                                                         |
| P2-18 | `routeRules.proxy` 多 baseURL（`/_p/{key}` 前缀代理）             | §4.3      | ⬜   | 多 client 实例；dev 代理 + 终端彩色日志                                                                                                                                                                                    |
| P2-19 | menu store 新增（自 route 拆分）                                  | §4.4      | ⬜   | 菜单树 + map + 面包屑 + routeMenu；监听语言变化重建                                                                                                                                                                        |
| P2-20 | 「模式 × 配置项」矩阵 PoC（Phase 2 第一周）                       | §10       | ⬜   | 盲区项降级为 5 模式或 `layoutProps` 透传 `SLayout` 兜底                                                                                                                                                                    |

**Phase 2 出口判据**：6 种布局模式可切换且视觉一致、菜单驱动页签/标题/面包屑全通、token 刷新重放 e2e 通过、主题抽屉四 Tab 可用。**lite 分支在本 Phase 完成后切出**（§9）。

---

## Phase 3 — 业务页面

| ID    | 任务                                                                                                    | 依据      | 状态 | 验收/备注                                                                                                                                               |
| ----- | ------------------------------------------------------------------------------------------------------- | --------- | ---- | ------------------------------------------------------------------------------------------------------------------------------------------------------- |
| P3-01 | dashboard 首页                                                                                          | §4.6      | ⬜   | 问候横幅/4 统计卡/折线/饼图/项目动态；`@soybeanjs/chart` + echarts；CountTo 用 `useTransition`                                                          |
| P3-02 | 表格范式（`usePaginatedTable` + 应用层 `useTableOperate`/`defaultTableTransform` + `filterValidQuery`） | §5.7      | ⬜   | `usePaginatedTable` 由 `@vean/ui` 导出；后两者需**在本仓库重写**（参照 `soybean-unify/apps/admin/src/composables/table.ts`、`.../src/shared/table.ts`） |
| P3-03 | manage 8 套 CRUD 页                                                                                     | §4.6      | ⬜   | 统一「搜索卡 + 分页表格 + operate 弹窗」范式                                                                                                            |
| P3-04 | `table-column-setting` / `table-header-operation` 重写                                                  | §5.7      | ⬜   | `SDropdownMenu` + `vue-draggable-plus`，保留为全局组件                                                                                                  |
| P3-05 | `SForm` + StandardSchema 校验                                                                           | §5.7      | ⬜   | 直接复用 `src/schema/` valibot schema，前后端同一份规则                                                                                                 |
| P3-06 | function 演示页全量 + 按钮级权限 + 角色分配弹窗                                                         | §4.6      | ⬜   | 请求演示对接 `POST /api/auth/error`                                                                                                                     |
| P3-07 | 403/404/500 + iframe 外链页                                                                             | §4.6/§4.2 | ⬜   | `exception-base` → Vean `SEmpty` + 本地 svg；`(builtin)/iframe/[url].vue`                                                                               |
| P3-08 | about（依赖版本表/构建时间/技术栈卡片）                                                                 | §4.6      | ⬜   | 版本表改读 catalog                                                                                                                                      |
| P3-09 | user-center → 完整 profile + settings 页                                                                | §4.6      | ⬜   | 补齐 unify 占位教训                                                                                                                                     |
| P3-10 | multi-menu 三级嵌套                                                                                     | §4.6      | ⬜   | 文件目录天然表达                                                                                                                                        |

**不迁移**：alova 示例、pro-naive-ui 示例（§4.6）。

---

## Phase 4 — 插件演示与增值

| ID    | 任务                                                                       | 依据      | 状态 | 验收/备注                                                                                                                                                                                           |
| ----- | -------------------------------------------------------------------------- | --------- | ---- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| P4-01 | plugin 演示页全量 + 懒加载隔离                                             | §4.6/§5.8 | ⬜   | echarts/@antv g2·g6/vchart/wangeditor/vditor/xlsx/vue-pdf-embed/print-js/jsbarcode/pinyin-pro/xgplayer/map/swiper/typeit/vtable/dhtmlx-gantt；经 `definePage` 懒加载，不进主包体积                  |
| P4-02 | 隐形能力回归测试（Playwright，vitest 5 浏览器模式）                        | §5.9/§10  | ⬜   | §5.9 清单转 e2e：版本更新检测、跨用户清页签、主题缓存+BUILD_TIME 覆盖、错误去重、token 刷新去重、移动端布局备份恢复、水印定时器、页签滚轮/中键、`isDev`、meta 语义、首屏 loading、登录 notification |
| P4-03 | lite 分支切出 + `docs/lite-delta.md` 差异固化                              | §8/§9 P4  | ⬜   | 差异集中在 5 个文件/目录；CI 校验 main→lite merge 只触碰这些                                                                                                                                        |
| P4-04 | lite 请求层 `gen:api` 脚本（`openapi-typescript <用户后端 openapi.json>`） | §8        | ⬜   | 文档提供 Java/Go/Python/Node 各后端契约示例                                                                                                                                                         |
| P4-05 | 增值能力演示（`defineQueue`/`defineScheduled`/WS/SSE/`useRateLimit`）      | §6.5      | ⬜   | **v3.1+，不进首版关键路径**                                                                                                                                                                         |

---

## Phase 5 — 适配对接与发布

| ID    | 任务                                                                   | 依据     | 状态 | 验收/备注                                                                                                                                                       |
| ----- | ---------------------------------------------------------------------- | -------- | ---- | --------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| P5-01 | 适配器契约落地：`useThemeTokens()` + `soybean:theme-change`            | §7.2/§10 | ⬜   | ⚠️ **两 API 在 `@vean/*` 中不存在**，需先定签名；基础是 `@vean/theme` 的 `resolveThemeMap()` + `emitThemeCss(map)` + `./storage`；首版可先在 admin 内实现再抽包 |
| P5-02 | 独立仓库 `soybean-ui-adapters`：naive/element/antd 适配 + 共享核心     | §7.2     | ⬜   | naive→ThemeOverrides；element→`--el-*`；antd→ConfigProvider theme token；primary 梯度统一用 `@soybeanjs/colord`                                                 |
| P5-03 | 缺口组件（Upload 等）补齐或桥接                                        | §7.3     | ⬜   | Upload 优先自建（aria 无原语）；其余应用层 `components/custom/` 先行 + 向上游提 issue/PR                                                                        |
| P5-04 | 文档站更新 + 中英 README 重写                                          | §9 P5    | ⬜   | v3 指南 + 迁移指南（含列模型映射表）+ API 契约文档                                                                                                              |
| P5-05 | 列模型字段映射表（`NaiveUI.TableColumn` → `STable` `TableColumnType`） | §7.4     | ⬜   | **尚未产出**，随迁移文档一并输出                                                                                                                                |
| P5-06 | 发布：beta → rc → stable                                               | §9 P5    | ⬜   | v3.0.0-beta.x 对齐 ubean 0.6.x 锁定版本                                                                                                                         |

---

## 横切任务（跨 Phase）

| ID   | 任务                                            | 依据     | 状态 | 验收/备注                                                                                                                                  |
| ---- | ----------------------------------------------- | -------- | ---- | ------------------------------------------------------------------------------------------------------------------------------------------ |
| X-01 | 版本锁定策略：每升级一个 ubean minor 跑全量 e2e | §10      | ⬜   | v3.0 stable 前不追新                                                                                                                       |
| X-02 | ubean API 隔离层 `src/shared/ubean-compat.ts`   | §10      | ⬜   | 隔离高频 API，降低破坏性变更冲击                                                                                                           |
| X-03 | 生产 connector 配置检查文档                     | §10      | ⬜   | 强制校验，防 DB「默认内存实现」上线                                                                                                        |
| X-04 | main→lite 单向同步（每季度）+ CI 差异文件校验   | §3.2/§10 | ⬜   | 冲突面控制在上文差异点                                                                                                                     |
| X-05 | bundle 体积基线 CI 闸门                         | §4.7     | ✅   | 已落地（P0-09）：`benchmarks/bundle-baseline.json` + `pnpm analyze:check`，gzip 增长 >5% 失败                                              |
| X-06 | 工具链门槛 Node >= 22 / pnpm 11.24.0            | §3.3     | ✅   | 已落地（P0-07）：`engines` + `packageManager: pnpm@12.9.1`；catalog `vite` 钉 `npm:@voidzero-dev/vite-plus-core@1.0.0`，`vite-plus: 1.0.0` |

---

## 待产出物 / 缺口

| ID   | 产出物                                                     | 依据 | 状态 | 备注                                                                                                                                                                                                                                                                                                          |
| ---- | ---------------------------------------------------------- | ---- | ---- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| G-01 | 列模型字段映射表（NaiveUI.TableColumn → STable）           | §7.4 | ⬜   | 迁移文档前置物                                                                                                                                                                                                                                                                                                |
| G-02 | 适配器契约签名（对接 `useTheme()` / `useThemeSettings()`） | §7.2 | ⬜   | **已查实**：`useThemeTokens` / `soybean:theme-change` 两个名字在 `@vean/*` 中不存在，但 `useTheme()`（`theme`/`base`/`primary`/`radius`/`mode` + `setMode`/`savePreset`/`applyPreset`）与 `useThemeSettings()`（`resolved`/`overrides`/`setOverride`/`persist`）已提供等价能力，适配器应对接这两个 composable |
| G-03 | `docs/lite-delta.md`（main/lite 差异清单）                 | §8   | ⬜   | CI 校验依据                                                                                                                                                                                                                                                                                                   |
| G-04 | `docs/api-contract.md`（lite 接口契约说明）                | §3.2 | ⬜   | lite 默认提供 unify 风格契约文档                                                                                                                                                                                                                                                                              |
| G-05 | 组件文档补 `theme-customizer.md`                           | §5.6 | ⬜   | vean-ui skill 96 篇中缺失；当前 API 需直读 `soybean-ui/packages/ui/src/components/theme-customizer/`                                                                                                                                                                                                          |
| G-06 | 样式产物抽查清单（防"dev 正常 / build 丢样式"复发）        | §3.3 | ⬜   | **已发生两次**：① 漏 `import 'uno.css'` → build 产物 CSS 仅 49 B；② 漏 `import '@vean/ui/styles.css'`（`ui: true` 的 registry 注入只在 `ubean dev` 生效，构建路径丢掉）→ 组件样式全无。建议 CI 断言 `dist/public/assets/*.css` 下限（如 >150 kB）                                                             |

---

## 风险登记（源自 §10）

| 风险                                                      | 等级 | 对策                                                                                                           | 状态 |
| --------------------------------------------------------- | ---- | -------------------------------------------------------------------------------------------------------------- | ---- |
| ubean 0.6.x API 破坏性变更（0.x 无稳定承诺）              | 高   | lock 精确版本 + `ubean-compat.ts` 隔离 + 每 minor 全量 e2e                                                     | ⬜   |
| ubean「声明宽于默认」（DB/queue 默认内存实现）            | 高   | 首版只依赖已验证子集（Hono 路由/中间件/cache/db0 显式接线）；生产 connector 检查                               | ⬜   |
| soybean-ui 缺口组件（Upload/Descriptions 等 22 个 P0/P1） | 中   | §7.3 清单化；应用层先行 + 向上游提 PR 双向收敛                                                                 | ⬜   |
| `SAppShell` API 世代（0.50.0 稳定 vs 本地 beta 源）       | 中   | 架子 API 以 `SAppShell` 为目标设计；beta 期调整由 §5.2 一层映射隔离                                            | ⬜   |
| vite-plus 工具链接受度                                    | 中   | 保留 eslint 兼容配置导出；CI 双跑一个 Phase 后收敛                                                             | ⬜   |
| `SAppShell` 模式组合盲区（6 mode × 配置项）               | 中   | P2-20 矩阵 PoC；盲区项降级为 5 模式或 `layoutProps` 透传 `SLayout` 兜底                                        | ⬜   |
| lite/main 双分支漂移                                      | 中   | 差异文件清单 CI 校验；每季度单向同步                                                                           | ⬜   |
| 功能回归遗漏（隐形能力）                                  | 中   | §5.9 清单转 e2e 用例（P4-02）                                                                                  | ⬜   |
| 与 v2 用户迁移断层                                        | 低   | 适配器（独立仓库）+ 迁移指南 + 字段映射表（G-01）                                                              | ⬜   |
| 适配器契约未定                                            | 中   | 先定契约签名（G-02）；**已查实 `useTheme()` / `useThemeSettings()` 提供等价能力**；首版先在 admin 内实现再抽包 | ⬜   |

---

## 里程碑与分支计划

```
main          v3.0.0-beta → rc → stable（全栈版）
lite          从 main Phase 2 完成后切出，跟随 main 里程碑同步
v2.x          维护分支仅收安全/严重 bug，README 置顶迁移指引
```

| 里程碑 | 内容                        | 依赖               | 状态 |
| ------ | --------------------------- | ------------------ | ---- |
| M0     | Phase 0 完成（地基）        | —                  | 🟡   |
| M1     | Phase 1 完成（后端内核）    | M0                 | ⬜   |
| M2     | Phase 2 完成（前端架子）    | M1                 | ⬜   |
| M2.5   | lite 分支切出               | M2                 | ⬜   |
| M3     | Phase 3 完成（业务页面）    | M2                 | ⬜   |
| M4     | Phase 4 完成（插件 + 增值） | M3                 | ⬜   |
| M5     | Phase 5 完成（适配 + 发布） | M4 + G-02 契约落地 | ⬜   |

---

## 变更记录

| 日期    | 变更                                                                                                                                                                                                                                                                                                                                                                                                                                                                                |
| ------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 2026-10 | 初版：依据 `docs/v3.md`（`1126c7fb`）生成任务清单与状态跟踪表                                                                                                                                                                                                                                                                                                                                                                                                                       |
| 2026-10 | Phase 0 实施后校准：P0-01/03/04/05/06/07/09/11 → ✅；P0-02/08/10 → 🟡；勘误 P0-04（`@/*` 非 `#/`）与 P0-08（`defineEnv()` 只读 `process.env`）；G-02 据实更新                                                                                                                                                                                                                                                                                                                       |
| 2026-10 | Phase 0 收尾：P0-02 → ✅（`.vite-hooks/` 提交、清理 v2 `sa` 钩子、`prepare` = `vp config --no-agent`）；X-05/X-06 → ✅；新增 G-06（UnoCSS 样式丢失抽查）；合计 80 任务                                                                                                                                                                                                                                                                                                              |
| 2026-10 | 调整两项：locale key 改 `zh`/`en`（`src/locales/{zh,en}.json`，路径 `/en/...`；**发现 `@vean/aria` 出厂只注册 `en`/`zh-CN` 且未知 key 静默回落 `en`** → 新增 `src/shared/vean-locale.ts` 补注册 + `vean-locale.test.ts` 守卫）；样式管线改为 `@vean/ui` 注入 styles.css + `@vean/unocss` 仅作 preset（发现 `ui: true` 的 css 注入在构建路径失效 → 改为显式 `import '@vean/ui/styles.css'`，并给 UnoCSS 加 `content.pipeline.exclude: [/node_modules/]`）；G-06 扩为「样式产物抽查」 |
