<template>
  <n-popover placement="bottom-end" trigger="click">
    <template #trigger>
      <n-input v-model:value="modelValue" readonly placeholder="点击选择图标">
        <template #suffix>
          <Icon :icon="modelValue ? modelValue : 'mdi:apps'" class="text-30px p-5px" />
        </template>
      </n-input>
    </template>
    <template #header>
      <n-input v-model:value="searchValue" placeholder="搜索图标"></n-input>
    </template>
    <div v-if="iconsList.length > 0" class="grid grid-cols-9 h-auto overflow-auto">
      <template v-for="iconItem in iconsList" :key="iconItem">
        <Icon
          :icon="iconItem"
          class="border-1px border-[#d9d9d9] text-30px m-2px p-5px"
          :style="{ 'border-color': modelValue === iconItem ? theme.themeColor : '' }"
          @click="handleChange(iconItem)"
        />
      </template>
    </div>
    <n-empty v-else class="w-306px" description="你什么也找不到" />
  </n-popover>
</template>

<script lang="ts" setup>
import { ref, computed } from 'vue';
import { NPopover, NInput, NEmpty } from 'naive-ui';
import { Icon } from '@iconify/vue';
import { useThemeStore } from '@/store';

interface Props {
  /** 绑定的图标 */
  value: string;
  /** 图标列表 */
  icons?: string[];
}

interface Emits {
  (e: 'update:value', val: string): void;
}

const props = withDefaults(defineProps<Props>(), {
  icons: () => []
});

const emit = defineEmits<Emits>();

const theme = useThemeStore();
const searchValue = ref('');

const modelValue = computed({
  get() {
    return props.value;
  },
  set(val: string) {
    emit('update:value', val);
  }
});

const iconsList = computed(() => props.icons.filter(v => v.includes(searchValue.value)));

function handleChange(iconItem: string) {
  modelValue.value = iconItem;
}
</script>
<style lang="scss" scoped>
:deep(.n-input-wrapper) {
  padding-right: 0;
}
:deep(.n-input__suffix) {
  border: 1px solid #d9d9d9;
}
</style>
