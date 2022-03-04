<template>
  <div class="h-full">
    <n-card title="Icon组件示例" class="shadow-sm rounded-16px">
      <div class="grid grid-cols-10">
        <template v-for="item in icons" :key="item">
          <div class="mt-5px flex-x-center">
            <Icon :icon="item" class="text-30px" />
          </div>
        </template>
      </div>
      <div class="mt-50px">
        <h1 class="mb-20px text-18px font-500">Icon图标选择器</h1>
        <icon-select v-model:value="selectValue" :icons="icons" />
      </div>
      <template #footer>
        <web-site-link label="iconify地址：" link="https://icones.js.org/" class="mt-10px" />
      </template>
    </n-card>
    <n-card title="SvgIcon 示例" class="mt-10px shadow-sm rounded-16px">
      <div class="pb-12px text-16px">在src/assets下的svg文件，通过在template里面以 icon-custom-{文件名} 渲染</div>
      <div class="grid grid-cols-10">
        <div class="mt-5px flex-x-center">
          <icon-custom-activity class="text-30px" />
        </div>
        <div class="mt-5px flex-x-center">
          <icon-custom-at-sign class="text-30px text-primary" />
        </div>
        <div class="mt-5px flex-x-center">
          <icon-custom-cast class="text-18px text-info" />
        </div>
        <div class="mt-5px flex-x-center">
          <icon-custom-chrome class="text-48px text-success" />
        </div>
        <div class="mt-5px flex-x-center">
          <icon-custom-copy class="text-30px text-error" />
        </div>
        <div class="mt-5px flex-x-center">
          <icon-custom-wind class="text-30px text-warning" />
        </div>
      </div>
    </n-card>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { Icon } from '@iconify/vue';
import { IconSelect, WebSiteLink } from '@/components';
import { icons } from './icons';

const selectValue = ref('');
</script>
<style scoped></style>
