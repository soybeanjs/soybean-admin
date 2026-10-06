import type { AnyColor } from 'colord';
import { getHex } from '../shared';
import type { ColorPaletteNumber } from '../types';
import { getRecommendedColorPalette } from './recommend';
import { getAntDColorPalette } from './antd';

/**
 * get color palette by provided color
 *
 * @param color
 * @param recommended whether to get recommended color palette (the provided color may not be the main color)
 */
export function getColorPalette(color: AnyColor, recommended = false) {
  const colorMap = new Map<ColorPaletteNumber, string>();

  if (recommended) {
    const colorPalette = getRecommendedColorPalette(getHex(color));
    colorPalette.palettes.forEach(palette => {
      colorMap.set(palette.number, palette.hex);
    });
  } else {
    const colors = getAntDColorPalette(color);

    const colorNumbers: ColorPaletteNumber[] = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950];

    colorNumbers.forEach((number, index) => {
      colorMap.set(number, colors[index]);
    });
  }

  return colorMap;
}

/**
 * get color palette color by number
 *
 * @param color the provided color
 * @param number the color palette number
 * @param recommended whether to get recommended color palette (the provided color may not be the main color)
 */
export function getPaletteColorByNumber(color: AnyColor, number: ColorPaletteNumber, recommended = false) {
  const colorMap = getColorPalette(color, recommended);

  return colorMap.get(number as ColorPaletteNumber)!;
}
