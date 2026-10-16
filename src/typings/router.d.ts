/** 注意：module augmentation 必须放在「模块文件」里（有顶层 import/export），放在全局脚本 `.d.ts` 里会被当作 ambient module。 */
import type { AppRouteMeta } from './app';

declare module 'vue-router' {
  interface RouteMeta extends AppRouteMeta {}
}
