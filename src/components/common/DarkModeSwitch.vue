<template>
  <div class="flex-center text-18px hover:text-primary cursor-pointer" @click="handleSwitch">
    <icon-mdi-moon-waning-crescent v-if="darkMode" />
    <icon-mdi-white-balance-sunny v-else />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

interface Props {
  /** 暗黑模式 */
  dark?: boolean;
}

interface Emits {
  (e: 'update:dark', darkMode: boolean): void;
}

const props = withDefaults(defineProps<Props>(), {
  dark: false
});

const emit = defineEmits<Emits>();

const darkMode = computed({
  get() {
    return props.dark;
  },
  set(newValue: boolean) {
    emit('update:dark', newValue);
  }
});

function handleSwitch() {
  darkMode.value = !darkMode.value;
}
</script>
<style scoped></style>
