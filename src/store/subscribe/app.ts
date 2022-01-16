import { useBodyScroll } from '@/hooks';
import { useAppStore } from '../modules';

/** 订阅app store */
export default function subscribeAppStore() {
  const app = useAppStore();
  const { scrollBodyHandler } = useBodyScroll();

  app.$subscribe((_mutation, state) => {
    // 弹窗打开时禁止滚动条
    scrollBodyHandler(state.settingDrawerVisible);
  });
}
