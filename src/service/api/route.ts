import { request } from '../request';

/**
 * Get user routes
 *
 * @param example Whether to use example data, default: 0
 */
export function fetchGetUserRoutes(example: '0' | '1' = '0') {
  return request<Api.Route.UserRoute>({ url: '/route/getUserRoutes', params: { example } });
}

/**
 * Whether the route is exist
 *
 * @param routeName Route name
 * @param example Whether to use example data, default: 0
 */
export function fetchIsRouteExist(routeName: string, example: '0' | '1' = '0') {
  return request<boolean>({ url: '/route/isRouteExist', params: { routeName, example } });
}
