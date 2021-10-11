import type { CustomRoute } from '@/interface';
import { EnumRoutePath } from '@/enum';
import { BasicLayout } from '@/layouts';
import { RouteNameMap } from '../helpers';
import { ROUTE_HOME } from '../routes';

const ROOT: CustomRoute = {
  name: RouteNameMap.get('root'),
  path: EnumRoutePath.root,
  component: BasicLayout,
  redirect: { name: ROUTE_HOME.name },
  meta: {
    isNotMenu: true
  }
};

export default ROOT;
