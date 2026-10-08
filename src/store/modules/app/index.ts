import { computed, ref, watch } from 'vue';
import { useMediaQuery } from '@vueuse/core';
import { defineStore } from 'pinia';
import { mobileViewportQuery } from '@vean/aria/shared';

export const useAppStore = defineStore('app', () => {
  /** 与 SAppShell 共用同一个断点来源，避免两处定义 768px */
  const isMobile = useMediaQuery(mobileViewportQuery);

  const themeDrawerVisible = ref(false);
  const searchVisible = ref(false);

  /** 侧栏展开态（受控下发给 SAppShell，供「折叠触发器/全屏内容」联动） */
  const sidebarOpen = ref(true);

  function toggleSidebar(): void {
    sidebarOpen.value = !sidebarOpen.value;
  }

  function setSidebarOpen(open: boolean): void {
    sidebarOpen.value = open;
  }

  /** 移动端抽屉展开态（受控下发给 SAppShell） */
  const mobileOpen = ref(false);

  function toggleMobileSidebar(): void {
    mobileOpen.value = !mobileOpen.value;
  }

  function setMobileOpen(open: boolean): void {
    mobileOpen.value = open;
  }

  /**
   * 进入/退出移动端只修「抽屉开合」这类运行态。
   *
   * 布局模式不在这里改写：Vean 在移动端本来就固定渲染 `sidebar` 骨架
   * （`app-shell.vue` 的 `mobileView ? sidebar : mode`），而
   * `resolveLayoutMatrix()` 已把这件事显式化。改写 settings 会把「移动端退化」
   * 持久化进 localStorage，用户下次在桌面打开就回不到原来选的模式了。
   */
  function syncMobileLayout(mobile: boolean): void {
    // 从移动端回到桌面：抽屉必须收起，否则侧栏与遮罩会同时存在
    if (!mobile) mobileOpen.value = false;
  }

  watch(isMobile, syncMobileLayout, { immediate: true });

  function toggleThemeDrawer(): void {
    themeDrawerVisible.value = !themeDrawerVisible.value;
  }

  function setThemeDrawerVisible(visible: boolean): void {
    themeDrawerVisible.value = visible;
  }

  function toggleSearch(): void {
    searchVisible.value = !searchVisible.value;
  }

  function setSearchVisible(visible: boolean): void {
    searchVisible.value = visible;
  }

  /** 语言由 i18n 插件持有，这里只做镜像，便于非组件处读取 */
  const locale = ref<string>('zh');

  const setLocaleMirror = (next: string): void => {
    locale.value = next;
  };

  /** 全局 loading（页签/路由切换的顶部进度条显隐） */
  const loading = ref(false);

  const isLoading = computed(() => loading.value);

  function setLoading(value: boolean): void {
    loading.value = value;
  }

  return {
    isMobile,
    locale,
    loading,
    isLoading,
    sidebarOpen,
    mobileOpen,
    themeDrawerVisible,
    searchVisible,
    syncMobileLayout,
    toggleSidebar,
    setSidebarOpen,
    toggleMobileSidebar,
    setMobileOpen,
    toggleThemeDrawer,
    setThemeDrawerVisible,
    toggleSearch,
    setSearchVisible,
    setLocaleMirror,
    setLoading
  };
});
