import { useEventListener } from '@vueuse/core';
import { defineStore } from 'pinia';
import { getCurrentInstance, ref } from 'vue';
import type { RouteLocationNormalized } from 'vue-router';
import { SetupStoreId } from '@/enum';
import { $t } from '@/locales';

let globalFormDirtyStore: ReturnType<typeof useFormDirtyStore> | null = null;

export function getFormDirtyStore() {
  if (globalFormDirtyStore) {
    return globalFormDirtyStore;
  }

  const instance = getCurrentInstance();
  if (instance) {
    try {
      globalFormDirtyStore = useFormDirtyStore();
      return globalFormDirtyStore;
    } catch {
      console.warn('Pinia may not be initialized yet');
    }
  }

  return null;
}

export const useFormDirtyStore = defineStore(SetupStoreId.FormDirty, () => {
  const isDirty = ref(false);

  const pendingNavigation = ref<{
    to: RouteLocationNormalized;
    from: RouteLocationNormalized;
  } | null>(null);

  function setDirty(dirty: boolean) {
    isDirty.value = dirty;
  }

  function markDirty() {
    isDirty.value = true;
  }

  function markClean() {
    isDirty.value = false;
  }

  function resetPendingNavigation() {
    pendingNavigation.value = null;
  }

  function setPendingNavigation(to: RouteLocationNormalized, from: RouteLocationNormalized) {
    pendingNavigation.value = { to, from };
  }

  function init() {
    globalFormDirtyStore = useFormDirtyStore();
  }

  useEventListener(window, 'beforeunload', (event: BeforeUnloadEvent) => {
    if (isDirty.value) {
      const message = $t('common.formDirtyLeaveBeforeunload');
      event.preventDefault();
      event.returnValue = message;
      return message;
    }
    return undefined;
  });

  return {
    isDirty,
    pendingNavigation,
    setDirty,
    markDirty,
    markClean,
    resetPendingNavigation,
    setPendingNavigation,
    init
  };
});
