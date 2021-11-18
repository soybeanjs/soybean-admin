import type { CustomRoute } from '@/interface';
import { routeName, routePath } from '../const';
import { ROUTE_HOME } from '../routes';

const ROOT: CustomRoute = {
  name: routeName('root'),
  path: routePath('root'),
  redirect: { name: ROUTE_HOME.name },
  meta: {
    isNotMenu: true
  }
};

export default ROOT;
