import { computed, ref, watch } from 'vue';
import { useRoute } from 'vue-router';

export function useRouteProps() {
  const route = useRoute();

  const props = computed(() => {
    /** 路由名称 */
    const name = route.name as string;
    /** 混存页面 */
    const keepAlive = Boolean(route.meta?.keepAlive);
    /** 视高100% */
    const fullPage = Boolean(route.meta?.fullPage);

    return {
      name,
      keepAlive,
      fullPage
    };
  });

  return props;
}

/** 路由切换，重置滚动行为 */
export function useScrollBehavior() {
  const scrollbar = ref<HTMLElement | null>(null);
  const route = useRoute();

  function resetScrollBehavior() {
    scrollbar.value?.scrollTo({ left: 0, top: 0 });
  }

  watch(
    () => route.name,
    () => {
      resetScrollBehavior();
    }
  );

  return {
    scrollbar
  };
}
