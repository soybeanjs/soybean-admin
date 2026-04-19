import { klona } from '@sa/utils';
import type { ComputedRef, Ref } from 'vue';
import { isReactive, isRef, onUnmounted, watch } from 'vue';
import { useFormDirtyStore } from '@/store/modules/form-dirty';

type FormData = Record<string, unknown>;

interface UseFormDirtyGuardOptions {
  immediate?: boolean;
  deep?: boolean;
}

function createSnapshot<T extends FormData>(data: T): string {
  return JSON.stringify(klona(data));
}

function compareSnapshots(snapshot1: string, snapshot2: string): boolean {
  return snapshot1 === snapshot2;
}

export function useFormDirtyGuard<T extends FormData>(
  formData: Ref<T> | ComputedRef<T> | T,
  options: UseFormDirtyGuardOptions = {}
) {
  const { immediate = true, deep = true } = options;
  const formDirtyStore = useFormDirtyStore();

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
    formDirtyStore.markDirty();
  }

  function markClean() {
    formDirtyStore.markClean();
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
  const formDirtyStore = useFormDirtyStore();

  function markDirty() {
    formDirtyStore.markDirty();
  }

  function markClean() {
    formDirtyStore.markClean();
  }

  function setDirty(dirty: boolean) {
    formDirtyStore.setDirty(dirty);
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
