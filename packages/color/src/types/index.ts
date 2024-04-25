/**
 * the color palette number
 *
 * the main color number is 500
 */
export type ColorPaletteNumber = 50 | 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900 | 950;

/** the color palette */
export type ColorPalette = {
  /** the color hex value */
  hex: string;
  /**
   * the color number
   *
   * - 50 | 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900 | 950
   */
  number: ColorPaletteNumber;
};

/** the color palette family */
export type ColorPaletteFamily = {
  /** the color palette family name */
  name: string;
  /** the color palettes */
  palettes: ColorPalette[];
};

/** the color palette with delta */
export type ColorPaletteWithDelta = ColorPalette & {
  delta: number;
};

/** the color palette family with nearest palette */
export type ColorPaletteFamilyWithNearestPalette = ColorPaletteFamily & {
  nearestPalette: ColorPaletteWithDelta;
  nearestLightnessPalette: ColorPaletteWithDelta;
};

/** the color palette match */
export type ColorPaletteMatch = ColorPaletteFamily & {
  /** the color map of the palette */
  colorMap: Map<ColorPaletteNumber, ColorPalette>;
  /**
   * the main color of the palette
   *
   * which number is 500
   */
  main: ColorPalette;
  /** the match color of the palette */
  match: ColorPalette;
};

/**
 * The color index of color palette
 *
 * From left to right, the color is from light to dark, 6 is main color
 */
export type ColorIndex = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11;
