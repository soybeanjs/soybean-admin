import { provide, inject } from 'vue';
import type { InjectionKey } from 'vue';

/** 创建共享上下文状态 */
export default function useCreateContext<T>(contextName: string = 'context') {
  const injectKey: InjectionKey<T> = Symbol(contextName);

  function useProvider(shareState: T) {
    provide(injectKey, shareState);
  }

  function useContext() {
    return inject(injectKey);
  }

  return {
    useProvider,
    useContext
  };
}
