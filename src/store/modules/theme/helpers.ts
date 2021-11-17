import { brightenColor, darkenColor, addColorAlpha } from '@/utils';

type ColorType = 'primary' | 'info' | 'success' | 'warning' | 'error';

type ColorScene = '' | 'Suppl' | 'Hover' | 'Pressed' | 'Active';

type ColorKey = `${ColorType}Color${ColorScene}`;

type ThemeColor = {
  [key in ColorKey]?: string;
};

interface ColorAction {
  scene: ColorScene;
  handler: (color: string) => string;
}

/** 获取主题颜色的各种场景对应的颜色 */
export function getThemeColors(colors: [ColorType, string][]) {
  const colorActions: ColorAction[] = [
    { scene: '', handler: color => color },
    { scene: 'Suppl', handler: color => color },
    { scene: 'Hover', handler: color => brightenColor(color) },
    { scene: 'Pressed', handler: color => darkenColor(color) },
    { scene: 'Active', handler: color => addColorAlpha(color, 0.1) }
  ];

  const themeColor: ThemeColor = {};

  colors.forEach(color => {
    colorActions.forEach(action => {
      const [colorType, colorValue] = color;
      const colorKey: ColorKey = `${colorType}Color${action.scene}`;
      themeColor[colorKey] = action.handler(colorValue);
    });
  });

  return themeColor;
}
