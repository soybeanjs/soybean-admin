import { ref, reactive } from 'vue';
import type { Ref } from 'vue';
import type { DataTableBaseColumn, DataTableSelectionColumn, DataTableExpandColumn, PaginationProps } from 'naive-ui';
import type { TableColumnGroup, InternalRowData } from 'naive-ui/es/data-table/src/interface';
import { useLoadingEmpty } from '../common';

/**
 * 表格分页参数
 */
type PaginationParams = Pick<PaginationProps, 'page' | 'pageSize'>;

/**
 * 表格请求接口的参数
 */
type ApiParams<TableData> = Record<string, unknown> & PaginationParams & Partial<TableData>;

/**
 * 表格请求接口的结果
 * @description 这里用属性list来表示后端接口返回的表格数据
 */
type ApiData<TableData = Record<string, unknown>> = Record<string, unknown> & { list: TableData[] };

/**
 * 表格接口的请求函数
 */
type ApiFn<TableData = Record<string, unknown>, Params = ApiParams<TableData>> = (
  params: Params
) => Promise<Service.RequestResult<ApiData<TableData>>>;

/**
 * 表格接口请求后转换后的数据
 */
type TransformedTableData<TableData = Record<string, unknown>> = {
  data: TableData[];
  pageNum: number;
  pageSize: number;
  total: number;
};

/**
 * 表格的列
 */
type DataTableColumn<T = InternalRowData> =
  | (Omit<TableColumnGroup<T>, 'key'> & { key: keyof T })
  | (Omit<DataTableBaseColumn<T>, 'key'> & { key: keyof T })
  | DataTableSelectionColumn<T>
  | DataTableExpandColumn<T>;

/**
 * 表格数据转换器
 * @description 将不同接口的表格数据转换成统一的类型
 */
type Transformer<TableData = Record<string, unknown>> = (
  apiData: ApiData<TableData>
) => TransformedTableData<TableData>;

type TableParams<TableData = Record<string, unknown>, Params = ApiParams<TableData>> = {
  apiFn: ApiFn<TableData, Params>;
  apiParams: Params;
  columns: DataTableColumn<TableData>[];
  transformer: Transformer<TableData>;
  pagination?: PaginationProps;
};

export function useTable<TableData extends Record<string, unknown>, Params extends ApiParams<TableData>>(
  params: TableParams<TableData, Params>,
  immediate = true
) {
  const { loading, startLoading, endLoading, empty, setEmpty } = useLoadingEmpty();

  const data: Ref<TableData[]> = ref([]);

  function updateData(update: TableData[]) {
    data.value = update;
  }

  const columns = ref(params.columns) as Ref<DataTableColumn<TableData>[]>;

  const pagination = reactive({
    page: 1,
    pageSize: 10,
    showSizePicker: true,
    pageSizes: [10, 15, 20, 25, 30],
    onChange: (page: number) => {
      pagination.page = page;
    },
    onUpdatePageSize: (pageSize: number) => {
      pagination.pageSize = pageSize;
      pagination.page = 1;
    },
    ...params.pagination
  }) as PaginationProps;

  function updatePagination(update: Partial<PaginationProps>) {
    Object.assign(pagination, update);
  }

  async function getData() {
    const apiParams: Params = { ...params.apiParams };
    apiParams.page = apiParams.page || pagination.page;
    apiParams.pageSize = apiParams.pageSize || pagination.pageSize;

    startLoading();

    const { data: apiData } = await params.apiFn(apiParams);

    if (apiData) {
      const transformedData = params.transformer(apiData);

      updateData(transformedData.data);

      setEmpty(transformedData.data.length === 0);

      updatePagination({ page: transformedData.pageNum, pageSize: transformedData.pageSize });
    }

    endLoading();
  }

  if (immediate) {
    getData();
  }

  return {
    data,
    columns,
    loading,
    empty,
    pagination,
    getData,
    updatePagination
  };
}
