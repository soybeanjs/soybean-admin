import { computed, onMounted, ref } from 'vue';
import type { ComputedRef, Ref } from 'vue';

/** 服务端与首屏取值不一致会触发 `Hydration node/text/attribute mismatch` 并丢弃部分 DOM 重渲染。详见 docs/v3-notes.md N-263。 */
export function useHydrated(): ComputedRef<boolean> {
  const mounted: Ref<boolean> = ref(false);

  onMounted(() => {
    mounted.value = true;
  });

  return computed(() => mounted.value);
}

/** 派生一个「水合前用占位值、水合后用真值」的 computed 详见 docs/v3-notes.md N-264。 */
export function useHydratedValue<T>(source: ComputedRef<T> | (() => T), fallback: T): ComputedRef<T> {
  const hydrated = useHydrated();
  const read = typeof source === 'function' ? source : () => source.value;

  return computed(() => (hydrated.value ? read() : fallback));
}
