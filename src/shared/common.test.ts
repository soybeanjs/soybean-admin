import { describe, expect, it } from 'vitest';
import { filterValidQuery } from '@/shared/common';

/**
 * `filterValidQuery`（P3-02）：
 * 表格搜索卡把空串字段直接拼进 query 时，后端会把 `keyword=` 当作"搜索空关键字"
 * 命中 0 行；`sort=` / `enabled=` 同理会覆盖掉有效默认值。
 */
describe('filterValidQuery', () => {
  it('剔除 undefined / null / 空串，保留 0 与 false', () => {
    const result = filterValidQuery({
      keyword: '',
      enabled: null,
      description: undefined,
      current: 0,
      pinned: false,
      size: 10,
      name: 'soy'
    });

    expect(result).toEqual({ current: 0, pinned: false, size: 10, name: 'soy' });
  });

  it('不修改入参', () => {
    const query = { keyword: '', size: 10 };
    filterValidQuery(query);

    expect(query).toEqual({ keyword: '', size: 10 });
  });

  it('空对象返回空对象', () => {
    expect(filterValidQuery({})).toEqual({});
  });
});
