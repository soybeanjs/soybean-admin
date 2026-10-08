/**
 * 管理域分页/行类型（P3-03）。
 *
 * 服务端行结构来自 drizzle `$inferSelect`，客户端拿不到该类型依赖，这里按
 * `src/db/schema/*.ts` 手工镜像。**与 `src/typings/app.d.ts` 同性质**：服务端
 * 列变更需同步本文件（`test/api.test.ts` 的 CRUD 生命周期用例是护栏）。
 */

/** 8 套 CRUD 共用的分页响应（`{ total, current, size, list }`） */
export interface ManagePage<Item> {
  total: number;
  current: number;
  size: number;
  list: Item[];
}

/** 审计四字段（所有业务表共有） */
export interface AuditFields {
  createdBy: string;
  createdTime: string;
  updatedBy: string;
  updatedTime: string;
}

/**
 * 分页查询参数。
 *
 * 两个用途共用一份类型：
 * - **表格状态**：`page` / `pageSize`（`useTableOperate` 会把它们写进 query，
 *   并被 `usePaginatedTable` 的页码驱动）；
 * - **HTTP 查询串**：后端 `paginationQuerySchema` 只认 `current` / `size` /
 *   `sort`，调用处做这一次改名（见各页 `api` 回调）。
 *
 * 索引签名是必需的：`useTableOperate<T extends TableQuery>` 要求 `T` 满足
 * `{page?: number; pageSize?: number; [key: string]: unknown}`，而
 * `interface X extends Record<string, unknown>` 在 TS 里不成立（索引签名缺失）。
 */
export type ManagePageQuery = {
  /** 页码（客户端表格状态；提交接口时映射为 `current`） */
  page?: number;
  /** 每页条数（客户端表格状态；提交接口时映射为 `size`） */
  pageSize?: number;
  /** 排序表达式，如 `-createdTime`（`-` 前缀为倒序） */
  sort?: string;
  [key: string]: unknown;
};

/**
 * 表格查询状态（`page`/`pageSize`）→ 后端分页查询串（`current`/`size`）。
 *
 * 后端 `paginationQuerySchema`（`src/schema/shared.ts`）只认 `current` / `size`，
 * 本仓表格状态用的是 `page` / `pageSize`；两边都保留原名，只在这一处改名。
 * 空值另行交给 `filterValidQuery`。
 *
 * ```ts
 * fetchApiList(toPageQuery(filterValidQuery(query.value)))
 * ```
 */
export function toPageQuery(query: Record<string, unknown>): Record<string, unknown> {
  const { page, pageSize, ...rest } = query;
  return { current: page, size: pageSize, ...rest };
}
