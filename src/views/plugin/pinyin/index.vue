<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { html } from 'pinyin-pro';
import domPurify from 'dompurify';

const domRef = ref<HTMLElement | null>(null);
const domRef2 = ref<HTMLElement | null>(null);
const domRef3 = ref<HTMLElement | null>(null);

function renderHtml() {
  if (!domRef.value || !domRef2.value || !domRef3.value) return;

  const text = 'SoybeanAdmin是一个清新优雅、高颜值且功能强大的后台管理模板';

  const code = domPurify.sanitize(html(text));
  const code2 = domPurify.sanitize(html(text, { toneType: 'none' }));

  domRef.value.innerHTML = code;
  domRef2.value.innerHTML = code2;
  domRef3.value.innerHTML = code;
}

onMounted(() => {
  renderHtml();
});
</script>

<template>
  <div>
    <NCard title="pinyin 插件" :bordered="false" class="h-full card-wrapper">
      <NSpace :vertical="true">
        <GithubLink link="https://github.com/zh-lx/pinyin-pro" />
        <WebSiteLink label="文档地址：" link="https://pinyin-pro.cn/" />
      </NSpace>
      <NDivider title-placement="left">常规使用</NDivider>
      <p ref="domRef" class="text-18px"></p>
      <NDivider title-placement="left">不带音调</NDivider>
      <p ref="domRef2" class="text-18px"></p>
      <NDivider title-placement="left">自定义样式</NDivider>
      <p ref="domRef3" class="custom-style text-18px"></p>
    </NCard>
  </div>
</template>

<style lang="scss" scoped>
.custom-style {
  :deep(.py-result-item) {
    .py-chinese-item {
      --uno: text-primary;
    }

    .py-pinyin-item {
      --uno: text-error;
    }
  }
}
</style>
