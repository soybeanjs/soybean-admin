/** 用户性别 */
export const genderLabels: Record<UserManagement.GenderKey, string> = {
  0: '女',
  1: '男'
};

export const genderOptions: { value: UserManagement.GenderKey; label: string }[] = [
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

export const userStatusOptions: { value: UserManagement.UserStatusKey; label: string }[] = [
  { value: '1', label: userStatusLabels['1'] },
  { value: '2', label: userStatusLabels['2'] },
  { value: '3', label: userStatusLabels['3'] },
  { value: '4', label: userStatusLabels['4'] }
];
