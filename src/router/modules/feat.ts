import type { CustomRoute } from '@/interface';
import { BasicLayout } from '@/layouts';
import { setRouterCacheName } from '@/utils';
import FeatCopy from '@/views/feat/copy/index.vue';
import FeatIcon from '@/views/feat/icon/index.vue';
import FeatPrint from '@/views/feat/print/index.vue';
import { routeName, routePath, routeTitle } from '../const';

setRouterCacheName(FeatCopy, routeName('feat_copy'));
setRouterCacheName(FeatIcon, routeName('feat_icon'));
setRouterCacheName(FeatPrint, routeName('feat_print'));

const FEAT: CustomRoute = {
  name: routeName('feat'),
  path: routePath('feat'),
  component: BasicLayout,
  redirect: { name: routeName('feat_copy') },
  meta: {
    requiresAuth: true,
    title: routeTitle('feat'),
    icon: 'ic:round-repeat'
  },
  children: [
    {
      name: routeName('feat_copy'),
      path: routePath('feat_copy'),
      component: FeatCopy,
      meta: {
        requiresAuth: true,
        title: routeTitle('feat_copy'),
        fullPage: true
      }
    },
    {
      name: routeName('feat_icon'),
      path: routePath('feat_icon'),
      component: FeatIcon,
      meta: {
        requiresAuth: true,
        title: routeTitle('feat_icon')
      }
    },
    {
      name: routeName('feat_print'),
      path: routePath('feat_print'),
      component: FeatPrint,
      meta: {
        requiresAuth: true,
        title: routeTitle('feat_print')
      }
    }
  ]
};

export default FEAT;
