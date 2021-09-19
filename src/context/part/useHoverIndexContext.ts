import { ref } from 'vue';
import type { Ref } from 'vue';
import { useContext } from '@/hooks';

interface HoverIndexContext {
  /** 被悬浮元素索引 */
  index: Ref<number>;
  /** 设置索引 */
  setHoverIndex(index: number): void;
  /** 重置索引 */
  resetHoverIndex(): void;
}
const { useProvide, useInject: useHoverIndexInject } = useContext<HoverIndexContext>();

/** 获取被悬浮元素的索引上下文 */
export default function useHoverIndexContext() {
  const index = ref(-1);
  function setHoverIndex(hIndex: number) {
    index.value = hIndex;
  }
  function resetHoverIndex() {
    index.value = -1;
  }

  const context: HoverIndexContext = {
    index,
    setHoverIndex,
    resetHoverIndex
  };
  function useHoverIndexProvide() {
    useProvide(context);
  }

  return {
    context,
    useHoverIndexProvide,
    useHoverIndexInject
  };
}
