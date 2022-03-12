import { request } from '../request';

/** 测试请求代理 */
export function fetchTestProxy() {
  return request.get('/test');
}
