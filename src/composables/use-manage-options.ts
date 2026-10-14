import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { MANAGE_API_METHODS } from '@/constants/manage';
import { SEARCH_ANY_SELECT_VALUE, SEARCH_ANY_VALUE } from '@/schema/_search';

/**
 * 管理端下拉选项（P3-03）。
 *
 * 与 `src/constants/manage.ts` 的分工：常量层放**值域**（可被测试直接断言，
 * 且不引入 vue-i18n 依赖），这里做「值 → 文案」的渲染层拼接。
 *
 * 文案一律写成静态字面量 key，**不能**用 `t(labelKeys[value])` 这类动态取值：
 * `scripts/remove-i18n` 只能内联字面量 key，动态调用会留下无法裁剪的 `useI18n`
 * 装配（`test/specs/scripts/remove-i18n.test.ts` 断言 `plan.leftovers === []`）。因此下面每个
 * 选项列表都穷举 `value` 与 key 的配对。
 *
 * 必须在 setup 里调用（用到 `useI18n()`）。
 *
 * **「全部」选项的哨兵值**：下拉里用 `SEARCH_ANY_SELECT_VALUE`（`'all'`）而不是
 * 表单层的空串 —— `@vean/aria` 的 `SelectItem` 对 `value === ''` 会直接抛错
 * （空串被保留给 placeholder/未选择语义）。两个值在
 * `fromSelectValue` / `toSelectValue` 这对边界函数上互相转换。
 */

/** `@vean/ui` 的 `SSelect` items 形状 */
export interface SelectOption<T extends string | number = string> {
  value: T;
  label: string;
}

export function useManageOptions() {
  const { t } = useI18n();

  const enabledOptions = computed<SelectOption[]>(() => [
    { value: 'Y', label: t('common.enabled') },
    { value: 'N', label: t('common.disabled') },
    { value: 'D', label: t('manage.enabledDeleted') }
  ]);

  const yesOrNoOptions = computed<SelectOption[]>(() => [
    { value: 'Y', label: t('common.yes') },
    { value: 'N', label: t('common.no') }
  ]);

  const menuTypeOptions = computed<SelectOption[]>(() => [
    { value: 'directory', label: t('manage.menuType.directory') },
    { value: 'menu', label: t('manage.menuType.menu') },
    { value: 'page', label: t('manage.menuType.page') },
    { value: 'iframe', label: t('manage.menuType.iframe') },
    { value: 'link', label: t('manage.menuType.link') },
    { value: 'button', label: t('manage.menuType.button') },
    { value: 'other', label: t('manage.menuType.other') }
  ]);

  const resourceTypeOptions = computed<SelectOption[]>(() => [
    { value: 'menu', label: t('manage.resourceType.menu') },
    { value: 'api', label: t('manage.resourceType.api') },
    { value: 'button', label: t('manage.resourceType.button') },
    { value: 'other', label: t('manage.resourceType.other') }
  ]);

  /** HTTP 方法下拉：展示大写，值保持小写（与后端 `API_METHODS` 一致） */
  const apiMethodOptions = computed<SelectOption[]>(() =>
    MANAGE_API_METHODS.map(value => ({ value, label: value.toUpperCase() }))
  );

  const searchAllOption = computed<SelectOption>(() => ({
    value: SEARCH_ANY_SELECT_VALUE,
    label: t('manage.searchAll')
  }));

  const enabledSearchOptions = computed(() => [searchAllOption.value, ...enabledOptions.value]);

  const menuTypeSearchOptions = computed(() => [searchAllOption.value, ...menuTypeOptions.value]);

  const resourceTypeSearchOptions = computed(() => [searchAllOption.value, ...resourceTypeOptions.value]);

  const apiMethodSearchOptions = computed(() => [searchAllOption.value, ...apiMethodOptions.value]);

  const yesOrNoSearchOptions = computed(() => [searchAllOption.value, ...yesOrNoOptions.value]);

  return {
    enabledOptions,
    yesOrNoOptions,
    menuTypeOptions,
    resourceTypeOptions,
    apiMethodOptions,
    enabledSearchOptions,
    menuTypeSearchOptions,
    resourceTypeSearchOptions,
    apiMethodSearchOptions,
    yesOrNoSearchOptions
  };
}

/**
 * `SSelect` 的选项值 → 表单值（`'all'` → `''`）。
 *
 * 搜索表单的默认值 / schema 仍以空串表示「全部」，只有下拉渲染层用哨兵值，
 * 提交前在这里转回来，`filterValidQuery` 照旧把空串剔除。
 */
export function fromSelectValue(value: string): string {
  return value === SEARCH_ANY_SELECT_VALUE ? SEARCH_ANY_VALUE : value;
}

/**
 * 表单值 → `SSelect` 的选项值（`''` → `'all'`）。
 *
 * 给 `:model-value` / `:default-value` 之类的受控绑定用；`v-model` 场景下
 * 用 `useSearchSelectValue` 更省事。
 */
export function toSelectValue(value: string): string {
  return value === SEARCH_ANY_VALUE ? SEARCH_ANY_SELECT_VALUE : value;
}

/** 值 → 展示标签（表格单元格用，非 setup 上下文也可用） */
export function resolveOptionLabel(
  options: SelectOption[],
  value: string | number | null | undefined,
  fallback = '-'
): string {
  if (value === null || value === undefined) return fallback;

  return options.find(option => option.value === value)?.label ?? String(value);
}
