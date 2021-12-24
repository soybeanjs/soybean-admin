<template>
  <NModal
    v-model:show="show"
    v-bind="getModalProps"
    :loading="loading"
    @positive-click="positiveClick"
    @negative-click="negativeClick"
  >
    {{ isFunction(props.content) ? props.content() : props.content }}
  </NModal>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue';
import { NModal } from 'naive-ui';
import type { ModalProps } from 'naive-ui';
import { omit, isFunction } from 'lodash-es';

export interface HookModalProps extends Partial<ModalProps> {
  closeModal?: () => void;
}

const props = withDefaults(defineProps<HookModalProps>(), {
  closeModal: () => {}
});

/** 重组NModal的props */
const getModalProps = computed(() => omit(props, ['onPositiveClick', 'onNegativeClick']));

const loading = ref(false);
const show = computed({
  get() {
    return props.show ?? false;
  },
  set(val: boolean) {
    if (Object.is(val, false)) {
      props.closeModal?.();
    }
  }
});

async function positiveClick() {
  loading.value = true;
  try {
    await props?.onPositiveClick?.();
    show.value = false;
  } catch (error) {
    loading.value = false;
  } finally {
    loading.value = false;
  }
}

async function negativeClick() {
  await props?.onNegativeClick?.();
  show.value = false;
}
</script>
