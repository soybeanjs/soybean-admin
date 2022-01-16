import { unref } from 'vue';
import { defineStore } from 'pinia';
import { router as globalRouter } from '@/router';
import { useRouterPush } from '@/composables';
import { fetchLogin, fetchUserInfo } from '@/service';
import { getUserInfo, getToken, setUserInfo, setToken, setRefreshToken, clearAuthStorage } from '@/utils';

interface AuthState {
  /** 用户信息 */
  userInfo: Auth.UserInfo;
  /** 用户token */
  token: string;
  /** 登录的加载状态 */
  loginLoding: boolean;
}

export const useAuthStore = defineStore('auth-store', {
  state: (): AuthState => ({
    userInfo: getUserInfo(),
    token: getToken(),
    loginLoding: false
  }),
  getters: {
    /** 是否登录 */
    isLogin(state) {
      return Boolean(state.token);
    }
  },
  actions: {
    /** 重置auth状态 */
    resetAuthStore() {
      const { toLogin } = useRouterPush(false);
      const route = unref(globalRouter.currentRoute);

      clearAuthStorage();
      this.$reset();

      if (route.meta.requiresAuth) {
        toLogin();
      }
    },
    /**
     * 根据token进行登录
     * @param backendToken - 返回的token
     */
    async loginByToken(backendToken: ApiAuth.Token) {
      const { toLoginRedirect } = useRouterPush(false);

      // 先把token存储到缓存中
      const { token, refreshToken } = backendToken;
      setToken(token);
      setRefreshToken(refreshToken);

      // 获取用户信息
      const { data } = await fetchUserInfo();
      if (data) {
        // 成功后把用户信息存储到缓存中
        setUserInfo(data);

        // 更新状态
        Object.assign(this, { userInfo: data, token });

        // 跳转登录后的地址
        toLoginRedirect();

        // 登录成功弹出欢迎提示
        window.$notification?.success({
          title: '登录成功!',
          content: `欢迎回来，${data.userName}!`,
          duration: 3000
        });
      } else {
        // 不成功则重置状态
        this.resetAuthStore();
      }
    },
    /**
     * 登录
     * @param phone - 手机号
     * @param pwdOrCode - 密码或验证码
     * @param type - 登录方式: pwd - 密码登录; sms - 验证码登录
     */
    async login(phone: string, pwdOrCode: string, type: 'pwd' | 'sms') {
      this.loginLoding = true;
      const { data } = await fetchLogin(phone, pwdOrCode, type);
      if (data) {
        await this.loginByToken(data);
      }
      this.loginLoding = false;
    }
  }
});
