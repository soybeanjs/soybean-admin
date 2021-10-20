import type { CustomRoute } from '@/interface';
import { EnumRoutePath } from '@/enum';
import { RouteNameMap } from '../helpers';
import { ROUTE_HOME } from '../routes';

const ROOT: CustomRoute = {
  name: RouteNameMap.get('root'),
  path: EnumRoutePath.root,
  redirect: { name: ROUTE_HOME.name },
  meta: {
    isNotMenu: true
  }
};

export default ROOT;
