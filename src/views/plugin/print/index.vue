<template>
  <div class="h-full">
    <n-card title="打印" class="shadow-sm rounded-16px">
      <n-button type="primary" class="mr-10px" @click="printTable">打印表格</n-button>
      <n-button type="primary" @click="printImage">打印图片</n-button>
      <template #footer>
        <github-link label="printJS：" link="https://github.com/crabbly/Print.js" class="mt-10px" />
      </template>
    </n-card>
  </div>
</template>

<script lang="ts" setup>
import printJS from 'print-js';

function printTable() {
  printJS({
    printable: [
      { name: 'soybean', wechat: 'honghuangdc', remark: '欢迎来技术交流' },
      { name: 'soybean', wechat: 'honghuangdc', remark: '欢迎来技术交流' }
    ],
    properties: ['name', 'wechat', 'remark'],
    type: 'json'
  });
}
function printImage() {
  printJS({
    printable: [
      'https://i.loli.net/2021/11/24/1J6REWXiHomU2kM.jpg',
      'https://i.loli.net/2021/11/24/1J6REWXiHomU2kM.jpg'
    ],
    type: 'image',
    header: 'Multiple Images',
    imageStyle: 'width:100%;'
  });
}
</script>

<style scoped></style>
