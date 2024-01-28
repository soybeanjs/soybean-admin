import { transformRecordToOption } from '@/utils/common';

export const roleStatusRecord: Record<Api.SystemManage.RoleStatus, App.I18n.I18nKey> = {
  '1': 'page.manage.role.status.enable',
  '2': 'page.manage.role.status.disable'
};

export const roleStatusOptions = transformRecordToOption(roleStatusRecord);

export const userGenderRecord: Record<Api.SystemManage.UserGender, App.I18n.I18nKey> = {
  '1': 'page.manage.user.gender.male',
  '2': 'page.manage.user.gender.female'
};

export const userGenderOptions = transformRecordToOption(userGenderRecord);

export const userStatusRecord: Record<Api.SystemManage.UserStatus, App.I18n.I18nKey> = {
  '1': 'page.manage.user.status.enable',
  '2': 'page.manage.user.status.disable'
};

export const userStatusOptions = transformRecordToOption(userStatusRecord);
