import type { CustomRoute } from '@/interface';
import { setSingleRoute } from '@/utils';
import { BlankLayout } from '@/layouts';
import Website from '@/views/website/index.vue';
import { getRouteConst, routeName } from '../constant';

const { name, path, title } = getRouteConst('website');

const WEBSITE: CustomRoute = setSingleRoute({
  route: {
    name,
    path,
    component: Website,
    meta: {
      title,
      icon: 'codicon:remote-explorer',
      isNotMenu: true
    }
  },
  container: BlankLayout,
  meta: {
    order: 8
  },
  notFoundName: routeName('not-found')
});

export default WEBSITE;
