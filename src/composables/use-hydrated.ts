import { computed, onMounted, ref } from 'vue';
import type { ComputedRef, Ref } from 'vue';

/**
 * 客户端挂载门控（水合一致性工具）。
 *
 * ## 解决什么问题
 *
 * 应用是 SSR 首屏 + 客户端水合。任何**服务端算不出、客户端却算得出**的首屏
 * 数据，都会让两侧渲染出不同的 DOM，Vue 只能报
 * `Hydration node/text/attribute mismatch` 并丢弃部分服务端 DOM 重新渲染 ——
 * 表现为首屏闪一下，且控制台一片红。这类数据的来源只有两个：
 *
 * 1. `localStorage`（页签列表、登录用户信息、主题偏好）；
 * 2. 服务端被早退跳过、客户端才执行的逻辑（路由守卫里的用户信息/菜单初始化）。
 *
 * ## 怎么用
 *
 * 把「只在浏览器成立」的值包一层：`const hydrated = useHydrated()`，
 * 首屏渲染时读 `hydrated.value ? 真值 : 占位值`，两侧即一致。**不要**用它去
 * 包服务端本就能算出来的东西（菜单树的 static 分支、i18n 文案）—— 那是纯粹
 * 多一层无谓的分支。
 *
 * `computed` 重算不产生额外渲染成本：水合后 `mounted` 变 true，依赖它的
 * computed 自然重算一次，正好把真实数据填进 DOM。
 *
 * 判定用 `onMounted` 而不是 `import.meta.client`：后者在 ubean 的 dev 预渲染
 * 上下文里**是 `false` 但 `window` 不存在**（见 AGENTS.md「已知陷阱」），
 * 拿它当判据会在服务端走进客户端分支。判据必须是能力检测。
 */
export function useHydrated(): ComputedRef<boolean> {
  const mounted: Ref<boolean> = ref(false);

  onMounted(() => {
    mounted.value = true;
  });

  return computed(() => mounted.value);
}

/**
 * 派生一个「水合前用占位值、水合后用真值」的 computed。
 *
 * 比在每个组件里手写 `mounted.value ? a : b` 更省事，也把「首屏占位」这件事
 * 显式命名出来。`fallback` 必须与服务端渲染结果一致（通常是空串 / `'-'` / `'U'`）。
 *
 * @param source 真实值（依赖 `localStorage` 或客户端才有的数据）
 * @param fallback 服务端与水合前使用的占位值
 */
export function useHydratedValue<T>(source: ComputedRef<T> | (() => T), fallback: T): ComputedRef<T> {
  const hydrated = useHydrated();
  const read = typeof source === 'function' ? source : () => source.value;

  return computed(() => (hydrated.value ? read() : fallback));
}
