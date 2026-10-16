import type { Router } from 'vue-router';
import { defineStore } from 'pinia';
import { STATIC_SUPER_ROLE } from '@/constants/service';
import {
  clearAuthStorage,
  getLocalRefreshToken,
  getLocalToken,
  getLocalUserInfo,
  handleAuthReset,
  setAuthResetHandler,
  setAuthStorage,
  setLogoutHandler
} from '@/utils/auth';
import { env } from '@/env';
import { api } from '@/request';
import type { AuthUserDTO, LoginResult } from '@/schema/auth';

/** 认证 store（v3 §5.5）：token 对 + 用户信息 + 登录/登出流程 详见 docs/v3-notes.md N-098。 */

interface AuthState {
  token: string;
  refreshToken: string;
  userInfo: AuthUserDTO | null;
}

export const useAuthStore = defineStore('auth', {
  state: (): AuthState => ({
    token: getLocalToken(),
    refreshToken: getLocalRefreshToken(),
    userInfo: getLocalUserInfo()
  }),
  getters: {
    /** 是否已登录（有 access token 即视为登录态，有效性由接口业务码保证） */
    isLogin: state => Boolean(state.token),
    /** static 权限模式的超级管理员 */
    isStaticSuper: state => state.userInfo?.roles.includes(STATIC_SUPER_ROLE) ?? false,
    /** 登录后首页：用户 homePath 优先，其次 env 兜底 */
    homePath: state => state.userInfo?.homePath || env.routeHome
  },
  actions: {
    /** 登录：调接口 → 落存储 → 拉用户信息 */
    async login(userName: string, password: string, captcha?: { captchaId: string; captchaCode: string }) {
      const result = await api.post('/auth/login', {
        body: {
          userName,
          password,
          grantType: 'pwd',
          ...(captcha?.captchaId && captcha.captchaCode ? captcha : {})
        }
      });

      this.handleLoginResult(result);
    },
    /** 验证码登录（图形验证码代替短信验证码） */
    async loginByCaptcha(userName: string, captchaId: string, captchaCode: string) {
      const result = await api.post('/auth/login', {
        body: { userName, captchaId, captchaCode, grantType: 'captcha' }
      });

      this.handleLoginResult(result);
    },
    /** 注册（后端注册即登录，直接拿到 token 对） */
    async register(payload: { userName: string; password: string; email?: string; fullName?: string }) {
      const result = await api.post('/auth/register', { body: payload });
      this.handleLoginResult(result);
    },
    /** 登录成功后的统一落库（登录/刷新共用） */
    handleLoginResult(result: LoginResult) {
      setAuthStorage(result);
      this.token = result.token;
      this.refreshToken = result.refreshToken;
      this.userInfo = result.user;
    },
    /** 覆盖本地用户信息（个人中心改资料后调用）。必须同时写 localStorage：否则刷新页面后 `userInfo` 从旧快照恢复，改动看起来「丢了」。 */
    setUserInfo(userInfo: AuthUserDTO) {
      this.userInfo = userInfo;
      setAuthStorage({ token: this.token, refreshToken: this.refreshToken, user: userInfo });
    },
    /** 恢复用户信息（页面刷新后 token 在而 userInfo 缺失时补拉） */
    async initUserInfo() {
      if (!this.isLogin) return;

      if (!this.userInfo) {
        this.userInfo = await api.get('/auth/user-info');
        setAuthStorage({
          token: this.token,
          refreshToken: this.refreshToken,
          user: this.userInfo
        });
      }
    },
    /** 登出：调后端拉黑 token 对 → 重置本地 详见 docs/v3-notes.md N-100。 */
    async logout() {
      try {
        await api.post('/auth/logout');
      } catch {
        // 后端登出失败不阻断前端登出
      }
      this.resetStore();
    },
    /** 重置登录态并回登录页。跳转经 `handleAuthReset()`（守卫注册的回调持有 router 实例），因此本action 不需要 router。 */
    resetStore() {
      clearAuthStorage();
      this.token = '';
      this.refreshToken = '';
      this.userInfo = null;
      // 菜单/页签一并重置（角色变化后菜单与页签都可能失效）
      void import('@/store').then(({ useMenuStore, useTabStore }) => {
        useMenuStore().resetStore();
        useTabStore().resetStore();
      });
      handleAuthReset();
    }
  }
});

/** 注册请求层登出回调与「重置收尾」回调（`setupRouterGuard` 拿到 router 后调用一次） 详见 docs/v3-notes.md N-102。 */
export function initAuthStore(router: Router): void {
  setLogoutHandler((silent: boolean) => {
    void import('@/store').then(({ useAuthStore: resolveAuthStore }) => {
      const authStore = resolveAuthStore();

      if (silent) {
        void import('@vean/ui').then(({ toast }) => {
          toast.error('登录状态已失效，请重新登录');
        });
      } else {
        // 声明式对话框（SDialogProvider 渲染）：`dialog.warning(message, data?)`
        // 的 data 是 DialogExternal（open/icon/showCancel/showConfirm），无 title
        // 字段，文案只能走 message
        void import('@vean/ui').then(({ dialog }) => {
          dialog.warning('登录状态已失效，请重新登录');
        });
      }
      authStore.resetStore();
    });
  });

  // 登录态清空后回登录页（`resetStore()` 的跳转出口）。
  setAuthResetHandler(() => {
    void router.replace('/login');
  });
}
