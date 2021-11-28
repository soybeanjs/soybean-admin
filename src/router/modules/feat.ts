import type { RouteRecordRaw } from 'vue-router';
import { BasicLayout } from '@/layouts';
import FeatCopy from '@/views/feat/copy/index.vue';
import FeatIcon from '@/views/feat/icon/index.vue';
import FeatPrint from '@/views/feat/print/index.vue';
import { routeName, routePath, routeTitle } from '../constant';

const FEAT: RouteRecordRaw = {
  name: routeName('feat'),
  path: routePath('feat'),
  component: BasicLayout,
  redirect: { name: routeName('feat_copy') },
  meta: {
    requiresAuth: true,
    title: routeTitle('feat'),
    icon: 'ic:round-repeat',
    order: 4
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
