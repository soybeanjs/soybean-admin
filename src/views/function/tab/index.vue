<script setup lang="ts">
import { ref } from 'vue';
import { useRouterPush } from '@/hooks/common/router';
import { $t } from '@/locales';
import { useTabStore } from '@/store/modules/tab';

const tabStore = useTabStore();
const { routerPushByKey } = useRouterPush();

const tabLabel = ref('');

function changeTabLabel() {
  tabStore.setTabLabel(tabLabel.value);
}

function resetTabLabel() {
  tabStore.resetTabLabel();
}
</script>

<template>
  <NSpace vertical :size="16">
    <NCard
      :title="$t('page.function.tab.tabOperate.title')"
      :bordered="false"
      size="small"
      segmented
      class="card-wrapper"
    >
      <NDivider title-placement="left">{{ $t('page.function.tab.tabOperate.addTab') }}</NDivider>
      <NButton @click="routerPushByKey('about')">{{ $t('page.function.tab.tabOperate.addTabDesc') }}</NButton>
      <NDivider title-placement="left">{{ $t('page.function.tab.tabOperate.closeTab') }}</NDivider>
      <NSpace>
        <NButton @click="tabStore.removeActiveTab">
          {{ $t('page.function.tab.tabOperate.closeCurrentTab') }}
        </NButton>
        <NButton @click="tabStore.removeTabByRouteName('about')">
          {{ $t('page.function.tab.tabOperate.closeAboutTab') }}
        </NButton>
      </NSpace>
      <NDivider title-placement="left">{{ $t('page.function.tab.tabOperate.addMultiTab') }}</NDivider>
      <NSpace>
        <NButton @click="routerPushByKey('function_multi-tab')">
          {{ $t('page.function.tab.tabOperate.addMultiTabDesc1') }}
        </NButton>
        <NButton @click="routerPushByKey('function_multi-tab', { query: { a: '1' } })">
          {{ $t('page.function.tab.tabOperate.addMultiTabDesc2') }}
        </NButton>
      </NSpace>
    </NCard>
    <NCard
      :title="$t('page.function.tab.tabTitle.title')"
      :bordered="false"
      size="small"
      segmented
      class="card-wrapper"
    >
      <NDivider title-placement="left">{{ $t('page.function.tab.tabTitle.changeTitle') }}</NDivider>
      <NInputGroup class="max-w-240px">
        <NInput v-model:value="tabLabel" />
        <NButton type="primary" @click="changeTabLabel">{{ $t('page.function.tab.tabTitle.change') }}</NButton>
      </NInputGroup>
      <NDivider title-placement="left">{{ $t('page.function.tab.tabTitle.resetTitle') }}</NDivider>
      <NButton type="error" ghost class="w-80px" @click="resetTabLabel">
        {{ $t('page.function.tab.tabTitle.reset') }}
      </NButton>
    </NCard>
  </NSpace>
</template>

<style scoped></style>
