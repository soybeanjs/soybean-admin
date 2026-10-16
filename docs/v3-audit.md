# soybean-admin v3.0 代码审查报告

> 审查范围：全仓（`src/**`、`scripts/**`、`test/**`、构建与部署配置、依赖清单）
> 审查方式：静态阅读 + `grep` 全树引用核对 + `pnpm typecheck` / `pnpm lint`
> 审查基线：`c02c517a`（fix(v3): keep the theme customizer inside the drawer content column）
> 假设负载：单实例部署，几十个管理员并发操作后台。凡涉及「多实例」「高并发」的结论均按此前提标注。
> 最后更新：2026-10

---

## 0. 仓库概览

soybean-admin v3 是一个全栈后台模板：ubean（Hono + Vite）做服务端，Vue 3 + `@vean/ui` 做前端，SQLite（drizzle）存数据，Valibot 同时驱动服务端校验与登录页表单。前端 92 个页面 + 后端 61 个路由文件，业务为用户 / 角色 / 权限 / 菜单 / 字典 / 组织六套 CRUD 加一套 RBAC。

**本次已核验的门槛**：`pnpm typecheck`（`vue-tsc --noEmit --skipLibCheck`）通过；`pnpm lint`（`vp lint --fix && eslint --fix .`）通过，无输出。
**未核验的门槛**：`pnpm test`、`pnpm build`、`pnpm analyze:check`。

**审查覆盖度**：`src/services/**`、`src/routes/**`、`src/db/**`、`src/middleware/**`、`src/shared/**`、`src/request/**`、`src/composables/**`、`src/store/**`、`src/layouts/**`、`scripts/**` 逐行读过；`src/pages/**`（92 个页面）、`src/components/**`、`src/locales/**` 只做结构层面扫描。

---

## 1. Must fix

会丢数据、能被绕过、或在预期负载下直接坏掉的项。

### 1.1 JWT_SECRET 是仓库里的公开常量，且空值会静默回落到它

- **位置**：`src/env.server.ts:18`、`.env:63`、`.env.prod:2`
- **问题**：签名 JWT 用的密钥，`defineEnv` 给的默认值是 `'soybean-admin-v3-dev-secret-change-me'`。`node_modules/@ubean/shared/dist/index.js:137-149` 里空字符串等同「没给」，于是取 `default`；`.env.prod` 写的正是 `JWT_SECRET=`（空）→ 生产用仓库里公开的占位符签名。而 `.env` 被 git 跟踪（`git ls-files` 列出 `.env`），占位符本身就是公开的。任何人拿它就能签一个 `{id:'U_admin',username:'admin'}` 的 token，直接是超管。
- **修法**：`src/env.server.ts` 去掉 `JWT_SECRET` 的 `default`，改成生产必填（`mode:'throw'` 才会真的抛）；`.env` 从 git 移除，只留 `.env.example`。
- **不修的后果**：忘记改环境变量的部署，等于没有鉴权。

### 1.2 删用户是硬删，但接口文档写的是软删

- **位置**：`src/services/user.service.ts:192-197` vs `src/routes/api/user/[id].ts:57`、`src/routes/api/user/batch-delete.ts:13`
- **问题**：实现是 `delete(userRole)` + `delete(user)` —— 物理删除，不可恢复；OpenAPI 描述写的是「按主键软删用户（enabled 置为 D）」。而 `enabled` 的 CHECK 约束本来就允许 `'D'`（`src/db/migrations.ts` 的 `ENABLED_CHECK`），说明表是为软删设计的。调用方按描述以为数据还在，实际已经没了。
- **修法**：改成 `update(user).set({ enabled: 'D' })`，或把描述改成硬删 —— 二选一，但必须一致。
- **不修的后果**：误删的用户救不回来，且前端/第三方按文档写的补偿逻辑全部失效。

### 1.3 删菜单 / 接口后权限缓存不失效

- **位置**：`src/services/menu.service.ts:300-330`、`src/services/api-org.service.ts:120-127`
- **问题**：权限码存在 KV 里，TTL 300 秒（`src/shared/permission-cache.ts` 的 `PERMISSION_CACHE_TTL`）。`deleteMenu` 会删掉 `permission` 表里 `resourceType='menu'` 的行，但从不调用 `invalidateAllPermissionCache()`；而 `src/services/permission.service.ts:188/195` 是会调的。于是被删菜单的权限码在用户缓存里最长再活 5 分钟，前端按钮照样显示、`v-auth` 照样通过。`deleteApi` 更糟：它连 `permission` 行都不清，留下永久悬挂的 `api:get:(/xxx)` 权限码。
- **修法**：两个方法各加一行 `await invalidateAllPermissionCache()`；`deleteApi` 里补删 `permission.resourceId === id` 的行。更好的做法是抽一个「任何写权限相关表的操作都走它」的统一失效入口，而不是靠每个 service 自觉。
- **不修的后果**：撤销权限后最多 5 分钟内仍然有效；删除接口后权限码永久残留。

