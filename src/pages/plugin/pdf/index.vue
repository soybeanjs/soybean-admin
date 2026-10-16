<script setup lang="ts">
import { computed, ref, shallowRef } from 'vue';
import { useI18n } from 'vue-i18n';
import VuePdfEmbed from 'vue-pdf-embed';
import { SCard, SCheckbox, SPagination, SScrollArea, SSkeleton, SButtonIcon, STooltip } from '@vean/ui';

/** 与 v2 的差异： 详见 docs/v3-notes.md N-368。 */
defineOptions({ name: 'PluginPdf' });

const { t } = useI18n();

const SOURCE =
  'https://xiaoxian521.github.io/hyperlink/pdf/Cookie%E5%92%8CSession%E5%8C%BA%E5%88%AB%E7%94%A8%E6%B3%95.pdf';
const ROTATIONS = [0, 90, 180, 270] as const;
const SKELETON_ROWS = 12;

const pdfRef = shallowRef<InstanceType<typeof VuePdfEmbed> | null>(null);

const loading = ref(true);
const showAllPages = ref(false);
const currentPage = ref(1);
const pageCount = ref(1);
const currentRotation = ref(0);

/** 旋转角度：按 0 → 90 → 180 → 270 循环 */
const rotation = computed(() => ROTATIONS[currentRotation.value]);

/** 单页模式下 `page` 生效；全页模式传 `undefined` 让组件铺开所有页 */
const visiblePage = computed(() => (showAllPages.value ? undefined : currentPage.value));

function endLoading() {
  loading.value = false;
}

function onPdfRendered() {
  endLoading();

  if (pdfRef.value?.doc) {
    pageCount.value = pdfRef.value.doc.numPages;
  }
}

function rotate() {
  currentRotation.value = (currentRotation.value + 1) % ROTATIONS.length;
}

async function print() {
  await pdfRef.value?.print(undefined, 'test.pdf', true);
}

async function download() {
  await pdfRef.value?.download('test.pdf');
}

definePage({
  meta: {
    title: 'PDF 预览',
    i18nKey: 'route.pluginPdf',
    icon: 'mdi:file-pdf-box',
    order: 50,
    menuParent: 'PluginIndex'
  }
});
</script>

<template>
  <div class="flex flex-col gap-4">
    <SCard :title="t('plugin.pdf')" :description="t('plugin.pluginTip')">
      <template #extra>
        <div class="flex items-center gap-2">
          <SCheckbox v-model="showAllPages">{{ t('plugin.pdfShowAll') }}</SCheckbox>
          <STooltip :content="t('plugin.pdfRotate')">
            <SButtonIcon icon="mdi:rotate-right" variant="ghost" size="sm" @click="rotate" />
          </STooltip>
          <STooltip :content="t('plugin.pdfPrint')">
            <SButtonIcon icon="mdi:printer" variant="ghost" size="sm" @click="print" />
          </STooltip>
          <STooltip :content="t('plugin.pdfDownload')">
            <SButtonIcon icon="mdi:download" variant="ghost" size="sm" @click="download" />
          </STooltip>
        </div>
      </template>

      <SScrollArea class="max-h-150">
        <div v-if="loading" class="flex flex-col gap-3">
          <SSkeleton v-for="row in SKELETON_ROWS" :key="row" class="h-8 w-full" />
        </div>

        <VuePdfEmbed
          ref="pdfRef"
          :class="{ 'h-0 overflow-hidden': loading }"
          :rotation="rotation"
          :page="visiblePage"
          :source="SOURCE"
          @rendered="onPdfRendered"
        />
      </SScrollArea>

      <div class="mt-4 flex justify-center">
        <span v-if="showAllPages" class="text-sm opacity-70">{{ t('plugin.pdfPageCount', { count: pageCount }) }}</span>
        <SPagination v-else v-model:page="currentPage" :total="pageCount" :page-size="1" />
      </div>
    </SCard>
  </div>
</template>
