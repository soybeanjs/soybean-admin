import chroma from 'chroma-js';

/**
 * 更亮的颜色
 * @param color
 */
export function brightenColor(color: string) {
  return chroma(color).brighten(0.5).hex();
}

/**
 * 更浅的颜色
 * @param color
 */
export function shallowColor(color: string, alpha: number = 0.5) {
  return chroma(color).alpha(alpha).hex();
}

/**
 * 更暗的颜色
 * @param color
 */
export function darkenColor(color: string) {
  return chroma(color).darken(0.5).hex();
}

/**
 * 给颜色加透明度
 * @param color - 颜色
 * @param alpha - 透明度
 */
export function addColorAlpha(color: string, alpha: number) {
  return chroma(color).alpha(alpha).hex();
}
