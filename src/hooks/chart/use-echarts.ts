import { effectScope, nextTick, onScopeDispose, ref, watch } from 'vue';
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

interface ChartHooks {
  onRender?: (chart: echarts.ECharts) => void | Promise<void>;
  onDestroy?: (chart: echarts.ECharts) => void | Promise<void>;
}

/**
 * use echarts
 *
 * @param options echarts options
 * @param darkMode dark mode
 */
export function useEcharts(options: ECOption, darkMode: Ref<boolean> | ComputedRef<boolean>, hooks?: ChartHooks) {
  const scope = effectScope();

  const domRef = ref<HTMLElement | null>(null);

  const initialSize = { width: 0, height: 0 };
  const { width, height } = useElementSize(domRef, initialSize);

  let chart: echarts.ECharts | null = null;

  function canRender() {
    return initialSize.width > 0 && initialSize.height > 0;
  }

  function isRendered() {
    return Boolean(domRef.value && chart);
  }

  function setOptions(opts: ECOption) {
    if (isRendered()) {
      chart?.clear();
      chart?.setOption({ ...opts, backgroundColor: 'transparent' });
    }
  }

  async function render() {
    if (domRef.value) {
      const chartTheme = darkMode.value ? 'dark' : 'light';

      await nextTick();

      chart = echarts.init(domRef.value, chartTheme);

      setOptions(options);

      await hooks?.onRender?.(chart);
    }
  }

  function resize() {
    chart?.resize();
  }

  async function destroy() {
    if (!chart) return;

    await hooks?.onDestroy?.(chart);
    chart?.dispose();
    chart = null;
  }

  async function changeTheme() {
    await destroy();
    await render();
  }

  /**
   * render chart by size
   *
   * @param w
   * @param h
   */
  async function renderChartBySize(w: number, h: number) {
    initialSize.width = w;
    initialSize.height = h;

    // size is abnormal, destroy chart
    if (!canRender()) {
      await destroy();

      return;
    }

    // render chart
    if (!isRendered()) {
      await render();
      return;
    }

    // resize chart
    resize();
  }

  scope.run(() => {
    watch([width, height], ([newWidth, newHeight]) => {
      renderChartBySize(newWidth, newHeight);
    });

    watch(darkMode, () => {
      changeTheme();
    });
  });

  onScopeDispose(() => {
    destroy();
    scope.stop();
  });

  return {
    domRef,
    setOptions
  };
}
