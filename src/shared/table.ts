/** 表格数据适配（v3 §5.7，P3-02） 详见 docs/v3-notes.md N-174。 */

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

/** 页面查询对象约束：`page` / `pageSize` 由分页组件驱动，其余为业务搜索字段 详见 docs/v3-notes.md N-175。 */
export interface TablePageQuery {
  page?: number;
  pageSize?: number;
  [key: string]: unknown;
}

/** 泛型保留其余字段，调用方可以直接把它喂给 typed client 的 `query`： 详见 docs/v3-notes.md N-176。 */
export function toPageQuery<T extends TablePageQuery>(query: T) {
  const { page, pageSize, ...rest } = query;

  return { current: page, size: pageSize, ...rest };
}

/** `{ current, size, total, list }` → `@vean/ui` 的 `PaginationResult` 详见 docs/v3-notes.md N-177。 */
export function toTablePagination<Item>(page: PageResult<Item>) {
  return {
    page: page.current,
    pageSize: page.size,
    total: page.total,
    list: page.list
  };
}

/** `usePaginatedTable` 的 `transform`（应用层范式，v3 §5.7）。 */
export function defaultTableTransform<Item>(page: PageResult<Item> | undefined | null) {
  return toTablePagination(page ?? createEmptyPageResult<Item>());
}
