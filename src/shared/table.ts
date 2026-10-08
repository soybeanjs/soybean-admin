/**
 * 表格数据适配（v3 §5.7，P3-02）。
 *
 * `usePaginatedTable`（`@vean/ui`）要求 `transform` 把接口响应映射成统一的
 * `PaginationResult`（`{ page, pageSize, total, list }`）；本后端列表接口返回的
 * 却是 `{ current, size, total, list }`（见 `src/schema/shared.ts` 的
 * `paginationQuerySchema`）。这一层做**唯一一次**字段改名，页面不再各自手写
 * `{ page: data.current, ... }`。
 *
 * 空页兜底是刻意的：`usePaginatedTable` 把 `transform` 的返回直接赋给
 * `tableData`，列表失败时（`flatApi` / `flatRequest` 永不抛异常，只在 `error`
 * 上报）必须给出形状合法的空页，否则表格会拿到 `undefined`。
 */

/** 列表接口响应里 `data` 的形状（8 套 CRUD 共用，见各 `*.service.ts`） */
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
 *   api: () => fetchUserPage(query.value),
 *   transform: defaultTableTransform,
 *   columns: () => [...]
 * });
 * ```
 */
export function defaultTableTransform<Item>(page: PageResult<Item> | undefined | null) {
  return toTablePagination(page ?? createEmptyPageResult<Item>());
}
