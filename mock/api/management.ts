import type { MockMethod } from 'vite-plugin-mock';

const apis: MockMethod[] = [
  {
    url: '/mock/getUserManagementList',
    method: 'post',
    response: (): Service.MockServiceResult<ApiUserManagement.UserTable[]> => {
      const data: ApiUserManagement.UserTable[] = [
        {
          id: '1',
          name: '张三',
          age: 24,
          gender: null,
          createTime: '2022-04-13',
          updateTime: '2022-07-29'
        },
        {
          id: '2',
          name: '李四',
          age: 22,
          gender: '1',
          createTime: '2022-05-13',
          updateTime: '2022-06-29'
        },
        {
          id: '3',
          name: '王五',
          gender: '1',
          createTime: '2022-04-18',
          updateTime: '2022-07-30'
        },
        {
          id: '4',
          name: '王小梅',
          age: 20,
          gender: '0',
          createTime: '2022-05-18',
          updateTime: '2022-07-30'
        }
      ];

      return {
        code: 200,
        message: 'ok',
        data
      };
    }
  }
];

export default apis;
