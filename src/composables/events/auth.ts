import { onMounted, onUnmounted } from 'vue';
import { useAuthStore } from '@/store';

/** 添加用户权益变更的全局点击事件监听 */
export function useAuthChangeEvent() {
  const { getIsAuthChange } = useAuthStore();

  function eventHandler(event: MouseEvent) {
    const change = getIsAuthChange();
    if (change) {
      event.stopPropagation();
      window.location.reload();
    }
  }

  function addAuthChangeListener() {
    document.addEventListener('click', eventHandler, { capture: true });
  }

  function removeAuthChangeListener() {
    document.removeEventListener('click', eventHandler);
  }

  onMounted(() => {
    addAuthChangeListener();
  });

  onUnmounted(() => {
    removeAuthChangeListener();
  });
}
