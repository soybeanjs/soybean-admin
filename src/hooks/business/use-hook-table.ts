import { ref, reactive } from 'vue';
import type { Ref } from 'vue';
import type { PaginationProps, DataTableBaseColumn, DataTableSelectionColumn, DataTableExpandColumn } from 'naive-ui';
import type { TableColumnGroup } from 'naive-ui/es/data-table/src/interface';
import { useLoadingEmpty } from '../common';

/**
 * 接口请求函数
 */
type ApiFn<T = any, R = any> = (args: T) => Promise<Service.RequestResult<R>>;

/**
 * 接口请求函数的参数
 */
type GetApiFnParameters<T extends ApiFn, R = any> = T extends (args: infer P) => Promise<Service.RequestResult<R>>
  ? P
  : never;

/**
 * 接口请求函数的返回值
 */
type GetApiFnReturnType<T extends ApiFn, P = any> = T extends (args: P) => Promise<Service.RequestResult<infer R>>
  ? R
  : never;

/**
 * 表格接口请求后转换后的数据
 */
type Transformer<TableData, Response> = (response: Response) => {
  data: TableData[];
  pageNum: number;
  pageSize: number;
  total: number;
};

/**
 * 列表接口参数更新
 */
type ApiParamsUpdater<P, R> = (params: P) => R;

/**
 * 分页参数
 */
type PagePropsOfPagination = Pick<PaginationProps, 'page' | 'pageSize'>;

/**
 * 自定义的列 key
 */
type CustomColumnKey<K = never> = K | 'action';

/**
 * 表格的列
 */
type HookTableColumn<T = Record<string, unknown>> =
  | (Omit<TableColumnGroup<T>, 'key'> & { key: CustomColumnKey<keyof T> })
  | (Omit<DataTableBaseColumn<T>, 'key'> & { key: CustomColumnKey<keyof T> })
  | DataTableSelectionColumn<T>
  | DataTableExpandColumn<T>;

/**
 * 表格配置
 */
type HookTableConfig<TableData, Fn extends ApiFn> = {
  /**
   * 列表接口参数
   */
  apiParams: GetApiFnParameters<Fn>;
  /**
   * 列表接口返回数据转换
   */
  transformer: Transformer<TableData, GetApiFnReturnType<Fn>>;
  /**
   * 列表列
   */
  columns: () => HookTableColumn<TableData>[];
  /**
   * 列表接口参数更新
   * @description 用于更新分页参数, 如果列表接口的参数不包含同名分页参数属性 `page` 和 `pageSize`, 需要通过此函数更新
   * @default p => p
   */
  apiParamsUpdater?: ApiParamsUpdater<GetApiFnParameters<Fn> & Partial<PagePropsOfPagination>, GetApiFnParameters<Fn>>;
  /**
   * 列表分页参数
   */
  pagination?: PaginationProps;
  /**
   * 是否立即请求
   * @default true
   */
  immediate?: boolean;
};

/**
 * 通用表格 hook
 * @param apiFn 接口请求函数
 * @param config 表格配置
 */
export default function useHookTable<TableData, Fn extends ApiFn>(apiFn: Fn, config: HookTableConfig<TableData, Fn>) {
  const { loading, startLoading, endLoading, empty, setEmpty } = useLoadingEmpty();

  const { apiParams, transformer, apiParamsUpdater = p => p, immediate = true } = config;

  const data: Ref<TableData[]> = ref([]);

  function updateData(update: TableData[]) {
    data.value = update;
  }

  const columns = ref(config.columns()) as Ref<HookTableColumn<TableData>[]>;

  const requestParams = ref(apiParams) as Ref<HookTableConfig<TableData, Fn>['apiParams']>;

  function updateRequestParamsByPagination(p: PagePropsOfPagination) {
    requestParams.value = apiParamsUpdater({ ...requestParams.value, ...p });
  }

  const pagination = reactive({
    page: 1,
    pageSize: 10,
    showSizePicker: true,
    pageSizes: [10, 15, 20, 25, 30],
    onChange: (page: number) => {
      pagination.page = page;

      updateRequestParamsByPagination({ page });
      getData();
    },
    onUpdatePageSize: (pageSize: number) => {
      pagination.pageSize = pageSize;
      pagination.page = 1;

      updateRequestParamsByPagination({ pageSize });
      getData();
    },
    ...config.pagination
  }) as PaginationProps;

  function updatePagination(update: Partial<PaginationProps>) {
    Object.assign(pagination, update);

    updateRequestParamsByPagination({ page: pagination.page, pageSize: pagination.pageSize });
  }

  async function getData() {
    startLoading();

    const { data: apiData, error } = await apiFn(requestParams.value);

    if (!error && data) {
      const { data: tableData, pageNum, pageSize, total } = transformer(apiData);

      updateData(tableData);

      setEmpty(tableData.length === 0);

      updatePagination({ page: pageNum, pageSize, itemCount: total });
    }

    endLoading();
  }

  function reloadColumns() {
    columns.value = config.columns();
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
    updatePagination,
    reloadColumns
  };
}
