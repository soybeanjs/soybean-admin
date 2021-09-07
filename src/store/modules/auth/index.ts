import { defineStore } from 'pinia';
import { store } from '@/store';
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
      token: '',
      userInfo: {
        userId: '',
        userName: '',
        userPhone: ''
      }
    };
  },
  getters: {
    /** 是否登录 */
    isLogin: state => Boolean(state.token)
  },
  actions: {
    /** 重置auth状态 */
    resetAuthState() {
      this.$reset();
    }
  }
});

export default function useAuthStore() {
  return authStore(store);
}
