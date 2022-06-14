<template>
  <n-space :vertical="true" :size="16">
    <n-card title="Tab Home" :bordered="false" size="small" class="shadow-sm rounded-16px">
      <n-space :vertical="true" :size="12">
        <n-button @click="handleToTabDetail">跳转Tab Detail</n-button>
        <n-button @click="handleToTabMultiDetail(1)">跳转Tab Multi Detail 1</n-button>
        <n-button @click="handleToTabMultiDetail(2)">跳转Tab Multi Detail 2</n-button>
        <n-input-group>
          <n-input v-model:value="title" />
          <n-button type="primary" @click="handleSetTitle">设置当前Tab页标题</n-button>
        </n-input-group>
      </n-space>
    </n-card>
  </n-space>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { routeName } from '@/router';
import { useTabStore } from '@/store';
import { useRouterPush } from '@/composables';

const { routerPush } = useRouterPush();
const tabStore = useTabStore();
const title = ref('');

function handleToTabDetail() {
  routerPush({ name: routeName('function_tab-detail'), query: { name: 'abc' }, hash: '#DEMO_HASH' });
}

function handleToTabMultiDetail(num: number) {
  routerPush({ name: routeName('function_tab-multi-detail'), query: { name: 'abc', num }, hash: '#DEMO_HASH' });
}

function handleSetTitle() {
  if (!title.value) {
    window.$message?.warning('请输入要设置的标题名称');
  } else {
    tabStore.setActiveTabTitle(title.value);
  }
}
</script>

<style scoped></style>
