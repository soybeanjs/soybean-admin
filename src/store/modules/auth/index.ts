import { computed, ref } from 'vue';
import type { Router } from 'vue-router';
import { defineStore } from 'pinia';
import { ROUTE_HOME as ENV_ROUTE_HOME } from 'ubean:env/client';
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
import { api } from '@/request';
import type { AuthUserDTO, LoginResult } from '@/schema/auth';

/** 认证 store（v3 §5.5）：token 对 + 用户信息 + 登录/登出流程 详见 docs/v3-notes.md N-098。 */

/** 登录/注册/刷新共用的落库（store 外纯函数，避免 setup 里再用 `this`）。 */
function persistLoginResult(result: LoginResult): {
  token: string;
  refreshToken: string;
  userInfo: AuthUserDTO;
} {
  setAuthStorage(result);

  return { token: result.token, refreshToken: result.refreshToken, userInfo: result.user };
}

export const useAuthStore = defineStore('auth', () => {
  const token = ref(getLocalToken());
  const refreshToken = ref(getLocalRefreshToken());
  const userInfo = ref<AuthUserDTO | null>(getLocalUserInfo());

  /** 是否已登录（有 access token 即视为登录态，有效性由接口业务码保证） */
  const isLogin = computed(() => Boolean(token.value));

  /** static 权限模式的超级管理员 */
  const isStaticSuper = computed(() => userInfo.value?.roles.includes(STATIC_SUPER_ROLE) ?? false);

  /** 登录后首页：用户 homePath 优先，其次 env 兜底 */
  const homePath = computed(() => userInfo.value?.homePath || ENV_ROUTE_HOME);

  function handleLoginResult(result: LoginResult): void {
    const next = persistLoginResult(result);

    token.value = next.token;
    refreshToken.value = next.refreshToken;
    userInfo.value = next.userInfo;
  }

  /** 登录：调接口 → 落存储 → 拉用户信息 */
  async function login(
    userName: string,
    password: string,
    captcha?: { captchaId: string; captchaCode: string }
  ): Promise<void> {
    const result = await api.post('/auth/login', {
      body: {
        userName,
        password,
        grantType: 'pwd',
        ...(captcha?.captchaId && captcha.captchaCode ? captcha : {})
      }
    });

    handleLoginResult(result);
  }

  /** 验证码登录（图形验证码代替短信验证码） */
  async function loginByCaptcha(userName: string, captchaId: string, captchaCode: string): Promise<void> {
    const result = await api.post('/auth/login', {
      body: { userName, captchaId, captchaCode, grantType: 'captcha' }
    });

    handleLoginResult(result);
  }

  /** 注册（后端注册即登录，直接拿到 token 对） */
  async function register(payload: {
    userName: string;
    password: string;
    email?: string;
    fullName?: string;
  }): Promise<void> {
    const result = await api.post('/auth/register', { body: payload });

    handleLoginResult(result);
  }

  /** 覆盖本地用户信息（个人中心改资料后调用）。必须同时写 localStorage：否则刷新页面后 `userInfo` 从旧快照恢复，改动看起来「丢了」。 */
  function setUserInfo(next: AuthUserDTO): void {
    userInfo.value = next;
    setAuthStorage({ token: token.value, refreshToken: refreshToken.value, user: next });
  }

  /** 恢复用户信息（页面刷新后 token 在而 userInfo 缺失时补拉） */
  async function initUserInfo(): Promise<void> {
    if (!isLogin.value) return;

    if (!userInfo.value) {
      const restored = await api.get('/auth/user-info');

      userInfo.value = restored;
      setAuthStorage({ token: token.value, refreshToken: refreshToken.value, user: restored });
    }
  }

  /** 登出：调后端拉黑 token 对 → 重置本地 详见 docs/v3-notes.md N-100。 */
  async function logout(): Promise<void> {
    try {
      await api.post('/auth/logout');
    } catch {
      // 后端登出失败不阻断前端登出
    }
    resetStore();
  }

  /** 重置登录态并回登录页。跳转经 `handleAuthReset()`（守卫注册的回调持有 router 实例），因此本动作不需要 router。 */
  function resetStore(): void {
    clearAuthStorage();
    token.value = '';
    refreshToken.value = '';
    userInfo.value = null;
    // 菜单/页签一并重置（角色变化后菜单与页签都可能失效）。动态 import 保持 store 之间的懒依赖，
    // 避免 `@/store` 桶文件在模块求值期把 menu/tab 也拉进来形成环。
    void import('@/store').then(({ useMenuStore, useTabStore }) => {
      useMenuStore().resetStore();
      useTabStore().resetStore();
    });
    handleAuthReset();
  }

  return {
    token,
    refreshToken,
    userInfo,
    isLogin,
    isStaticSuper,
    homePath,
    login,
    loginByCaptcha,
    register,
    handleLoginResult,
    setUserInfo,
    initUserInfo,
    logout,
    resetStore
  };
});

/** 注册请求层登出回调与「重置收尾」回调（`initAuthGuardWiring` 拿到 router 后调用一次） 详见 docs/v3-notes.md N-102。 */
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
