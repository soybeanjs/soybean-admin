import { readFile } from 'fs/promises';
import nodeHtmlToImage from 'node-html-to-image';

async function generatePngLogoFromSvg(svgPath: string, color: string) {
  const svgStr = await readFile(svgPath, 'utf-8');

  const svgStrWithColor = svgStr.replace(/currentColor/g, color);

  nodeHtmlToImage({
    output: './public/logo1.png',
    html: svgStrWithColor,
    transparent: true
  });
}

generatePngLogoFromSvg('./src/assets/svg-icon/logo.svg', '#1890ff');
