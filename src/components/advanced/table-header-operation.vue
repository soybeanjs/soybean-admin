<script setup lang="ts">
import { computed } from 'vue';
import { $t } from '@/locales';

defineOptions({
  name: 'TableHeaderOperation'
});

/** button item config type */
export interface TableButtonItem {
  /** button unique identifier */
  key: string;
  /** button text, if not passed, use default internationalized text */
  text?: string;
  /** button icon */
  icon: string;
  /** button type */
  type?: 'default' | 'primary' | 'info' | 'success' | 'warning' | 'error';
  /** whether to be ghost button */
  ghost?: boolean;
  /** whether to disable button */
  disabled?: boolean;
  /** button order, the smaller the value, the closer to the front */
  order?: number;
  /** whether to need confirm */
  needConfirm?: boolean;
  /** confirm text */
  confirmText?: string;
  /** button extra props */
  buttonProps?: Record<string, any>;
}

/** preset button type */
export type PresetButtonKey = 'add' | 'delete' | 'refresh';

/** button type constant */
const ButtonType = {
  DEFAULT: 'default',
  PRIMARY: 'primary',
  INFO: 'info',
  SUCCESS: 'success',
  WARNING: 'warning',
  ERROR: 'error'
} as const;

/** component props */
export interface TableHeaderOperationProps {
  /** internal element alignment */
  itemAlign?: 'start' | 'end' | 'center' | 'baseline' | 'stretch';
  /** loading status */
  loading?: boolean;
  /** button config list */
  buttons?: TableButtonItem[];
  /** whether to show preset buttons */
  showPresetButtons?: boolean;
  /** disabled preset buttons */
  disabledPresetButtons?: PresetButtonKey[];
  /** hidden preset buttons */
  hiddenPresetButtons?: PresetButtonKey[];
}

const props = withDefaults(defineProps<TableHeaderOperationProps>(), {
  itemAlign: 'center',
  loading: false,
  showPresetButtons: true,
  disabledPresetButtons: () => [],
  hiddenPresetButtons: () => [],
  buttons: () => []
});

/** component events */
interface Emits {
  /** add button click event */
  (e: 'add'): void;
  /** delete button click event */
  (e: 'delete'): void;
  /** refresh button click event */
  (e: 'refresh'): void;
  /** custom button click event */
  (e: 'click', key: string): void;
}

const emit = defineEmits<Emits>();

const columns = defineModel<any[]>('columns', {
  default: () => []
});

/** get preset button config */
const getPresetButtons = (): TableButtonItem[] => {
  return [
    {
      key: 'add',
      text: $t('common.add'),
      icon: 'ic-round-plus',
      type: ButtonType.PRIMARY,
      ghost: true,
      order: 10,
      disabled: props.disabledPresetButtons.includes('add')
    },
    {
      key: 'delete',
      text: $t('common.batchDelete'),
      icon: 'ic-round-delete',
      type: ButtonType.ERROR,
      ghost: true,
      order: 20,
      disabled: props.disabledPresetButtons.includes('delete'),
      needConfirm: true,
      confirmText: $t('common.confirmDelete')
    },
    {
      key: 'refresh',
      text: $t('common.refresh'),
      icon: 'mdi-refresh',
      type: ButtonType.DEFAULT,
      order: 30,
      disabled: props.disabledPresetButtons.includes('refresh')
    }
  ].filter(btn => !props.hiddenPresetButtons.includes(btn.key as PresetButtonKey));
};

/** merge button config */
const mergedButtons = computed(() => {
  const result: TableButtonItem[] = [];

  // add preset buttons
  if (props.showPresetButtons) {
    result.push(...getPresetButtons());
  }

  // add custom buttons
  if (props.buttons?.length) {
    // merge custom buttons with preset buttons
    props.buttons.forEach(customBtn => {
      const existingIndex = result.findIndex(btn => btn.key === customBtn.key);

      if (existingIndex >= 0) {
        // override preset buttons
        result[existingIndex] = {
          ...result[existingIndex],
          ...customBtn
        };
      } else {
        // add new button
        result.push({
          order: 100, // custom button default order value
          ...customBtn
        });
      }
    });
  }

  // sort by order
  return result.sort((a, b) => (a.order || 0) - (b.order || 0));
});

/** handle button click event */
function handleButtonClick(key: string) {
  switch (key) {
    case 'add':
      emit('add');
      break;
    case 'delete':
      emit('delete');
      break;
    case 'refresh':
      emit('refresh');
      break;
    default:
      emit('click', key);
      break;
  }
}

/** get button text */
function getButtonText(button: TableButtonItem): string {
  if (button.text) return button.text;

  // use default internationalized text
  switch (button.key) {
    case 'add':
      return $t('common.add');
    case 'delete':
      return $t('common.batchDelete');
    case 'refresh':
      return $t('common.refresh');
    default:
      return button.key;
  }
}
</script>

<template>
  <NSpace :align="itemAlign" wrap justify="end" class="lt-sm:w-200px">
    <slot name="prefix"></slot>
    <slot name="default">
      <template v-for="button in mergedButtons" :key="button.key">
        <!-- button that needs confirmation -->
        <NPopconfirm v-if="button.needConfirm" @positive-click="handleButtonClick(button.key)">
          <template #trigger>
            <NButton
              size="small"
              :ghost="button.ghost"
              :type="button.type"
              :disabled="button.disabled"
              v-bind="button.buttonProps"
            >
              <template #icon>
                <SvgIcon
                  :icon="button.icon"
                  class="text-icon"
                  :class="{ 'animate-spin': loading && button.key === 'refresh' }"
                />
              </template>
              {{ getButtonText(button) }}
            </NButton>
          </template>
          {{ button.confirmText }}
        </NPopconfirm>

        <!-- normal button -->
        <NButton
          v-else
          size="small"
          :ghost="button.ghost"
          :type="button.type"
          :disabled="button.disabled"
          v-bind="button.buttonProps"
          @click="handleButtonClick(button.key)"
        >
          <template #icon>
            <SvgIcon
              :icon="button.icon"
              class="text-icon"
              :class="{ 'animate-spin': loading && button.key === 'refresh' }"
            />
          </template>
          {{ getButtonText(button) }}
        </NButton>
      </template>
    </slot>

    <TableColumnSetting v-model:columns="columns" />
    <slot name="suffix"></slot>
  </NSpace>
</template>
