import { request } from '../../request';

/** 获取跳转URL */
export function fetchSocialAuthBinding(source: Api.System.SocialSource, tenantId: string = '000000') {
  return request<string>({
    url: `/auth/binding/${source}`,
    method: 'get',
    params: {
      tenantId,
      domain: window.location.host
    }
  });
}

/** 解绑账户 */
export function fetchSocialAuthUnbinding(socialId: CommonType.IdType) {
  return request<string>({
    url: `/auth/unlock/${socialId}`,
    method: 'delete'
  });
}

/** 查询社会化关系列表 */
export function fetchSocialList() {
  return request<Api.System.Social[]>({
    url: '/system/social/list',
    method: 'get'
  });
}
