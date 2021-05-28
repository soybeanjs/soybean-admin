import { inject, reactive } from 'vue';
import type { App, InjectionKey } from 'vue';

interface AsideState {
  collapse: boolean;
}

interface AsideStore {
  /** aside状态 */
  asideState: AsideState;
  /** 切换collapse */
  toggle: () => void;
}

const injectKey: InjectionKey<AsideStore> = Symbol('aside-store');

export function createAsideStore(app: App) {
  const state = reactive<AsideState>({
    collapse: false
  });
  function toggle() {
    state.collapse = !state.collapse;
  }
  const provideData: AsideStore = {
    asideState: state,
    toggle
  };
  app.provide(injectKey, provideData);
}

export function useAsideStore() {
  return inject(injectKey)!;
}
