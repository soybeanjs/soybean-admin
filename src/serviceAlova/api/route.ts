import { alova } from '../request';

/** get constant routes */
export function fetchGetConstantRoutes() {
  return alova.Get<Api.Route.MenuRoute[]>('/route/getConstantRoutes');
}

/** get user routes */
export function fetchGetUserRoutes() {
  return alova.Get<Api.Route.UserRoute>('/route/getUserRoutes');
}

/**
 * whether the route is exist
 *
 * @param routeName route name
 */
export function fetchIsRouteExist(routeName: string) {
  return alova.Get<boolean>('/route/isRouteExist', { params: { routeName } });
}
