import { ref } from 'vue';
import { defineStore } from 'pinia';
import type { AppLocale } from '@/constants';

/**
 * 应用级 UI 状态（与主题、鉴权解耦）。
 *
 * locale 的**真值**仍在 vue-i18n（`setLocale()`，来自 `ubean/client`）；
 * 这里只保留一份镜像，供不依赖 i18n 上下文的组件（如 store 驱动的菜单）使用。
 */
export const useAppStore = defineStore('app', () => {
  /** 侧边栏折叠 */
  const sidebarCollapsed = ref(false);
  /** 当前 locale 镜像 */
  const locale = ref<AppLocale>('zh-CN');

  function toggleSidebar(): void {
    sidebarCollapsed.value = !sidebarCollapsed.value;
  }

  function setSidebarCollapsed(collapsed: boolean): void {
    sidebarCollapsed.value = collapsed;
  }

  function setLocaleMirror(next: AppLocale): void {
    locale.value = next;
  }

  return { sidebarCollapsed, locale, toggleSidebar, setSidebarCollapsed, setLocaleMirror };
});
