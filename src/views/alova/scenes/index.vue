<script setup lang="ts">
import { $t } from '@/locales';
import Captcha from './modules/Captcha.vue';
import BrowserVisivilityRequest from './modules/BrowserVisivilityRequest.vue';
import PollingRequest from './modules/PollingRequest.vue';
import NetworkToggleRequest from './modules/NetworkToggleRequest.vue';
import CrossComponentRequest from './modules/CrossComponentRequest.vue';
</script>

<template>
  <NSpace vertical :size="16">
    <NCard :title="$t('page.alova.scenes.captchaSend')" :bordered="false" size="small" segmented class="card-wrapper">
      <Captcha class="w-1/3" />
    </NCard>
    <NCard :title="$t('page.alova.scenes.autoRequest')" :bordered="false" size="small" segmented class="card-wrapper">
      <NSpace :wrap="false">
        <BrowserVisivilityRequest />
        <PollingRequest />
        <NetworkToggleRequest />
      </NSpace>
    </NCard>
    <NCard
      :title="$t('page.alova.scenes.requestCrossComponent')"
      :bordered="false"
      size="small"
      segmented
      class="card-wrapper"
    >
      <CrossComponentRequest />
    </NCard>
  </NSpace>
</template>

<style scoped></style>
