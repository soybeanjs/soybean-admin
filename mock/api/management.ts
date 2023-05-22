import { mock } from 'mockjs';
import type { MockMethod } from 'vite-plugin-mock';

const apis: MockMethod[] = [
  {
    url: '/mock/getAllUserList',
    method: 'post',
    response: (): Service.MockServiceResult<ApiUserManagement.User[]> => {
      const data = mock({
        'list|1000': [
          {
            id: '@id',
            userName: '@cname',
            'age|18-56': 56,
            'gender|1': ['0', '1', null],
            phone:
              /^[1](([3][0-9])|([4][01456789])|([5][012356789])|([6][2567])|([7][0-8])|([8][0-9])|([9][012356789]))[0-9]{8}$/,
            'email|1': ['@email("qq.com")', null],
            'userStatus|1': ['1', '2', '3', '4', null]
          }
        ]
      });

      return {
        code: 200,
        message: 'ok',
        data: data.list
      };
    }
  }
];

export default apis;