### 1.4 `appDb` 连接没开 `foreign_keys`，外键形同虚设

- **位置**：`src/db/index.ts:87-89` vs `src/db/index.ts:189`
- **问题**：两个 SQLite 连接。`createSqliteDatabase` 设了 `pragma('foreign_keys = ON')`，`createAppDb` 只写了 `drizzleSqlite(new Database(...), { schema })`，没有任何 pragma。better-sqlite3 的 `foreign_keys` 默认是 **OFF**，而所有业务写操作都走 `appDb`。所以 `src/db/migrations.ts` 里声明的 `REFERENCES ... ON DELETE CASCADE` 一条都不生效：插入一条指向不存在 role 的 `user_role` 会成功，删除父行不会级联。`src/services/dict.service.ts:112-116` 手动删 `dictItem` 正是「外键没被信任」的症状。
- **修法**：一行 —— 在 `appDb` 的连接上也开 pragma；或干脆复用 `createSqliteDatabase` 那一个连接，省掉重复打开同一个文件。
- **不修的后果**：脏数据悄悄累积，只在查询对不上时才暴露。

### 1.5 生产环境缓存全在进程内存，多实例下登出的 token 还能用

- **位置**：`.env.prod:4`、`src/shared/auth.ts`（`blacklistStore`）、`src/shared/permission-cache.ts`、`src/services/captcha.service.ts`
- **问题**：token 黑名单、权限缓存、图形验证码三个 KV 都走 `useKV`，`REDIS_URL` 为空时落到进程内存驱动，而 `.env.prod` 里 `REDIS_URL=` 是空的。两个实例时：A 实例登出把 token 写进自己的黑名单，B 实例从没见过这个 key，`isTokenBlacklisted` 返回 false → 已登出的 token 在 B 上继续有效。权限缓存同理（撤销权限后其它实例无限期认为有效，因为失效广播也只发到本进程）。验证码跨实例必然失败。
- **修法**：生产把 `REDIS_URL` 设成必填（同样去掉默认空值，让启动期就炸）；若确定单实例，在 `.env.prod` 注释里明确写死这个前提。
- **不修的后果**：横向扩容那天，鉴权变成「看请求打到哪台机器」。

### 1.6 登录没有频率限制，验证码可选，种子密码是 `123456`

- **位置**：`src/schema/auth.ts:32-38`、`src/db/seed-data.ts:43,52`
- **问题**：`pwdLoginSchema` 的 `captchaId` / `captchaCode` 都是 `optional`，两个都传才校验。`grep -rn "rateLimit\|attempt\|throttle" src/` 无结果 —— 全仓没有任何登录限流或锁定。加上不传验证码也能登录，`POST /api/auth/login` 可以无限次猜密码，而种子用户是 `admin/123456`。
- **修法**：用现成的 KV 加一个按用户名 / IP 的失败计数（如 5 次后强制要求验证码），或接入 ubean 的限流中间件。
- **不修的后果**：线上就是一个可无限尝试的密码爆破口。

### 1.7 PostgreSQL 分支返回错误类型，参数还会错位

- **位置**：`src/db/index.ts:194-206`、`src/db/index.ts:127`
- **问题**：`isBetterSQLite3Database(pgDb)` 的实现是 `'select' in value && 'insert' in value`（结构判断），Postgres 的 drizzle 实例同样满足 → 它被当作 `BetterSQLite3Database<typeof schema>` 返回。这是运行时的谎：所有 service 都在用 SQLite 特有的 `.get()` / `.all()`。另一处 `:127` 的 `values.filter(isSerializableValue)` 会**从参数数组里删元素**，而查询文本里的 `$1..$n` 位置不变：`` sql`... a = ${1} and b = ${undefined}` `` 生成 2 个占位符却只剩 1 个参数 → `bind message supplies 1 parameters, but prepared statement requires 2`。
- **修法**：直接删掉 PG 分支（v3 本来就是 SQLite-only，`migrations.ts` 的 DDL 也全是 SQLite 语法，`datetime('now','localtime')`、`check (...)` 在 PG 上跑不了）；真要做 PG 就重写参数处理，不要用 `filter`。
- **不修的后果**：谁信了「支持 postgres」这句注释去切库，会在启动或首个请求时炸，且报错指不到真正的原因。

---

## 2. Should fix

