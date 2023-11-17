import { request } from '../request';

/**
 * get user routes
 * @param example whether to use example data, default: 0
 */
export function fetchGetUserRoutes(example: '0' | '1' = '0') {
  return request<App.Service.Response<Api.Route.UserRoute>>('/route/getUserRoutes', { params: { example } });
}

/**
 * whether the route is exist
 * @param routeName route name
 * @param example whether to use example data, default: 0
 */
export function fetchIsRouteExist(routeName: string, example: '0' | '1' = '0') {
  return request<App.Service.Response<boolean>>('/route/isRouteExist', { params: { routeName, example } });
}
