import { getDeltaE, getHsl, isValidColor, transformHslToHex } from './color';
import { getColorName } from './name';
import type { ColorPaletteFamily, ColorPaletteFamilyWithNearestPalette } from './type';
import defaultPalettes from './json/palette.json';

export function getNearestColorPaletteFamily(color: string, families: ColorPaletteFamily[]) {
  const familyWithConfig = families.map(family => {
    const palettes = family.palettes.map(palette => {
      return {
        ...palette,
        delta: getDeltaE(color, palette.hexcode)
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
      const { l: prevLightness } = getHsl(prev.hexcode);
      const { l: currLightness } = getHsl(curr.hexcode);

      const deltaPrev = Math.abs(prevLightness - l);
      const deltaCurr = Math.abs(currLightness - l);

      return deltaPrev < deltaCurr ? prev : curr;
    })
  };

  return paletteFamily;
}

export function getColorPaletteFamily(color: string, colorName: string) {
  if (!isValidColor(color)) {
    throw new Error('Invalid color, please check color value!');
  }

  const { h: h1, s: s1 } = getHsl(color);

  const { nearestLightnessPalette, palettes } = getNearestColorPaletteFamily(
    color,
    defaultPalettes as ColorPaletteFamily[]
  );

  const { number, hexcode } = nearestLightnessPalette;

  const { h: h2, s: s2 } = getHsl(hexcode);

  const deltaH = h1 - h2 || h2;

  const sRatio = s1 / s2;

  const colorPaletteFamily: ColorPaletteFamily = {
    key: colorName,
    palettes: palettes.map(palette => {
      let hexValue = color;

      const isSame = number === palette.number;

      if (!isSame) {
        const { h: h3, s: s3, l } = getHsl(palette.hexcode);

        const newH = deltaH < 0 ? h3 + deltaH : deltaH;
        const newS = s3 * sRatio;

        hexValue = transformHslToHex({
          h: newH,
          s: newS,
          l
        });
      }

      return {
        hexcode: hexValue,
        number: palette.number,
        name: getColorName(hexValue)
      };
    })
  };

  return colorPaletteFamily;
}