没有测试覆盖的风险代码、真实的慢路径、重复实现、职责混杂。

### 2.1 所有多表写操作都没有事务

- **位置**：`grep -rn "\.transaction(" src/` 为空。具体：`src/services/user.service.ts:192`（userRole + user）、`src/services/role.service.ts:159-166`（rolePermission + userRole + role）、`src/services/permission.service.ts:188`（rolePermission + permission）、`src/services/menu.service.ts:300-330`（permission + menu）、`src/services/dict.service.ts:112-116`（dictItem + dict）、`src/services/api-org.service.ts`（组织删除）
- **问题**：每条 `.run()` 是各自独立的隐式事务，中间抛错就留下半删除状态（比如权限行没了、菜单还在）。
- **修法**：每个多语句块包一层 `appDb.transaction(tx => ...)`，SQLite 同步驱动下几乎零成本。
- **不修的后果**：一次失败留下需要人工比对的中间态。

### 2.2 列表接口 N+1 查询

- **位置**：`src/services/user.service.ts:60-66`、`src/services/role.service.ts:60-68`
- **问题**：`getUserList` = 1 次 count + 1 次 select + **每行 1 次** role 查询；默认 `size=10` 就是 12 条 SQL，`size=100`（schema 上限，见 `src/schema/_shared.ts:92` 的 `maxValue(100)`）就是 102 条。`getRoleList` 每行一次 `userCount` 查询，同样的问题。
- **修法**：一次 `inArray` 批量查关联行 + `groupBy` 计数，在 JS 里按 id 合并。
- **不修的后果**：每页 100 条时接口慢一个数量级。

### 2.3 `ACTOR = 'admin'` 在六个 service 里硬编码

- **位置**：`src/services/user.service.ts:27`、`src/services/menu.service.ts:20`、`src/services/api-org.service.ts:18`、`src/services/permission.service.ts`、`src/services/role.service.ts`、`src/services/dict.service.ts`
- **问题**：无论谁调用，写进 `created_by` / `updated_by` 的永远是字符串 `'admin'`。表上专门建了审计列，但审计轨迹是假的 —— 出问题查不到是谁改的。而 `src/middleware/01.auth.ts` 已经把 `c.get('userId')` 放好了，现成的没用。
- **修法**：把 actor 作为参数传进 service（路由层从 context 取）；或承认不做审计、把列删掉。
- **不修的后果**：「谁改的」这个问题永远没有答案。

### 2.4 `updateUser` 无条件重写 password 列

- **位置**：`src/services/user.service.ts:163,175`
- **问题**：`const nextPassword = dto.password ? await hashPassword(dto.password) : current.password`，然后**永远**写 `password: nextPassword`。改个手机号也会重写哈希列 —— 值虽然没变，但「这一行密码变过吗」再也无法回答，将来加触发器或 CDC 会全量误报。
- **修法**：按条件拼 update 对象，`dto.password` 为空时不带 `password` 字段。
- **不修的后果**：审计和增量同步都失去判断依据。

### 2.5 `register` 用 `crypto.randomUUID()`，且新用户没有任何角色

- **位置**：`src/services/auth.service.ts:236`
- **问题**：全仓其它地方（`src/shared/uuid.ts` 的 `createUuidV7()`）都用 UUIDv7，只有这里用 `randomUUID()` —— 违反仓库自己的约定，主键不再按时间有序，索引局部性变差。另外注册用户不分配角色，`roles` 为空，登录后任何 RBAC 接口都进不去。
- **修法**：换成 `createUuidV7()`；明确注册后是否给默认角色。
- **不修的后果**：注册完的用户登录即「无权限」，看起来像坏了。

### 2.6 权限判断用线性数组查找

- **位置**：`src/shared/permission.ts:38`、`src/services/permission.service.ts`（`checkUserHasPermission` 内的 `codes.includes(code)`）
- **问题**：`required.some(code => codes.includes(code))` 是 O(n·m)，每渲染一个按钮跑一次；服务端 `checkUserHasPermission` 用 `Array.includes`，每个请求跑一次。缓存里存的本来就是数组，等于每请求一次线性扫描。
- **修法**：缓存改成存 `Set`（或 `Record<string, true>`），判断降成 O(1)。
- **不修的后果**：权限码数量上来后，鉴权中间件是每个请求的固定开销。

### 2.7 `isApiResponseStructure` 靠字段名猜是不是响应封装

