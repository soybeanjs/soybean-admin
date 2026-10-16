/** 通用纯函数（v3 §5.7，P3-02） 详见 docs/v3-notes.md N-140。 */

/** 过滤查询参数里的空值（`undefined` / `null` / `''`） 详见 docs/v3-notes.md N-141。 */
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
