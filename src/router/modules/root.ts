import type { CustomRoute } from '@/interface';
import { EnumRoutePath } from '@/enum';
import { ROUTE_NAME_MAP } from '@/utils';
import { ROUTE_HOME } from '../routes';

const ROOT: CustomRoute = {
  name: ROUTE_NAME_MAP.get('root'),
  path: EnumRoutePath.root,
  redirect: { name: ROUTE_HOME.name },
  meta: {
    isNotMenu: true
  }
};

export default ROOT;
