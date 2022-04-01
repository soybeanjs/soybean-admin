import colorJson from './color.json';

interface TraditionColorDetail {
  label: string;
  color: string;
}
interface TraditionColor {
  label: string;
  data: TraditionColorDetail[];
}

/** 中国传统颜色 */
export const traditionColors = colorJson as TraditionColor[];

export function isInTraditionColors(color: string) {
  return traditionColors.some(item => {
    const flag = item.data.some(v => v.color === color);
    return flag;
  });
}
