import { request } from '../../request';

/** Check if system needs initialization */
export function fetchCheckInit() {
  return request<{ needInit: boolean }>({
    url: '/init/checkDB',
    method: 'get'
  });
}

/**
 * Initialize system
 *
 * @param initData Initialization data
 */
export function fetchInitSystem(initData: App.Global.InitFormModel) {
  return request({
    url: '/init/initDB',
    method: 'post',
    data: initData
  });
}
