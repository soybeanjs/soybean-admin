import type { GlobalThemeOverrides } from 'naive-ui';
import { kebabCase } from 'lodash-es';
import { getColorPalette, addColorAlpha } from '@/utils';

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
function getThemeColors(colors: [ColorType, string][]) {
  const colorActions: ColorAction[] = [
    { scene: '', handler: color => color },
    { scene: 'Suppl', handler: color => color },
    { scene: 'Hover', handler: color => getColorPalette(color, 5) },
    { scene: 'Pressed', handler: color => getColorPalette(color, 7) },
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

/** 获取naive的主题颜色 */
export function getNaiveThemeOverrides(colors: { [key in ColorType]: string }): GlobalThemeOverrides {
  const { primary, info, success, warning, error } = colors;
  const themeColors = getThemeColors([
    ['primary', primary],
    ['info', info],
    ['success', success],
    ['warning', warning],
    ['error', error]
  ]);

  const colorLoading = primary;

  return {
    common: {
      ...themeColors
    },
    LoadingBar: {
      colorLoading
    }
  };
}

type ThemeVars = Exclude<GlobalThemeOverrides['common'], undefined>;
type ThemeVarsKeys = keyof ThemeVars;

/** 添加css vars至html */
export function addThemeCssVarsToHtml(themeVars: ThemeVars, action: 'add' | 'update' = 'add') {
  const keys = Object.keys(themeVars) as ThemeVarsKeys[];
  const style: string[] = [];
  keys.forEach(key => {
    style.push(`--${kebabCase(key)}: ${themeVars[key]}`);
  });
  const styleStr = style.join(';');
  if (action === 'add') {
    document.documentElement.style.cssText = styleStr;
  } else {
    document.documentElement.style.cssText += styleStr;
  }
}

/**
 * 根据主题颜色更新css vars
 * @param primaryColor
 */
export function updateThemeCssVarsByPrimary(primaryColor: string) {
  const themeColor = getThemeColors([['primary', primaryColor]]);
  addThemeCssVarsToHtml(themeColor, 'update');
}

/** windicss 暗黑模式 */
export function handleWindicssDarkMode() {
  const DARK_CLASS = 'dark';
  function addDarkClass() {
    document.documentElement.classList.add(DARK_CLASS);
  }
  function removeDarkClass() {
    document.documentElement.classList.remove(DARK_CLASS);
  }
  return {
    addDarkClass,
    removeDarkClass
  };
}
