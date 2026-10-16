import { beforeEach, describe, expect, it } from 'vitest';
// @vitest-environment jsdom
import { createApp, ref } from 'vue';
import { defineStore, setActivePinia } from 'pinia';
import { setupStore } from '@/store/setup';

/**
 * `resetSetupStore` 是 setup store 唯一拿到 `$reset` 的途径 —— 它失效时不会报错，
 * 只会在登出重置时静默不生效，所以必须有用例盯着。
 *
 * 这里刻意走 `setupStore(app)` 而不是 `createPinia().use(...)`：pinia 的 `use()`
 * 在 `install(app)` 之前只把插件推进 `toBeInstalled`，不 `app.use` 插件就永远不执行
 * （这也正是生产链路 `defineApp({ plugins: [setupStore] })` 的形状）。
 */

beforeEach(() => {
  const app = createApp({ render: () => null });

  setActivePinia(setupStore(app));
});

describe('resetSetupStore', () => {
  it('把 setup store 的状态还原到初值', () => {
    const useStore = defineStore('probe', () => {
      const count = ref(0);
      const list = ref<string[]>([]);

      return { count, list };
    });

    const store = useStore();

    store.count = 3;
    store.list.push('a');

    store.$reset();

    expect(store.count).toBe(0);
    expect(store.list).toEqual([]);
  });

  it('连续重置两次仍还原到初值（快照不被 state 的原地修改污染）', () => {
    const useStore = defineStore('probe-repeat', () => {
      const list = ref<string[]>([]);

      return { list };
    });

    const store = useStore();

    store.list.push('first');
    store.$reset();
    store.list.push('second');
    store.$reset();

    expect(store.list).toEqual([]);
  });

  it('重置后 action 仍可调用', () => {
    const useStore = defineStore('probe-action', () => {
      const count = ref(0);

      function inc(): void {
        count.value += 1;
      }

      return { count, inc };
    });

    const store = useStore();

    store.inc();
    store.$reset();

    expect(store.count).toBe(0);

    store.inc();
    expect(store.count).toBe(1);
  });

  it('把初值来自持久化的 state 也还原到「建 store 时读到的快照」', () => {
    localStorage.setItem('@soybean/probe-seed', JSON.stringify(['seeded']));

    const useStore = defineStore('probe-seeded', () => {
      const items = ref<string[]>(JSON.parse(String(localStorage.getItem('@soybean/probe-seed'))));

      return { items };
    });

    const store = useStore();

    store.items.push('user-added');
    store.$reset();

    // 语义是「回到初值」而不是「清空」——清空语义由各 store 的 resetStore() 负责
    expect(store.items).toEqual(['seeded']);
  });
});
