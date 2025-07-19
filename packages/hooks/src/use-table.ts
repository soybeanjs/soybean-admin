import { computed, ref } from 'vue';
import type { Ref, VNodeChild } from 'vue';
import useBoolean from './use-boolean';
import useLoading from './use-loading';

export interface PaginationData<T> {
  data: T[];
  pageNum: number;
  pageSize: number;
  total: number;
}

type GetApiData<ApiData, Pagination extends boolean> = Pagination extends true ? PaginationData<ApiData> : ApiData[];

type Transform<ResponseData, ApiData, Pagination extends boolean> = (
  response: ResponseData
) => GetApiData<ApiData, Pagination>;

export type TableColumnCheckTitle = string | ((...args: any) => VNodeChild);

export type TableColumnCheck = {
  key: string;
  title: TableColumnCheckTitle;
  checked: boolean;
  visible: boolean;
};

export interface UseTableOptions<ResponseData, ApiData, Column, Pagination extends boolean> {
  /**
   * api function to get table data
   */
  api: () => Promise<ResponseData>;
  /**
   * whether to enable pagination
   */
  pagination?: Pagination;
  /**
   * transform api response to table data
   */
  transform: Transform<ResponseData, ApiData, Pagination>;
  /**
   * columns factory
   */
  columns: () => Column[];
  /**
   * get column checks
   */
  getColumnChecks: (columns: Column[]) => TableColumnCheck[];
  /**
   * get columns
   */
  getColumns: (columns: Column[], checks: TableColumnCheck[]) => Column[];
  /**
   * callback when response fetched
   */
  onFetched?: (data: GetApiData<ApiData, Pagination>) => void | Promise<void>;
  /**
   * whether to get data immediately
   *
   * @default true
   */
  immediate?: boolean;
}

export default function useTable<ResponseData, ApiData, Column, Pagination extends boolean>(
  options: UseTableOptions<ResponseData, ApiData, Column, Pagination>
) {
  const { loading, startLoading, endLoading } = useLoading();
  const { bool: empty, setBool: setEmpty } = useBoolean();

  const { api, pagination, transform, columns, getColumnChecks, getColumns, onFetched, immediate = true } = options;

  const data = ref([]) as Ref<ApiData[]>;

  const columnChecks = ref(getColumnChecks(columns())) as Ref<TableColumnCheck[]>;

  const $columns = computed(() => getColumns(columns(), columnChecks.value));

  function reloadColumns() {
    const checkMap = new Map(columnChecks.value.map(col => [col.key, col.checked]));

    const defaultChecks = getColumnChecks(columns());

    columnChecks.value = defaultChecks.map(col => ({
      ...col,
      checked: checkMap.get(col.key) ?? col.checked
    }));
  }

  async function getData() {
    try {
      startLoading();

      const response = await api();

      const transformed = transform(response);

      data.value = getTableData(transformed, pagination);

      setEmpty(data.value.length === 0);

      await onFetched?.(transformed);
    } finally {
      endLoading();
    }
  }

  if (immediate) {
    getData();
  }

  return {
    loading,
    empty,
    data,
    columns: $columns,
    columnChecks,
    reloadColumns,
    getData
  };
}

function getTableData<ApiData, Pagination extends boolean>(
  data: GetApiData<ApiData, Pagination>,
  pagination?: Pagination
) {
  if (pagination) {
    return (data as PaginationData<ApiData>).data;
  }

  return data as ApiData[];
}
