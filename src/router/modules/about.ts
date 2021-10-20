import { BookInformation24Regular } from '@vicons/fluent';
import type { CustomRoute } from '@/interface';
import { EnumRoutePath, EnumRouteTitle } from '@/enum';
import { RouteNameMap, getSingleBasicLayoutRoute } from '../helpers';
import { About } from '../components';

const ABOUT: CustomRoute = getSingleBasicLayoutRoute({
  name: RouteNameMap.get('about'),
  path: EnumRoutePath.about,
  component: About,
  meta: {
    requiresAuth: true,
    title: EnumRouteTitle.about,
    icon: BookInformation24Regular
  }
});
export default ABOUT;
