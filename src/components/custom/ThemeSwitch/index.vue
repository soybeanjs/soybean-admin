<template>
  <div class="flex-center w-40px h-40px text-14px hover:text-primary cursor-pointer" @click="toggleDarkMode">
    <icon-mdi-moon-waning-crescent v-if="dark" />
    <icon-mdi-white-balance-sunny v-else />
  </div>
</template>

<script lang="ts" setup>
import { watch } from 'vue';
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
