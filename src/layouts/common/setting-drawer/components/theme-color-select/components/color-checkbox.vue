<template>
  <div class="flex-center w-20px h-20px rounded-2px shadow cursor-pointer" :style="{ backgroundColor: color }">
    <icon-ic-outline-check v-if="checked" :class="[iconClass, isWhite ? 'text-gray-700' : 'text-white']" />
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue';

defineOptions({ name: 'ColorCheckbox' });

interface Props {
  /** 颜色 */
  color: string;
  /** 是否选中 */
  checked: boolean;
  /** 图标的class */
  iconClass?: string;
}

const props = withDefaults(defineProps<Props>(), {
  iconClass: 'text-14px'
});

const whiteColors = ['#ffffff', '#fff', 'rgb(255,255,255)'];
const isWhite = computed(() => whiteColors.includes(props.color));
</script>

<style scoped></style>
