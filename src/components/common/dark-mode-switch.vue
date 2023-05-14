<template>
  <div class="flex-center text-18px cursor-pointer" @click="handleSwitch">
    <icon-mdi-moon-waning-crescent v-if="darkMode" />
    <icon-mdi-white-balance-sunny v-else />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

defineOptions({ name: 'DarkModeSwitch' });

interface Props {
  /** 暗黑模式 */
  dark?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  dark: false
});

interface Emits {
  (e: 'update:dark', darkMode: boolean): void;
}

const emit = defineEmits<Emits>();

const darkMode = computed({
  get() {
    return props.dark;
  },
  set(newValue: boolean) {
    emit('update:dark', newValue);
  }
});

function handleSwitch(event: MouseEvent) {
  const x = event.clientX;
  const y = event.clientY;
  const endRadius = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y));
  // @ts-expect-error: Transition API
  if (!document.startViewTransition) {
    darkMode.value = !darkMode.value;
    return;
  }
  // @ts-expect-error: Transition API
  const transition = document.startViewTransition(() => {
    darkMode.value = !darkMode.value;
  });
  transition.ready.then(() => {
    const clipPath = [`circle(0px at ${x}px ${y}px)`, `circle(${endRadius}px at ${x}px ${y}px)`];
    document.documentElement.animate(
      {
        clipPath: darkMode.value ? clipPath : [...clipPath].reverse()
      },
      {
        duration: 300,
        easing: 'ease-in',
        pseudoElement: darkMode.value ? '::view-transition-new(root)' : '::view-transition-old(root)'
      }
    );
  });
}
</script>

<style>
::view-transition-old(root),
::view-transition-new(root) {
  animation: none;
  mix-blend-mode: normal;
}
::view-transition-old(root) {
  z-index: 9999;
}
::view-transition-new(root) {
  z-index: 1;
}
.dark::view-transition-old(root) {
  z-index: 1;
}
.dark::view-transition-new(root) {
  z-index: 9999;
}
</style>
