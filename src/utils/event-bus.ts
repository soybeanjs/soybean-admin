import { reactive } from 'vue';

type EventCallback = (...args: any[]) => void;

interface EventBus {
  on(event: string, callback: EventCallback): void;
  off(event: string, callback: EventCallback): void;
  emit(event: string, ...args: any[]): void;
}

const eventBus = reactive<{
  events: { [key: string]: EventCallback[] };
}>({
  events: {}
});

export const useEventBus = (): EventBus => {
  return {
    on(event: string, callback: EventCallback) {
      if (!eventBus.events[event]) {
        eventBus.events[event] = [];
      }
      eventBus.events[event].push(callback);
    },
    off(event: string, callback: EventCallback) {
      if (!eventBus.events[event]) return;
      eventBus.events[event] = eventBus.events[event].filter(cb => cb !== callback);
    },
    emit(event: string, ...args: any[]) {
      if (!eventBus.events[event]) return;
      eventBus.events[event].forEach(callback => callback(...args));
    }
  };
};
