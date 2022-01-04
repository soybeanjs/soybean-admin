import { unref, computed } from 'vue';
import { useRoute } from 'vue-router';
import { router } from '@/router';
import { useRouteStore } from '@/store';

/**
 * 路由查询参数
 * @param inSetup - 是否在vue页面/组件的setup里面调用，在axios里面无法使用useRouter和useRoute
 */
export function useRouteQuery(inSetup: boolean = true) {
  const { getRouteName } = useRouteStore();

  const route = getRouteInstance(inSetup);

  /** 登录后跳转的地址 */
  const loginRedirect = computed(() => {
    let url: string | undefined;
    if (route.name === getRouteName('login')) {
      url = (route.query?.redirect as string) || '';
    }
    return url;
  });

  return {
    loginRedirect
  };
}

function getRouteInstance(inSetup: boolean = true) {
  const route = inSetup ? useRoute() : unref(router.currentRoute);
  return route;
}
