<template>
  <app-provider>
    <n-modal
      v-model:show="show"
      v-bind="getModalProps"
      :loading="loading"
      @positive-click="positiveClick"
      @negative-click="negativeClick"
    >
      <template v-if="!isVNode(SlotContent)">
        {{ SlotContent }}
      </template>
      <component :is="SlotContent" v-else />
    </n-modal>
  </app-provider>
</template>

<script lang="ts" setup>
import { computed, ref, isVNode } from 'vue';
import type { VNode } from 'vue';
import { NModal } from 'naive-ui';
import type { ModalProps } from 'naive-ui';
import { omit, isFunction } from 'lodash-es';
import AppProvider from '@/AppProvider.vue';

export interface HookModalProps extends Partial<ModalProps> {
  closeModal?: () => void;
}

const props = withDefaults(defineProps<HookModalProps>(), {
  closeModal: () => {}
});

/** 重组NModal的props */
const getModalProps = computed(() => omit(props, ['onPositiveClick', 'onNegativeClick']));
const SlotContent = computed(() => {
  if (isFunction(props.content)) {
    return isVNode(props.content()) ? (props.content() as VNode) : (props.content() as any);
  }
  return props.content as string;
});

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