- **位置**：`src/shared/response.ts:33-43`（消费方 `src/middleware/02.response.ts`、`src/request/factory.ts` 的 `readEnvelope`）
- **问题**：判断是「对象里同时有 `code`、`message`、`data` 三个 key」。任何业务数据碰巧长这样（比如某个列表项恰好是 `{code, message, data}` 结构）就不会被包装，客户端会把业务数据当封装解析 → 拿到错的 data。
- **修法**：用一个显式标记（内部类 / 品牌字段）代替字段名嗅探。
- **不修的后果**：某天某个接口的数据形状刚好撞上，前端静默取错值。

---

## 3. Nice to have

### 3.1 六个导出零引用，可以删

全仓 grep（含 `test/`、`scripts/`）零调用点：

| 文件                          | 导出                                                         |
| ----------------------------- | ------------------------------------------------------------ |
| `src/shared/pagination.ts`    | `resolvePagination`、`resolveSort`（含 `ResolvedSortField`） |
| `src/shared/theme-preset.ts`  | `readThemeState`                                             |
| `src/request/internal.ts`     | 整个文件（`createServerApi`）                                |
| `src/shared/layout-matrix.ts` | `MATRIX_DIMENSION_LABELS`                                    |

另有 `src/middleware/01.auth.ts` 的 `getAuthUser`、`src/db/index.ts` 的 `isRawSqlValue` 与 `joinTemplate` 里的 rawSql 分支同样无人调用。

### 3.2 分页 / 排序实现重复两份

`src/shared/pagination.ts` 的两个函数没人用，而八个 service 各自手写 `const offset = (query.current - 1) * query.size` 与 `query.sort ?? '-createdTime'`：`src/services/permission.service.ts:75`、`api-org.service.ts:29,139`、`user.service.ts:47`、`menu.service.ts:192`、`dict.service.ts:29,144`、`role.service.ts:47`。删掉重复的那份，让 service 调同一个 helper。

### 3.3 `src/shared/index.ts` 这个 barrel 无人导入，且 re-export 了服务端模块

`grep -rn "from '@/shared'" src/ test/` 零结果。它还 `export * from './auth'`，而 `src/shared/auth.ts` 引入了 `useKV` 和 `serverEnv`。删掉它，顺手消掉一个客户端打包隐患。

### 3.4 `01.auth.ts` 与 `01.global.ts` 都是 `order: 1`

`.ubean/virtual/routes.mjs:83-86` 里两条都是 `order: 1`。`node_modules/@ubean/routes/dist/index.js:87` 的 `sort((a, b) => a.order - b.order)` 是稳定排序，实际顺序由文件顺序决定，编号想表达的先后关系丢失了。改成 `01.global` / `02.auth` / `03.response` / `04.error`。

### 3.5 `layout-matrix.ts` 562 行里只有两个函数是生产代码

生产只用了 `resolveLayoutMatrix` 和 `resolveMenuProps`（`src/layouts/default.vue:68,78`）。`describeLayoutMatrix`、`MATRIX_DIMENSIONS`、`MATRIX_DIMENSION_LABELS`、`isCellEffective`、`APP_SHELL_MATRIX_VERSION`、`MatrixReason` / `degraded` 全部只在 `test/specs/shared/layout-matrix.test.ts` 里出现。那个 19 个 `DimensionCell` 的诊断对象每次 computed 重算都在构造，但只读了 `.shell` / `.layoutProps`。

### 3.6 每个已鉴权请求都全量加载用户信息

`src/middleware/01.auth.ts` 在验证 token 之后 `await authService.getUserInfo(payload.id)`，而它只用到了 `roles`（判断是不是 super）。这一次调用含一次角色查询加一次权限码 KV 读，每个请求都跑。把 `roles` 放进 token，或写一个只取角色的轻查询即可。

---

## 4. 结论与建议顺序

**结论**：结构清晰、分层正确、`typecheck` 与 `lint` 全绿，但没有事务、没有登录限流、外键没开、生产密钥是公开占位符。

**建议修复顺序**：先修 1.1、1.2、1.4、1.5、1.7 —— 这五条会丢数据或能被绕过；1.3、1.6 紧随其后。

**可精简量**：约 -270 行、-0 依赖（死代码 + 重复分页实现 + `layout-matrix` 的测试专用部分）。

---

## 5. 未检查项

- `pnpm test`、`pnpm build`、`pnpm analyze:check` 未跑（仅跑了 `typecheck` 和 `lint`，均通过）。
- `src/pages/**` 的 92 个页面组件、`src/components/**`、`src/locales/**` 只做结构层面扫描，未逐行审。
- `scripts/remove-i18n.ts`（738 行）、`test/integration/api.test.ts`（1115 行）未逐行审。
- `src/services/captcha.service.ts` 只看了接口，未看实现。
- 前端页面的逐行审查与实际运行验证未做，因此涉及前端的结论只有静态证据。
