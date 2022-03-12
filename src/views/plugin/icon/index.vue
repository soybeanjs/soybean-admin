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
      <div class="pb-12px text-16px">
        在src/assets/svg文件夹下的svg文件，通过在template里面以 icon-custom-{文件名} 直接渲染，动态渲染需要import组件
      </div>
      <div class="grid grid-cols-10">
        <div class="mt-5px flex-x-center">
          <icon-custom-activity class="text-40px text-success" />
        </div>
        <div class="mt-5px flex-x-center">
          <icon-custom-cast class="text-20px text-error" />
        </div>
        <div v-for="(item, index) in customIcons" :key="index" class="mt-5px flex-x-center">
          <component :is="item" class="text-30px text-primary" />
        </div>
      </div>
    </n-card>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { Icon } from '@iconify/vue';
import { icons } from './icons';
import CustomActivity from '~icons/custom/activity';
import CustomAtSign from '~icons/custom/at-sign';
import CustomCast from '~icons/custom/cast';
import CustomChrome from '~icons/custom/chrome';
import CustomCopy from '~icons/custom/copy';
import CustomWind from '~icons/custom/wind';

const selectValue = ref('');

const customIcons = [CustomActivity, CustomAtSign, CustomCast, CustomChrome, CustomCopy, CustomWind];
</script>
<style scoped></style>
