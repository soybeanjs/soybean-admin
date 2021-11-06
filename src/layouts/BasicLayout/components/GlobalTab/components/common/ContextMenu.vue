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

interface Props {
  /** 右键菜单可见性 */
  visible?: boolean;
  /** 当前是否是路由首页 */
  isRouteHome?: boolean;
  /** 当前路由路径 */
  currentPath?: string;
  /** 鼠标x坐标 */
  x: number;
  /** 鼠标y坐标 */
  y: number;
}

type DropdownKey = 'reload-current' | 'close-current' | 'close-other' | 'close-all';
type Option = DropdownOption & {
  key: DropdownKey;
};

const props = withDefaults(defineProps<Props>(), {
  visible: false,
  isRouteHome: false,
  currentPath: ''
});

const emit = defineEmits<{
  (e: 'update:visible', visible: boolean): void;
}>();

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
