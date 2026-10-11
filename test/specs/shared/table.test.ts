import { describe, expect, it } from 'vitest';
import { createEmptyPageResult, defaultTableTransform, toTablePagination } from '@/shared/table';

type Row = { id: string; username: string };

/**
 * 表格分页字段改名（P3-02）：
 * 后端列表接口返回 `{ current, size, total, list }`，而 `@vean/ui` 的
 * `usePaginatedTable` 要 `{ page, pageSize, total, list }`。
 */
describe('defaultTableTransform', () => {
  it('把 current/size 改名为 page/pageSize', () => {
    const page = { current: 3, size: 20, total: 47, list: [{ id: '1', username: 'soy' }] };

    expect(defaultTableTransform<Row>(page)).toEqual({
      page: 3,
      pageSize: 20,
      total: 47,
      list: [{ id: '1', username: 'soy' }]
    });
  });

  it('undefined 输入兜底成空页（表格不会拿到 undefined）', () => {
    const result = defaultTableTransform<Row>(undefined);

    expect(result).toEqual({ page: 1, pageSize: 10, total: 0, list: [] });
  });

  it('空页默认 size 跟随后端 schema 默认值 10', () => {
    expect(createEmptyPageResult<Row>()).toEqual({ current: 1, size: 10, total: 0, list: [] });
    expect(createEmptyPageResult<Row>(30).size).toBe(30);
  });

  it('toTablePagination 与 defaultTableTransform 结果一致', () => {
    const page = createEmptyPageResult<Row>();

    expect(toTablePagination(page)).toEqual(defaultTableTransform<Row>(page));
  });
});
