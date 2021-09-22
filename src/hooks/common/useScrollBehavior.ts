import { ref } from 'vue';

/** 滚动行为 */
export default function useScrollBehavior() {
  const scrollbar = ref<HTMLElement | null>(null);

  /** 重置滚动条行为 */
  function resetScrollBehavior() {
    scrollbar.value?.scrollTo({ left: 0, top: 0 });
  }

  return {
    scrollbar,
    resetScrollBehavior
  };
}
