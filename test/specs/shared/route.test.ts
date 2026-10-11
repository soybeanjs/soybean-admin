import { describe, expect, it } from 'vitest';
import { normalizeRoutePath } from '@/shared/route';

/**
 * `normalizeRoutePath` 守卫（P3-11）。
 *
 * 回归背景：i18n 策略为 `prefix_except_default` 时，ubean 把每条页面路由
 * 注册在 `/:locale(en)?/about` 这样的 path 上；菜单树从 `router.getRoutes()`
 * 取 path 后原样 `router.push()`，会跳到字面量 `/:locale(en)?/about` → 404
 * （「点击菜单关于」的真实 bug）。
 */
describe('normalizeRoutePath', () => {
  it('剥掉 prefix_except_default 的可选 locale 段', () => {
    expect(normalizeRoutePath('/:locale(en)?/about')).toBe('/about');
    expect(normalizeRoutePath('/:locale(en)?/manage/dict-item')).toBe('/manage/dict-item');
  });

  it('剥掉 prefix_and_default 的多语言可选段与 prefix 的必填段', () => {
    expect(normalizeRoutePath('/:locale(en|zh)?/about')).toBe('/about');
    expect(normalizeRoutePath('/:locale(en|zh)/about')).toBe('/about');
  });

  it('根路径剥完仍返回根路径', () => {
    expect(normalizeRoutePath('/:locale(en)?')).toBe('/');
    expect(normalizeRoutePath('/:locale')).toBe('/');
  });

  it('无 locale 段的路径原样返回（no_prefix 策略 / 静态页面）', () => {
    expect(normalizeRoutePath('/about')).toBe('/about');
    expect(normalizeRoutePath('/manage/dict-item')).toBe('/manage/dict-item');
    expect(normalizeRoutePath('/')).toBe('/');
  });

  it('不改具名业务参数（只剥首段的 locale）', () => {
    expect(normalizeRoutePath('/user/:id')).toBe('/user/:id');
    expect(normalizeRoutePath('/about/:locale')).toBe('/about/:locale');
  });

  it('缺失前导斜杠时补上（防御性）', () => {
    expect(normalizeRoutePath('about')).toBe('/about');
  });
});
