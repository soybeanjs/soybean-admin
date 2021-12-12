export default function useAntvTool() {
  /**
   * antv滑动调属性
   */
  function getSlider(columns: number, length: number, sliderColor: string) {
    return {
      start: 1 - columns / length,
      end: 1,
      foregroundStyle: { fill: sliderColor }
    };
  }

  function getFormatter(unit: string) {
    const EMPTY = ' ';
    function formatter(v: number | null) {
      return v === null ? EMPTY : v + unit;
    }
    return formatter;
  }

  function formatLabelWithUnit(value: number | null, unit: string) {
    const EMPTY = ' ';
    return value === null ? EMPTY : value + unit;
  }

  return {
    getSlider,
    getFormatter,
    formatLabelWithUnit
  };
}
