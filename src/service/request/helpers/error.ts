const ERROR_STATUS = {
  400: '400: 请求出现语法错误',
  401: '401: 用户未授权~',
  403: '403: 服务器拒绝访问~',
  404: '404: 请求的资源不存在~',
  405: '405: 请求方法未允许~',
  408: '408: 网络请求超时~',
  500: '500: 服务器内部错误~',
  501: '501: 服务器未实现请求功能~',
  502: '502: 错误网关~',
  503: '503: 服务不可用~',
  504: '504: 网关超时~',
  505: '505: http版本不支持该请求~'
};

type ErrorStatus = keyof typeof ERROR_STATUS;

type ErrorMsg = [boolean, string];
/**
 * 获取请求失败的错误
 * @param error
 */
export function getFailRequestErrorMsg(error: any) {
  const errorAction: ErrorMsg[] = [
    [!window.navigator.onLine || error.message === 'Network Error', '网络不可用~'],
    [error.code === 'ECONNABORTED' && error.message.includes('timeout'), '网络连接超时~'],
    [error.response, ERROR_STATUS[error.response.status as ErrorStatus]]
  ];
  let errorMsg = '请求错误~';
  errorAction.some(item => {
    const [flag, msg] = item;
    if (flag) {
      errorMsg = msg;
    }
    return flag;
  });
  return errorMsg;
}

/**
 * 处理请求失败的错误
 * @param error - 错误
 */
export function handleResponseError(error: any) {
  const { $message: Message } = window;

  const msg = getFailRequestErrorMsg(error);

  Message?.error(msg);
}
