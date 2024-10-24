<script setup lang="ts">
import { $t } from '@/locales';
import { fetchCustomBackendError } from '@/service-alova/api';

async function logout() {
  await fetchCustomBackendError('8888', $t('request.logoutMsg'));
}

async function logoutWithModal() {
  await fetchCustomBackendError('7777', $t('request.logoutWithModalMsg'));
}

async function refreshToken() {
  await fetchCustomBackendError('9999', $t('request.tokenExpired'));
}

async function handleRepeatedMessageError() {
  await Promise.all([
    fetchCustomBackendError('2222', $t('page.function.request.repeatedErrorMsg1')),
    fetchCustomBackendError('2222', $t('page.function.request.repeatedErrorMsg1')),
    fetchCustomBackendError('2222', $t('page.function.request.repeatedErrorMsg1')),
    fetchCustomBackendError('3333', $t('page.function.request.repeatedErrorMsg2')),
    fetchCustomBackendError('3333', $t('page.function.request.repeatedErrorMsg2')),
    fetchCustomBackendError('3333', $t('page.function.request.repeatedErrorMsg2'))
  ]);
}

async function handleRepeatedModalError() {
  await Promise.all([
    fetchCustomBackendError('7777', $t('request.logoutWithModalMsg')),
    fetchCustomBackendError('7777', $t('request.logoutWithModalMsg')),
    fetchCustomBackendError('7777', $t('request.logoutWithModalMsg'))
  ]);
}
</script>

<template>
  <NSpace vertical :size="16">
    <NCard :title="$t('request.logout')" :bordered="false" size="small" segmented class="card-wrapper">
      <NButton @click="logout">{{ $t('common.trigger') }}</NButton>
    </NCard>
    <NCard :title="$t('request.logoutWithModal')" :bordered="false" size="small" segmented class="card-wrapper">
      <NButton @click="logoutWithModal">{{ $t('common.trigger') }}</NButton>
    </NCard>
    <NCard :title="$t('request.refreshToken')" :bordered="false" size="small" segmented class="card-wrapper">
      <NButton @click="refreshToken">{{ $t('common.trigger') }}</NButton>
    </NCard>
    <NCard
      :title="$t('page.function.request.repeatedErrorOccurOnce')"
      :bordered="false"
      size="small"
      segmented
      class="card-wrapper"
    >
      <NButton @click="handleRepeatedMessageError">{{ $t('page.function.request.repeatedError') }}(Message)</NButton>
      <NButton class="ml-12px" @click="handleRepeatedModalError">
        {{ $t('page.function.request.repeatedError') }}(Modal)
      </NButton>
    </NCard>
  </NSpace>
</template>

<style scoped></style>
