import { onMounted, onUnmounted } from 'vue';
import { useEventBus } from '@/utils/event-bus';

type ShortcutHandler = (event: KeyboardEvent) => void;

const useKeyboardShortcuts = () => {
  const eventBus = useEventBus();

  const shortcuts: { [key: string]: ShortcutHandler } = {
    k: (event: KeyboardEvent) => {
      event.preventDefault();
      eventBus.emit('searchShortcutKey');
    }
  };

  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.ctrlKey && shortcuts[event.key]) {
      shortcuts[event.key](event);
    }
  };

  onMounted(() => {
    window.addEventListener('keydown', handleKeyDown);
  });

  onUnmounted(() => {
    window.removeEventListener('keydown', handleKeyDown);
  });
};

export { useKeyboardShortcuts };
