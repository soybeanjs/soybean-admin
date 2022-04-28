/** 统一失败和成功的请求结果的数据类型 */
export async function handleServiceResult<T = any>(error: Service.RequestError | null, data: any) {
  if (error) {
    const fail: Service.FailedResult = {
      error,
      data: null
    };
    return fail;
  }
  const success: Service.SuccessResult<T> = {
    error: null,
    data
  };
  return success;
}

type Adapter<T = any> = (...args: Service.RequestResult[]) => T;

/**
 * 请求结果的数据转换适配器
 * @param adapter - 适配器函数
 * @param args - 适配器函数的参数
 */
export function serviceAdapter<T extends Adapter>(adapter: T, ...args: TypeUtil.GetFunArgs<T>) {
  let result: Service.RequestResult | undefined;

  const hasError = args.some(item => {
    const flag = Boolean(item.error);
    if (flag) {
      result = {
        error: item.error,
        data: null
      };
    }
    return flag;
  });

  if (!hasError) {
    result = {
      error: null,
      data: adapter(...args)
    };
  }

  return result as Service.RequestResult<TypeUtil.GetFunReturn<T>>;
}
