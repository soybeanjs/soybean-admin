import { ref, watch } from 'vue';
import { useRoute } from 'vue-router';

export default function useScrollBehavior() {
  const scrollbar = ref<HTMLElement | null>(null);
  const route = useRoute();

  function resetScrollBehavior() {
    scrollbar.value?.scrollTo({ left: 0, top: 0 });
  }

  function resetScrollWatcher() {
    watch(
      () => route.name,
      () => {
        resetScrollBehavior();
      }
    );
  }

  return {
    scrollbar,
    resetScrollWatcher
  };
}
