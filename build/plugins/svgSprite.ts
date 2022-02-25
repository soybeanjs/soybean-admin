import path from 'path';
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons';

export default createSvgIconsPlugin({
  iconDirs: [path.resolve(process.cwd(), 'src/assets/svg')],
  symbolId: 'icon-[dir]-[name]'
});
