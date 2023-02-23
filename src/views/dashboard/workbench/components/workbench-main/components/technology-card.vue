<template>
  <div
    class="p-4px border-1px border-[#efeff5] dark:border-[#ffffff17] rounded-4px hover:shadow-sm cursor-pointer"
    @click="handleOpenSite"
  >
    <header class="flex-y-center">
      <svg-icon :icon="icon" :style="{ color: iconColor }" class="text-30px" />
      <h3 class="pl-12px text-18px font-semibold">{{ name }}</h3>
    </header>
    <p class="py-8px h-56px text-[#999]">{{ description }}</p>
    <div class="flex justify-end">
      <span>{{ author }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
defineOptions({ name: 'DashboardWorkbenchMainTechnologyCard' });

interface Props {
  /** 技术名称 */
  name: string;
  /** 技术描述 */
  description: string;
  /** 技术作者 */
  author: string;
  /** 技术官网 */
  site: string;
  /** 技术图标 */
  icon: string;
  /** 图标颜色 */
  iconColor?: string;
}

const props = defineProps<Props>();

function handleOpenSite() {
  window.open(props.site, '_blank');
}
</script>

<style scoped></style>
