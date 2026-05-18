import { inject, provide } from 'vue';

type ContextName = string | { name: string; key: string | symbol };

type ContextValue<T> = T extends (...args: any[]) => any ? ReturnType<T> : T;

type ContextProvider<T> = T extends (...args: any[]) => any ? T : (arg: T) => T;

type ContextConsumer<Context> = <N extends string | null | undefined = undefined>(
  consumerName?: N,
  defaultValue?: Context
) => N extends null | undefined ? Context | null : Context;

/**
 * Creates a context provider and consumer pair.
 *
 * @param contextName - The name of the context. This can be a string or an object with a `name` and `key` property.
 * @param composable - An optional composable function that returns the context value. If not provided, the context value will be the first argument passed to the provider.
 */
export default function useContext<T>(
  contextName: ContextName,
  composable?: T extends (...args: any[]) => any ? T : never
) {
  type Context = ContextValue<T>;

  const name = typeof contextName === 'string' ? contextName : contextName.name;

  const key = typeof contextName === 'string' ? Symbol(contextName) : contextName.key;

  /**
   * Injects the context value.
   *
   * @param consumerName - The name of the component that is consuming the context. If provided, the component must be
   *   used within the context provider.
   * @param defaultValue - The default value to return if the context is not provided.
   * @returns The context value.
   */
  const useInject = (consumerName?: string | null, defaultValue?: any) => {
    const value = inject(key, defaultValue) ?? null;

    if (consumerName != null && value === null) {
      throw new Error(`\`${consumerName}\` must be used within \`${name}\``);
    }

    return value;
  };

  const useProvide = (...args: any[]) => {
    const value = composable?.(...args) ?? args[0];

    provide(key, value);

    return value;
  };

  return [useProvide, useInject] as [ContextProvider<T>, ContextConsumer<Context>];
}
