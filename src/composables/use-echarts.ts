import { computed, effectScope, nextTick, onScopeDispose, ref, toValue, watch } from 'vue';
import type { MaybeRefOrGetter } from 'vue';
import { useElementSize } from '@vueuse/core';
import { useTheme } from '@vean/ui';
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
import * as echarts from 'echarts/core';
import { LabelLayout, UniversalTransition } from 'echarts/features';
import { CanvasRenderer } from 'echarts/renderers';

/**
 * echarts 按需注册（P3-01 起，v2 `hooks/common/echarts.ts` 的移植）。
 *
 * 注册清单是工作台 + `/plugin/charts/echarts` 演示页的并集：折线 / 饼 / 柱 /
 * 雷达 / 散点 / 象形柱 / 仪表 + 标题 / 图例 / 提示 / 网格 / 工具箱 / 数据集 / 变换
 * + Canvas 渲染器。新增图表类型时**在这里加一行**，不要在页面里
 * `import 'echarts'`（整包会把体积从 ~100 kB 推到 ~1 MB gzip）。
 */
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

/** 已注册模块能表达的 option 类型（写 options 时有补全与约束） */
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

export interface EchartsHooks {
  /** 首次 init 之后（loading / tooltip 定制等） */
  onRender?: (chart: echarts.ECharts) => void;
  /** 每次 setOption 之后 */
  onUpdated?: (chart: echarts.ECharts) => void;
  /** dispose 之前（销毁前收尾） */
  onDestroy?: (chart: echarts.ECharts) => void;
}

/**
 * 图表生命周期钩子（v3 §4.6：v2 `useEcharts` 保留）。
 *
 * 负责三件事：容器尺寸就绪后 init、尺寸变化 resize、明暗切换重建实例
 * （echarts 的主题只在 init 时生效，切主题必须 dispose + init）。
 *
 * 只在容器**有真实尺寸**时 init —— 隐藏容器（页签切走 / 折叠）里 init 会
 * 得到 0×0 画布，`resize()` 也救不回来。
 *
 * `target` 由调用方提供（页面里是 `useTemplateRef<HTMLElement>('chart')`），
 * 这样模板上的 `ref="chart"` 与脚本里的变量同源，不需要额外把 ref 名再暴露一遍。
 */
export function useEcharts<T extends ECOption>(
  target: MaybeRefOrGetter<HTMLElement | null | undefined>,
  optionsFactory: () => T,
  hooks: EchartsHooks = {}
) {
  const scope = effectScope();

  const { effectiveMode } = useTheme();
  const darkMode = computed(() => effectiveMode.value === 'dark');

  /** 内部容器 ref：与调用方的模板 ref 同步（`useElementSize` 需要可写 ref 才收） */
  const domRef = ref<HTMLElement | null>(null);

  watch(
    () => (target ? toValue(target) : null),
    element => {
      domRef.value = element ?? null;
    },
    { immediate: true }
  );

  const { width, height } = useElementSize(domRef, { width: 0, height: 0 });

  let chart: echarts.ECharts | null = null;
  const chartOptions: T = optionsFactory();

  async function destroy(): Promise<void> {
    const instance = chart;

    if (!instance) {
      return;
    }

    hooks.onDestroy?.(instance);
    instance.dispose();
    chart = null;
  }

  /** init + 首次 setOption */
  async function render(): Promise<void> {
    if (chart) {
      return;
    }

    await nextTick();

    const dom = domRef.value;
    if (!dom) {
      return;
    }

    const instance = echarts.init(dom, darkMode.value ? 'dark' : 'light');

    instance.setOption({ ...chartOptions, backgroundColor: 'transparent' });
    chart = instance;
    hooks.onRender?.(instance);
  }

  /** 明暗切换：主题只在 init 生效，必须重建 */
  async function changeTheme(): Promise<void> {
    await destroy();
    await render();

    if (chart) {
      hooks.onUpdated?.(chart);
    }
  }

  /** 尺寸就绪才 render，已渲染则 resize；尺寸归零（容器隐藏）时销毁 */
  async function renderBySize(w: number, h: number): Promise<void> {
    if (w <= 0 || h <= 0) {
      await destroy();
      return;
    }

    const instance = chart;

    if (instance) {
      instance.resize();
      return;
    }

    await render();
  }

  /**
   * 增量更新（异步数据回来时调用）：patch 结果并入本地 options 再 setOption，
   * 保证 `render()` 在重建（切主题）时用的是最新数据。
   */
  async function updateOptions(patch: (options: T) => Partial<T> = () => chartOptions): Promise<void> {
    const instance = chart;

    if (!instance) {
      return;
    }

    const updated = patch(chartOptions);

    Object.assign(chartOptions, updated);
    instance.setOption({ ...updated, backgroundColor: 'transparent' });
    hooks.onUpdated?.(instance);
  }

  /** 直接 setOption（不并入本地 options） */
  function setOptions(options: T): void {
    chart?.setOption(options);
  }

  scope.run(() => {
    watch([width, height], ([w, h]) => {
      void renderBySize(w, h);
    });

    watch(darkMode, () => {
      void changeTheme();
    });
  });

  onScopeDispose(() => {
    void destroy();
    scope.stop();
  });

  return { domRef, updateOptions, setOptions };
}
