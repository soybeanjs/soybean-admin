import { defineStore } from 'pinia';
import { store } from '../../index';

interface AppState {
  /** 侧边栏折叠 */
  asideCollapse: boolean;
}

const appStore = defineStore({
  id: 'app-store',
  state: (): AppState => ({
    asideCollapse: false
  }),
  actions: {
    handleAsideCollapse(collapse: boolean) {
      this.asideCollapse = collapse;
    },
    toggleAside() {
      this.asideCollapse = !this.asideCollapse;
    }
  }
});

export default function useAppStore() {
  return appStore(store);
}
