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

<script setup lang="ts">
import { computed } from 'vue';
import type { DropdownOption } from 'naive-ui';
import { useAppStore, useTabStore } from '@/store';
import { iconifyRender } from '@/utils';

interface Props {
  /** 右键菜单可见性 */
  visible?: boolean;
  /** 当前路由路径 */
  currentPath?: string;
  /** 鼠标x坐标 */
  x: number;
  /** 鼠标y坐标 */
  y: number;
}

interface Emits {
  (e: 'update:visible', visible: boolean): void;
}

type DropdownKey = 'reload-current' | 'close-current' | 'close-other' | 'close-left' | 'close-right' | 'close-all';
type Option = DropdownOption & {
  key: DropdownKey;
};

const props = withDefaults(defineProps<Props>(), {
  visible: false,
  currentPath: ''
});

const emit = defineEmits<Emits>();

const app = useAppStore();
const tab = useTabStore();

const dropdownVisible = computed({
  get() {
    return props.visible;
  },
  set(visible: boolean) {
    emit('update:visible', visible);
  }
});

function hide() {
  dropdownVisible.value = false;
}

const options = computed<Option[]>(() => [
  {
    label: '重新加载',
    key: 'reload-current',
    disabled: props.currentPath !== tab.activeTab,
    icon: iconifyRender('ant-design:reload-outlined')
  },
  {
    label: '关闭',
    key: 'close-current',
    disabled: props.currentPath === tab.homeTab.path,
    icon: iconifyRender('ant-design:close-outlined')
  },
  {
    label: '关闭其他',
    key: 'close-other',
    icon: iconifyRender('ant-design:column-width-outlined')
  },
  {
    label: '关闭左侧',
    key: 'close-left',
    icon: iconifyRender('mdi:format-horizontal-align-left')
  },
  {
    label: '关闭右侧',
    key: 'close-right',
    icon: iconifyRender('mdi:format-horizontal-align-right')
  }
]);

const actionMap = new Map<DropdownKey, () => void>([
  [
    'reload-current',
    () => {
      app.reloadPage();
    }
  ],
  [
    'close-current',
    () => {
      tab.removeTab(props.currentPath);
    }
  ],
  [
    'close-other',
    () => {
      tab.clearTab([props.currentPath]);
    }
  ],
  [
    'close-left',
    () => {
      tab.clearLeftTab(props.currentPath);
    }
  ],
  [
    'close-right',
    () => {
      tab.clearRightTab(props.currentPath);
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
</script>
<style scoped></style>
