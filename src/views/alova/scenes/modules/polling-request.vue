<script setup lang="ts">
import { actionDelegationMiddleware, useAutoRequest } from '@sa/alova/client';
import { ref } from 'vue';
import { alova } from '@/service-alova/request';

const getLastTime = alova.Get<{ time: string }>('/mock/getLastTime', { cacheFor: null });
const isStop = ref(false);
const { loading, data } = useAutoRequest(getLastTime, {
  pollingTime: 3000,
  initialData: {
    time: ''
  },
  async middleware(_, next) {
    await actionDelegationMiddleware('autoRequest:3')(_, () => Promise.resolve());
    if (!isStop.value) {
      next();
    }
  }
});

const toggleStop = () => {
  isStop.value = !isStop.value;
};
</script>

<template>
  <NSpace vertical>
    <NAlert type="info">
      {{ $t('page.alova.scenes.pollingRequestTips') }}
    </NAlert>
    <NButton type="primary" @click="toggleStop">
      <icon-carbon-play v-if="isStop" class="mr-2" />
      <icon-carbon-stop v-else class="mr-2" />
      {{ isStop ? $t('page.alova.scenes.startRequest') : $t('page.alova.scenes.stopRequest') }}
    </NButton>
    <NSpace align="center">
      <span>{{ $t('page.alova.scenes.refreshTime') }}: {{ data.time || '--' }}</span>
      <NSpin v-if="loading" :size="12" />
    </NSpace>
  </NSpace>
</template>
