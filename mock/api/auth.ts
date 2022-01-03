import type { MockMethod } from 'vite-plugin-mock';

const apis: MockMethod[] = [
  {
    url: '/mock/getUser',
    method: 'get',
    response: (): Service.BackendServiceResult => {
      return {
        code: 200,
        message: 'ok',
        data: '测试mock数据'
      };
    }
  }
];

export default apis;
