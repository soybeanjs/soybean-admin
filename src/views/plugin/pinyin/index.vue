<script setup lang="ts">
import { html } from 'pinyin-pro';
</script>

<template>
  <div class="h-full">
    <NCard title="pinyin 插件" :bordered="false" class="h-full card-wrapper" content-style="overflow:hidden">
      <NSpace :vertical="true">
        <GithubLink link="https://github.com/zh-lx/pinyin-pro" />
        <WebSiteLink label="文档地址：" link="https://pinyin-pro.cn/" />
      </NSpace>

      <NDivider title-placement="left">常规使用</NDivider>
      <p v-html="html('soybean 是一个清新优雅、高颜值且功能强大的后台管理模板')" />
      <NDivider title-placement="left">不带音调</NDivider>
      <p v-html="html('soybean 是一个清新优雅、高颜值且功能强大的后台管理模板', { toneType: 'none' })" />
      <NDivider title-placement="left">自定义样式</NDivider>
      <p class="custom-style" v-html="html('soybean 是一个清新优雅、高颜值且功能强大的后台管理模板')" />
    </NCard>
  </div>
</template>

<style lang="scss" scoped>
.custom-style {
  /* 汉字的样式 */
  :deep(.py-chinese-item) {
    color: #646cff;
  }

  /* 拼音的样式 */
  :deep(.py-pinyin-item) {
    color: #06b6d4;
  }
}
</style>
