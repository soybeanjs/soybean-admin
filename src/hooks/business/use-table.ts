import { ref, reactive } from 'vue';
import type { Ref } from 'vue';
import type { DataTableBaseColumn, DataTableSelectionColumn, DataTableExpandColumn, PaginationProps } from 'naive-ui';
import type { MaybeComputedRef } from '@vueuse/core';
import type { TableColumnGroup, InternalRowData } from 'naive-ui/es/data-table/src/interface';
import { useLoadingEmpty } from '../common';

/**
 * 表格的列
 */
type DataTableColumn<T = InternalRowData> =
  | (Omit<TableColumnGroup<T>, 'key'> & { key: keyof T })
  | (Omit<DataTableBaseColumn<T>, 'key'> & { key: keyof T })
  | DataTableSelectionColumn<T>
  | DataTableExpandColumn<T>;

/**
 * 表格分页参数
 */
type TablePaginationParams = Pick<PaginationProps, 'page' | 'pageSize'>;

/**
 * 表格接口的请求参数
 */
type TableApiParams = Record<string, unknown> & TablePaginationParams;

/**
 * 表格接口的请求数据
 */
type TableApiData<T = InternalRowData> = {
  data: T[];
  pageNum: number;
  pageSize: number;
  total: number;
};

/**
 * 表格接口的请求函数
 */
type TableApiFn<P extends TableApiParams, T extends InternalRowData> = (
  params: P
) => Promise<Service.SuccessResult<TableApiData<T>>>;

export function useNaiveTable<TableData extends InternalRowData, P extends TableApiParams>(
  apiFn: TableApiFn<P, TableData>,
  apiParams: P,
  columns: MaybeComputedRef<DataTableColumn<TableData>[]>
) {
  const { loading, startLoading, endLoading, empty, setEmpty } = useLoadingEmpty();

  const tableData: Ref<TableData[]> = ref([]);

  async function getTableData(paginationParams?: TablePaginationParams) {
    startLoading();

    const params = { ...apiParams, ...paginationParams };

    const { data } = await apiFn(params);
    if (data) {
      tableData.value = data.data;

      setEmpty(data.data.length === 0);
    }
    endLoading();
  }

  const pagination: PaginationProps = reactive({
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
    }
  });

  return {
    tableData,
    columns,
    loading,
    empty,
    pagination,
    start: getTableData
  };
}
