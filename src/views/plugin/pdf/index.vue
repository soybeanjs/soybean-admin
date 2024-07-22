<script setup lang="ts">
import VuePdfEmbed from 'vue-pdf-embed';
import { ref } from 'vue';
import type { ShallowRef } from 'vue';
import type { PDFDocumentProxy } from 'pdfjs-dist/types/src/display/api';
import { useLoading } from '@sa/hooks';

interface PDFProps {
  doc: ShallowRef<PDFDocumentProxy | null>;
  download: (filename: string) => Promise<void>;
  print: (dpi?: number, filename?: string, allPages?: boolean) => Promise<void>;
}

const rotations = [0, 90, 180, 270];

const source =
  'https://xiaoxian521.github.io/hyperlink/pdf/Cookie%E5%92%8CSession%E5%8C%BA%E5%88%AB%E7%94%A8%E6%B3%95.pdf';

const { loading, endLoading } = useLoading(true);

const currentRotation = ref(0);

const pdfRef = ref<PDFProps | null>(null);

const currentPage = ref<undefined | number>(1);

const pageCount = ref(1);

const showAllPages = ref(false);

function handleDocumentRender() {
  endLoading();
  if (pdfRef.value?.doc) pageCount.value = pdfRef.value.doc.numPages;
}

function rotate() {
  currentRotation.value = (currentRotation.value + 1) % 4;
}

function handlePrint() {
  pdfRef.value?.print(undefined, 'test.pdf', true);
}

function showAllPagesChange() {
  currentPage.value = showAllPages.value ? undefined : 1;
}

function handleDownload() {
  pdfRef.value?.download('test.pdf');
}
</script>

<template>
  <div>
    <NCard title="PDF 预览" content-class="flex-col-stretch" :bordered="false" class="h-full card-wrapper">
      <NSpace :vertical="true">
        <GithubLink link="https://github.com/hrynko/vue-pdf-embed" />
        <WebSiteLink label="文档地址：" link="https://www.npmjs.com/package/vue-pdf-embed" />
        <NFlex justify="end">
          <NSpace align="center">
            <NCheckbox v-model:checked="showAllPages" @update:checked="showAllPagesChange">显示所有页面</NCheckbox>
            <ButtonIcon tooltip-content="旋转90度" @click="rotate">
              <icon-material-symbols-light:rotate-90-degrees-ccw-outline-rounded />
            </ButtonIcon>

            <ButtonIcon tooltip-content="打印" @click="handlePrint">
              <icon-mdi:printer />
            </ButtonIcon>

            <ButtonIcon tooltip-content="下载" @click="handleDownload">
              <icon-charm:download />
            </ButtonIcon>
          </NSpace>
        </NFlex>
      </NSpace>

      <NScrollbar class="my-8px flex-grow flex-basis-0 overflow-hidden">
        <NSkeleton v-if="loading" size="small" class="mt-12px" text :repeat="12" />

        <VuePdfEmbed
          ref="pdfRef"
          class="overflow-auto container"
          :class="{ 'h-0': loading }"
          :rotation="rotations[currentRotation]"
          :page="currentPage"
          :source="source"
          @rendered="handleDocumentRender"
        />
      </NScrollbar>

      <div class="flex items-center justify-between">
        <div v-if="showAllPages" class="text-18px font-medium">共{{ pageCount }}页</div>
        <NPagination v-else v-model:page="currentPage" :page-count="pageCount" :page-size="1" />
      </div>
    </NCard>
  </div>
</template>

<style scoped></style>
