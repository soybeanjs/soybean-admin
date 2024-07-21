import { computed, effectScope, onScopeDispose, reactive, ref, watch } from 'vue';
import type { Ref } from 'vue';
import type { PaginationProps } from 'naive-ui';
import { jsonClone } from '@sa/utils';
import { useBoolean, useHookTable } from '@sa/hooks';
import { useAppStore } from '@/store/modules/app';
import { $t } from '@/locales';

type TableData = NaiveUI.TableData;
type GetTableData<A extends NaiveUI.TableApiFn> = NaiveUI.GetTableData<A>;
type TableColumn<T> = NaiveUI.TableColumn<T>;

export function useTable<A extends NaiveUI.TableApiFn>(config: NaiveUI.NaiveTableConfig<A>) {
  const scope = effectScope();
  const appStore = useAppStore();

  const isMobile = computed(() => appStore.isMobile);

  const { apiFn, apiParams, immediate, showTotal } = config;

  const SELECTION_KEY = '__selection__';

  const EXPAND_KEY = '__expand__';

  const {
    loading,
    empty,
    data,
    columns,
    columnChecks,
    reloadColumns,
    getData,
    searchParams,
    updateSearchParams,
    resetSearchParams
  } = useHookTable<A, GetTableData<A>, TableColumn<NaiveUI.TableDataWithIndex<GetTableData<A>>>>({
    apiFn,
    apiParams,
    columns: config.columns,
    transformer: res => {
      const { records = [], current = 1, size = 10, total = 0 } = res.data || {};

      // Ensure that the size is greater than 0, If it is less than 0, it will cause paging calculation errors.
      const pageSize = size <= 0 ? 10 : size;

      const recordsWithIndex = records.map((item, index) => {
        return {
          ...item,
          index: (current - 1) * pageSize + index + 1
        };
      });

      return {
        data: recordsWithIndex,
        pageNum: current,
        pageSize,
        total
      };
    },
    getColumnChecks: cols => {
      const checks: NaiveUI.TableColumnCheck[] = [];

      cols.forEach(column => {
        if (isTableColumnHasKey(column)) {
          checks.push({
            key: column.key as string,
            title: column.title as string,
            checked: true
          });
        } else if (column.type === 'selection') {
          checks.push({
            key: SELECTION_KEY,
            title: $t('common.check'),
            checked: true
          });
        } else if (column.type === 'expand') {
          checks.push({
            key: EXPAND_KEY,
            title: $t('common.expandColumn'),
            checked: true
          });
        }
      });

      return checks;
    },
    getColumns: (cols, checks) => {
      const columnMap = new Map<string, TableColumn<GetTableData<A>>>();

      cols.forEach(column => {
        if (isTableColumnHasKey(column)) {
          columnMap.set(column.key as string, column);
        } else if (column.type === 'selection') {
          columnMap.set(SELECTION_KEY, column);
        } else if (column.type === 'expand') {
          columnMap.set(EXPAND_KEY, column);
        }
      });

      const filteredColumns = checks
        .filter(item => item.checked)
        .map(check => columnMap.get(check.key) as TableColumn<GetTableData<A>>);

      return filteredColumns;
    },
    onFetched: async transformed => {
      const { pageNum, pageSize, total } = transformed;

      updatePagination({
        page: pageNum,
        pageSize,
        itemCount: total
      });
    },
    immediate
  });

  const pagination: PaginationProps = reactive({
    page: 1,
    pageSize: 10,
    showSizePicker: true,
    pageSizes: [10, 15, 20, 25, 30],
    onUpdatePage: async (page: number) => {
      pagination.page = page;

      updateSearchParams({
        current: page,
        size: pagination.pageSize!
      });

      getData();
    },
    onUpdatePageSize: async (pageSize: number) => {
      pagination.pageSize = pageSize;
      pagination.page = 1;

      updateSearchParams({
        current: pagination.page,
        size: pageSize
      });

      getData();
    },
    ...(showTotal
      ? {
          prefix: page => $t('datatable.itemCount', { total: page.itemCount })
        }
      : {})
  });

  // this is for mobile, if the system does not support mobile, you can use `pagination` directly
  const mobilePagination = computed(() => {
    const p: PaginationProps = {
      ...pagination,
      pageSlot: isMobile.value ? 3 : 9,
      prefix: !isMobile.value && showTotal ? pagination.prefix : undefined
    };

    return p;
  });

  function updatePagination(update: Partial<PaginationProps>) {
    Object.assign(pagination, update);
  }

  /**
   * get data by page number
   *
   * @param pageNum the page number. default is 1
   */
  async function getDataByPage(pageNum: number = 1) {
    updatePagination({
      page: pageNum
    });

    updateSearchParams({
      current: pageNum,
      size: pagination.pageSize!
    });

    await getData();
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
    columnChecks,
    reloadColumns,
    pagination,
    mobilePagination,
    updatePagination,
    getData,
    getDataByPage,
    searchParams,
    updateSearchParams,
    resetSearchParams
  };
}

export function useTableOperate<T extends TableData = TableData>(data: Ref<T[]>, getData: () => Promise<void>) {
  const { bool: drawerVisible, setTrue: openDrawer, setFalse: closeDrawer } = useBoolean();

  const operateType = ref<NaiveUI.TableOperateType>('add');

  function handleAdd() {
    operateType.value = 'add';
    openDrawer();
  }

  /** the editing row data */
  const editingData: Ref<T | null> = ref(null);

  function handleEdit(id: T['id']) {
    operateType.value = 'edit';
    const findItem = data.value.find(item => item.id === id) || null;
    editingData.value = jsonClone(findItem);

    openDrawer();
  }

  /** the checked row keys of table */
  const checkedRowKeys = ref<string[]>([]);

  /** the hook after the batch delete operation is completed */
  async function onBatchDeleted() {
    window.$message?.success($t('common.deleteSuccess'));

    checkedRowKeys.value = [];

    await getData();
  }

  /** the hook after the delete operation is completed */
  async function onDeleted() {
    window.$message?.success($t('common.deleteSuccess'));

    await getData();
  }

  return {
    drawerVisible,
    openDrawer,
    closeDrawer,
    operateType,
    handleAdd,
    editingData,
    handleEdit,
    checkedRowKeys,
    onBatchDeleted,
    onDeleted
  };
}

function isTableColumnHasKey<T>(column: TableColumn<T>): column is NaiveUI.TableColumnWithKey<T> {
  return Boolean((column as NaiveUI.TableColumnWithKey<T>).key);
}
