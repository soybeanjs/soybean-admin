import { getColorPaletteFamily } from './palette';
import { getColorName } from './name';
import type { ColorPalette, ColorPaletteFamily, ColorPaletteItem, ColorPaletteNumber } from './type';
import defaultPalettes from './json/palette.json';

/**
 * Get color palette by provided color and color name
 *
 * @param color The provided color
 * @param colorName Color name
 */
export function getColorPalette(color: string, colorName: string) {
  const colorPaletteFamily = getColorPaletteFamily(color, colorName);

  const colorMap = new Map<ColorPaletteNumber, ColorPaletteItem>();

  colorPaletteFamily.palettes.forEach(palette => {
    colorMap.set(palette.number, palette);
  });

  const mainColor = colorMap.get(500) as ColorPaletteItem;
  const matchColor = colorPaletteFamily.palettes.find(palette => palette.hexcode === color) as ColorPaletteItem;

  const colorPalette: ColorPalette = {
    ...colorPaletteFamily,
    colorMap,
    main: mainColor,
    match: matchColor
  };

  return colorPalette;
}

/**
 * Get color by color palette number
 *
 * @param color Color
 * @param num Color palette number
 * @returns Color hexcode
 */
export function getColorByColorPaletteNumber(color: string, num: ColorPaletteNumber) {
  const colorPalette = getColorPalette(color, color);

  const colorItem = colorPalette.colorMap.get(num) as ColorPaletteItem;

  return colorItem.hexcode;
}

export default getColorPalette;

/** The builtin color palettes */
const colorPalettes = defaultPalettes as ColorPaletteFamily[];

export { getColorName, colorPalettes };

export type { ColorPalette, ColorPaletteNumber, ColorPaletteItem, ColorPaletteFamily };
