import { computed, effectScope, nextTick, onScopeDispose, ref, watch } from 'vue';
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
import { useThemeStore } from '@/store/modules/theme';

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
  onUpdated?: (chart: echarts.ECharts) => void | Promise<void>;
  onDestroy?: (chart: echarts.ECharts) => void | Promise<void>;
}

/**
 * use echarts
 *
 * @param optionsFactory echarts options factory function
 * @param darkMode dark mode
 */
export function useEcharts<T extends ECOption>(
  optionsFactory: () => T,
  hooks: ChartHooks = {
    onRender(chart) {
      chart.showLoading();
    },
    onUpdated(chart) {
      chart.hideLoading();
    }
  }
) {
  const scope = effectScope();

  const themeStore = useThemeStore();
  const darkMode = computed(() => themeStore.darkMode);

  const domRef = ref<HTMLElement | null>(null);
  const initialSize = { width: 0, height: 0 };
  const { width, height } = useElementSize(domRef, initialSize);

  let chart: echarts.ECharts | null = null;
  const chartOptions: T = optionsFactory();

  /**
   * whether can render chart
   *
   * when domRef is ready and initialSize is valid
   */
  function canRender() {
    return domRef.value && initialSize.width > 0 && initialSize.height > 0;
  }

  /** is chart rendered */
  function isRendered() {
    return Boolean(domRef.value && chart);
  }

  /**
   * update chart options
   *
   * @param callback callback function
   */
  async function updateOptions(callback: (opts: T, optsFactory: () => T) => ECOption = () => chartOptions) {
    if (!isRendered()) return;

    const updatedOpts = callback(chartOptions, optionsFactory);

    Object.assign(chartOptions, updatedOpts);

    if (isRendered()) {
      chart?.clear();
    }

    chart?.setOption({ ...updatedOpts, backgroundColor: 'transparent' });

    await hooks?.onUpdated?.(chart!);
  }

  /** render chart */
  async function render() {
    if (!isRendered()) {
      const chartTheme = darkMode.value ? 'dark' : 'light';

      await nextTick();

      chart = echarts.init(domRef.value, chartTheme);

      chart.setOption({ ...chartOptions, backgroundColor: 'transparent' });

      await hooks?.onRender?.(chart);
    }
  }

  /** resize chart */
  function resize() {
    chart?.resize();
  }

  /** destroy chart */
  async function destroy() {
    if (!chart) return;

    await hooks?.onDestroy?.(chart);
    chart?.dispose();
    chart = null;
  }

  /** change chart theme */
  async function changeTheme() {
    await destroy();
    await render();
    await hooks?.onUpdated?.(chart!);
  }

  /**
   * render chart by size
   *
   * @param w width
   * @param h height
   */
  async function renderChartBySize(w: number, h: number) {
    initialSize.width = w;
    initialSize.height = h;

    // size is abnormal, destroy chart
    if (!canRender()) {
      await destroy();

      return;
    }

    // resize chart
    if (isRendered()) {
      resize();
    }

    // render chart
    await render();
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
    updateOptions
  };
}
