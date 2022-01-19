<template>
  <div
    class="relative flex-center w-18px h-18px text-14px"
    :style="{ color: isActive ? primaryColor : defaultColor }"
    @mouseenter="setTrue"
    @mouseleave="setFalse"
  >
    <transition name="fade">
      <icon-mdi:close-circle v-if="isHover" key="hover" class="absolute" />
      <icon-mdi:close v-else key="unhover" class="absolute" />
    </transition>
  </div>
</template>

<script lang="ts" setup>
import { useBoolean } from '@/hooks';

interface Props {
  /** 激活状态 */
  isActive?: boolean;
  /** 主题颜色 */
  primaryColor?: string;
  /** 默认颜色 */
  defaultColor?: string;
}

withDefaults(defineProps<Props>(), {
  isPrimary: false,
  primaryColor: '#1890ff',
  defaultColor: '#9ca3af'
});

const { bool: isHover, setTrue, setFalse } = useBoolean();
</script>
<style scoped></style>
