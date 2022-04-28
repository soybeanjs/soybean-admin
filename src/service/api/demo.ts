import { serviceAdapter } from '@/utils';
import { request, mockRequest } from '../request';
import { adapterOfFetchDataWithAdapter } from '../adapter';

/** 带有适配器的请求(将请求结果进行数据处理) */
export async function fetchDataWithAdapter() {
  const res = await mockRequest.post<ApiDemo.DataWithAdapter>('/apiDemoWithAdapter');
  return serviceAdapter(adapterOfFetchDataWithAdapter, res);
}

/** 测试代理后的请求 */
export function testRequestWithProxy() {
  return request.get('/test-proxy'); // 确保.env-config的url和当前地址组成的 `${url}/test-proxy` 是有效的后端接口
}
