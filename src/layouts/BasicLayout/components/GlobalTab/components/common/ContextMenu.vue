<template>
  <n-dropdown
    :show="dropdownVisible"
    :options="options"
    placement="bottom-start"
    :x="x"
    :y="y"
    @clickoutside="hide"
    @select="handleDropdown"
  />
</template>

<script lang="ts" setup>
import { computed, watch } from 'vue';
import { NDropdown } from 'naive-ui';
import type { DropdownOption } from 'naive-ui';
import { ReloadOutlined, CloseOutlined, ColumnWidthOutlined, MinusOutlined } from '@vicons/antd';
import { useAppStore } from '@/store';
import { useBoolean } from '@/hooks';
import { ROUTE_HOME } from '@/router';
import { useReloadInject } from '@/context';
import { dynamicIconRender } from '@/utils';

type DropdownKey = 'reload-current' | 'close-current' | 'close-other' | 'close-all';
type Option = DropdownOption & {
  key: DropdownKey;
};

const props = defineProps({
  visible: {
    type: Boolean,
    default: false
  },
  isRouteHome: {
    type: Boolean,
    default: false
  },
  currentPath: {
    type: String,
    default: ''
  },
  x: {
    type: Number,
    required: true
  },
  y: {
    type: Number,
    required: true
  }
});

const emit = defineEmits(['update:visible']);

const app = useAppStore();
const { removeMultiTab, clearMultiTab } = useAppStore();
const { handleReload } = useReloadInject();
const { bool: dropdownVisible, setTrue: show, setFalse: hide } = useBoolean(props.visible);

const options = computed<Option[]>(() => [
  {
    label: '重新加载',
    key: 'reload-current',
    disabled: props.currentPath !== app.multiTab.activeRoute,
    icon: dynamicIconRender(ReloadOutlined)
  },
  {
    label: '关闭标签页',
    key: 'close-current',
    disabled: props.currentPath === ROUTE_HOME.path,
    icon: dynamicIconRender(CloseOutlined)
  },
  {
    label: '关闭其他标签页',
    key: 'close-other',
    icon: dynamicIconRender(ColumnWidthOutlined)
  },
  {
    label: '关闭全部标签页',
    key: 'close-all',
    icon: dynamicIconRender(MinusOutlined)
  }
]);

const actionMap = new Map<DropdownKey, () => void>([
  [
    'reload-current',
    () => {
      handleReload();
    }
  ],
  [
    'close-current',
    () => {
      removeMultiTab(app.multiTab.activeRoute);
    }
  ],
  [
    'close-other',
    () => {
      clearMultiTab([props.currentPath]);
    }
  ],
  [
    'close-all',
    () => {
      clearMultiTab();
    }
  ]
]);

function handleDropdown(optionKey: string) {
  const key = optionKey as DropdownKey;
  const actionFunc = actionMap.get(key);
  if (actionFunc) {
    actionFunc();
  }
  hide();
}

watch(
  () => props.visible,
  newValue => {
    if (newValue) {
      show();
    } else {
      hide();
    }
  }
);
watch(dropdownVisible, newValue => {
  emit('update:visible', newValue);
});
</script>
<style scoped></style>
