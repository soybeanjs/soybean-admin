<script setup lang="tsx">
import { $t } from '@/locales';
import type { SelectMixedOption } from '@/utils/selectTypes';
import { transformRecordToOption, translateOptions } from '@/utils/common';

interface Emits {
  (e: 'reset'): void;
  (e: 'search'): void;
}

const emit = defineEmits<Emits>();

const model = defineModel<any>('model', { required: true });

const rule = defineModel<any>('rule', { required: true });

function reset() {
  emit('reset');
}

function search() {
  emit('search');
}

function recordToOptions(optionsRecord: Record<string, App.I18n.I18nKey>): SelectMixedOption[] {
  if (!optionsRecord || Object.keys(optionsRecord).length === 0) {
    return [];
  }
  const anyOptions = transformRecordToOption(optionsRecord);
  return translateOptions(anyOptions);
}
</script>

<template>
  <NCard :bordered="false" size="small" class="card-wrapper">
    <NForm :model="model" label-placement="left">
      <NGrid responsive="screen" item-responsive>
        <NFormItemGi v-for="item in rule" :key="item.model" span="24 s:5 m:5" :label="$t(item.label)" class="pr-24px">
          <NInput v-if="!item.options" v-model:value="model[item.model]" :placeholder="$t(item.placeholder)" />
          <NSelect
            v-else
            v-model:value="model[item.model]"
            :placeholder="$t(item.placeholder) === '' ? '' : $t(item.placeholder)"
            filterable
            autocomplete="off"
            clearable
            :options="recordToOptions(item.options)"
          ></NSelect>
        </NFormItemGi>
        <NFormItemGi span="24 s:6 m:6">
          <NSpace class="w-full" justify="end">
            <NButton type="primary" ghost @click="search">
              <template #icon>
                <icon-ic-round-search class="text-icon" />
              </template>
              {{ $t('common.search') }}
            </NButton>
            <NButton @click="reset">
              <template #icon>
                <icon-ic-round-refresh class="text-icon" />
              </template>
              {{ $t('common.reset') }}
            </NButton>
          </NSpace>
        </NFormItemGi>
      </NGrid>
    </NForm>
  </NCard>
</template>

<style scoped></style>
