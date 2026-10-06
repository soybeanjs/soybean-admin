import { getColorName, getDeltaE, getHsl, isValidColor, transformHslToHex } from '../shared';
import { colorPalettes } from '../constant';
import type {
  ColorPalette,
  ColorPaletteFamily,
  ColorPaletteFamilyWithNearestPalette,
  ColorPaletteMatch,
  ColorPaletteNumber
} from '../types';

/**
 * get recommended color palette by provided color
 *
 * @param color the provided color
 */
export function getRecommendedColorPalette(color: string) {
  const colorPaletteFamily = getRecommendedColorPaletteFamily(color);

  const colorMap = new Map<ColorPaletteNumber, ColorPalette>();

  colorPaletteFamily.palettes.forEach(palette => {
    colorMap.set(palette.number, palette);
  });

  const mainColor = colorMap.get(500)!;
  const matchColor = colorPaletteFamily.palettes.find(palette => palette.hex === color)!;

  const colorPalette: ColorPaletteMatch = {
    ...colorPaletteFamily,
    colorMap,
    main: mainColor,
    match: matchColor
  };

  return colorPalette;
}

/**
 * get recommended palette color by provided color
 *
 * @param color the provided color
 * @param number the color palette number
 */
export function getRecommendedPaletteColorByNumber(color: string, number: ColorPaletteNumber) {
  const colorPalette = getRecommendedColorPalette(color);

  const { hex } = colorPalette.colorMap.get(number)!;

  return hex;
}

/**
 * get color palette family by provided color and color name
 *
 * @param color the provided color
 */
export function getRecommendedColorPaletteFamily(color: string) {
  if (!isValidColor(color)) {
    throw new Error('Invalid color, please check color value!');
  }

  let colorName = getColorName(color);

  colorName = colorName.toLowerCase().replace(/\s/g, '-');

  const { h: h1, s: s1 } = getHsl(color);

  const { nearestLightnessPalette, palettes } = getNearestColorPaletteFamily(color, colorPalettes);

  const { number, hex } = nearestLightnessPalette;

  const { h: h2, s: s2 } = getHsl(hex);

  const deltaH = h1 - h2;

  const sRatio = s1 / s2;

  const colorPaletteFamily: ColorPaletteFamily = {
    name: colorName,
    palettes: palettes.map(palette => {
      let hexValue = color;

      const isSame = number === palette.number;

      if (!isSame) {
        const { h: h3, s: s3, l } = getHsl(palette.hex);

        const newH = deltaH < 0 ? h3 + deltaH : h3 - deltaH;
        const newS = s3 * sRatio;

        hexValue = transformHslToHex({
          h: newH,
          s: newS,
          l
        });
      }

      return {
        hex: hexValue,
        number: palette.number
      };
    })
  };

  return colorPaletteFamily;
}

/**
 * get nearest color palette family
 *
 * @param color color
 * @param families color palette families
 */
function getNearestColorPaletteFamily(color: string, families: ColorPaletteFamily[]) {
  const familyWithConfig = families.map(family => {
    const palettes = family.palettes.map(palette => {
      return {
        ...palette,
        delta: getDeltaE(color, palette.hex)
      };
    });

    const nearestPalette = palettes.reduce((prev, curr) => (prev.delta < curr.delta ? prev : curr));

    return {
      ...family,
      palettes,
      nearestPalette
    };
  });

  const nearestPaletteFamily = familyWithConfig.reduce((prev, curr) =>
    prev.nearestPalette.delta < curr.nearestPalette.delta ? prev : curr
  );

  const { l } = getHsl(color);

  const paletteFamily: ColorPaletteFamilyWithNearestPalette = {
    ...nearestPaletteFamily,
    nearestLightnessPalette: nearestPaletteFamily.palettes.reduce((prev, curr) => {
      const { l: prevLightness } = getHsl(prev.hex);
      const { l: currLightness } = getHsl(curr.hex);

      const deltaPrev = Math.abs(prevLightness - l);
      const deltaCurr = Math.abs(currLightness - l);

      return deltaPrev < deltaCurr ? prev : curr;
    })
  };

  return paletteFamily;
}
