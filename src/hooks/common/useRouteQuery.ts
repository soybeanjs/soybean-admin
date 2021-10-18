import { computed } from 'vue';
import { useRoute } from 'vue-router';
import { EnumRoutePath } from '@/enum';
import { RouteNameMap } from '@/router';

export default function useRouteQuery() {
  const route = useRoute();

  /** 登录跳转链接 */
  const loginRedirectUrl = computed(() => {
    let url: EnumRoutePath | undefined;
    if (route.name === RouteNameMap.get('login')) {
      url = (route.query?.redirectUrl as EnumRoutePath) || '';
    }
    return url;
  });

  return {
    loginRedirectUrl
  };
}
