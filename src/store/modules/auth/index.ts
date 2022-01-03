import { ref, computed, reactive } from 'vue';
import type { Ref, ComputedRef } from 'vue';
import { defineStore } from 'pinia';
import { getUserInfo, getToken } from '@/utils';

interface AuthStore {
  /** 用户信息 */
  userInfo: Auth.UserInfo;
  /** 用户token */
  token: Ref<string>;
  /** 是否登录 */
  isLogin: ComputedRef<boolean>;
  /** 用户角色 */
  role: Ref<Auth.RoleType>;
}

export const useAuthStore = defineStore('auth-store', () => {
  const userInfo: Auth.UserInfo = reactive(getUserInfo());
  const token = ref(getToken());
  const isLogin = computed(() => Boolean(token.value));
  const role = ref<Auth.RoleType>('super');

  const authStore: AuthStore = {
    userInfo,
    token,
    isLogin,
    role
  };

  return authStore;
});
