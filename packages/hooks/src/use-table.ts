import { computed, reactive, ref } from 'vue';
import type { Ref } from 'vue';
import { jsonClone } from '@sa/utils';
import { usePagination } from '@sa/alova/client';
import type { AlovaGenerics, Method } from '@sa/alova';
import useBoolean from './use-boolean';

export type MaybePromise<T> = T | Promise<T>;

export type ApiFn = (args: any) => Method<AlovaGenerics>;

export type TableColumnCheck = {
  key: string;
  title: string;
  checked: boolean;
};

export type TableDataWithIndex<T> = T & { index: number };

export type Transformer<T, Response> = (response: Response) => TableDataWithIndex<T>[];

export type TableConfig<A extends ApiFn, T, C> = {
  /** api function to get table data */
  apiFn: A;
  /** api params */
  apiParams?: Parameters<A>[0];
  /** transform api response to table data */
  transformer: Transformer<T, Awaited<ReturnType<ReturnType<A>['send']>>>;
  /** columns factory */
  columns: () => C[];
  /**
   * get column checks
   *
   * @param columns
   */
  getColumnChecks: (columns: C[]) => TableColumnCheck[];
  /**
   * get columns
   *
   * @param columns
   */
  getColumns: (columns: C[], checks: TableColumnCheck[]) => C[];
  /**
   * whether to get data immediately
   *
   * @default true
   */
  immediate?: boolean;
};

export default function useHookTable<A extends ApiFn, T, C>(config: TableConfig<A, T, C>) {
  const { bool: empty, setBool: setEmpty } = useBoolean();

  const { apiFn, apiParams, transformer, immediate = true, getColumnChecks, getColumns } = config;

  const searchParams: NonNullable<Parameters<A>[0]> = reactive(jsonClone({ ...apiParams }));

  const allColumns = ref(config.columns()) as Ref<C[]>;

  const columnChecks: Ref<TableColumnCheck[]> = ref(getColumnChecks(config.columns()));

  const columns = computed(() => getColumns(allColumns.value, columnChecks.value));

  const states = usePagination<ReturnType<A> extends Method<infer AG> ? AG : never, ReturnType<typeof transformer>>(
    (page, size) => apiFn({ ...formatSearchParams(searchParams), page, size }) as any,
    {
      immediate,
      data: transformer,
      total: res => res.total
    }
  ).onSuccess(({ data }) => {
    setEmpty(data.length === 0);
  });
  Reflect.deleteProperty(states, 'uploading');

  function reloadColumns() {
    allColumns.value = config.columns();

    const checkMap = new Map(columnChecks.value.map(col => [col.key, col.checked]));

    const defaultChecks = getColumnChecks(allColumns.value);

    columnChecks.value = defaultChecks.map(col => ({
      ...col,
      checked: checkMap.get(col.key) ?? col.checked
    }));
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
  function updateSearchParams(params: Partial<Parameters<A>[0]>) {
    Object.assign(searchParams, params);
  }

  /** reset search params */
  function resetSearchParams() {
    Object.assign(searchParams, jsonClone(apiParams));
  }

  return {
    ...states,
    empty,
    columns,
    columnChecks,
    reloadColumns,
    getData: states.send,
    searchParams,
    updateSearchParams,
    resetSearchParams
  };
}
