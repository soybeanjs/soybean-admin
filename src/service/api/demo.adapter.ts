export function adapterOfFetchDataWithAdapter(data: ApiDemo.DataWithAdapter): Demo.DataWithAdapter {
  const { dataId, dataName } = data;

  const result: Demo.DataWithAdapter = {
    id: dataId,
    name: dataName
  };

  return result;
}
