import type { PiniaPluginContext } from 'pinia';
import { klona } from '@vean/aria/shared';

/**
 * 给 setup 语法写的 store 补上 `$reset`（options store 自带，setup store 原生没有）。
 *
 * 装配时机是插件生效的那一次 `defineStore` 调用 —— 此时 `context.store.$state` 已经是
 * setup 里所有 ref/reactive 的集合，`klona` 一份快照即可；`$reset` 用 `$patch` 而不是
 * 重新赋值，避免把 `$state` 的响应式引用换掉。快照每次重置都重新克隆：`$patch` 会把
 * 快照里的数组/对象直接挂到 state 上，之后对 state 的原地修改会污染第一份快照。
 *
 * 注意初值语义：`state` 的初值来自 setup 执行结果，因此初值里读 localStorage 的 store
 * （如 `tab` 的 `tabs`）重置后回到「建 store 那一刻的持久化快照」而非空值。
 * 需要「清空」语义时仍走各自的 `resetStore()`（详见 `docs/v3-notes.md` N-117）。
 */
export function resetSetupStore(context: PiniaPluginContext): void {
  const defaultStore = klona(context.store.$state);

  context.store.$reset = () => {
    context.store.$patch(klona(defaultStore));
  };
}
