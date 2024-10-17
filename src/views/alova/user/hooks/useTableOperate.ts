import { useBoolean } from '@sa/hooks';
import type { Ref } from 'vue';
import { ref } from 'vue';
import { jsonClone } from '@sa/utils';
import { $t } from '@/locales';

type TableData = NaiveUI.TableData;
interface Operations<T> {
  delete?: (row: T) => Promise<void>;
  batchDelete?: (rows: T[]) => Promise<void>;
}

// this hook is used to handle the table operations
// if you choose alova, you can move this hook to the `src/hooks` to handle all list page in your project
export default function useTableOperate<T extends TableData = TableData>(data: Ref<T[]>, operations: Operations<T>) {
  const { bool: drawerVisible, setTrue: openDrawer, setFalse: closeDrawer } = useBoolean();
  const { bool: deleting, setTrue: deletify, setFalse: antiDelete } = useBoolean();
  const { bool: batchDeleting, setTrue: batchDeletify, setFalse: antiBatchDelete } = useBoolean();

  const operateType = ref<NaiveUI.TableOperateType>('add');

  const getRowByDataId = (id: T['id']) => data.value.find(item => item.id === id) || null;

  function handleAdd() {
    operateType.value = 'add';
    openDrawer();
  }

  /** the editing row data */
  const editingData: Ref<T | null> = ref(null);

  function handleEdit(id: T['id']) {
    operateType.value = 'edit';
    editingData.value = jsonClone(getRowByDataId(id));

    openDrawer();
  }

  /** the checked row keys of table */
  const checkedRowKeys = ref<T['id'][]>([]);

  /** handler to batch delete rows */
  async function handleBatchDelete() {
    batchDeletify();
    try {
      const rows = checkedRowKeys.value.map(id => getRowByDataId(id)).filter(Boolean);
      await operations.batchDelete?.(rows as T[]);
      window.$message?.success($t('common.deleteSuccess'));
      checkedRowKeys.value = [];
    } finally {
      antiBatchDelete();
    }
  }

  /** handler to delete row */
  async function handleDelete(id: T['id']) {
    deletify();
    const row = getRowByDataId(id);
    if (!row) return;
    try {
      await operations.delete?.(row);
      window.$message?.success($t('common.deleteSuccess'));
      checkedRowKeys.value = [];
    } finally {
      antiDelete();
    }
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
    deleting,
    handleDelete,
    batchDeleting,
    handleBatchDelete
  };
}
