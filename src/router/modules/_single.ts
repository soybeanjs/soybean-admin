import type { CustomRoute } from '@/interface';
import { EnumRoutePath } from '@/enum';
import { BasicLayout } from '@/layouts';
import { RouteNameMap } from '../helpers';
import { ROUTE_HOME } from '../routes';
import ABOUT from './about';

const SINGLE: CustomRoute = {
  name: RouteNameMap.get('root'),
  path: EnumRoutePath.root,
  component: BasicLayout,
  redirect: { name: ROUTE_HOME.name },
  meta: {
    isNotMenu: true
  },
  children: [ABOUT]
};

export default SINGLE;
