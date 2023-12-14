/** The color palette number */
export type ColorPaletteNumber = 50 | 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900 | 950;

/** The color palette item */
export type ColorPaletteItem = {
  /** The color hexcode */
  hexcode: string;
  /**
   * The color number
   *
   * @link {@link ColorPaletteNumber}
   */
  number: ColorPaletteNumber;
  /** The color name */
  name: string;
};

export type ColorPaletteFamily = {
  /** The color palette family key */
  key: string;
  /** The color palette family's palettes */
  palettes: ColorPaletteItem[];
};

export type ColorPaletteWithDelta = ColorPaletteItem & {
  delta: number;
};

export type ColorPaletteItemWithName = ColorPaletteItem & {
  name: string;
};

export type ColorPaletteFamilyWithNearestPalette = ColorPaletteFamily & {
  nearestPalette: ColorPaletteWithDelta;
  nearestLightnessPalette: ColorPaletteWithDelta;
};

export type ColorPalette = ColorPaletteFamily & {
  /** The color map of the palette */
  colorMap: Map<ColorPaletteNumber, ColorPaletteItem>;
  /**
   * The main color of the palette
   *
   * Which number is 500
   */
  main: ColorPaletteItemWithName;
  /** The match color of the palette */
  match: ColorPaletteItemWithName;
};
