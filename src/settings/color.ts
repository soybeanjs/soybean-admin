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
