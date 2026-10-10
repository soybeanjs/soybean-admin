<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { SCard } from '@vean/ui';

defineOptions({ name: 'HomeCreativityBanner' });

const { t } = useI18n();
</script>

<template>
  <SCard size="sm" class="h-full" :title="t('page.home.creativity')">
    <div class="h-72 flex-center">
      <span class="i-lucide:palette text-primary text-160px opacity-20" />
    </div>
  </SCard>
</template>
