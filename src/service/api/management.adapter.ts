import { EnumGender } from '@/enum';
import { isUndefined } from '@/utils';

export function adapterOfFetchUserManagementList(
  requestData: ApiUserManagement.UserTable[],
  adminId: string
): UserManagement.UserTable[] {
  const genderMap: Record<
    NonNullable<ApiUserManagement.UserTable['gender']>,
    NonNullable<UserManagement.UserTable['userGender']>
  > = {
    '0': 'female',
    '1': 'male'
  };

  // 1. 有可能依赖于多个接口的结果，再转换成页面的数据
  // 2. 接口定义的字段有可能为null, 例如 预期是数组却返回了null，导致调用数组方法报错
  // 3. 字段可能丢失

  return requestData.map(item => {
    const { id, name, age, gender } = item;

    const userName = name + (adminId === id ? '(管理员)' : '');

    const userAge = isUndefined(age) ? '无' : String(age);

    const userGender = gender !== null ? genderMap[gender] : 'null';

    const result: UserManagement.UserTable = {
      id,
      userName,
      userAge,
      userGender,
      userGenderLabel: EnumGender[userGender]
    };

    return result;
  });
}
