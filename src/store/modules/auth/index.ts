import { computed, reactive, ref } from 'vue';
import { defineStore } from 'pinia';
import { useLoading } from '@sa/hooks';
import {SetupStoreId, SsoAuthor} from '@/enum';
import { useRouterPush } from '@/hooks/common/router';
import {
  doLoginSso,
  doLogoutSso,
  fetchGetUserInfo,
  fetchLogin,
  fetchLoginSsoCheck,
  fetchLoginSsoUrl, fetchSsoUserInfo
} from '@/service/api';
import { localStg } from '@/utils/storage';
import { $t } from '@/locales';
import { useRouteStore } from '../route';
import { clearAuthStorage, getToken, getUserInfo } from './shared';

export const useAuthStore = defineStore(SetupStoreId.Auth, () => {
  const routeStore = useRouteStore();
  const { route, toLogin, redirectFromLogin } = useRouterPush(false);
  const { loading: loginLoading, startLoading, endLoading } = useLoading();

  const token = ref(getToken());

  const userInfo: Api.Auth.UserInfo = reactive(getUserInfo());

  /** is super role in static route */
  const isStaticSuper = computed(() => {
    const { VITE_AUTH_ROUTE_MODE, VITE_STATIC_SUPER_ROLE } = import.meta.env;

    return VITE_AUTH_ROUTE_MODE === 'static' && userInfo.roles.includes(VITE_STATIC_SUPER_ROLE);
  });

  /** Is login */
  const isLogin = computed(() => Boolean(token.value));

  /** Reset auth store */
  async function resetStore() {
    const authStore = useAuthStore();

    clearAuthStorage();

    authStore.$reset();

    if (!route.value.meta.constant) {
      await toLogin();
    }

    routeStore.resetStore();
  }

  /**
   * Login
   *
   * @param userName User name
   * @param password Password
   * @param [redirect=true] Whether to redirect after login. Default is `true`
   */
  async function login(userName: string, password: string, redirect = true) {
    startLoading();

    const { data: loginToken, error } = await fetchLogin(userName, password);

    if (!error) {
      const pass = await loginByToken(loginToken);

      if (pass) {
        await routeStore.initAuthRoute();

        if (redirect) {
          await redirectFromLogin();
        }

        if (routeStore.isInitAuthRoute) {
          window.$notification?.success({
            title: $t('page.login.common.loginSuccess'),
            content: $t('page.login.common.welcomeBack', { userName: userInfo.userName }),
            duration: 4500
          });
        }
      }
    } else {
      resetStore();
    }

    endLoading();
  }

  async function loginByToken(loginToken: Api.Auth.LoginToken) {
    // 1. stored in the localStorage, the later requests need it in headers
    localStg.set('token', loginToken.token);
    localStg.set('refreshToken', loginToken.refreshToken);

    const { data: info, error } = await fetchGetUserInfo();

    if (!error) {
      // 2. store user info
      localStg.set('userInfo', info);

      // 3. update store
      token.value = loginToken.token;
      Object.assign(userInfo, info);

      return true;
    }

    return false;
  }

  async function fetchSsoUrl(author: string) {
    startLoading();

    const {data: url, error} = await fetchLoginSsoUrl(author);

    if (error) {
      resetStore();
      endLoading();
      return null;
    }
    // 若发生幂等
    if (!url) {
      const res = await fetchUser(author);
      if (res) {
        await redirectFromLogin();
        endLoading();
        if (routeStore.isInitAuthRoute) {
          window.$notification?.success({
            title: $t('page.login.common.loginSuccess'),
            content: $t('page.login.common.welcomeBack', {userName: userInfo.userName}),
            duration: 4500
          });
        }
      }
    }
    endLoading();
    return url;
  }

  async function loginSso(author: string, code: string, state: string) {
    startLoading();
    const {error} = await doLoginSso(author, code, state);

    if (!error) {
      await fetchUser(author);
      endLoading();
      return true;
    }
    await resetStore();
    endLoading();
    return false;
  }

  async function fetchUser(author: string) {
    const {data: info, error: err} = await fetchSsoUserInfo(author);
    if (!err && info !== null) {
      info.roles = ['R_SUPER'];
      localStg.set('token', info.userId);
      // 2. store user info
      localStg.set('userInfo', info);
      localStg.set('author', author);

      // 3. update auth route
      token.value = info.userId;
      Object.assign(userInfo, info);

      await routeStore.initAuthRoute();

      return true;
    }
    return false;
  }

  async function logoutSso() {
    await resetStore();
    await doLogoutSso(localStg.get('author') || '');
  }

  async function checkLogin() {
    if (!token.value) {
      return false;
    }
    const {data: check, error} = await fetchLoginSsoCheck(localStg.get('author') || SsoAuthor.Authing);
    if (!error) {
      return check;
    }
    return false;
  }

  return {
    token,
    userInfo,
    isStaticSuper,
    isLogin,
    loginLoading,
    resetStore,
    login,
    fetchSsoUrl,
    loginSso,
    logoutSso,
    checkLogin
  };
});
