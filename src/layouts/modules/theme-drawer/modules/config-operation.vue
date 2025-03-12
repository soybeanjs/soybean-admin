<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import Clipboard from 'clipboard';
import { useThemeStore } from '@/store/modules/theme';
import { $t } from '@/locales';

defineOptions({
  name: 'ConfigOperation'
});

const themeStore = useThemeStore();

const domRef = ref<HTMLElement | null>(null);

function initClipboard() {
  if (!domRef.value) return;

  const clipboard = new Clipboard(domRef.value);

  clipboard.on('success', () => {
    window.$message?.success($t('theme.configOperation.copySuccessMsg'));
  });
}

function getClipboardText() {
  const reg = /"\w+":/g;

  const json = themeStore.settingsJson;

  return json.replace(reg, match => match.replace(/"/g, ''));
}

function handleReset() {
  themeStore.resetStore();

  setTimeout(() => {
    window.$message?.success($t('theme.configOperation.resetSuccessMsg'));
  }, 50);
}

const dataClipboardText = computed(() => getClipboardText());

onMounted(() => {
  initClipboard();
});
</script>

<template>
  <div class="w-full flex justify-between">
    <textarea id="themeConfigCopyTarget" v-model="dataClipboardText" class="absolute opacity-0 -z-1" />
    <NButton type="error" ghost @click="handleReset">{{ $t('theme.configOperation.resetConfig') }}</NButton>
    <div ref="domRef" data-clipboard-target="#themeConfigCopyTarget">
      <NButton type="primary">{{ $t('theme.configOperation.copyConfig') }}</NButton>
    </div>
  </div>
</template>

<style scoped></style>
