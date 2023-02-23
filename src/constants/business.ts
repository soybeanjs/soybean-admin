export const loginModuleLabels: Record<UnionKey.LoginModule, string> = {
  'pwd-login': '账密登录',
  'code-login': '手机验证码登录',
  register: '注册',
  'reset-pwd': '重置密码',
  'bind-wechat': '微信绑定'
};

export const userRoleLabels: Record<Auth.RoleType, string> = {
  super: '超级管理员',
  admin: '管理员',
  user: '普通用户'
};

export const userRoleOptions: Common.OptionWithKey<Auth.RoleType>[] = [
  { value: 'super', label: userRoleLabels.super },
  { value: 'admin', label: userRoleLabels.admin },
  { value: 'user', label: userRoleLabels.user }
];

/** 用户性别 */
export const genderLabels: Record<UserManagement.GenderKey, string> = {
  0: '女',
  1: '男'
};

export const genderOptions: Common.OptionWithKey<UserManagement.GenderKey>[] = [
  { value: '0', label: genderLabels['0'] },
  { value: '1', label: genderLabels['1'] }
];

/** 用户状态 */
export const userStatusLabels: Record<UserManagement.UserStatusKey, string> = {
  1: '启用',
  2: '禁用',
  3: '冻结',
  4: '软删除'
};

export const userStatusOptions: Common.OptionWithKey<UserManagement.UserStatusKey>[] = [
  { value: '1', label: userStatusLabels['1'] },
  { value: '2', label: userStatusLabels['2'] },
  { value: '3', label: userStatusLabels['3'] },
  { value: '4', label: userStatusLabels['4'] }
];
