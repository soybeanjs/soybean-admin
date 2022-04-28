export function adapterOfFetchDataWithAdapter(
  res: Service.RequestResult<ApiDemo.DataWithAdapter>
): Demo.DataWithAdapter {
  const { dataId, dataName } = res.data!;

  const result: Demo.DataWithAdapter = {
    id: dataId,
    name: dataName
  };

  return result;
}
