import { computed, effectScope, onScopeDispose, ref, watch } from 'vue';
import { useElementSize } from '@vueuse/core';
import VChart, { registerLiquidChart } from '@visactor/vchart';
import type { ISpec, ITheme } from '@visactor/vchart';
import light from '@visactor/vchart-theme/public/light.json';
import dark from '@visactor/vchart-theme/public/dark.json';
import { useThemeStore } from '@/store/modules/theme';

registerLiquidChart();

// register the theme
VChart.ThemeManager.registerTheme('light', light as ITheme);
VChart.ThemeManager.registerTheme('dark', dark as ITheme);

interface ChartHooks {
  onRender?: (chart: VChart) => void | Promise<void>;
  onUpdated?: (chart: VChart) => void | Promise<void>;
  onDestroy?: (chart: VChart) => void | Promise<void>;
}

export function useVChart<T extends ISpec>(specFactory: () => T, hooks: ChartHooks = {}) {
  const scope = effectScope();
  const themeStore = useThemeStore();
  const darkMode = computed(() => themeStore.darkMode);

  const domRef = ref<HTMLElement | null>(null);
  const initialSize = { width: 0, height: 0 };
  const { width, height } = useElementSize(domRef, initialSize);

  let chart: VChart | null = null;
  const spec: T = specFactory();

  const { onRender, onUpdated, onDestroy } = hooks;

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
   * update chart spec
   *
   * @param callback callback function
   */
  async function updateSpec(callback: (opts: T, optsFactory: () => T) => ISpec = () => spec) {
    if (!isRendered()) return;

    const updatedOpts = callback(spec, specFactory);

    Object.assign(spec, updatedOpts);

    if (isRendered()) {
      chart?.release();
    }

    chart?.updateSpec({ ...updatedOpts }, true);

    await onUpdated?.(chart!);
  }

  function setSpec(newSpec: T) {
    chart?.updateSpec(newSpec);
  }

  /** render chart */
  async function render() {
    if (!isRendered()) {
      // apply the theme
      if (darkMode.value) {
        VChart.ThemeManager.setCurrentTheme('dark');
      } else {
        VChart.ThemeManager.setCurrentTheme('light');
      }

      chart = new VChart(spec, { dom: domRef.value as HTMLElement });
      chart.renderSync();

      await onRender?.(chart);
    }
  }

  /** resize chart */
  function resize() {
    // chart?.resize();
  }

  /** destroy chart */
  async function destroy() {
    if (!chart) return;

    await onDestroy?.(chart);
    chart?.release();
    chart = null;
  }

  /** change chart theme */
  async function changeTheme() {
    await destroy();
    await render();
    await onUpdated?.(chart!);
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
    updateSpec,
    setSpec
  };
}
