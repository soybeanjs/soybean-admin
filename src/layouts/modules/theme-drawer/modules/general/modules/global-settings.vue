<script setup lang="ts">
import { useThemeStore } from '@/store/modules/theme';
import { $t } from '@/locales';
import SettingItem from '../../../components/setting-item.vue';

defineOptions({
  name: 'GlobalSettings'
});

const themeStore = useThemeStore();
</script>

<template>
  <div class="flex-col-stretch gap-16px">
    <SettingItem :label="$t('theme.general.multilingual.visible')">
      <NSwitch v-model:value="themeStore.header.multilingual.visible" />
    </SettingItem>

    <SettingItem :label="$t('theme.general.globalSearch.visible')">
      <NSwitch v-model:value="themeStore.header.globalSearch.visible" />
    </SettingItem>

    <TransitionGroup tag="div" name="setting-list" class="flex-col-stretch gap-12px">
      <SettingItem key="1" :label="$t('theme.general.watermark.visible')">
        <NSwitch v-model:value="themeStore.watermark.visible" />
      </SettingItem>
      <SettingItem v-if="themeStore.watermark.visible" key="2" :label="$t('theme.general.watermark.enableUserName')">
        <NSwitch v-model:value="themeStore.watermark.enableUserName" />
      </SettingItem>
      <SettingItem v-if="themeStore.watermark.visible" key="3" :label="$t('theme.general.watermark.text')">
        <NInput
          v-model:value="themeStore.watermark.text"
          autosize
          type="text"
          size="small"
          class="w-120px"
          placeholder="SoybeanAdmin"
        />
      </SettingItem>
    </TransitionGroup>
  </div>
</template>

<style scoped>
.setting-list-move,
.setting-list-enter-active,
.setting-list-leave-active {
  --uno: transition-all-300;
}

.setting-list-enter-from,
.setting-list-leave-to {
  --uno: opacity-0 -translate-x-30px;
}

.setting-list-leave-active {
  --uno: absolute;
}
</style>
