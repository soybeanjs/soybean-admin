<template>
  <n-divider title-placement="center">{{ $t('layout.settingDrawer.themeConfiguration.title') }}</n-divider>
  <textarea id="themeConfigCopyTarget" v-model="dataClipboardText" class="absolute opacity-0" />
  <n-space vertical>
    <div ref="copyRef" data-clipboard-target="#themeConfigCopyTarget">
      <n-button type="primary" :block="true">{{ $t('layout.settingDrawer.themeConfiguration.copy') }}</n-button>
    </div>
    <n-button type="warning" :block="true" @click="handleResetConfig">
      {{ $t('layout.settingDrawer.themeConfiguration.reset') }}
    </n-button>
  </n-space>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref, watch } from 'vue';
import Clipboard from 'clipboard';
import { useThemeStore } from '@/store';
import { $t } from '@/locales';

defineOptions({ name: 'ThemeConfig' });

const theme = useThemeStore();

const copyRef = ref<HTMLElement>();

const dataClipboardText = ref(getClipboardText());

function getClipboardText() {
  return JSON.stringify(theme.$state);
}

function handleResetConfig() {
  theme.resetThemeStore();
  window.$message?.success($t('layout.settingDrawer.themeConfiguration.resetSuccess'));
}

function clipboardEventListener() {
  if (!copyRef.value) return;
  const copy = new Clipboard(copyRef.value);
  copy.on('success', () => {
    window.$dialog?.success({
      title: $t('layout.settingDrawer.themeConfiguration.operateSuccess'),
      content: $t('layout.settingDrawer.themeConfiguration.copySuccess'),
      positiveText: $t('layout.settingDrawer.themeConfiguration.confirmCopy')
    });
  });
}

const stopHandle = watch(
  () => theme.$state,
  () => {
    dataClipboardText.value = getClipboardText();
  },
  { deep: true }
);

onMounted(() => {
  clipboardEventListener();
});
onUnmounted(() => {
  stopHandle();
});
</script>

<style scoped></style>
