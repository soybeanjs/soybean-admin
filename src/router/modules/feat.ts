import type { CustomRoute } from '@/interface';
import { EnumRoutePath, EnumRouteTitle } from '@/enum';
import { BasicLayout } from '@/layouts';
import { ROUTE_NAME_MAP, setRouterCacheName } from '@/utils';
import FeatCopy from '@/views/feat/copy/index.vue';

setRouterCacheName(FeatCopy, ROUTE_NAME_MAP.get('feat_copy'));

const FEAT: CustomRoute = {
  name: ROUTE_NAME_MAP.get('feat'),
  path: EnumRoutePath.feat,
  component: BasicLayout,
  redirect: { name: ROUTE_NAME_MAP.get('feat_copy') },
  meta: {
    requiresAuth: true,
    title: EnumRouteTitle.feat,
    icon: 'ic:round-repeat'
  },
  children: [
    {
      name: ROUTE_NAME_MAP.get('feat_copy'),
      path: EnumRoutePath.feat_copy,
      component: FeatCopy,
      meta: {
        requiresAuth: true,
        title: EnumRouteTitle.feat_copy,
        fullPage: true
      }
    }
  ]
};

export default FEAT;
