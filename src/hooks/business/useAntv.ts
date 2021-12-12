import { ref, watch, onMounted } from 'vue';
import type { ComputedRef } from 'vue';
import type { Plot } from '@antv/g2plot';
import { useBoolean } from '@/hooks';

interface AntvFn<T, O> {
  new (dom: HTMLElement, options: O): T;
}

export default function useAntv<GraphOption, GraphType extends Plot<GraphOption>>(
  GraphFn: AntvFn<GraphType, GraphOption>,
  graphOptions: ComputedRef<GraphOption>
) {
  /** 图表dom容器 */
  const domRef = ref<HTMLElement>();

  /** 图表实例 */
  const graph = ref<GraphType>();

  /** 是否可以开始渲染图表 */
  const { bool: canRender, setTrue: setCanRender } = useBoolean();

  /** 是否是在onMouted第一次渲染图表 */
  const { bool: isFirstRender, setTrue: setIsFirstRender, setFalse: setIsNotFirstRender } = useBoolean();

  /** 渲染图表 */
  function renderGraph(options: GraphOption) {
    if (!domRef.value) return;
    if (!graph.value) {
      graph.value = new GraphFn(domRef.value, options);
      graph.value.render();
    } else {
      graph.value.update(options);
    }
  }

  onMounted(() => {
    setCanRender();
    setIsFirstRender();
    renderGraph(graphOptions.value);
    setIsNotFirstRender();
  });

  watch(graphOptions, newValue => {
    if (!canRender.value || isFirstRender.value) return;
    renderGraph(newValue);
  });

  return {
    domRef,
    graph
  };
}
