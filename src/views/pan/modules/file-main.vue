<script setup lang="ts">
import { computed, ref } from 'vue';
import { useSvgIcon } from '@/hooks/common/icon';
import { usePanStore } from '@/store/modules/pan';
import FilePath from '../components/file-path.vue';
defineOptions({
  name: 'FileMain'
});
const { SvgIconVNode } = useSvgIcon();
const panStore = usePanStore();

// 是否是批量操作
const isBatchMode = ref<boolean>(false);
// 是否是加载的状态
const show = ref(false);

// 获取当前文件列表的展示模式
const currentMode = computed(() => panStore.fileShowMode);

// 切换展示模式
const toggleMode = () => {
  const newMode = currentMode.value === 'grid' ? 'list' : 'grid';
  panStore.toggleFileShowMode(newMode);
};

const uploadOptions = [
  {
    key: 'file',
    label: '上传文件',
    icon: SvgIconVNode({ localIcon: 'upload-file', fontSize: 20 }),
    props: {
      onClick: () => {
        // handleFileUpload();
        window.$message?.info('上传文件功能');
      }
    }
  },
  {
    key: 'folder',
    label: '上传文件夹',
    icon: SvgIconVNode({ localIcon: 'upload-folder', fontSize: 20 }),
    props: {
      onClick: () => {
        // handleFolderUpload();
        window.$message?.info('上传文件夹功能');
      }
    }
  }
];
</script>

<template>
  <div class="h-full flex-col overflow-hidden">
    <NCard class="h-full">
      <FilePath />
      <NSpace justify="space-between" class="mt-10px">
        <NSpace>
          <!--上传操作按钮-->
          <NDropdown trigger="click" :options="uploadOptions">
            <NButton type="primary" round>
              <template #icon>
                <icon-ic:outline-file-upload />
              </template>
              上传
            </NButton>
          </NDropdown>

          <!--搜索框-->
          <NInputGroup>
            <NSelect class="w-150px"></NSelect>
            <NInput placeholder="请输入关键词..."></NInput>
            <NButton type="primary">
              <template #icon>
                <icon-uil-search />
              </template>
              搜索
            </NButton>
          </NInputGroup>
        </NSpace>
        <!--右侧按钮及功能-->
        <NSpace>
          <NButton v-if="isBatchMode" type="error">
            <template #icon>
              <icon-meteor-icons:trash-can />
            </template>
          </NButton>
          <NButton type="primary" @click="isBatchMode = !isBatchMode">
            <template #icon>
              <icon-fluent:multiselect-20-filled />
            </template>
            <template #default>{{ isBatchMode ? '取消批量' : '批量操作' }}</template>
          </NButton>
          <NButtonGroup>
            <NTooltip placement="bottom" trigger="hover">
              <template #trigger>
                <NButton>
                  <template #icon>
                    <icon-cuida:swap-vertical-arrows-outline />
                  </template>
                </NButton>
              </template>
              <span>传输列表</span>
            </NTooltip>
            <NTooltip placement="bottom" trigger="hover">
              <template #trigger>
                <NButton>
                  <template #icon>
                    <icon-tabler:filter />
                  </template>
                </NButton>
              </template>
              <span>排序</span>
            </NTooltip>
            <NTooltip placement="bottom" trigger="hover">
              <template #trigger>
                <NButton @click="toggleMode">
                  <template #icon>
                    <icon-material-symbols:apps v-if="currentMode === 'grid'" />
                    <icon-mdi:format-list-bulleted v-else />
                  </template>
                </NButton>
              </template>
              <span>视图</span>
            </NTooltip>
          </NButtonGroup>
        </NSpace>
      </NSpace>

      <!--文件列表--宫格模式-->
      <NSpin :show="show" class="box-border flex-col px-0 py-16px">
        <FileGrid />
      </NSpin>
    </NCard>
  </div>
</template>

<style scoped></style>
