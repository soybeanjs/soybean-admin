/**
 * 列表查询的公共算式（审计 3.2）。
 *
 * 迁移前 8 处列表方法各自手写 `const offset = (query.current - 1) * query.size`。
 * 排序默认值不用单独兜底的函数 —— `resolveSortColumn(sort, table, fallback)` 的第三参
 * 已经是「缺省时用哪一列」，各用一句 `const sort = query.sort ?? '-createdTime'` 只是
 * 把同一个约定抄了 8 遍。
 */

/** 分页游标：`current` 从 1 开始，`size` 由 schema 的 `maxValue` 兜住上限 */
export function resolvePageWindow(query: { current: number; size: number }): {
  offset: number;
  limit: number;
} {
  return { offset: (query.current - 1) * query.size, limit: query.size };
}

/** 从排序串解析出 drizzle 列引用（列表查询专用） 详见 docs/v3-notes.md N-159。 */
export function resolveSortColumn<T extends object>(
  sort: string | undefined | null,
  columns: T,
  fallback: string
): { column: unknown; isDesc: boolean } {
  const value = sort ?? `-${fallback}`;
  const isDesc = value.startsWith('-');
  const field = isDesc ? value.slice(1) : value;
  const record: Record<string, unknown> = {};

  for (const [key, val] of Object.entries(columns)) {
    record[key] = val;
  }

  const column = Object.hasOwn(record, field) ? record[field] : record[fallback];

  return { column, isDesc };
}
