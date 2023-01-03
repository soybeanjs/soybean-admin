import { readFile } from 'fs/promises';
import nodeHtmlToImage from 'node-html-to-image';
import themeSettings from '../src/settings/theme.json';

async function generatePngLogoFromSvg(svgPath: string, color: string) {
  const svgStr = await readFile(svgPath, 'utf-8');

  const svgStrWithColor = svgStr.replace(/currentColor/g, color);

  await nodeHtmlToImage({
    output: './public/logo.png',
    html: svgStrWithColor,
    transparent: true
  });
}

generatePngLogoFromSvg('./src/assets/svg-icon/logo.svg', themeSettings.themeColor);
