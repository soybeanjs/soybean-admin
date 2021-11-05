<template>
  <shadow-card class="p-18px !rounded-4px">
    <h3 class="pb-18px text-16px font-semibold">项目信息</h3>
    <n-descriptions label-placement="left" bordered size="small" :column="2">
      <n-descriptions-item label="版本">
        <n-tag type="primary">1.0.0</n-tag>
      </n-descriptions-item>
      <n-descriptions-item label="最后编译时间">
        <n-tag type="primary">{{ lastestBuildTime }}</n-tag>
      </n-descriptions-item>
      <n-descriptions-item label="Github地址">
        <a class="g_text-primary" href="https://github.com/honghuangdc/soybean-admin" target="_blank">Github地址</a>
      </n-descriptions-item>
      <n-descriptions-item label="预览地址">
        <a class="g_text-primary" href="https://soybean.pro" target="_blank">预览地址</a>
      </n-descriptions-item>
    </n-descriptions>
  </shadow-card>
</template>

<script setup lang="ts">
import { NDescriptions, NDescriptionsItem, NTag } from 'naive-ui';

const lastestBuildTime = PROJECT_BUILD_TIME;
</script>
<style scoped></style>
