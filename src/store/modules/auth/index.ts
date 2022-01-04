import { ref, computed, reactive, unref } from 'vue';
import type { Ref, ComputedRef } from 'vue';
import { defineStore } from 'pinia';
import { router as globalRouter } from '@/router';
import { useRouterPush, useRouteQuery } from '@/composables';
import { useLoading } from '@/hooks';
import { fetchLogin, fetchUserInfo } from '@/service';
import { getUserInfo, getToken, setUserInfo, setToken, setRefreshToken, clearAuthStorage } from '@/utils';

interface AuthStore {
  /** 用户信息 */
  userInfo: Auth.UserInfo;
  /** 用户token */
  token: Ref<string>;
  /** 是否登录 */
  isLogin: ComputedRef<boolean>;
  /**
   * 重置authStore
   * 是否需要跳转页面(例如当前页面是需要权限的，登出后需要跳转到登录页面)
   */
  resetAuthStore(pushRoute: boolean): void;
  /** 登录的加载状态 */
  loginLoding: Ref<boolean>;
  /**
   * 登录
   * @param phone - 手机号
   * @param pwdOrCode - 密码或验证码
   * @param type - 登录方式: pwd - 密码登录; sms - 验证码登录
   */
  login(phone: string, pwdOrCode: string, type: 'pwd' | 'sms'): void;
}

export const useAuthStore = defineStore('auth-store', () => {
  const { toLogin, toLoginRedirect } = useRouterPush(false);
  const { loginRedirect } = useRouteQuery(false);
  const { loading: loginLoding, startLoading: startLoginLoading, endLoading: endLoginLoading } = useLoading();

  const userInfo: Auth.UserInfo = reactive(getUserInfo());
  function handleSetUserInfo(data: Auth.UserInfo) {
    Object.assign(userInfo, data);
  }

  const token = ref(getToken());
  function handleSetToken(data: string) {
    token.value = data;
  }

  const isLogin = computed(() => Boolean(token.value));

  function resetAuthStore(pushRoute: boolean = true) {
    const auth = useAuthStore();
    const route = unref(globalRouter.currentRoute);

    clearAuthStorage();
    auth.$reset();

    if (pushRoute && route.meta.requiresAuth) {
      toLogin();
    }
  }

  async function login(phone: string, pwdOrCode: string, type: 'pwd' | 'sms') {
    startLoginLoading();
    const { data } = await fetchLogin(phone, pwdOrCode, type);
    if (data) {
      await loginByToken(data);
    }
    endLoginLoading();
  }

  async function loginByToken(backendToken: ApiAuth.Token) {
    // 1.先把token存储到缓存中
    const { token, refreshToken } = backendToken;
    setToken(token);
    setRefreshToken(refreshToken);

    // 2.获取用户信息
    const { data } = await fetchUserInfo();
    if (data) {
      // 成功后把用户信息存储到缓存中
      setUserInfo(data);
      handleSetToken(token);
      handleSetUserInfo(data);
      // 3. 跳转登录后的地址
      toLoginRedirect(loginRedirect.value);
      // 4.登录成功弹出欢迎提示
      window.$notification?.success({
        title: '登录成功!',
        content: `欢迎回来，${userInfo.userName}!`,
        duration: 3000
      });
    } else {
      // 不成功则重置状态
      resetAuthStore(false);
    }
  }

  const authStore: AuthStore = {
    userInfo,
    token,
    isLogin,
    resetAuthStore,
    loginLoding,
    login
  };

  return authStore;
});
