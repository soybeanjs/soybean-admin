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
import { CloseOutlined, ColumnWidthOutlined, MinusOutlined } from '@vicons/antd';
import { useAppStore } from '@/store';
import { useBoolean } from '@/hooks';
import { ROUTE_HOME } from '@/router';
import { dynamicIconRender } from '@/utils';

type DropdownKey = 'close-current' | 'close-other' | 'close-all';

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
const { bool: dropdownVisible, setTrue: show, setFalse: hide } = useBoolean(props.visible);

const options = computed(() => [
  {
    label: '关闭当前',
    key: 'close-current',
    disabled: props.currentPath === ROUTE_HOME.path,
    icon: dynamicIconRender(CloseOutlined)
  },
  {
    label: '关闭其他',
    key: 'close-other',
    icon: dynamicIconRender(ColumnWidthOutlined)
  },
  {
    label: '关闭全部',
    key: 'close-all',
    icon: dynamicIconRender(MinusOutlined)
  }
]);

const actionMap = new Map<DropdownKey, () => void>([
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
