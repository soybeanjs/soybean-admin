import type { RouteRecordRaw } from 'vue-router';
import { transformAuthRouteToVueRoute } from '@/utils';

export function userRoutesMiddleware(data: ApiRoute.ResponseRoute | null) {
  if (!data) return [];

  const routes: RouteRecordRaw[] = data.routes.map(item => transformAuthRouteToVueRoute(item));

  return routes;
}
