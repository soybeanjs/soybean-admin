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
        <icon-select v-model:value="selectVal" :icons="icons" />
      </div>
      <template #footer>
        <web-site-link label="iconify地址：" link="https://icones.js.org/" class="mt-10px" />
      </template>
    </n-card>
    <n-card title="SvgIcon 示例" class="mt-10px shadow-sm rounded-16px">
      <div class="grid grid-cols-10">
        <template v-for="item in svgIcons" :key="item">
          <div class="mt-5px flex-x-center">
            <svg-icon :name="item" class="text-30px" />
          </div>
        </template>
      </div>
    </n-card>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { Icon } from '@iconify/vue';
import { IconSelect, WebSiteLink } from '@/components';
import { icons } from './icons';
import { svgIcons } from './svg-icons';

const selectVal = ref('');
</script>
<style scoped></style>
