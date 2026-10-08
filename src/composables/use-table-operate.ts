import { computed, ref, shallowRef, toRaw, watch, watchEffect } from 'vue';
import type { Ref, ShallowRef } from 'vue';
import { refDebounced } from '@vueuse/core';
import { useI18n } from 'vue-i18n';
import { toast } from '@vean/ui';

/**
 * 表格 operate 弹窗 / 搜索 / 刷新范式（v3 §5.7，P3-02）。
 *
 * 从 `soybean-unify/apps/admin/src/composables/table.ts` 重写而来，差异：
 * - 深度克隆用内建 `structuredClone`，不引入 `klona`（本仓无该依赖）；
 * - `t()` 只能在 setup 上下文用 → 走 `useI18n()`，不再有 unify 的
 *   模块级 `I18N_FLAG` 开关；
 * - 查询默认值类型放宽为 `Record<string, unknown>` 的普通对象。
 *
 * 与 `usePaginatedTable`（`@vean/ui`）的分工：后者管**数据与分页**，
 * 这里管**交互**（新增/编辑弹窗开关、批量选中、搜索/重置/刷新）。
 */

/** 查询对象约束：`page`/`pageSize` 由 `watchEffect` 自动同步，业务字段随意 */
export type TableQuery = {
  page?: number;
  pageSize?: number;
  [key: string]: unknown;
};

/** 实体 id 类型（本仓 8 套 CRUD 均为 uuid 字符串，故默认 `string`） */
export type TableIdType = 'number' | 'string';

type TableId<T extends TableIdType> = T extends 'number' ? number : string;

export interface UseTableOperateOptions<T extends TableQuery, I extends TableIdType = 'string'> {
  /** 搜索条件（在 setup 里 `ref({})`，字段由页面定义） */
  query: Ref<T>;
  /** `usePaginatedTable` 返回的页码 */
  page: Ref<number>;
  /** `usePaginatedTable` 返回的每页条数 */
  pageSize: Ref<number>;
  /** `usePaginatedTable` 返回的 `fetchData` */
  fetchData: () => Promise<void>;
  /** `usePaginatedTable` 返回的 `loading` */
  loading: ShallowRef<boolean>;
  /** 实体 id 类型，默认 `string` */
  idType?: I;
}

/**
 * 克隆查询默认值。用内建 `structuredClone`（Node 17+ / 全部现代浏览器）；
 * `toRaw` 先脱掉 reactive 代理，否则克隆出来的是 Proxy（会随 search 表单漂移）。
 */
function cloneQuery<T extends TableQuery>(query: T): T {
  return structuredClone(toRaw(query));
}

export function useTableOperate<T extends TableQuery, I extends TableIdType = 'string'>(
  options: UseTableOperateOptions<T, I>
) {
  const { query, page, pageSize, fetchData, loading } = options;

  /** 当前 operate 弹窗操作的实体 id（`undefined` = 新增） */
  const operateId = shallowRef<TableId<I> | undefined>(undefined);
  /** operate 弹窗开关 */
  const operateOpen = shallowRef(false);
  /** 表格多选选中的 id */
  const selected = ref<TableId<I>[]>([]);
  /**
   * 刷新按钮的 loading：请求期间**立即**跟手（0ms），结束后再拖 500ms ——
   * 否则快速的本地查询会让按钮闪一下，看起来像"没点到"。
   */
  const refreshLoading = refDebounced(
    loading,
    computed(() => (loading.value ? 0 : 500))
  );

  const defaultQuery = cloneQuery(query.value);

  /** 新增：清空 id，开弹窗 */
  function handleAdd(): void {
    operateId.value = undefined;
    operateOpen.value = true;
  }

  /** 编辑：带 id 开弹窗 */
  function handleEdit(id: TableId<I>): void {
    operateId.value = id;
    operateOpen.value = true;
  }

  /** 手动刷新 */
  async function handleRefresh(): Promise<void> {
    await fetchData();
  }

  /** 重置：恢复初始条件（保留当前分页），再刷新 */
  async function handleReset(): Promise<void> {
    query.value = { ...defaultQuery, page: page.value, pageSize: pageSize.value };
    await handleRefresh();
  }

  /** 搜索：可先并入增量条件（如表单字段），再刷新 */
  async function handleSearch(update?: Partial<T>): Promise<void> {
    if (update) {
      query.value = { ...query.value, ...update };
    }
    await handleRefresh();
  }

  /** 单条删除成功回调：提示 + 刷新 */
  async function onDeleted(): Promise<void> {
    toast.success('删除成功');
    await handleRefresh();
  }

  /** 批量删除成功回调：提示 + 清空选中 + 刷新 */
  async function onBatchDeleted(): Promise<void> {
    toast.success('批量删除成功');
    selected.value = [];
    await handleRefresh();
  }

  // 每页条数变化回到第一页（否则会停在超出范围的空页）
  watch(pageSize, () => {
    page.value = 1;
  });

  // 查询条件里携带 page/pageSize，供 api 函数直接拼 query。
  // 方向是单向的 page/pageSize → query：`SPagination` 是分页的唯一驱动，
  // 反向写 query.page 会被这里按当前 page 覆写回去。
  watchEffect(() => {
    if (query.value.page !== page.value) {
      query.value.page = page.value;
    }
    if (query.value.pageSize !== pageSize.value) {
      query.value.pageSize = pageSize.value;
    }
  });

  return {
    operateId,
    operateOpen,
    selected,
    refreshLoading,
    handleAdd,
    handleEdit,
    handleRefresh,
    handleReset,
    handleSearch,
    onDeleted,
    onBatchDeleted
  };
}

/** 可选每页条数（与 `SPagination` 的 `pageSizeOptions` 对接） */
export const DEFAULT_PAGE_SIZES = [10, 15, 20, 25, 30, 40, 50, 100];

/**
 * 每页条数下拉项。必须在 setup 里调用（内部用 `useI18n()`）。
 */
export function usePageSizeOptions() {
  const { t } = useI18n();

  const pageSizeOptions = computed(() =>
    DEFAULT_PAGE_SIZES.map(size => ({ label: t('common.perPage', { size }), value: size }))
  );

  return { pageSizeOptions };
}
