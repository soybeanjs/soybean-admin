import type { LoginModule } from './use-login';

/** 登录页壳层共用常量与 props（三个布局壳都读这里，避免各写一份） 详见 docs/v3-notes.md N-298。 */

/** 模块标题的中文文案（`card` / `split` / `fullscreen` 三壳共用） */
export const LOGIN_MODULE_TITLE_KEYS: Record<LoginModule, string> = {
  'pwd-login': '登录',
  'code-login': '验证码登录',
  register: '注册',
  'reset-pwd': '重置密码',
  'bind-wechat': '绑定微信'
};

/**
 * 壳层 props。
 *
 * 文案由 `index.vue` 解析好传入 —— 壳不认识「模块」语义，只负责摆放，
 * 这样新增登录模块不必碰三个壳。
 */
export interface LoginLayoutProps {
  /** 当前模块标题（已解析） */
  title: string;
  /** 副标题（已解析） */
  description: string;
}
