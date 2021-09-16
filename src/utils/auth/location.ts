/** 获取登录重定向的地址 */
export function getLoginRedirectUrl() {
  return window.location.href;
}

/** 登录后跳转重定向的地址 */
export function toLoginRedirectUrl(redirectUrl: string) {
  window.location.href = redirectUrl;
}
