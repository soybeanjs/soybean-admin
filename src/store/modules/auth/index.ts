import { unref, nextTick } from 'vue';
import { defineStore } from 'pinia';
import { router } from '@/router';
import { fetchUserInfo } from '@/service';
import { useRouteStore } from '@/store';
import { useRouterPush } from '@/composables';
import { localStg } from '@/utils';
import { useTabStore } from '../tab';
import { defaultAuthType } from './auth-type';
import { getToken, getUserInfo, clearAuthStorage } from './helpers';

interface AuthState {
  /** 用户信息 */
  userInfo: Auth.UserInfo;
  /** 用户token */
  token: string;
  /** 登录的加载状态 */
  loginLoading: boolean;
}

export const useAuthStore = defineStore('auth-store', {
  state: (): AuthState => ({
    userInfo: getUserInfo(),
    token: getToken(),
    loginLoading: false
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
      const { resetTabStore } = useTabStore();
      const { resetRouteStore } = useRouteStore();
      const route = unref(router.currentRoute);

      clearAuthStorage();
      this.$reset();

      if (route.meta.requiresAuth) {
        toLogin();
      }

      nextTick(() => {
        resetTabStore();
        resetRouteStore();
      });
    },
    /**
     * 处理登录后成功或失败的逻辑
     * @param backendToken - 返回的token
     */
    async handleActionAfterLogin(backendToken: ApiAuth.Token | ApiAuth.JWT) {
      const route = useRouteStore();
      const { toLoginRedirect } = useRouterPush(false);

      // 保存token到store
      this.token = backendToken.token;

      // 获取用户信息
      const userInfo = await this.updateUserInfo();
      if (!userInfo) {
        // 获取数据失败，重置状态，退出
        this.resetAuthStore();
        return;
      }

      // 初始化路由
      await route.initAuthRoute();

      // 跳转登录后的地址
      toLoginRedirect();

      // 登录成功弹出欢迎提示
      if (route.isInitAuthRoute) {
        window.$notification?.success({
          title: '登录成功!',
          content: `欢迎回来，${this.userInfo.userName}!`,
          duration: 3000
        });
      }
    },
    /**
     * 登录
     * @param userName - 用户名
     * @param password - 密码
     */
    async login(userName: string, password: string) {
      this.loginLoading = true;
      const { data } = await defaultAuthType.fetchLogin(userName, password);
      if (data) {
        // 登录成功后对返回的Token或者JWT处理
        defaultAuthType.handleAuthToken(data);
        await this.handleActionAfterLogin(data);
      }
      this.loginLoading = false;
    },
    /**
     * 查询用户信息并更新到store
     */
    async updateUserInfo() {
      const { data } = await fetchUserInfo();
      if (data) {
        // 成功后把用户信息存储到缓存中
        localStg.set('userInfo', data);
        // 更新状态
        this.userInfo = data;
        return data;
      }
      return null;
    },
    /**
     * 更换用户权限(切换账号)
     * @param userRole
     */
    async updateUserRole(userRole: Auth.RoleType) {
      const { resetRouteStore, initAuthRoute } = useRouteStore();

      const accounts: Record<Auth.RoleType, { userName: string; password: string }> = {
        super: {
          userName: 'Super',
          password: 'super123'
        },
        admin: {
          userName: 'Admin',
          password: 'admin123'
        },
        user: {
          userName: 'User01',
          password: 'user01123'
        }
      };
      const { userName, password } = accounts[userRole];
      const { data } = await defaultAuthType.fetchLogin(userName, password);
      if (data) {
        this.token = data.token;
        defaultAuthType.handleAuthToken(data);
        resetRouteStore();
        initAuthRoute();
      }
    }
  }
});
