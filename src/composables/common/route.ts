import { computed, watch } from 'vue';
import { useRoute } from 'vue-router';
import { routeName } from '@/router';
import type { RouteKey } from '@/interface';

/**
 * 路由属性
 */
export function useRouteProps() {
  const route = useRoute();
  const props = computed(() => {
    /** 路由名称 */
    const name = route.name as string;
    /** 缓存页面 */
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

/**
 * 路由查询参数
 */
export function useRouteQuery() {
  const route = useRoute();

  /** 登录跳转链接 */
  const loginRedirectUrl = computed(() => {
    let url: string | undefined;
    if (route.name === routeName('login')) {
      url = (route.query?.redirect as string) || '';
    }
    return url;
  });

  return {
    loginRedirectUrl
  };
}

/**
 * 路由名称变化后的回调
 * @param callback
 */
export function routeNameWatcher(callback: (name: RouteKey) => void) {
  const route = useRoute();
  watch(
    () => route.name,
    newValue => {
      callback(newValue as RouteKey);
    }
  );
}

/**
 * 路由全路径变化后的回调
 * @param callback
 */
export function routeFullPathWatcher(callback: (fullPath: string) => void) {
  const route = useRoute();
  watch(
    () => route.fullPath,
    newValue => {
      callback(newValue);
    }
  );
}
