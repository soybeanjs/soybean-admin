<script lang="ts" setup>
import { onMounted, ref } from 'vue';
import TypeIt from 'typeit';
import type { Options } from 'typeit';
import type { El } from 'typeit/dist/types';
const text = ref<HTMLSpanElement | null>(null);

const options: Options = {
  strings: 'SoybeanAdmin是一个清新优雅、高颜值且功能强大的后台管理模板',
  lifeLike: true,
  speed: 120,
  loop: true
};

function init() {
  const initTypeIt = new TypeIt(text.value as El, options);
  initTypeIt.go();
}

onMounted(() => {
  init();
});
</script>

<template>
  <div>
    <NCard title="打字机 插件" :bordered="false" class="h-full card-wrapper">
      <NSpace :vertical="true">
        <GithubLink link="https://github.com/alexmacarthur/typeit" />
        <WebSiteLink label="文档地址：" link="https://www.typeitjs.com/docs/vanilla/usage/" />
      </NSpace>
      <NDivider title-placement="left">基本示例</NDivider>
      <span ref="text" class="msg text-18px"></span>
    </NCard>
  </div>
</template>

<style scoped>
.msg ::v-deep .ti-cursor {
  margin-left: 4px;
}
</style>
