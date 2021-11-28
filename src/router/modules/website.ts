import type { RouteRecordRaw } from 'vue-router';
import { setSingleRoute } from '@/utils';
import { BlankLayout } from '@/layouts';
import { Website } from '@/views';
import { getRouteConst, routeName } from '../constant';

const { name, path, title } = getRouteConst('website');

const website: RouteRecordRaw = setSingleRoute({
  route: {
    name,
    path,
    component: Website,
    meta: {
      title,
      icon: 'codicon:remote-explorer',
      notAsMenu: true
    }
  },
  container: BlankLayout,
  containerMeta: {
    title,
    order: 8
  },
  notFoundName: routeName('not-found')
});

export default website;
