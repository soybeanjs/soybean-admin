/** 统一失败和成功的请求结果的数据类型 */
export async function handleServiceResult<T = any>(error: Service.RequestError | null, page: any, data: any) {
  if (error) {
    const fail: Service.FailedResult = {
      error,
      data: null
    };
    return fail;
  }
	if (page) {
		const pageresult: Service.DataTablResult = {
			error: null,
			page: page,
			data
		};
		return pageresult;
	}

  const success: Service.SuccessResult<T> = {
    error: null,
    data
  };
  return success;
}

/** 请求结果的适配器：用于接收适配器函数和请求结果 */
export function adapter<T extends Service.ServiceAdapter>(
  adapterFun: T,
  ...args: Service.MultiRequestResult<Parameters<T>>
): Service.RequestResult<ReturnType<T>> {
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
    const adapterFunArgs = args.map(item => item.data);
		const hasPage = args.some(item => {
			if (item.page) {
				result = {
					error: null,
					page: item.page,
					data: adapterFun(...adapterFunArgs)
				};
				return true;
			}
			return false;
		});
		if(!hasPage){
			result = {
				error: null,
				data: adapterFun(...adapterFunArgs)
			};
		}
  }

  return result!;
}
