import { nextTick, effectScope, onScopeDispose, ref, watch } from 'vue';
import type { ComputedRef, Ref } from 'vue';
import * as echarts from 'echarts/core';
import { BarChart, GaugeChart, LineChart, PictorialBarChart, PieChart, RadarChart, ScatterChart } from 'echarts/charts';
import type {
  BarSeriesOption,
  GaugeSeriesOption,
  LineSeriesOption,
  PictorialBarSeriesOption,
  PieSeriesOption,
  RadarSeriesOption,
  ScatterSeriesOption
} from 'echarts/charts';
import {
  DatasetComponent,
  GridComponent,
  LegendComponent,
  TitleComponent,
  ToolboxComponent,
  TooltipComponent,
  TransformComponent
} from 'echarts/components';
import type {
  DatasetComponentOption,
  GridComponentOption,
  LegendComponentOption,
  TitleComponentOption,
  ToolboxComponentOption,
  TooltipComponentOption
} from 'echarts/components';
import { LabelLayout, UniversalTransition } from 'echarts/features';
import { CanvasRenderer } from 'echarts/renderers';
import { useElementSize } from '@vueuse/core';
import { useThemeStore } from '@/store';

export type ECOption = echarts.ComposeOption<
  | BarSeriesOption
  | LineSeriesOption
  | PieSeriesOption
  | ScatterSeriesOption
  | PictorialBarSeriesOption
  | RadarSeriesOption
  | GaugeSeriesOption
  | TitleComponentOption
  | LegendComponentOption
  | TooltipComponentOption
  | GridComponentOption
  | ToolboxComponentOption
  | DatasetComponentOption
>;

echarts.use([
  TitleComponent,
  LegendComponent,
  TooltipComponent,
  GridComponent,
  DatasetComponent,
  TransformComponent,
  ToolboxComponent,
  BarChart,
  LineChart,
  PieChart,
  ScatterChart,
  PictorialBarChart,
  RadarChart,
  GaugeChart,
  LabelLayout,
  UniversalTransition,
  CanvasRenderer
]);

/**
 * Echarts hooks函数
 * @param options - 图表配置
 * @param renderFun - 图表渲染函数(例如：图表监听函数)
 * @description 按需引入图表组件，没注册的组件需要先引入
 */
export function useEcharts(
  options: Ref<ECOption> | ComputedRef<ECOption>,
  renderFun?: (chartInstance: echarts.ECharts) => void
) {
  const theme = useThemeStore();

  const domRef = ref<HTMLElement>();

  const initialSize = { width: 0, height: 0 };
  const { width, height } = useElementSize(domRef, initialSize);

  let chart: echarts.ECharts | null = null;

  function canRender() {
    return initialSize.width > 0 && initialSize.height > 0;
  }

  function isRendered() {
    return Boolean(domRef.value && chart);
  }

  function update(updateOptions: ECOption) {
    if (isRendered()) {
      chart?.clear();
      chart!.setOption({ ...updateOptions, backgroundColor: 'transparent' });
    }
  }

  async function render() {
    if (domRef.value) {
      const chartTheme = theme.darkMode ? 'dark' : 'light';
      await nextTick();
      chart = echarts.init(domRef.value, chartTheme);
      if (renderFun) {
        renderFun(chart);
      }
      update(options.value);
    }
  }

  function resize() {
    chart?.resize();
  }

  function destroy() {
    chart?.dispose();
  }

  function updateTheme() {
    destroy();
    render();
  }

  const scope = effectScope();

  scope.run(() => {
    watch([width, height], ([newWidth, newHeight]) => {
      initialSize.width = newWidth;
      initialSize.height = newHeight;
      if (newWidth === 0 && newHeight === 0) {
        // 节点被删除 将chart置为空
        chart = null;
      }
      if (canRender()) {
        if (!isRendered()) {
          render();
        } else {
          resize();
        }
      }
    });

    watch(
      options,
      newValue => {
        update(newValue);
      },
      { deep: true }
    );

    watch(
      () => theme.darkMode,
      () => {
        updateTheme();
      }
    );
  });

  onScopeDispose(() => {
    destroy();
    scope.stop();
  });

  return {
    domRef
  };
}
