<script setup lang="ts">
import { ref } from 'vue';
import { useSvgIcon } from '@/hooks/common/icon';

defineOptions({
  name: 'FileAside'
});

const { SvgIconVNode } = useSvgIcon();

const selectedKey = ref('2');

const showPersent = ref(false);

const fileMenuOptions = [
  {
    key: '1',
    label: '文件类型',
    icon: SvgIconVNode({ icon: 'uim:apps' }),
    children: [
      {
        key: '2',
        label: '全部',
        icon: SvgIconVNode({ localIcon: 'menu-file', fontSize: 28 })
      },
      {
        key: '3',
        label: '图片',
        icon: SvgIconVNode({ localIcon: 'file-image', fontSize: 28 })
      },
      {
        key: '4',
        label: '文档',
        icon: SvgIconVNode({ localIcon: 'file-txt', fontSize: 28 })
      },
      {
        key: '5',
        label: '视频',
        icon: SvgIconVNode({ localIcon: 'file-video', fontSize: 28 })
      },
      {
        key: '6',
        label: '音频',
        icon: SvgIconVNode({ localIcon: 'file-music', fontSize: 28 })
      },
      {
        key: '7',
        label: '其他',
        icon: SvgIconVNode({ localIcon: 'file-other', fontSize: 28 })
      }
    ]
  }
];
</script>

<template>
  <div class="h-full flex-col">
    <NCard
      title="文件列表"
      :bordered="false"
      size="small"
      :content-style="{ padding: 0, display: 'flex', flexDirection: 'column' }"
      class="h-full flex-1"
    >
      <template #header-extra>
        <NTooltip trigger="hover">
          <template #trigger>
            <NSwitch v-model:value="showPersent" :round="false" size="small" />
          </template>
          显示容量
        </NTooltip>
      </template>
      <NMenu v-model:value="selectedKey" :options="fileMenuOptions"></NMenu>
    </NCard>
    <div v-show="showPersent" class="mt-10px box-border">
      <NCard :bordered="false">
        <NSpace justify="center">
          <NProgress type="circle" :percentage="30" :stroke-width="5" />
          <NStatistic label="剩余容量 / 总容量" value="512GB / 1T"></NStatistic>
        </NSpace>
      </NCard>
    </div>
  </div>
</template>

<style scoped></style>
