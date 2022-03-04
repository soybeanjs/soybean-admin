<template>
  <n-scrollbar>
    <div class="pb-12px">
      <template v-for="item in options" :key="item.path">
        <div
          class="bg-[#e5e7eb] dark:bg-dark h-56px mt-8px px-14px rounded-4px cursor-pointer flex-y-center justify-between"
          :style="{
            background: item.path === active ? theme.themeColor : '',
            color: item.path === active ? '#fff' : ''
          }"
          @click="handleTo"
          @mouseenter="handleMouse(item)"
        >
          <Icon :icon="item.meta?.icon ?? 'mdi:bookmark-minus-outline'" />
          <span class="flex-1 ml-5px">{{ item.meta?.title }}</span>
          <icon-ant-design-enter-outlined class="icon text-20px p-2px mr-3px" />
        </div>
      </template>
    </div>
  </n-scrollbar>
</template>

<script lang="ts" setup>
import { computed } from 'vue';
import { Icon } from '@iconify/vue';
import { useThemeStore } from '@/store';
import type { SearchMenu } from '@/interface';

interface Props {
  value: string;
  options: SearchMenu[];
}

interface Emits {
  (e: 'update:value', val: string): void;
  (e: 'enter'): void;
}

const props = defineProps<Props>();

const emit = defineEmits<Emits>();

const theme = useThemeStore();

const active = computed({
  get() {
    return props.value;
  },
  set(val: string) {
    emit('update:value', val);
  }
});

/** 鼠标移入 */
async function handleMouse(item: SearchMenu) {
  active.value = item.path;
}

function handleTo() {
  emit('enter');
}
</script>
<style lang="scss" scoped></style>
