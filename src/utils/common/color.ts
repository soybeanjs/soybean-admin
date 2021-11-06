import chroma from 'chroma-js';

/**
 * 更亮的颜色
 * @param color - 颜色
 * @param deep - 效果层次
 */
export function brightenColor(color: string, deep: number = 0.5) {
  return chroma(color).brighten(deep).hex();
}

/**
 * 更暗的颜色
 * @param color - 颜色
 * @param deep - 效果层次
 */
export function darkenColor(color: string, deep: number = 0.5) {
  return chroma(color).darken(deep).hex();
}

/**
 * 给颜色加透明度
 * @param color - 颜色
 * @param alpha - 透明度
 */
export function addColorAlpha(color: string, alpha: number) {
  return chroma(color).alpha(alpha).hex();
}

/**
 * 颜色混合
 * @param firstColor - 第一个颜色
 * @param secondColor - 第二个颜色
 * @param ratio - 第二个颜色占比
 */
export function mixColor(firstColor: string, secondColor: string, ratio: number) {
  return chroma.mix(firstColor, secondColor, ratio).hex();
}
