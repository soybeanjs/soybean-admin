import { computed, inject, reactive } from 'vue';
import type { ComputedRef, App, InjectionKey } from 'vue';

interface UserInfo {
  userId: string;
  userName: string;
  userPhone: string;
}

interface AuthState {
  token: string;
  userInfo: UserInfo;
}

interface AuthStore {
  /** auth状态 */
  authState: AuthState;
  /** 是否登录 */
  isLogin: ComputedRef<boolean>;
}

const injectKey: InjectionKey<AuthStore> = Symbol('auth-store');

export function createAuthStore(app: App) {
  const state = reactive<AuthState>({
    token: '',
    userInfo: {
      userId: '',
      userName: '',
      userPhone: ''
    }
  });
  const isLogin = computed(() => Boolean(state.token));

  const provideData: AuthStore = {
    authState: state,
    isLogin
  };
  app.provide(injectKey, provideData);
}

export function useAuthStore() {
  return inject(injectKey)!;
}
