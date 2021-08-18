import chroma from 'chroma-js';

/**
 * 更亮的颜色
 * @param color
 */
export function brightenColor(color: string) {
  return chroma(color).brighten(0.5).hex();
}
