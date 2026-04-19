import { klona } from '@sa/utils';
import type { ComputedRef, Ref } from 'vue';
import { computed, isReactive, isRef, onUnmounted, ref, watch } from 'vue';
import { useFormDirtyStore, getFormDirtyStore } from '@/store/modules/form-dirty';
import { $t } from '@/locales';

type FormData = Record<string, unknown>;

interface UseFormDirtyGuardOptions {
  immediate?: boolean;
  deep?: boolean;
}

interface UseModalFormDirtyOptions extends UseFormDirtyGuardOptions {
  onConfirmLeave?: () => void | Promise<void>;
  onCancelLeave?: () => void | Promise<void>;
}

interface ModalCloseHandler {
  handleClose: () => Promise<boolean>;
  beforeClose: (done: (closed?: boolean) => void) => void;
  canClose: ComputedRef<boolean>;
}

function createSnapshot<T extends FormData>(data: T): string {
  return JSON.stringify(klona(data));
}

function compareSnapshots(snapshot1: string, snapshot2: string): boolean {
  return snapshot1 === snapshot2;
}

function showConfirmDialog(): Promise<boolean> {
  if (!window.$dialog) {
    console.warn('Dialog is not available, allowing navigation');
    return Promise.resolve(true);
  }

  return new Promise(resolve => {
    let resolved = false;

    const dialog = window.$dialog.warning({
      title: $t('common.formDirtyLeaveTitle'),
      content: $t('common.formDirtyLeaveContent'),
      positiveText: $t('common.formDirtyLeaveConfirm'),
      negativeText: $t('common.formDirtyLeaveCancel'),
      closable: false,
      maskClosable: false,
      onPositiveClick: () => {
        if (resolved) return;
        resolved = true;
        resolve(true);
      },
      onNegativeClick: () => {
        if (resolved) return;
        resolved = true;
        resolve(false);
      },
      onClose: () => {
        if (resolved) return;
        resolved = true;
        resolve(false);
      }
    });

    setTimeout(() => {
      if (!resolved && dialog) {
        resolved = true;
        dialog.destroy();
        resolve(false);
      }
    }, 60000);
  });
}

export function useFormDirtyGuard<T extends FormData>(
  formData: Ref<T> | ComputedRef<T> | T,
  options: UseFormDirtyGuardOptions = {}
) {
  const { immediate = true, deep = true } = options;

  let formDirtyStore;
  try {
    formDirtyStore = useFormDirtyStore();
  } catch (e) {
    console.warn('Failed to access formDirtyStore, trying alternative:', e);
    formDirtyStore = getFormDirtyStore();
  }

  if (!formDirtyStore) {
    console.warn('formDirtyStore is not available, dirty state tracking disabled');
    return {
      isDirty: ref(false),
      markDirty: () => {},
      markClean: () => {},
      resetDirty: () => {},
      updateInitialData: () => {},
      checkDirty: () => false,
      takeSnapshot: () => {}
    };
  }

  let initialSnapshot: string = '';

  function getFormDataValue(): T {
    if (isRef(formData) || 'value' in formData) {
      return (formData as Ref<T>).value;
    }
    return formData as T;
  }

  function takeSnapshot() {
    const data = getFormDataValue();
    initialSnapshot = createSnapshot(data);
  }

  function checkDirty(): boolean {
    const currentData = getFormDataValue();
    const currentSnapshot = createSnapshot(currentData);
    return !compareSnapshots(initialSnapshot, currentSnapshot);
  }

  function markDirty() {
    formDirtyStore?.markDirty();
  }

  function markClean() {
    formDirtyStore?.markClean();
  }

  function resetDirty() {
    takeSnapshot();
    markClean();
  }

  function updateInitialData(data: T) {
    initialSnapshot = createSnapshot(data);
    markClean();
  }

  if (immediate) {
    takeSnapshot();
  }

  let stopWatcher: (() => void) | null = null;

  if (isRef(formData) || isReactive(formData)) {
    stopWatcher = watch(
      formData,
      () => {
        if (checkDirty()) {
          markDirty();
        }
      },
      { deep }
    );
  }

  onUnmounted(() => {
    if (stopWatcher) {
      stopWatcher();
    }
    markClean();
  });

  return {
    isDirty: formDirtyStore.isDirty,
    markDirty,
    markClean,
    resetDirty,
    updateInitialData,
    checkDirty,
    takeSnapshot
  };
}

export function useManualFormDirtyGuard() {
  let formDirtyStore;
  try {
    formDirtyStore = useFormDirtyStore();
  } catch (e) {
    console.warn('Failed to access formDirtyStore:', e);
    formDirtyStore = getFormDirtyStore();
  }

  if (!formDirtyStore) {
    return {
      isDirty: ref(false),
      markDirty: () => {},
      markClean: () => {},
      setDirty: () => {}
    };
  }

  function markDirty() {
    formDirtyStore?.markDirty();
  }

  function markClean() {
    formDirtyStore?.markClean();
  }

  function setDirty(dirty: boolean) {
    formDirtyStore?.setDirty(dirty);
  }

  onUnmounted(() => {
    markClean();
  });

  return {
    isDirty: formDirtyStore.isDirty,
    markDirty,
    markClean,
    setDirty
  };
}

export function useModalFormDirtyGuard<T extends FormData>(
  formData: Ref<T> | ComputedRef<T> | T,
  visibleRef: Ref<boolean>,
  options: UseModalFormDirtyOptions = {}
) {
  const { onConfirmLeave, onCancelLeave, ...guardOptions } = options;

  const dirtyGuard = useFormDirtyGuard(formData, guardOptions);

  const canClose = computed(() => {
    return !dirtyGuard.isDirty.value;
  });

  async function handleClose(): Promise<boolean> {
    if (!dirtyGuard.isDirty.value) {
      dirtyGuard.markClean();
      return true;
    }

    const confirmed = await showConfirmDialog();

    if (confirmed) {
      dirtyGuard.markClean();
      if (onConfirmLeave) {
        await onConfirmLeave();
      }
      return true;
    }

    if (onCancelLeave) {
      await onCancelLeave();
    }
    return false;
  }

  function beforeClose(done: (closed?: boolean) => void) {
    handleClose().then(canCloseNow => {
      if (canCloseNow) {
        done(true);
      } else {
        done(false);
      }
    });
  }

  watch(
    visibleRef,
    (newVal, oldVal) => {
      if (!newVal && oldVal) {
        return;
      }
      if (newVal && !oldVal) {
        dirtyGuard.resetDirty();
      }
    }
  );

  onUnmounted(() => {
    dirtyGuard.markClean();
  });

  return {
    ...dirtyGuard,
    handleClose,
    beforeClose,
    canClose,
    showConfirmDialog
  };
}

export function useSimpleFormDirtyGuard() {
  const isFormDirty = ref(false);

  let formDirtyStore;
  try {
    formDirtyStore = useFormDirtyStore();
  } catch (e) {
    console.warn('Failed to access formDirtyStore:', e);
    formDirtyStore = getFormDirtyStore();
  }

  function markDirty() {
    isFormDirty.value = true;
    formDirtyStore?.markDirty();
  }

  function markClean() {
    isFormDirty.value = false;
    formDirtyStore?.markClean();
  }

  watch(
    isFormDirty,
    (dirty) => {
      formDirtyStore?.setDirty(dirty);
    }
  );

  onUnmounted(() => {
    markClean();
  });

  return {
    isFormDirty,
    markDirty,
    markClean,
    showConfirmDialog
  };
}
