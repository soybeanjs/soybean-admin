import { transformRecordToOption } from '@/utils/common';

export const roleStatusRecord: Record<Api.SystemManage.RoleStatus, App.I18n.I18nKey> = {
  '1': 'page.manage.role.status.enable',
  '2': 'page.manage.role.status.disable'
};

export const roleStatusOptions = transformRecordToOption(roleStatusRecord);
