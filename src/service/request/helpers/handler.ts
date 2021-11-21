// type ResultHandler<T> = (...arg: any) => T;
// type SuccessRequest<T> = {
//   error: null;
//   data: T;
// };
// type FailRequest = {
//   error: any;
//   data: null;
// };
// type RequestResult<T> = SuccessRequest<T> | FailRequest;
// /**
//  * 对请求的结果数据进行格式化的处理
//  * @param handleFunc - 处理函数
//  * @param requests - 请求结果
//  */
// export function handleResponse<ResponseData>(resultHandler: ResultHandler<ResponseData>, requests: RequestResult[]) {}
