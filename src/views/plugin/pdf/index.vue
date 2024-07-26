<script setup lang="ts">
import { ref, shallowRef } from 'vue';
import VuePdfEmbed from 'vue-pdf-embed';
import { useLoading } from '@sa/hooks';

const { loading, endLoading } = useLoading(true);

const pdfRef = shallowRef<InstanceType<typeof VuePdfEmbed> | null>(null);
const source = `https://xiaoxian521.github.io/hyperlink/pdf/Cookie%E5%92%8CSession%E5%8C%BA%E5%88%AB%E7%94%A8%E6%B3%95.pdf`;

const showAllPages = ref(false);
const currentPage = ref<undefined | number>(1);
const pageCount = ref(1);

function onPdfRendered() {
  endLoading();

  if (pdfRef.value?.doc) {
    pageCount.value = pdfRef.value.doc.numPages;
  }
}

function showAllPagesChange() {
  currentPage.value = showAllPages.value ? undefined : 1;
}

const rotations = [0, 90, 180, 270];
const currentRotation = ref(0);

function handleRotate() {
  currentRotation.value = (currentRotation.value + 1) % 4;
}

async function handlePrint() {
  await pdfRef.value?.print(undefined, 'test.pdf', true);
}

async function handleDownload() {
  await pdfRef.value?.download('test.pdf');
}
</script>

<template>
  <div class="overflow-hidden">
    <NCard title="PDF 预览" :bordered="false" class="h-full card-wrapper" content-class="overflow-hidden">
      <div class="h-full flex-col-stretch">
        <GithubLink link="https://github.com/hrynko/vue-pdf-embed" />
        <WebSiteLink label="文档地址：" link="https://www.npmjs.com/package/vue-pdf-embed" />
        <div class="flex-y-center justify-end gap-12px">
          <NCheckbox v-model:checked="showAllPages" @update:checked="showAllPagesChange">显示所有页面</NCheckbox>
          <ButtonIcon tooltip-content="旋转90度" @click="handleRotate">
            <icon-material-symbols-light:rotate-90-degrees-ccw-outline-rounded />
          </ButtonIcon>
          <ButtonIcon tooltip-content="打印" @click="handlePrint">
            <icon-mdi:printer />
          </ButtonIcon>
          <ButtonIcon tooltip-content="下载" @click="handleDownload">
            <icon-charm:download />
          </ButtonIcon>
        </div>
        <NScrollbar class="flex-1-hidden">
          <NSkeleton v-if="loading" size="small" class="mt-12px" text :repeat="12" />
          <VuePdfEmbed
            ref="pdfRef"
            class="overflow-auto container"
            :class="{ 'h-0': loading }"
            :rotation="rotations[currentRotation]"
            :page="currentPage"
            :source="source"
            @rendered="onPdfRendered"
          />
        </NScrollbar>
        <div class="flex-y-center justify-between">
          <div v-if="showAllPages" class="text-18px font-medium">共{{ pageCount }}页</div>
          <NPagination v-else v-model:page="currentPage" :page-count="pageCount" :page-size="1" />
        </div>
      </div>
    </NCard>
  </div>
</template>

<style scoped></style>
