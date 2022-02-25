import type { App } from 'vue';
import { SvgIcon } from '@/components';

/** 注册全局svg-icon组件 */
export default function setupNaiveUI(app: App) {
  app.component('SvgIcon', SvgIcon);
}
