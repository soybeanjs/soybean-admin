import { computed } from 'vue';
import { useRoute } from 'vue-router';

export default function useRouteProps() {
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
