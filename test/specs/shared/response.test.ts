import { describe, expect, it } from 'vitest';
import { createErrorResponse, createSuccessResponse, isApiResponseStructure } from '@/shared/response';

/**
 * 响应体品牌（审计 2.7）。
 *
 * 包装中间件原先靠猜字段名判断「是否已经包过」，于是业务数据只要恰好带
 * `code` / `message` / `data` 三个 key 就会被漏包。品牌只由工厂函数打上，
 * 判据从启发式变成事实。
 */
describe('response brand', () => {
  it('工厂函数产出的响应体被识别为已包装', () => {
    expect(isApiResponseStructure(createSuccessResponse({ id: '1' }))).toBe(true);
    expect(isApiResponseStructure(createErrorResponse('PARAM_INVALID', '参数错误'))).toBe(true);
  });

  it('普通对象即使凑齐 code/message/data 也不被识别', () => {
    // 这正是旧实现的误判：payload 自带这三个 key 就会被当成已包装
    expect(isApiResponseStructure({ code: '0000', message: 'ok', data: null })).toBe(false);
  });

  it('非对象一律不识别', () => {
    for (const value of [null, undefined, 0, '', 'x', [], true]) {
      expect(isApiResponseStructure(value)).toBe(false);
    }
  });

  it('品牌不可枚举，序列化后字节不变', () => {
    const body = createSuccessResponse({ id: '1' }, '成功');

    expect(JSON.stringify(body)).toBe('{"code":"0000","message":"成功","data":{"id":"1"}}');
    expect(Object.keys(body)).toEqual(['code', 'message', 'data']);
  });

  it('错误响应无 data 时为 null，且保留传入的 data', () => {
    const bare = createErrorResponse('PARAM_INVALID', '参数错误');
    expect(bare.data).toBeNull();

    const withData = createErrorResponse<{ message: string }[]>('PARAM_INVALID', '参数错误', [{ message: 'x' }]);
    expect(withData.data).toEqual([{ message: 'x' }]);
  });
});
