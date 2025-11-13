import { request } from '@/service/request';

/** 修改用户密码 */
export function fetchUpdateUserPassword(data: Api.System.UserPasswordOperateParams) {
  return request<boolean>({
    url: '/user/password',
    method: 'put',
    headers: {
      isEncrypt: true
    },
    data
  });
}

/** 修改用户基本信息 */
export function fetchUpdateUserProfile(data: Api.System.UserProfileOperateParams) {
  return request<boolean>({
    url: '/user/profile',
    method: 'put',
    data
  });
}

/** 修改用户头像 */
export function fetchUpdateUserAvatar(formData: FormData) {
  return request<boolean>({
    url: '/user/avatar',
    method: 'post',
    data: formData
  });
}

/** 获取在线设备列表 */
export function fetchGetOnlineDeviceList(params?: Api.System.OnlineUserSearchParams) {
  return request<Api.System.OnlineUserList>({
    url: '/monitor/online',
    method: 'get',
    params
  });
}

/**
 * 强制下线
 *
 * @param tokenId - 令牌ID
 */
export function fetchForceLogout(tokenId: string) {
  return request<boolean>({
    url: `/monitor/online/${tokenId}`,
    method: 'delete'
  });
}

/** 解绑账户 */
export function fetchSocialAuthUnbinding(socialId: CommonType.IdType) {
  return request<string>({
    url: `/auth/unlock/${socialId}`,
    method: 'delete'
  });
}

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

/** 查询社会化关系列表 */
export function fetchSocialList() {
  return request<Api.System.Social[]>({
    url: '/system/social/list',
    method: 'get'
  });
}
