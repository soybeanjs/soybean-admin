<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { useSvgIcon } from '@/hooks/common/icon';
import { usePanStore } from '@/store/modules/pan';
import { fetchGetFileList } from '@/service/api/pan';
import FilePath from '../components/file-path.vue';
import FileGrid from '../components/file-grid.vue';
import FileList from '../components/file-list.vue';

defineOptions({
  name: 'FileMain'
});
const { SvgIconVNode } = useSvgIcon();
const panStore = usePanStore();

const globalUploaderRef = ref();

// 是否是批量操作
const isBatchMode = ref<boolean>(false);
// 是否是加载的状态
const show = ref(false);

// 文件列表数据
const fileList = ref<App.Global.FileItem[]>([]);

// 获取当前文件列表的展示模式
const currentMode = computed(() => panStore.fileShowMode);

// 切换展示模式
const toggleMode = () => {
  const newMode = currentMode.value === 'grid' ? 'list' : 'grid';
  panStore.toggleFileShowMode(newMode);
};

// 点击上传文件按钮的回调
const handleFileUpload = () => {
  globalUploaderRef.value?.handleFileUpload();
};

// 点击上传文件夹按钮的回调
const handleFolderUpload = () => {
  globalUploaderRef.value?.handleFolderUpload();
};

// 打开传输列表面板
const handleOpenPanel = () => {
  globalUploaderRef.value?.openPanelShow();
};

const uploadOptions = [
  {
    key: 'file',
    label: '上传文件',
    icon: SvgIconVNode({ localIcon: 'upload-file', fontSize: 25 }),
    props: {
      onClick: () => {
        handleFileUpload();
      }
    }
  },
  {
    key: 'folder',
    label: '上传文件夹',
    icon: SvgIconVNode({ localIcon: 'upload-folder', fontSize: 20 }),
    props: {
      onClick: () => {
        handleFolderUpload();
      }
    }
  }
];

// 获取文件列表
async function getListData() {
  const { data: fileListData, error } = await fetchGetFileList();
  if (!error) {
    fileList.value = fileListData;
  }
}

onMounted(async () => {
  // 向后端发起请求获取文件列表
  await getListData();
});
</script>

<template>
  <div class="h-full flex-col overflow-hidden">
    <NCard class="h-full">
      <GlobalUploader ref="globalUploaderRef" />
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
                <NButton @click="handleOpenPanel">
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
      <div>
        <NSpin :show="show" class="box-border h-full flex-col px-0 py-16px">
          <!--文件列表--宫格模式-->
          <FileGrid
            v-show="fileList.length > 0 && currentMode === 'grid'"
            :data="fileList"
            :is-batch-mode="isBatchMode"
          />
          <!-- 文件列表-列表模式 -->
          <FileList v-show="fileList.length && currentMode === 'list'" :data="fileList" :is-batch-mode="isBatchMode" />
          <NCard
            v-show="!fileList.length"
            size="huge"
            class="h-full flex-center gap-12px"
            content-style="height: 100%; display: flex; flex-direction: column"
          >
            <img class="h-200px" src="@/assets/imgs/no-items-tip.png" />
            <span class="text-20px">目前该目录下面啥也没有！</span>
          </NCard>
        </NSpin>
      </div>
    </NCard>
  </div>
</template>

<style scoped></style>
