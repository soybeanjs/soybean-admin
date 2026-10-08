/**
 * 通用纯函数（v3 §5.7，P3-02）。
 *
 * 与 `src/shared/pagination.ts` 同层：**零依赖 + 零副作用**，前后端与测试
 * 三方共用。这一层刻意不放 `t()` 之类需要运行时上下文的东西 —— 所有需要
 * i18n 的应用层逻辑在 `src/composables/` 里。
 */

/**
 * 过滤查询参数里的空值（`undefined` / `null` / `''`）。
 *
 * 为什么需要：表格搜索卡的表单字段在"未填"时是空串，直接拼进 query 会让
 * 后端把 `keyword=` 当成"搜索空关键字"从而命中 0 行；`sort=` / `enabled=`
 * 同理会把有效默认值覆盖掉。
 *
 * 返回 `Partial<T>` 而非 `T` —— 调用处应把它当作"全部可选"的一包查询条件。
 *
 * ```ts
 * filterValidQuery({ keyword: '', current: 1, size: 10 })
 * // → { current: 1, size: 10 }
 * ```
 */
export function filterValidQuery<T extends object>(query: T): Partial<T> {
  const filtered: Partial<T> = {};
  const entries = Object.entries(query);

  for (const [key, value] of entries) {
    if (value !== undefined && value !== null && value !== '') {
      Object.assign(filtered, { [key]: value });
    }
  }

  return filtered;
}
