import { computed, effectScope, onScopeDispose, ref, toValue, watch } from 'vue';
import type { MaybeRefOrGetter } from 'vue';
import { useElementSize } from '@vueuse/core';
import { useTheme } from '@vean/ui';
import VChart from '@visactor/vchart';
import type { ITheme, IVChart } from '@visactor/vchart';
import darkTheme from '@visactor/vchart-theme/public/dark.json';
import lightTheme from '@visactor/vchart-theme/public/light.json';

/**
 * VChart 生命周期（P4-01，v2 `hooks/common/vchart.ts` 的移植）。
 *
 * 与 `useEcharts` 同构：容器尺寸就绪才创建实例、尺寸变化 resize、明暗切换
 * 销毁重建。差异只在库本身：
 *
 * - VChart 实例的尺寸跟随容器，`resize()` 在 0×0 时会抛错，因此尺寸归零
 *   只销毁不重建（`canRender()`）；
 * - 主题用 `ThemeManager.setCurrentTheme()` 全局切换，**必须**在 new 之前设置，
 *   否则沿用上一个实例的主题。
 *
 * 主题 JSON 是运行时数据（不是样式），直接 import；`ECharts` 侧的 `backgroundColor`
 * 透明处理在 VChart 无对应项，改用 `background: 'transparent'` spec 字段由页面决定。
 */

VChart.ThemeManager.registerTheme('light', toTheme(lightTheme));
VChart.ThemeManager.registerTheme('dark', toTheme(darkTheme));

/** 主题 JSON 的宽泛结构（`ITheme` 的必填项在 JSON 里不保证齐全，逐字段收窄） */
function toTheme(value: unknown): Partial<ITheme> {
  return typeof value === 'object' && value !== null ? { ...value } : {};
}

export interface VChartHooks {
  /** 首次 renderSync 之后 */
  onRender?: (chart: IVChart) => void;
  /** 每次 updateSpec 之后 */
  onUpdated?: (chart: IVChart) => void;
  /** release 之前 */
  onDestroy?: (chart: IVChart) => void;
}

/**
 * VChart 生命周期钩子。
 *
 * `target` 由调用方提供（页面里是 `useTemplateRef<HTMLElement>('chart')`）。
 * `specFactory` 里可以放任意 `ISpec`，不做类型收窄 —— VChart 的 spec 是
 * 按 `type` 分派的联合体，页面各自知道自己要什么。
 */
export function useVChart<T extends { type: string }>(
  target: MaybeRefOrGetter<HTMLElement | null | undefined>,
  specFactory: () => T,
  hooks: VChartHooks = {}
) {
  const scope = effectScope();

  const { effectiveMode } = useTheme();
  const darkMode = computed(() => effectiveMode.value === 'dark');

  const domRef = ref<HTMLElement | null>(null);

  watch(
    () => (target ? toValue(target) : null),
    element => {
      domRef.value = element ?? null;
    },
    { immediate: true }
  );

  const { width, height } = useElementSize(domRef, { width: 0, height: 0 });

  let chart: IVChart | null = null;
  const spec: T = specFactory();

  /** 容器尺寸有效才可渲染（VChart 拿 0 尺寸会抛错） */
  function canRender(): boolean {
    return Boolean(domRef.value) && width.value > 0 && height.value > 0;
  }

  function destroy(): void {
    const instance = chart;

    if (!instance) {
      return;
    }

    hooks.onDestroy?.(instance);
    instance.release();
    chart = null;
  }

  function render(): void {
    const dom = domRef.value;

    if (chart || !dom || !canRender()) {
      return;
    }

    VChart.ThemeManager.setCurrentTheme(darkMode.value ? 'dark' : 'light');

    const instance = new VChart(spec, { dom });
    instance.renderSync();
    chart = instance;
    hooks.onRender?.(instance);
  }

  /** 明暗切换：主题在创建时定死，必须重建 */
  function changeTheme(): void {
    destroy();
    render();
  }

  function renderBySize(): void {
    if (!canRender()) {
      destroy();
      return;
    }

    if (chart) {
      void chart.resize(width.value, height.value);
      return;
    }

    render();
  }

  /** 增量更新（异步数据回来时调用） */
  function updateSpec(patch: (current: T) => Partial<T>): void {
    const instance = chart;

    if (!instance) {
      return;
    }

    const updated = patch(spec);

    Object.assign(spec, updated);
    void instance.updateSpec({ ...spec }, true);
    hooks.onUpdated?.(instance);
  }

  /** 直接替换 spec（不并入本地副本） */
  function setSpec(next: T): void {
    chart?.updateSpec({ ...next }, true);
  }

  scope.run(() => {
    watch([width, height], () => {
      renderBySize();
    });

    watch(darkMode, () => {
      changeTheme();
    });
  });

  onScopeDispose(() => {
    destroy();
    scope.stop();
  });

  return { domRef, updateSpec, setSpec };
}
