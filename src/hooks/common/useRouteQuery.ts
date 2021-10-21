import { computed } from 'vue';
import { useRoute } from 'vue-router';
import { EnumRoutePath } from '@/enum';
import { ROUTE_NAME_MAP } from '@/utils';

export default function useRouteQuery() {
  const route = useRoute();

  /** 登录跳转链接 */
  const loginRedirectUrl = computed(() => {
    let url: EnumRoutePath | undefined;
    if (route.name === ROUTE_NAME_MAP.get('login')) {
      url = (route.query?.redirectUrl as EnumRoutePath) || '';
    }
    return url;
  });

  return {
    loginRedirectUrl
  };
}
