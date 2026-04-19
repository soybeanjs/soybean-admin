import { useEventListener } from '@vueuse/core';
import { defineStore } from 'pinia';
import { ref } from 'vue';
import type { RouteLocationNormalized } from 'vue-router';
import { SetupStoreId } from '@/enum';
import { $t } from '@/locales';

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
    setPendingNavigation
  };
});
