import { normalizeApiPermissionPath } from './route';

/** 路由 ↔ `api` 表对账（§5.2 第 5 条） 详见 docs/v3-notes.md N-135。 */

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
 * 路由注册钩子回传的是 hono 模板（`/api/user/:id`），带 `/api` 挂载前缀；权限码里的 path 不含该前缀 → 剥一次。
 */
function routeKey(route: RegisteredRoute): NormalizedApiKey {
  return { method: route.method.toLowerCase(), path: normalizeApiPermissionPath(route.path) };
}

/** `api` 表行的候选键（可能命中多个） 详见 docs/v3-notes.md N-137。 */
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

/** 对账（纯函数） 详见 docs/v3-notes.md N-138。 */
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
