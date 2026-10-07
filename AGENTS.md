# AGENTS.md

本仓库 AI agent（及协作者）的执行规约。设计原文见 `docs/v3.md`，任务分解与进度跟踪见 `docs/v3-task.md`。

## 必读 skills（执行规约，非可选参考）

位置：`~/.agents/skills/<name>/SKILL.md`。写代码前按触发条件先读对应 skill：

| skill                         | 触发条件（满足其一即读）                                                                |
| ----------------------------- | --------------------------------------------------------------------------------------- |
| `ubean`                       | 改 `ubean.config.ts`、写 `src/pages/**` / `src/routes/api/**`、用 `defineEnv` / codegen |
| `vean-ui`                     | 用任何 `S*` 组件（`@vean/ui`）时；组件文档在 `vean-ui/components/*.md`                  |
| `vean-aria`                   | 用无样式原语（`@vean/aria`）、自建组件、定制 class map 时                               |
| `vue-sfc-structure`           | 每个 `.vue` 文件                                                                        |
| `typescript-functional-style` | 每个 `.ts` / `.tsx` 文件                                                                |
| `pnpm-deps-upgrade`           | 升级依赖时（`upkg` → 锁文件重装 → 修 allowBuilds → 门槛 → 提交推送）                    |

其他 skill（`vue`、`pinia`、`unocss`、`vitest`、`vite`、`pr`、`code-review`、`diagnosing-bugs`、`tdd`、`writing-for-agents`）在对应场景按需读。完整索引见 `docs/v3.md` §11.2。

## 提交规约

提交信息遵守 [Conventional Commits](https://conventionalcommits.org)，**用英文书写**（type、scope、description 全英文）：

```
<type>(<scope>)!: <description>

feat(v3): P2-08 login modules — captcha login, register, reset password
fix(router): keep the auth guard browser-only under dev prerender
chore(deps): update deps
```

- type 取 `feat` / `fix` / `docs` / `style` / `refactor` / `perf` / `optimize` / `test` / `build` / `ci` / `chore` / `revert`
- scope 自由，常用 `v3`、`projects`、`components`、`types`、`deps`
- `!` 标注破坏性变更
- 格式由 `.vite-hooks/commit-msg`（`soy git-commit-verify`）校验，不合规的提交会被拒绝；`.vite-hooks/pre-commit` 跑 `vp staged`，自动 lint / 格式化暂存文件
- 交互式生成合规提交：`pnpm commit`

## 交付门槛

一次改动收尾前，下列检查必须全绿：

```
pnpm typecheck && pnpm lint && pnpm test && pnpm build && pnpm analyze:check
```

`pnpm test` 是真实 HTTP 集成测试（`test/global-setup.ts` 自起 dev server，端口 9527）；`pnpm analyze:check` 对比 `benchmarks/bundle-baseline.json`，包体合法增长时用 `pnpm analyze` 重写基线并在提交信息里说明。

## 硬约定（配置里推不出、必须遵守）

- 别名：`@/*` → `src/*`，`~ubean/*` → `./.ubean/*`。`.ubean/**`、`src/router/_generated/**`、`dist/**` 是 codegen 与构建产物，直接手改会在下次生成时丢失。
- 契约单一来源：DTO 与校验写 `src/schema/**`（Valibot）；接口响应固定 `{ code, message, data }`，业务码集中在 `src/constants/error-code.ts`；新端点要同步 `.ubean/openapi.d.ts` 所依赖的路由定义。
- 新增或修改端点时，在 `test/api.test.ts` 补真实 HTTP 用例（成功路径、错误业务码、未授权 2000）。
- 样式只走 `@vean/ui` + UnoCSS（`uno.config.ts` = `presetSoybean()` + `presetUi()`）；全局样式进 `src/styles/`。
- i18n 文案写 `src/locales/{zh,en}.json`；新增 key 后先跑一次 `pnpm dev`（或 `pnpm build`）让 `.ubean/i18n.d.ts` 重新生成，再 `pnpm typecheck`。
- 提交前同步文档状态：Phase 任务完成后更新 `docs/v3-task.md` 的行状态、总览计数、「进度快照」与「变更记录」。
- lint 硬约束（`eslint.config.mjs`）：禁 `any`；禁 `as T` 断言（`as const` 例外）；宏顺序 `defineOptions → defineProps → defineEmits → defineSlots → defineModel`；模板内用具名函数，不写内联箭头函数。

## 已知陷阱（踩过，别重踩）

- ubean dev 会对每个 HTML 请求在 Node 里预渲染执行应用与 vue-router 守卫，那里 `import.meta.server === false` 且没有 `window` / `localStorage`。浏览器专属逻辑（鉴权重定向、localStorage 读取）在守卫顶部用 `typeof window === 'undefined'` 早退；判据是能力检测，不是编译标志。
- router 单例只从 `src/router/instance.ts` 的 `getRouter()` 取：store / 布局 / 页面 import 它，而 `@/router` 只导出 `setupRouterGuard`。否则 store ↔ router 模块环会让 dev 转换管线静默死锁。
- 本机 curl 访问 dev server 用 `--noproxy '*'`，否则系统代理会返回 502。
