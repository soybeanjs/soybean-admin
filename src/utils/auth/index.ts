import type { LoginModuleType } from '@/interface';

export function getToken() {
  return '';
}

export function getUserInfo() {}

/** 获取登录模块的正则字符串 */
export function getLoginModuleRegExp() {
  const arr: LoginModuleType[] = ['pwd-login', 'code-login', 'register', 'reset-pwd', 'bind-wechat'];
  return arr.join('|');
}
