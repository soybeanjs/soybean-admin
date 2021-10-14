import { visualizer } from 'rollup-plugin-visualizer';

export default visualizer({
  open: true,
  gzipSize: true,
  brotliSize: true
});
