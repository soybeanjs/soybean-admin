import { describe, expect, it } from 'vitest';
import { shouldTreatMissingRouteAsForbidden } from './route-exist';

describe('shouldTreatMissingRouteAsForbidden', () => {
  it('static 模式一律 false：本地全注册，落 NotFound 就是真 404', () => {
    expect(shouldTreatMissingRouteAsForbidden({ authRouteMode: 'static', menuInited: true, routeExists: true })).toBe(
      false
    );
    expect(shouldTreatMissingRouteAsForbidden({ authRouteMode: 'static', menuInited: false, routeExists: false })).toBe(
      false
    );
  });

  it('dynamic + 菜单已初始化 + 后端说存在 → true（无权限，改判 403）', () => {
    expect(shouldTreatMissingRouteAsForbidden({ authRouteMode: 'dynamic', menuInited: true, routeExists: true })).toBe(
      true
    );
  });

  it('dynamic + 后端说不存在 → false（真 404）', () => {
    expect(shouldTreatMissingRouteAsForbidden({ authRouteMode: 'dynamic', menuInited: true, routeExists: false })).toBe(
      false
    );
  });

  it('dynamic 但菜单尚未初始化 → false（NotFound 可能只是路由还没注册）', () => {
    expect(shouldTreatMissingRouteAsForbidden({ authRouteMode: 'dynamic', menuInited: false, routeExists: true })).toBe(
      false
    );
  });
});
