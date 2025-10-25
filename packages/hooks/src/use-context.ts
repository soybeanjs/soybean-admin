import { inject, provide } from 'vue';

/**
 * Use context
 *
 * @example
 *   ```ts
 *   // there are three vue files: A.vue, B.vue, C.vue, and A.vue is the parent component of B.vue and C.vue
 *
 *   // context.ts
 *   import { ref } from 'vue';
 *   import { useContext } from '@sa/hooks';
 *
 *   export const [provideDemoContext, useDemoContext] = useContext('demo', () => {
 *     const count = ref(0);
 *
 *     function increment() {
 *       count.value++;
 *     }
 *
 *     function decrement() {
 *       count.value--;
 *     }
 *
 *     return {
 *       count,
 *       increment,
 *       decrement
 *     };
 *   })
 *   ``` // A.vue
 *   ```vue
 *   <template>
 *     <div>A</div>
 *   </template>
 *   <script setup lang="ts">
 *   import { provideDemoContext } from './context';
 *
 *   provideDemoContext();
 *   // const { increment } = provideDemoContext(); // also can control the store in the parent component
 *   </script>
 *   ``` // B.vue
 *   ```vue
 *   <template>
 *    <div>B</div>
 *   </template>
 *   <script setup lang="ts">
 *   import { useDemoContext } from './context';
 *
 *   const { count, increment } = useDemoContext();
 *   </script>
 *   ```;
 *
 *   // C.vue is same as B.vue
 *
 * @param contextName Context name
 * @param fn Context function
 */
export default function useContext<Arguments extends Array<any>, T>(
  contextName: string,
  composable: (...args: Arguments) => T
) {
  const key = Symbol(contextName);

  /**
   * Injects the context value.
   *
   * @param consumerName - The name of the component that is consuming the context. If provided, the component must be
   *   used within the context provider.
   * @param defaultValue - The default value to return if the context is not provided.
   * @returns The context value.
   */
  const useInject = <N extends string | null | undefined = undefined>(
    consumerName?: N,
    defaultValue?: T
  ): N extends null | undefined ? T | null : T => {
    const value = inject(key, defaultValue);

    if (consumerName && !value) {
      throw new Error(`\`${consumerName}\` must be used within \`${contextName}\``);
    }

    // @ts-expect-error - we want to return null if the value is undefined or null
    return value || null;
  };

  const useProvide = (...args: Arguments) => {
    const value = composable(...args);

    provide(key, value);

    return value;
  };

  return [useProvide, useInject] as const;
}
