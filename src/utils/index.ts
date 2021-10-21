export { setToken, getToken, removeToken, getUserInfo, resetAuthStorage } from './auth';

export {
  isNumber,
  isString,
  isBoolean,
  isNull,
  isUndefined,
  isObject,
  isArray,
  isDate,
  isRegExp,
  isSet,
  isMap,
  brightenColor,
  darkenColor,
  addColorAlpha,
  dynamicIconRender
} from './common';

export {
  setLocal,
  getLocal,
  removeLocal,
  clearLocal,
  setSession,
  getSession,
  removeSession,
  clearSession
} from './storage';

export {
  ROUTE_NAME_MAP,
  setRouterCacheName,
  getLoginRedirectUrl,
  setSingleRoute,
  getCacheRoutes,
  transformRouteToMenu
} from './router';
