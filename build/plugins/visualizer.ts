import { visualizer } from 'rollup-plugin-visualizer';

export default visualizer({
  gzipSize: true,
  brotliSize: true,
  open: true
});
