import type { App, Directive } from 'vue';
import { NETWORK_ERROR_MSG } from '@/config';

export default function setupNetworkDirective(app: App) {
  function listenerHandler(event: MouseEvent) {
    const hasNetwork = window.navigator.onLine;
    if (!hasNetwork) {
      window.$message?.error(NETWORK_ERROR_MSG);
      event.stopPropagation();
    }
  }

  const networkDirective: Directive<HTMLElement, boolean | undefined> = {
    mounted(el: HTMLElement, binding) {
      if (binding.value === false) return;
      el.addEventListener('click', listenerHandler, { capture: true });
    },
    unmounted(el: HTMLElement, binding) {
      if (binding.value === false) return;
      el.removeEventListener('click', listenerHandler);
    }
  };

  app.directive('network', networkDirective);
}
