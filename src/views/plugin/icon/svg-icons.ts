const importSvgIcons = import.meta.glob('../../../assets/svg/**/*.svg');
export const svgIcons = Object.keys(importSvgIcons).map(k => {
  return k.split('/svg/')[1].replaceAll('/', '-').replace('.svg', '');
});
