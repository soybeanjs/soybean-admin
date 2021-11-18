<template>
  <div>
    <n-card title="Icon组件示例" class="shadow-sm rounded-16px">
      <div class="flex justify-around">
        <template v-for="item in icons" :key="item">
          <Icon :icon="item" class="text-30px" />
        </template>
      </div>
      <template #footer>
        <web-site-link label="iconify地址：" link="https://icones.js.org/" class="mt-10px" />
      </template>
    </n-card>
  </div>
</template>

<script lang="ts" setup>
import { NCard } from 'naive-ui';
import { Icon } from '@iconify/vue';
import { WebSiteLink } from '@/components';

const icons = [
  'mdi:emoticon',
  'mdi:ab-testing',
  'ph:alarm',
  'ph:android-logo',
  'ph:align-bottom',
  'ph:archive-box-light',
  'uil:basketball',
  'uil:brightness-plus',
  'uil:capture'
];
</script>
<style scoped></style>
