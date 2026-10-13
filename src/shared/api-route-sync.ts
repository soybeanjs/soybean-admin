import { normalizeApiPermissionPath } from './route';

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

/** 路由注册钩子 / `api` 表行共用的形状 */
export type RegisteredRoute = { method: string; path: string };

/** 归一后的「方法 + 权限路径」，两侧比对都降到这个形状 */
export type NormalizedApiKey = { method: string; path: string };

export type ApiRouteDiff = {
  /** 归一化后的方法（小写） */
  method: string;
  /** 权限码里的路径段（`/user/list`、`/user/[id]`） */
  path: string;
  /** 权限码，如 `api:get:(/user/[id])` */
  code: string;
  /** `api` 表里的原始录入值（路由侧无此概念，与 `path` 同形） */
  sourcePath: string;
};

export type ApiRouteSyncResult = {
  /** 路由有、`api` 表没有 → 该端点无权限点可授予 */
  missing: ApiRouteDiff[];
  /** `api` 表有、路由没有 → 表里是幽灵行（路由已删或路径写错） */
  stale: ApiRouteDiff[];
};

/** 键（方法 + 归一路径），两侧比对统一走它 */
function keyOf(key: NormalizedApiKey): string {
  return `${key.method} ${key.path}`;
}

function toCode(key: NormalizedApiKey): string {
  return `api:${key.method}:(${key.path})`;
}

/** 补前导斜杠 + `:id` → `[id]`，但**不**剥 `/api` 前缀 */
function canonicalizeRaw(path: string): string {
  const normalized = path.startsWith('/') ? path : `/${path}`;

  return normalized.replace(/:(\w+)/g, '[$1]');
}

/**
 * 路由注册钩子回传的是 hono 模板（`/api/user/:id`），带 `/api` 挂载前缀；
 * 权限码里的 path 不含该前缀 → 剥一次。
 */
function routeKey(route: RegisteredRoute): NormalizedApiKey {
  return { method: route.method.toLowerCase(), path: normalizeApiPermissionPath(route.path) };
}

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
function apiKeyCandidates(row: RegisteredRoute): NormalizedApiKey[] {
  const method = row.method.toLowerCase();
  const stripped = normalizeApiPermissionPath(row.path);
  const raw = canonicalizeRaw(row.path);

  return stripped === raw
    ? [{ method, path: stripped }]
    : [
        { method, path: stripped },
        { method, path: raw }
      ];
}

function dedupeByKey<T extends NormalizedApiKey>(items: readonly T[]): T[] {
  const seen = new Map<string, T>();

  items.forEach(item => seen.set(keyOf(item), item));

  return [...seen.values()];
}

/**
 * 对账（纯函数）。
 *
 * - `missing`：真实路由的归一键不在「`api` 表全部候选键」集合里；
 * - `stale`：`api` 行的**全部**候选键都不在真实路由集合里。
 */
export function diffApiRoutes(
  routes: readonly RegisteredRoute[],
  apiRows: readonly RegisteredRoute[]
): ApiRouteSyncResult {
  const routeKeys = dedupeByKey(routes.map(routeKey));
  const routeSet = new Set(routeKeys.map(keyOf));

  const apiCandidateKeys = new Set(apiRows.flatMap(row => apiKeyCandidates(row)).map(keyOf));

  const missing = routeKeys
    .filter(key => !apiCandidateKeys.has(keyOf(key)))
    .map(key => ({ ...key, code: toCode(key), sourcePath: key.path }));

  // 每个 api 行只报一次：候选键全不命中真实路由即为幽灵行
  const staleByRow = new Map<string, ApiRouteDiff>();

  apiRows.forEach(row => {
    const candidates = apiKeyCandidates(row);

    if (candidates.some(candidate => routeSet.has(keyOf(candidate)))) return;

    const [first] = candidates;
    const dedupeKey = `${first.method} ${row.path}`;

    if (staleByRow.has(dedupeKey)) return;

    staleByRow.set(dedupeKey, {
      method: first.method,
      path: first.path,
      code: toCode(first),
      sourcePath: row.path
    });
  });

  return { missing, stale: [...staleByRow.values()] };
}

/** 把对账结果渲染成启动日志（无差异时返回空数组） */
export function formatApiRouteDiff(diff: ApiRouteSyncResult): string[] {
  const lines: string[] = [];

  if (diff.missing.length) {
    lines.push(
      `[api-route-sync] ${diff.missing.length} 条路由在 api 表里没有登记（这些端点无法授予权限，只有 super 能访问）：`
    );
    diff.missing.forEach(item => lines.push(`  + ${item.code}`));
  }

  if (diff.stale.length) {
    lines.push(`[api-route-sync] ${diff.stale.length} 条 api 表记录找不到对应路由（幽灵行）：`);
    diff.stale.forEach(item => lines.push(`  - ${item.code}  (api.path = ${item.sourcePath})`));
  }

  if (lines.length) {
    lines.push('  （修法：同步 src/db/seed-data.ts 的 seedApis，或删除已下线端点）');
  }

  return lines;
}
