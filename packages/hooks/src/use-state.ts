import { ref } from 'vue';
import type { Ref } from 'vue';

/**
 * useRef
 *
 * it is a simple ref management hook wrapped by vue3's ref function.
 *
 * to resolve the ref type problem about `UnwrapRef`
 *
 * @param initValue
 */
export function useRef<T>(initValue: T) {
  const refValue = ref(initValue) as Ref<T>;

  return refValue;
}

/**
 * useState
 *
 * define a state and a setState function
 *
 * @param initValue
 */
export function useState<T>(initValue: T) {
  const state = useRef(initValue);

  function setState(value: T) {
    state.value = value;
  }

  return [state, setState] as const;
}

interface Signal<T> {
  (): T;
  /**
   * the ref object of the signal, but it is readonly
   *
   * equal to `const ref = ref(initValue);`
   */
  readonly ref: Readonly<Ref<T>>;
  /**
   * set the value of the signal
   *
   * @param value
   */
  set(value: T): void;
  /**
   * update the value of the signal
   *
   * @param fn update function
   */
  update(fn: (value: T) => T): void;
}

/**
 * useSignal
 *
 * @param initValue
 */
export function useSignal<T>(initValue: T) {
  const [state, setState] = useState(initValue);

  function updateState(fn: (value: T) => T) {
    const updatedValue = fn(state.value);
    setState(updatedValue);
  }

  const signal = function signal() {
    return state.value;
  } as Signal<T>;

  (signal as any).ref = state;

  signal.set = setState;
  signal.update = updateState;

  return signal;
}
