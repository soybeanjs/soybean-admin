import { defineStore } from 'pinia';
import { store } from '@/store';
import { clearAuthStorage, getToken, getUserInfo } from '@/utils';
import type { UserInfo } from '@/interface';

interface AuthState {
  /** 用户token */
  token: string;
  /** 用户信息 */
  userInfo: UserInfo;
}

const authStore = defineStore({
  /** 区分不通状态的唯一标识 */
  id: 'auth-store',
  /** 状态 */
  state: (): AuthState => {
    return {
      token: getToken(),
      userInfo: getUserInfo()
    };
  },
  getters: {
    /** 是否登录 */
    isLogin: state => Boolean(state.token)
  },
  actions: {
    /** 设置Auth状态 */
    setAuthState(data: Partial<AuthState>) {
      Object.assign(this, data);
    },
    /** 重置auth状态 */
    resetAuthState() {
      clearAuthStorage();
      this.$reset();
    },
    /** 判断用户权益是否变更 */
    getIsAuthChange() {
      const token = getToken();
      const tokenChange = token !== this.token;
      return tokenChange;
    }
  }
});

export default function useAuthStore() {
  return authStore(store);
}
