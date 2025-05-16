import type { App } from 'vue';
import { ProDate, ProDateTime, ProInput, ProRate, create } from 'pro-naive-ui';

/** pro-naive-ui 支持配置表单的按需加载，所以需要注册 */
export function setupProNaiveComponents(app: App) {
  const proNaive = create({
    components: [ProInput, ProDate, ProDateTime, ProRate]
  });
  app.use(proNaive);
}
