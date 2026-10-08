import { describe, expect, it, vi } from 'vitest';
import { nextTick, ref, shallowRef } from 'vue';
import { useTableOperate } from '@/composables/use-table-operate';

/**
 * `useTableOperate`（P3-02）：表格交互范式。
 *
 * 只测纯逻辑部分 —— operate 弹窗开关、选中集、查询重置、分页与 query 的双向
 * 同步。`t()` 只在 `usePageSizeOptions` 里用（需要 setup 上下文），不在覆盖范围。
 */
function setup(initialQuery: Record<string, unknown> = {}) {
  const query = ref<Record<string, unknown>>({ ...initialQuery });
  const page = ref(1);
  const pageSize = ref(10);
  const loading = shallowRef(false);
  const fetchData = vi.fn(async () => {
    loading.value = true;
    loading.value = false;
  });

  const operate = useTableOperate({ query, page, pageSize, loading, fetchData });

  return { operate, query, page, pageSize, loading, fetchData };
}

describe('useTableOperate', () => {
  it('新增清空 id 并开弹窗，编辑带上 id', () => {
    const { operate } = setup();

    expect(operate.operateOpen.value).toBe(false);
    expect(operate.operateId.value).toBeUndefined();

    operate.handleEdit('user-1');
    expect(operate.operateId.value).toBe('user-1');
    expect(operate.operateOpen.value).toBe(true);

    operate.handleAdd();
    expect(operate.operateId.value).toBeUndefined();
    expect(operate.operateOpen.value).toBe(true);
  });

  it('重置恢复初始查询条件，并保留当前分页', async () => {
    const { operate, query, page, pageSize, fetchData } = setup({ keyword: 'soy', enabled: 'Y' });

    query.value.keyword = 'changed';
    page.value = 5;
    await nextTick();

    await operate.handleReset();

    expect(query.value.keyword).toBe('soy');
    expect(query.value.enabled).toBe('Y');
    expect(query.value.page).toBe(5);
    expect(query.value.pageSize).toBe(pageSize.value);
    expect(fetchData).toHaveBeenCalledTimes(1);
  });

  it('重置用的默认值在组合时快照，之后改 query 不影响它', async () => {
    const { operate, query } = setup({ keyword: 'soy' });

    query.value.keyword = 'mutated';
    await nextTick();
    await operate.handleReset();

    expect(query.value.keyword).toBe('soy');
  });

  it('搜索可并入增量条件后刷新', async () => {
    const { operate, query, fetchData } = setup({ keyword: '' });

    await operate.handleSearch({ keyword: 'soy', enabled: 'Y' });

    expect(query.value.keyword).toBe('soy');
    expect(query.value.enabled).toBe('Y');
    expect(fetchData).toHaveBeenCalledTimes(1);

    await operate.handleSearch();

    expect(fetchData).toHaveBeenCalledTimes(2);
  });

  it('批量删除后清空选中', async () => {
    const { operate, fetchData } = setup();

    operate.selected.value = ['a', 'b'];
    await operate.onBatchDeleted();

    expect(operate.selected.value).toEqual([]);
    expect(fetchData).toHaveBeenCalledTimes(1);
  });

  it('每页条数变化回到第一页', async () => {
    const { page, pageSize } = setup();

    page.value = 7;
    pageSize.value = 50;
    await nextTick();

    expect(page.value).toBe(1);
  });

  it('分页状态单向同步进 query（api 函数直接拼 query 用）', async () => {
    const { query, page, pageSize } = setup();

    pageSize.value = 20;
    await nextTick();

    // 每页条数变化 → 回第一页，并写进 query
    expect(page.value).toBe(1);
    expect(query.value.page).toBe(1);
    expect(query.value.pageSize).toBe(20);

    page.value = 3;
    await nextTick();
    expect(query.value.page).toBe(3);

    // 方向是 page/pageSize → query（SPagination 是分页唯一驱动）；
    // 直接改 query.page 会被 watchEffect 按当前 page 覆写回去
    query.value.page = 9;
    await nextTick();
    expect(query.value.page).toBe(3);
  });
});
