import type { MockMethod } from 'vite-plugin-mock';
import type { BackendServiceResult } from '@/interface';

export default [
  {
    url: '/api/getUser',
    method: 'get',
    response: (): BackendServiceResult => {
      return {
        code: 200,
        message: 'ok',
        data: '测试mock数据'
      };
    }
  }
] as MockMethod[];
