import { useAuthStore } from '@/store';
import { useLoading } from '@/hooks';
import { setToken, setRefreshToken, setUserInfo, log } from '@/utils';
import type { LoginToken, UserInfo } from '@/interface';
import { useRouterPush, useRouteQuery } from '../common';

export function useLogin() {
  const auth = useAuthStore();
  const { setAuthState } = useAuthStore();
  const { toLoginRedirect } = useRouterPush();
  const { loginRedirect } = useRouteQuery();
  const { loading, startLoading, endLoading } = useLoading();

  /**
   * 登录注册
   * @param param - 请求参数
   * - phone: 手机号
   * - pwdOrCode: 密码或验证码
   * - type: 登录方式: pwd - 密码登录; sms - 验证码登录
   * @returns 是否登录成功
   */
  async function login(param: { phone: string; pwdOrCode: string; type: 'pwd' | 'sms' }) {
    log(param); // 打印参数(接入接口后去除)

    startLoading();
    // 1.这里调用登录接口获取token和refreshToken
    const loginToken: LoginToken = {
      token: 'temp-token',
      refreshToken: 'temp-refresh-token'
    };
    const { token, refreshToken } = loginToken;
    setToken(token);
    setRefreshToken(refreshToken);
    // 2.这里调用获取用户信息的接口
    const userInfo: UserInfo = {
      userId: 'temp-user-id',
      userName: 'Soybean',
      userPhone: '15170283876'
    };
    setUserInfo(userInfo);
    setAuthState({ token, userInfo });

    // 3.登录成功后跳转重定向地址
    toLoginRedirect(loginRedirect.value);
    window.$notification?.success({
      title: '登录成功！',
      content: `欢迎回来，${auth.userInfo.userName}!`,
      duration: 3000
    });
    endLoading();
  }

  return {
    loading,
    login
  };
}
