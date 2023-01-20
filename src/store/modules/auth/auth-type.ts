import type { AxiosRequestConfig } from 'axios';
import { fetchLoginToken, fetchLoginJWT } from '@/service';
import { useAuthStore } from '@/store';
import { localStg } from '@/utils';
import { handleRefreshToken } from '@/service/request/helpers';

const TokenAuth = {
  /** 获取token的接口 */
  fetchLogin: fetchLoginToken,
  /** 请求登录成功后的数据处理回调 */
  handleAuthToken(backendToken: ApiAuth.Token) {
    // 先把token存储到缓存中(后面接口的请求头需要token)
    const { token } = backendToken;
    // token由后端控制刷新，不需要前端处理刷新逻辑
    localStg.set('token', token, null);
  },
  /** Token失效后的回调 */
  async handleTokenFailure(_: AxiosRequestConfig) {
    // token失效说明已经超过了可刷新token时间，需要重新登录
    const { resetAuthStore } = useAuthStore();
    resetAuthStore();
  }
};

const JWTAuth = {
  fetchLogin: fetchLoginJWT,
  /** 请求登录成功后的数据处理回调 */
  handleAuthToken(backendToken: ApiAuth.JWT) {
    // 先把token存储到缓存中(后面接口的请求头需要token)
    const { token, refreshToken } = backendToken;
    localStg.set('token', token);
    localStg.set('refreshToken', refreshToken);
  },
  /** Token失效后的回调 */
  async handleTokenFailure(axiosConfig: AxiosRequestConfig) {
    return handleRefreshToken(axiosConfig);
  }
};

/**
 * 选择需要使用哪种认证方式，默认选择JWT方式
 */
const defaultAuthType = JWTAuth;

// 如果只使用JWTAuth，不导出会导致TokenAuth报未使用的ts、eslint错误
export { defaultAuthType, JWTAuth, TokenAuth };
