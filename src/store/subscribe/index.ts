import subscribeAppStore from './app';
import subscribeThemeStore from './theme';

/** 订阅状态 */
export function subscribeStore() {
  subscribeAppStore();
  subscribeThemeStore();
}
