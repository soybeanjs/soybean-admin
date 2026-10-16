<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { SButton, SCard, SForm } from '@vean/ui';

/** manage 页搜索卡外壳（P3-03） 详见 docs/v3-notes.md N-039。 */
defineOptions({ name: 'ManageSearch' });

const props = withDefaults(
  defineProps<{
    /** 提交回调（通常是页面 `useForm` 的 `handleSubmit`） */
    submit: () => void;
    /** 查询请求进行中 */
    loading?: boolean;
    /** 栅格类名，默认 4 列并按断点收敛 */
    gridClass?: string;
  }>(),
  {
    loading: false,
    gridClass: 'cols-4 lt-xl:cols-3 lt-md:cols-2 lt-sm:cols-1'
  }
);

const emit = defineEmits<{
  reset: [];
}>();

const { t } = useI18n();

function onSubmit() {
  props.submit();
}

function onReset() {
  emit('reset');
}
</script>

<template>
  <SCard :title="t('manage.search')" :ui="{ content: 'max-h-70 lt-md:max-h-45 overflow-auto' }">
    <SForm class="grid gap-x-4 gap-y-6" :class="props.gridClass" @submit.prevent="onSubmit">
      <slot />

      <div class="flex items-end justify-end gap-3">
        <SButton type="button" variant="outline" @click="onReset">
          {{ t('common.reset') }}
        </SButton>
        <SButton type="submit" :loading="props.loading">
          {{ t('common.search') }}
        </SButton>
      </div>
    </SForm>
  </SCard>
</template>
