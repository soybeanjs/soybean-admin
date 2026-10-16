/** 分页 / 排序参数解析（unify 范式） 详见 docs/v3-notes.md N-158。 */
export function resolvePagination(query: { page?: number | null; pageSize?: number | null }) {
  const page = query.page ?? 1;
  const pageSize = query.pageSize ?? 10;
  const offset = (page - 1) * pageSize;

  return { page, pageSize, offset };
}

export type ResolvedSortField = {
  field: string;
  order: 'asc' | 'desc';
};

/** 解析排序串：'name,-updatedTime' → [{field:'name',order:'asc'}, {field:'updatedTime',order:'desc'}] */
export function resolveSort(sort?: string | null): ResolvedSortField[] {
  if (!sort) {
    return [];
  }

  return sort.split(',').map(item => {
    const isDesc = item.startsWith('-');

    return {
      field: isDesc ? item.slice(1) : item,
      order: isDesc ? ('desc' as const) : ('asc' as const)
    };
  });
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
