import {
  create,
  NLayout,
  NLayoutSider,
  NLayoutHeader,
  NLayoutContent,
  NLayoutFooter,
  NSpace,
  NButton,
  NDatePicker,
  NInput
} from 'naive-ui';
import type { App } from 'vue';

export default function setupNaive(app: App) {
  const naive = create({
    components: [
      NLayout,
      NLayoutSider,
      NLayoutHeader,
      NLayoutContent,
      NLayoutFooter,
      NSpace,
      NButton,
      NDatePicker,
      NInput
    ]
  });
  app.use(naive);
}
