<script setup lang="ts">
import { $t } from '@/locales';

defineOptions({
  name: 'ReloadButton'
});

defineProps<Props>();

interface Props {
  loading?: boolean;
}
</script>

<template>
  <ButtonIcon :tooltip-content="$t('icon.reload')">
    <IconAntDesignReloadOutlined :class="{ 'animate-spin animate-duration-750': loading }" />
  </ButtonIcon>
</template>

<style scoped></style>
