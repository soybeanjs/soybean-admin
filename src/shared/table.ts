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

/** 列表接口响应里 `data` 的形状（8 套 CRUD 共用，即 `src/schema/_shared.ts` 的 `PagedData`） */
export interface PageResult<Item> {
  current: number;
  size: number;
  total: number;
  list: Item[];
}

/** 空页（`size` 与后端 schema 默认值一致，避免首帧跳页） */
export function createEmptyPageResult<Item>(size = 10): PageResult<Item> {
  return { current: 1, size, total: 0, list: [] };
}

/**
 * 页面查询对象约束：`page` / `pageSize` 由分页组件驱动，其余为业务搜索字段。
 *
 * 与 `src/composables/use-table-operate.ts` 的 `TableQuery` 同形状，这里单独声明
 * 是为了让 `src/shared` 不反向依赖 `src/composables`。
 */
export interface TablePageQuery {
  page?: number;
  pageSize?: number;
  [key: string]: unknown;
}

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
export function toPageQuery<T extends TablePageQuery>(query: T) {
  const { page, pageSize, ...rest } = query;

  return { current: page, size: pageSize, ...rest };
}

/**
 * `{ current, size, total, list }` → `@vean/ui` 的 `PaginationResult`。
 *
 * `defaultTableTransform` 是它更常用的别名形态，页面直接把它交给
 * `usePaginatedTable({ transform })`。
 */
export function toTablePagination<Item>(page: PageResult<Item>) {
  return {
    page: page.current,
    pageSize: page.size,
    total: page.total,
    list: page.list
  };
}

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
export function defaultTableTransform<Item>(page: PageResult<Item> | undefined | null) {
  return toTablePagination(page ?? createEmptyPageResult<Item>());
}
