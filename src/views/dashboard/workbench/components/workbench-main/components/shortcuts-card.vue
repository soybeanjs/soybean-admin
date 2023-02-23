<template>
  <div
    class="flex-col-center p-12px border-1px border-[#efeff5] dark:border-[#ffffff17] rounded-4px hover:shadow-sm cursor-pointer"
  >
    <svg-icon :icon="icon" :style="{ color: iconColor }" class="text-30px" />
    <p class="py-8px text-16px">{{ label }}</p>
  </div>
</template>

<script setup lang="ts">
defineOptions({ name: 'DashboardWorkbenchMainShortcutsCard' });

interface Props {
  /** 快捷操作名称 */
  label: string;
  /** 图标 */
  icon: string;
  /** 图标颜色 */
  iconColor: string;
}

defineProps<Props>();
</script>

<style scoped></style>
