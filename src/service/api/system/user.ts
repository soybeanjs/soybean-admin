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
