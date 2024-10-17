<script setup lang="ts">
import { accessAction } from '@sa/alova/client';

const handleAutoRequestSend = async () => {
  accessAction(/^autoRequest/, async ({ send }) => {
    await send();
  });
};
</script>

<template>
  <NButton @click="handleAutoRequestSend">{{ $t('page.alova.scenes.triggerAllRequest') }}</NButton>
</template>
