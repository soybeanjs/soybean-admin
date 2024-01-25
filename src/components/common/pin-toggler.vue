<script lang="ts" setup>
import { computed } from 'vue';
import { $t } from '@/locales';

defineOptions({ name: 'PinToggler' });

interface Props {
  pin?: boolean;
}

const props = defineProps<Props>();

const icon = computed(() => (props.pin ? 'mdi-pin-off' : 'mdi-pin'));
</script>

<template>
  <ButtonIcon
    :tooltip-content="pin ? $t('icon.pin') : $t('icon.unpin')"
    tooltip-placement="bottom-start"
    trigger-parent
  >
    <SvgIcon :icon="icon" />
  </ButtonIcon>
</template>

<style scoped></style>
