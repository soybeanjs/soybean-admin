import { computed, ref, shallowRef, triggerRef } from 'vue';
import type {
  ComputedGetter,
  DebuggerOptions,
  Ref,
  ShallowRef,
  WritableComputedOptions,
  WritableComputedRef
} from 'vue';

type Updater<T> = (value: T) => T;
type Mutator<T> = (value: T) => void;

/**
 * Signal is a reactive value that can be set, updated or mutated
 *
 * @example
 *   ```ts
 *   const count = useSignal(0);
 *
 *   // `watchEffect`
 *   watchEffect(() => {
 *   console.log(count());
 *   });
 *
 *   // watch
 *   watch(count, value => {
 *   console.log(value);
 *   });
 *
 *   // useComputed
 *   const double = useComputed(() => count() * 2);
 *   const writeableDouble = useComputed({
 *   get: () => count() * 2,
 *   set: value => count.set(value / 2)
 *   });
 *   ```
 */
export interface Signal<T> {
  (): Readonly<T>;
  /**
   * Set the value of the signal
   *
   * It recommend use `set` for primitive values
   *
   * @param value
   */
  set(value: T): void;
  /**
   * Update the value of the signal using an updater function
   *
   * It recommend use `update` for non-primitive values, only the first level of the object will be reactive.
   *
   * @param updater
   */
  update(updater: Updater<T>): void;
  /**
   * Mutate the value of the signal using a mutator function
   *
   * this action will call `triggerRef`, so the value will be tracked on `watchEffect`.
   *
   * It recommend use `mutate` for non-primitive values, all levels of the object will be reactive.
   *
   * @param mutator
   */
  mutate(mutator: Mutator<T>): void;
  /**
   * Get the reference of the signal
   *
   * Sometimes it can be useful to make `v-model` work with the signal
   *
   * ```vue
   * <template>
   *   <input v-model="model.count" />
   * </template>;
   *
   * <script setup lang="ts">
   *  const state = useSignal({ count: 0 }, { useRef: true });
   *
   *  const model = state.getRef();
   * </script>
   * ```
   */
  getRef(): Readonly<ShallowRef<Readonly<T>>>;
}

export interface ReadonlySignal<T> {
  (): Readonly<T>;
}

export interface SignalOptions {
  /**
   * Whether to use `ref` to store the value
   *
   * @default false use `sharedRef` to store the value
   */
  useRef?: boolean;
}

export function useSignal<T>(initialValue: T, options?: SignalOptions): Signal<T> {
  const { useRef } = options || {};

  const state = useRef ? (ref(initialValue) as Ref<T>) : shallowRef(initialValue);

  return createSignal(state);
}

export function useComputed<T>(getter: ComputedGetter<T>, debugOptions?: DebuggerOptions): ReadonlySignal<T>;
export function useComputed<T>(options: WritableComputedOptions<T>, debugOptions?: DebuggerOptions): Signal<T>;
export function useComputed<T>(
  getterOrOptions: ComputedGetter<T> | WritableComputedOptions<T>,
  debugOptions?: DebuggerOptions
) {
  const isGetter = typeof getterOrOptions === 'function';

  const computedValue = computed(getterOrOptions as any, debugOptions);

  if (isGetter) {
    return () => computedValue.value as ReadonlySignal<T>;
  }

  return createSignal(computedValue);
}

function createSignal<T>(state: ShallowRef<T> | WritableComputedRef<T>): Signal<T> {
  const signal = () => state.value;

  signal.set = (value: T) => {
    state.value = value;
  };

  signal.update = (updater: Updater<T>) => {
    state.value = updater(state.value);
  };

  signal.mutate = (mutator: Mutator<T>) => {
    mutator(state.value);
    triggerRef(state);
  };

  signal.getRef = () => state as Readonly<ShallowRef<Readonly<T>>>;

  return signal;
}
