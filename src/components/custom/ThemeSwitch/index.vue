<template>
  <hover-container class="w-40px h-full text-14px text-[#999] hover:text-primary" @click="toggleDarkMode">
    <icon-mdi-moon-waning-crescent v-if="dark" />
    <icon-mdi-white-balance-sunny v-else />
  </hover-container>
</template>

<script lang="ts" setup>
import { watch } from 'vue';
import { HoverContainer } from '../../common';
import { useBoolean } from '@/hooks';

interface Props {
  /** 暗黑模式 */
  dark?: boolean;
}

interface Emits {
  (e: 'update', darkMode: boolean): void;
}

const props = withDefaults(defineProps<Props>(), {
  dark: false
});

const emit = defineEmits<Emits>();

const { bool: darkMode, setBool: setDarkMode, toggle: toggleDarkMode } = useBoolean(props.dark);

watch(
  () => props.dark,
  newValue => {
    setDarkMode(newValue);
  }
);
watch(darkMode, newValue => {
  emit('update', newValue);
});
</script>
<style scoped></style>
