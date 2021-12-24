import { consoleLog } from '@/utils';
import { mockRequest } from '../request';

/** 测试mock数据 */
export async function fetchTestMock() {
  const { data } = await mockRequest.get('/api/getUser');
  consoleLog('data: ', data);
}
