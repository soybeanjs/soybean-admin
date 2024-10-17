import type { TableColumnCheck } from '@sa/hooks';
import { computed, ref } from 'vue';
import type { DataTableBaseColumn, DataTableColumn } from 'naive-ui';
import { $t } from '@/locales';
import type { AlovaGenerics, Method } from '~/packages/alova/src';

function isTableColumnHasKey<T>(column: DataTableColumn<T>): column is DataTableBaseColumn<T> {
  return Boolean((column as NaiveUI.TableColumnWithKey<T>).key);
}

type TableAlovaApiFn<T = any, R = Api.Common.CommonSearchParams> = (
  params: R
) => Method<AlovaGenerics<Api.Common.PaginatingQueryRecord<T>>>;

// this hook is used to manage table columns
// if you choose alova, you can move this hook to the `src/hooks` to handle all list page in your project
export default function useCheckedColumns<A extends TableAlovaApiFn, T = Awaited<ReturnType<A>>['records'][number]>(
  getColumns: () => DataTableColumn<T>[]
) {
  const SELECTION_KEY = '__selection__';

  const EXPAND_KEY = '__expand__';

  const getColumnChecks = (cols: DataTableColumn<T>[]) => {
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
  };

  const columnChecks = ref<TableColumnCheck[]>(getColumnChecks(getColumns()));

  const columns = computed(() => {
    const cols = getColumns();
    const columnMap = new Map<string, DataTableColumn<T>>();

    cols.forEach(column => {
      if (isTableColumnHasKey(column)) {
        columnMap.set(column.key as string, column);
      } else if (column.type === 'selection') {
        columnMap.set(SELECTION_KEY, column);
      } else if (column.type === 'expand') {
        columnMap.set(EXPAND_KEY, column);
      }
    });

    const filteredColumns = columnChecks.value
      .filter(item => item.checked)
      .map(check => columnMap.get(check.key) as NaiveUI.TableColumn<T>);

    return filteredColumns;
  });

  return {
    columnChecks,
    columns
  };
}
