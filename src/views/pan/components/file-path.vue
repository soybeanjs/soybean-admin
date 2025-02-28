<script setup lang="ts">
defineOptions({ name: 'FilePath' });
</script>

<template>
  <div class="flex-y-center gap-8px">
    <SvgIcon local-icon="return" class="text-size-icon-large" />
    <NBreadcrumb>
      <NBreadcrumbItem separator=">">
        根目录
        <template #separator></template>
      </NBreadcrumbItem>
      <NBreadcrumbItem separator=">">新建文件夹</NBreadcrumbItem>
    </NBreadcrumb>
  </div>
</template>

<style scoped></style>
