import { adapterOfServiceResult } from '@/utils';
import { mockRequest } from '../request';
import { adapterOfDataWithAdapter } from '../adapter';

/** 带有适配器的请求(将请求结果进行数据处理) */
export async function fetchDataWithAdapter() {
  const res = await mockRequest.post<ApiDemo.DataWithAdapter>('/apiDemoWithAdapter');
  return adapterOfServiceResult(adapterOfDataWithAdapter, res);
}
