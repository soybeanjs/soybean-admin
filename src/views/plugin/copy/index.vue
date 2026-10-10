<script setup lang="ts">
import { computed, ref } from 'vue';
import { useClipboard } from '@vueuse/core';
import { useI18n } from 'vue-i18n';
import { SCard, SInput, SButton, toast } from '@vean/ui';

/**
 * 文本复制演示（P4-01）。
 *
 * 分两块：`useClipboard` 手写流程（能看清"复制了什么、失败为什么"）与
 * `@vean/ui` 的 `SClipboard` 现成按钮（属性里已带复制态与降级处理）。
 */
defineOptions({ name: 'PluginCopy' });

const { t } = useI18n();

const source = ref('SoybeanAdmin · 清新优雅、高颜值且功能强大的后台管理模板');
const { copy, isSupported, copied } = useClipboard({ source });

const canCopy = computed(() => isSupported.value && source.value.length > 0);

async function copyText() {
  if (!source.value) {
    toast.warning(t('plugin.copyEmpty'));
    return;
  }

  await copy();

  if (copied.value) {
    toast.success(t('plugin.copySuccess', { text: source.value }));
    return;
  }

  toast.error(t('plugin.copyUnsupported'));
}
</script>

<template>
  <div class="flex flex-col gap-4">
    <SCard :title="t('plugin.copy')" :description="t('plugin.copyPlaceholder')">
      <div class="flex flex-col gap-3">
        <div class="flex items-center gap-3">
          <SInput v-model="source" class="flex-1" :placeholder="t('plugin.copyPlaceholder')">
            <template #trailing>
              <span v-if="copied" class="text-xs opacity-70">copied</span>
            </template>
          </SInput>
          <SButton :disabled="!canCopy" @click="copyText">{{ t('plugin.copy') }}</SButton>
        </div>
        <p v-if="!isSupported" class="text-xs opacity-70">{{ t('plugin.copyUnsupported') }}</p>
      </div>
    </SCard>

    <SCard title="SClipboard">
      <div class="flex flex-wrap items-center gap-3">
        <SClipboard :value="source" />
        <SClipboard :value="source" variant="outline" />
        <SClipboard :value="source" only-icon />
        <SClipboard value="https://github.com/soybeanjs/soybean-admin" size="sm" variant="soft" />
      </div>
    </SCard>
  </div>
</template>
