import { computed, effectScope, onScopeDispose, reactive, ref, watch } from 'vue';
import type { Ref } from 'vue';
import type { DataTableBaseColumn, DataTableExpandColumn, DataTableSelectionColumn, PaginationProps } from 'naive-ui';
import type { TableColumnGroup } from 'naive-ui/es/data-table/src/interface';
import { useBoolean, useLoading } from '@sa/hooks';
import { useAppStore } from '@/store/modules/app';
import { $t } from '@/locales';

type BaseData = Record<string, unknown>;

type ApiFn = (args: any) => Promise<unknown>;

export type TableColumn<T extends BaseData = BaseData, CustomColumnKey = never> =
  | (Omit<TableColumnGroup<T>, 'key'> & { key: keyof T | CustomColumnKey })
  | (Omit<DataTableBaseColumn<T>, 'key'> & { key: keyof T | CustomColumnKey })
  | DataTableSelectionColumn<T>
  | DataTableExpandColumn<T>;

export type TransformedData<TableData extends BaseData = BaseData> = {
  data: TableData[];
  pageNum: number;
  pageSize: number;
  total: number;
};

/** transform api response to table data */
type Transformer<TableData extends BaseData = BaseData, Response = NonNullable<unknown>> = (
  response: Response
) => TransformedData<TableData>;

/** table config */
export type TableConfig<TableData extends BaseData = BaseData, Fn extends ApiFn = ApiFn, CustomColumnKey = never> = {
  /** api function to get table data */
  apiFn: Fn;
  /** api params */
  apiParams?: Parameters<Fn>[0];
  /** transform api response to table data */
  transformer: Transformer<TableData, Awaited<ReturnType<Fn>>>;
  /** pagination */
  pagination?: PaginationProps;
  /**
   * callback when pagination changed
   *
   * @param pagination
   */
  onPaginationChanged?: (pagination: PaginationProps) => void | Promise<void>;
  /**
   * whether to get data immediately
   *
   * @default true
   */
  immediate?: boolean;
  /** columns factory */
  columns: () => TableColumn<TableData, CustomColumnKey>[];
};

/** filter columns */
export type FilteredColumn = {
  key: string;
  title: string;
  checked: boolean;
};

export function useTable<TableData extends BaseData, Fn extends ApiFn, CustomColumnKey = never>(
  config: TableConfig<TableData, Fn, CustomColumnKey>
) {
  const scope = effectScope();
  const appStore = useAppStore();

  const { loading, startLoading, endLoading } = useLoading();
  const { bool: empty, setBool: setEmpty } = useBoolean();

  const { apiFn, apiParams, transformer, onPaginationChanged, immediate = true } = config;

  const searchParams: NonNullable<Parameters<Fn>[0]> = reactive({ ...apiParams });

  const { columns, filteredColumns, reloadColumns } = useTableColumn(config.columns);

  const data: Ref<TableData[]> = ref([]);

  const pagination = reactive({
    page: 1,
    pageSize: 10,
    showSizePicker: true,
    pageSizes: [10, 15, 20, 25, 30],
    // Fix Naive Pagination's outdated API
    onUpdatePage: async (page: number) => {
      pagination.page = page;

      await onPaginationChanged?.(pagination);
    },
    onUpdatePageSize: async (pageSize: number) => {
      pagination.pageSize = pageSize;
      pagination.page = 1;

      await onPaginationChanged?.(pagination);
    },
    ...config.pagination
  }) as PaginationProps;

  function updatePagination(update: Partial<PaginationProps>) {
    Object.assign(pagination, update);
  }

  async function getData() {
    startLoading();

    const formattedParams = formatSearchParams(searchParams);

    const response = await apiFn(formattedParams);

    const { data: tableData, pageNum, pageSize, total } = transformer(response as Awaited<ReturnType<Fn>>);

    data.value = tableData;

    setEmpty(tableData.length === 0);
    updatePagination({ page: pageNum, pageSize, itemCount: total });
    endLoading();
  }

  function formatSearchParams(params: Record<string, unknown>) {
    const formattedParams: Record<string, unknown> = {};

    Object.entries(params).forEach(([key, value]) => {
      if (value !== null && value !== undefined) {
        formattedParams[key] = value;
      }
    });

    return formattedParams;
  }

  /**
   * update search params
   *
   * @param params
   */
  function updateSearchParams(params: Partial<Parameters<Fn>[0]>) {
    Object.assign(searchParams, params);
  }

  /** reset search params */
  function resetSearchParams() {
    Object.assign(searchParams, apiParams);
  }

  if (immediate) {
    getData();
  }

  scope.run(() => {
    watch(
      () => appStore.locale,
      () => {
        reloadColumns();
      }
    );
  });

  onScopeDispose(() => {
    scope.stop();
  });

  return {
    loading,
    empty,
    data,
    columns,
    filteredColumns,
    reloadColumns,
    pagination,
    updatePagination,
    getData,
    searchParams,
    updateSearchParams,
    resetSearchParams
  };
}

function useTableColumn<TableData extends BaseData, CustomColumnKey = never>(
  factory: () => TableColumn<TableData, CustomColumnKey>[]
) {
  const SELECTION_KEY = '__selection__';

  const allColumns = ref(factory()) as Ref<TableColumn<TableData, CustomColumnKey>[]>;

  const filteredColumns: Ref<FilteredColumn[]> = ref(getFilteredColumns(factory()));

  const columns = computed(() => getColumns());

  function reloadColumns() {
    allColumns.value = factory();
    filteredColumns.value = getFilteredColumns(factory());
  }

  function getFilteredColumns(aColumns: TableColumn<TableData, CustomColumnKey>[]) {
    const cols: FilteredColumn[] = [];

    aColumns.forEach(column => {
      if (column.type === undefined) {
        cols.push({
          key: column.key as string,
          title: column.title as string,
          checked: true
        });
      }

      if (column.type === 'selection') {
        cols.push({
          key: SELECTION_KEY,
          title: $t('common.check'),
          checked: true
        });
      }
    });

    return cols;
  }

  function getColumns() {
    const cols = filteredColumns.value
      .filter(column => column.checked)
      .map(column => {
        if (column.key === SELECTION_KEY) {
          return allColumns.value.find(col => col.type === 'selection');
        }
        return allColumns.value.find(col => (col as DataTableBaseColumn).key === column.key);
      });

    return cols as TableColumn<TableData, CustomColumnKey>[];
  }

  return {
    columns,
    reloadColumns,
    filteredColumns
  };
}
