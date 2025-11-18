<script setup lang="ts">
import { $t } from '@/locales';

defineOptions({
  name: 'TableRowCheckAlert'
});

const checkedRowKeys = defineModel<CommonType.IdType[]>('checkedRowKeys', { required: true });
</script>

<template>
  <NAlert type="info">
    <span v-if="checkedRowKeys.length">
      {{ $t('common.selected') }} {{ checkedRowKeys.length }} {{ $t('common.anyRecords') }}
      <NButton class="pl-6px" text type="primary" @click="() => (checkedRowKeys = [])">
        {{ $t('common.clear') }}
      </NButton>
    </span>
    <span v-else>{{ $t('common.noSelectRecord') }}</span>
  </NAlert>
</template>

<style scoped lang="scss">
.n-alert {
  --n-padding: 5px 13px !important;
  --n-icon-margin: 6px 8px 0 12px !important;
  --n-icon-size: 20px !important;
}
</style>
