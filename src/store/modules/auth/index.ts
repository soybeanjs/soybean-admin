import { defineStore } from 'pinia';
import { STATIC_SUPER_ROLE } from '@/constants/service';
import {
  clearAuthStorage,
  getLocalRefreshToken,
  getLocalToken,
  getLocalUserInfo,
  setAuthStorage,
  setLogoutHandler
} from '@/utils/auth';
import { fetchGetUserInfo, fetchLogin, fetchLogout } from '@/service/api/auth';
import { env } from '@/env';
import type { ApiLoginResult, ApiUserInfo } from '@/typings/app';

/**
 * 认证 store（v3 §5.5）：token 对 + 用户信息 + 登录/登出流程。
 *
 * token 与用户信息同步落 localStorage（`src/utils/auth.ts`），刷新页面经
 * `initUserInfo` 恢复；请求层的登出回调在这里注册（避免循环引用）。
 */

interface AuthState {
  token: string;
  refreshToken: string;
  userInfo: ApiUserInfo | null;
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
    async login(userName: string, password: string) {
      const result = await fetchLogin(userName, password);
      this.handleLoginResult(result);
    },
    /** 登录成功后的统一落库（登录/刷新共用） */
    handleLoginResult(result: ApiLoginResult) {
      setAuthStorage(result);
      this.token = result.token;
      this.refreshToken = result.refreshToken;
      this.userInfo = result.user;
    },
    /** 恢复用户信息（页面刷新后 token 在而 userInfo 缺失时补拉） */
    async initUserInfo() {
      if (!this.isLogin) return;

      if (!this.userInfo) {
        this.userInfo = await fetchGetUserInfo();
        setAuthStorage({
          token: this.token,
          refreshToken: this.refreshToken,
          user: this.userInfo
        });
      }
    },
    /**
     * 登出：调后端拉黑 token 对 → 重置本地。
     * 抛错不阻断 —— 后端不可达时也要完成前端登出。
     */
    async logout() {
      try {
        await fetchLogout();
      } catch {
        // 后端登出失败不阻断前端登出
      }
      this.resetStore();
    },
    /** 重置登录态并跳转登录页 */
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
      void import('@/router/instance').then(({ getRouter }) => {
        void getRouter().replace('/login');
      });
    }
  }
});

/**
 * 注册请求层登出回调（app 启动时调用一次）。
 *
 * ①故意做成**模块级普通函数**而非 store action：ubean 的 `router.setup` 在
 * `applyAppConfig`（安装 plugins/pinia）**之前**执行，此时拿不到活跃 pinia；
 * 回调注册本身不需要 store 实例，回调体在使用期（接口响应时）才动态取 store。
 * ②回调体动态 import，避免 store ↔ 请求层循环引用。
 */
export function initAuthStore(): void {
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
}
