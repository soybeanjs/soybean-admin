import { mock } from 'mockjs';
import type { MockMethod } from 'vite-plugin-mock';

const apis: MockMethod[] = [
  {
    url: '/mock/getUserManagementList',
    method: 'post',
    response: (): Service.MockServiceResult<ApiUserManagement.UserTable[]> => {
      const data = mock({
        'list|1000': [
          {
            id: '@id',
            name: '@cname',
            'age|20-36': 36,
            'gender|1': ['0', '1', null],
            phone:
              /^[1](([3][0-9])|([4][01456789])|([5][012356789])|([6][2567])|([7][0-8])|([8][0-9])|([9][012356789]))[0-9]{8}$/,
            email: '@email("qq.com")',
            'role|1': ['super', 'admin', 'user'],
            'disabled|1': true
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
