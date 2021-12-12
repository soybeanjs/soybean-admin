import { ref, watch, computed, nextTick } from 'vue';
import type { Ref, ComputedRef } from 'vue';

interface VirtualListConfig {
  /** 容器的高度 */
  containerHeight: number;
  /** 渲染的个数 */
  renderNums: number;
  /** 触发的高度距离 */
  triggerHeight: number;
}

/**
 * 虚拟列表
 * @param list - 列表数据源
 * @param config - 虚拟列表配置
 */
export default function useVirtualList<T extends { [key: string]: any }[]>(
  list: Ref<T>,
  config: VirtualListConfig = {
    containerHeight: 200,
    renderNums: 10,
    triggerHeight: 24
  }
) {
  const { containerHeight, renderNums, triggerHeight } = config;

  const renderIndex = ref(1);
  function setRenderIndex(index: number) {
    renderIndex.value = index;
  }
  function resetRenderIndex() {
    setRenderIndex(1);
  }

  const dataSource = computed(() => {
    const endIndex = renderIndex.value * renderNums;
    return list.value.slice(0, endIndex);
  }) as ComputedRef<T>;

  function handleScroll(e: Event) {
    const target = e.target as HTMLElement;
    const needRender = target.scrollHeight - (target.scrollTop + containerHeight) < triggerHeight;
    if (needRender) {
      nextTick(() => {
        setRenderIndex(renderIndex.value + 1);
      });
    }
  }

  watch(list, () => {
    resetRenderIndex();
  });

  return {
    containerHeight,
    dataSource,
    handleScroll
  };
}
