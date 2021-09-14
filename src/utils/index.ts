export {
  setToken,
  getToken,
  removeToken,
  getUserInfo,
  getLoginModuleRegExp,
  getLoginRedirectUrl,
  toLoginRedirectUrl,
  toHomeByLocation
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

export { setLocal, getLocal, setSession, getSession } from './storage';
