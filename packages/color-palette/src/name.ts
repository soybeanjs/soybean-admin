import { getHex, getHsl, getRgb } from './color';
import colorNames from './json/color-name.json';

export function getColorName(color: string) {
  const hex = getHex(color);
  const rgb = getRgb(color);
  const hsl = getHsl(color);

  let ndf = 0;
  let ndf1 = 0;
  let ndf2 = 0;
  let cl = -1;
  let df = -1;

  let name = '';

  colorNames.some((item, index) => {
    const [hexValue, colorName] = item;

    const hexcode = `#${hexValue}`;

    const match = hex === hexcode;

    if (match) {
      name = colorName;
    } else {
      const { r, g, b } = getRgb(hexcode);
      const { h, s, l } = getHsl(hexcode);

      ndf1 = (rgb.r - r) ** 2 + (rgb.g - g) ** 2 + (rgb.b - b) ** 2;
      ndf2 = (hsl.h - h) ** 2 + (hsl.s - s) ** 2 + (hsl.l - l) ** 2;

      ndf = ndf1 + ndf2 * 2;
      if (df < 0 || df > ndf) {
        df = ndf;
        cl = index;
      }
    }

    return match;
  });

  name = cl < 0 ? 'Invalid Color' : colorNames[cl][1];

  return name;
}
