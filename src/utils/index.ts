export {
  setToken,
  getToken,
  removeToken,
  getUserInfo,
  resetAuthStorage,
  getLoginModuleRegExp,
  getLoginRedirectUrl,
  toLoginRedirectUrl
} from './auth';

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

export { getRouteNameMap, setRouterCacheName } from './router';
