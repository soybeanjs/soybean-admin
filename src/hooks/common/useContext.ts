import { provide, inject } from 'vue';
import type { InjectionKey } from 'vue';

/** 创建共享上下文状态 */
export default function useContext<T>(contextName: string = 'context') {
  const injectKey: InjectionKey<T> = Symbol(contextName);

  function useProvide(context: T) {
    provide(injectKey, context);
  }

  function useInject() {
    return inject(injectKey)!;
  }

  return {
    useProvide,
    useInject
  };
}
