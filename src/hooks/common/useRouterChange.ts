import { useRouter } from 'vue-router';
import { EnumRoutePaths } from '@/enum';
import { RouteNameMap } from '@/router';
import type { LoginModuleType } from '@/interface';

export default function useRouterChange() {
  const router = useRouter();

  /**
   * 跳转登录页面(通过vue路由)
   * @param module - 展示的登录模块
   * @param redirectUrl - 登录后重定向的页面路径
   */
  function toLogin(module: LoginModuleType = 'pwd-login', redirectUrl?: string) {
    router.push({
      name: RouteNameMap.get('login'),
      params: {
        module
      },
      query: {
        redirectUrl
      }
    });
  }
  /**
   * 跳转登录页面(通过window.location)
   * @param module - 展示的登录模块
   * @param redirectUrl - 登录后重定向的页面路径
   */
  function toLoginByLocation(module: LoginModuleType = 'pwd-login', redirectUrl?: string) {
    let href = `${window.location.origin + EnumRoutePaths.login}/${module}`;
    if (redirectUrl) {
      href += redirectUrl;
    }
    window.location.href = href;
  }

  return {
    toLogin,
    toLoginByLocation
  };
}
