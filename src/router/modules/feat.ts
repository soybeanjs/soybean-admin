import type { CustomRoute } from '@/interface';
import { EnumRoutePath, EnumRouteTitle } from '@/enum';
import { BasicLayout } from '@/layouts';
import { ROUTE_NAME_MAP, setRouterCacheName } from '@/utils';
import FeatCopy from '@/views/feat/copy/index.vue';
import FeatIcon from '@/views/feat/icon/index.vue';
import FeatPrint from '@/views/feat/print/index.vue';

setRouterCacheName(FeatCopy, ROUTE_NAME_MAP.get('feat_copy'));
setRouterCacheName(FeatIcon, ROUTE_NAME_MAP.get('feat_icon'));
setRouterCacheName(FeatPrint, ROUTE_NAME_MAP.get('feat_print'));

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
    },
    {
      name: ROUTE_NAME_MAP.get('feat_icon'),
      path: EnumRoutePath.feat_icon,
      component: FeatIcon,
      meta: {
        requiresAuth: true,
        title: EnumRouteTitle.feat_icon
      }
    },
    {
      name: ROUTE_NAME_MAP.get('feat_print'),
      path: EnumRoutePath.feat_print,
      component: FeatPrint,
      meta: {
        requiresAuth: true,
        title: EnumRouteTitle.feat_print
      }
    }
  ]
};

export default FEAT;
