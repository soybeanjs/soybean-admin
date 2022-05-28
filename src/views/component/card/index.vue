<template>
  <div>
    <n-card title="卡片" class="h-full shadow-sm rounded-16px">
      <n-space :vertical="true">
        <n-card title="基本用法">
          <p class="pb-16px">基础卡片</p>
          <n-card title="卡片">卡片内容</n-card>
        </n-card>
        <n-card title="尺寸">
          <p class="pb-16px">卡片有 small、medium、large、huge 尺寸。</p>
          <n-space vertical>
            <n-card title="小卡片" size="small">卡片内容</n-card>
            <n-card title="中卡片" size="medium">卡片内容</n-card>
            <n-card title="大卡片" size="large">卡片内容</n-card>
            <n-card title="超大卡片" size="huge">卡片内容</n-card>
          </n-space>
        </n-card>
        <n-card title="文本按钮">
          <p class="pb-16px">
            content 和 footer 可以被 hard 或 soft 分段，action 可以被分段。分段分割线会在区域的上方出现。
          </p>
          <n-card
            title="卡片分段示例"
            :segmented="{
              content: true,
              footer: 'soft'
            }"
          >
            <template #header-extra>#header-extra</template>
            卡片内容
            <template #footer>#footer</template>
            <template #action>#action</template>
          </n-card>
        </n-card>
      </n-space>
    </n-card>
  </div>
</template>

<script setup lang="ts"></script>

<style scoped></style>
