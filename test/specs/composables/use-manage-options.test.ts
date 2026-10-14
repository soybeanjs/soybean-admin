import { describe, expect, it } from 'vitest';
import { fromSelectValue, toSelectValue } from '@/composables/use-manage-options';
import { SEARCH_ANY_SELECT_VALUE, SEARCH_ANY_VALUE } from '@/schema/_search';

/**
 * 「全部」哨兵值的边界转换。
 *
 * 背景：`@vean/aria` 把**空串**保留给「未选择」语义（`shouldShowPlaceholder`
 * 判定 `isNullish(v) || v === '' || []`，且 `SelectItem` 在 `setup` 里对
 * `value === ''` 直接抛错）。搜索表单的数据层却一直以空串表示「全部」，两者
 * 冲突。折中办法是渲染层换一个非空哨兵值，只在提交边界转换 ——
 * 转换一旦错位，要么控制台满屏报错（空串漏进 `SSelect`），要么请求带上
 * `enabled=` 这类空参数（哨兵值漏进 query）。
 *
 * 这两个函数是唯一的转换点，因此必须双向可逆，且对真实值零影响。
 */
describe('搜索「全部」哨兵值的边界转换', () => {
  it('空串与哨兵值双向互转', () => {
    expect(toSelectValue(SEARCH_ANY_VALUE)).toBe(SEARCH_ANY_SELECT_VALUE);
    expect(fromSelectValue(SEARCH_ANY_SELECT_VALUE)).toBe(SEARCH_ANY_VALUE);
  });

  it('哨兵值非空，不会触发 SelectItem 的空串校验', () => {
    expect(SEARCH_ANY_VALUE).toBe('');
    expect(SEARCH_ANY_SELECT_VALUE).not.toBe('');
  });

  it('真实枚举值原样透传（两个方向都不动）', () => {
    for (const value of ['Y', 'N', 'CATALOG', 'MENU', 'GET', 'POST']) {
      expect(toSelectValue(value)).toBe(value);
      expect(fromSelectValue(value)).toBe(value);
    }
  });

  it('渲染值往返可逆：render → form → render 回到原值', () => {
    for (const renderValue of [SEARCH_ANY_SELECT_VALUE, 'Y', 'N', 'CATALOG']) {
      expect(toSelectValue(fromSelectValue(renderValue))).toBe(renderValue);
    }
  });

  it('表单值经 from 后落在「渲染值域」，再回表单保持稳定', () => {
    // `''` 是表单侧的「全部」，但它不是合法的渲染值 —— `fromSelectValue` 只把
    // 哨兵值转回空串，不负责把空串变成哨兵值（那是 `toSelectValue` 的职责）。
    // 因此往返只在渲染值域成立；这里固定住这个不对称，避免以后误改。
    for (const formValue of [SEARCH_ANY_VALUE, 'Y', 'N', 'CATALOG']) {
      expect(fromSelectValue(fromSelectValue(toSelectValue(formValue)))).toBe(formValue);
    }
  });
});
