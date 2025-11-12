import type { ClickDot } from 'go-captcha-vue/dist/components/click/meta/data.js';
import { request } from '../../request';

/** Check if system needs initialization */
export function fetchCheckInit() {
  return request<{ needInit: boolean }>({
    url: '/init/checkDB',
    method: 'get'
  });
}

/**
 * Initialize system
 *
 * @param initData Initialization data
 */
export function fetchInitSystem(initData: App.Global.InitFormModel) {
  return request({
    url: '/init/initDB',
    method: 'post',
    data: initData
  });
}

/** 从后端获取点选式验证码 */
export function fetchGetClickCaptcha() {
  return request<Api.Auth.ClickCaptchaBackendData>({
    url: '/auth/captcha',
    method: 'post'
  });
}

/** 后端刷新验证码 */
export function fetchRefreshClickCaptcha(captchaKey: string) {
  return request<Api.Auth.ClickCaptchaBackendData>({
    url: '/auth/captchaRefresh',
    method: 'post',
    data: {
      captchaKey
    }
  });
}

export function fetchCloseClickCaptcha(captchaKey: string) {
  return request({
    url: '/auth/captchaClose',
    method: 'post',
    data: {
      captchaKey
    }
  });
}

export function fetchValidateClickCaptcha(params: { captchaKey: string; clickDots: ClickDot[] }) {
  return request<Api.Auth.ClickCaptchaVerifyData>({
    url: '/auth/captchaVerify',
    method: 'post',
    data: params
  });
}
