<script setup lang="ts">
import type { ComponentPublicInstance } from 'vue';
import { h, nextTick, onMounted, ref } from 'vue';
import type { UploadFile } from 'vue-simple-uploader';
import { NButton } from 'naive-ui';
import { fetchCheckFile, fetchUploadFolder, simpleUploadURL } from '@/service/api/pan';
import { localStg } from '@/utils/storage';
import { usePanStore } from '@/store/modules/pan';

defineOptions({
  name: 'GlobalUploader'
});

const panStore = usePanStore();

/** 数据定义 */
const uploaderRef = ref();
const showUploader = ref(true);
const dragover = ref(false);
const enableDragUpload = ref(false);
const isPanelShow = ref(false);
const fileListLength = ref(0);
const process = ref(-10);
const uploadBtnRef = ref<ComponentPublicInstance | null>(null);
const folderBtnRef = ref<ComponentPublicInstance | null>(null);

/** 上传组件的配置 */
const options = {
  target: simpleUploadURL, // 上传地址
  headers: {
    Authorization: `Bearer ${localStg.get('token')}` // 上传请求头
  },
  chunkSize: localStg.get('uploaderChunkSize') || 1024 * 1024, // 分片大小
  forceChunkSize: true, // 是否强制所有的块都是小于等于 chunkSize 的值。默认是 false。
  // fileParameterName: 'file', // 上传文件时文件的参数名，默认file
  maxChunkRetries: 3, // 最大自动失败重试上传次数
  simultaneousUploads: 3, // 并发上传数
  testChunks: true, // 是否开启服务器分片校验
  // 服务器分配校验函数，秒传及断点续传基础函数
  checkChunkUploadedByResponse(chunk: any, message: any) {
    const objMessage = JSON.parse(message);
    const res = objMessage.data;
    if (!res) {
      return [];
    }
    if (res.pass) {
      // 秒传
      return true;
    }
    // 断点续传
    return (res.resume || []).includes(chunk.offset + 1);
  },
  // 格式化你想要剩余时间
  parseTimeRemaining(parsedTimeRemaining: string) {
    return parsedTimeRemaining
      .replace(/\syears?/, '年')
      .replace(/\days?/, '天')
      .replace(/\shours?/, '小时')
      .replace(/\sminutes?/, '分钟')
      .replace(/\sseconds?/, '秒');
  },
  query() {}
};

/** 上传状态文本 */
const statusText = {
  success: '上传成功',
  error: '上传失败',
  uploading: '正在上传',
  paused: '已暂停',
  waiting: '等待中'
};

// 限制上传文件的类型
const attrs = {
  accept: '*'
};

// 点击上传文件的方法
const handleFileUpload = () => {
  if (uploadBtnRef.value) {
    uploadBtnRef.value?.$el.click();
  }
};

// 点击上传文件夹的方法
const handleFolderUpload = () => {
  if (folderBtnRef.value) {
    folderBtnRef.value?.$el.click();
  }
};

// 文件上传前的方法
const handleUploadBefore = async (files: UploadFile[], uploadParams?: any) => {
  if (!files || files.length === 0) {
    window.$message?.warning('没有选择要上传的文件');
    return;
  }
  // 更新文件列表长度
  fileListLength.value = window.$uploader?.fileList.length || 0;
  // 处理文件夹上传
  const filePaths = window.$uploader?.filePaths || {};
  const paths = Object.keys(filePaths);
  if (paths.length > 0) {
    try {
      // 收集所有文件夹信息，一次性发送给后端
      const folderStructure = paths.map(path => {
        const folder = filePaths[path];
        return {
          path: folder.parent.path,
          name: folder.name,
          fullPath: folder.parent.path ? `${folder.parent.path}${folder.name}` : folder.name
        };
      });

      // 向后端发送完整的文件夹结构信息
      await fetchUploadFolder({
        isFolder: true,
        currentDirectory: panStore.currentPath as string,
        folderStructure // 传递完整的文件夹结构给后端
      });
      // 所有文件夹创建完成后，开始上传文件
      if (uploadParams) {
        // 处理特殊上传模式（智能合并或重命名）
        if (uploadParams.mergeMode === 'smart') {
          window.$message?.success('使用智能合并模式上传文件');
        } else if (uploadParams.renameMode === 'auto') {
          window.$message?.success('使用自动重命名模式上传文件');
        }
      }
    } catch (error) {
      window.$message?.error(`上传文件夹时出现错误：${error}`);
    }
  }

  // 上传文件
  files.forEach(_file => {
    Object.assign(window.$uploader?.opts, {
      query: {
        isFolder: false,
        currentPath: panStore.currentPath,
        ...(uploadParams || {})
      }
    });
  });
  // Dom更新完成，开始上传
  nextTick(() => {
    window.$uploader?.resume();
  });
};

// 取消上传的方法
const hanldeUploadCancel = () => {
  window.$uploader?.cancel();
  window.$message?.info('还没实现取消上传的方法');
};

// 智能合并处理函数
const handleSmartMerge = (files: UploadFile[], conflicts: any[]) => {
  // 实现智能合并逻辑
  // 例如：文件夹合并内容，文件则根据修改时间或大小决定是否覆盖
  handleUploadBefore(files, { mergeMode: 'smart', conflicts });
};

// 重命名后上传处理函数
const handleRenameAndUpload = (files: UploadFile[], conflicts: any[]) => {
  // 实现自动重命名逻辑
  // 例如：为冲突文件添加后缀如 "(1)", "(2)" 等
  handleUploadBefore(files, { renameMode: 'auto', conflicts });
};
// 文件一添加就执行的方法
const handleFilesAdded = async (files: UploadFile[]) => {
  if (files.length === 0) return;
  try {
    // 遍历files得到文件名称和路径的信息
    const fileInfo = files.map(file => {
      // 使用路径分隔符分割相对路径
      const pathParts = file.relativePath.split(/[/\\]/);
      // 判断是否为文件夹上传（路径包含多级目录）
      const isFolderUpload = pathParts.length > 1;
      return {
        name: file.name,
        // 保存完整的相对路径，而不仅仅是第一级目录
        fullPath: file.relativePath,
        // 如果是文件夹上传取第一级目录，否则设为undefined
        rootPath: isFolderUpload ? pathParts[0] : undefined,
        // 保存完整的路径数组，用于后续处理
        pathParts,
        isFolder: isFolderUpload
      };
    });
    const query = {
      fileInfo,
      currentPath: panStore.currentPath
    };
    // 校验文件是否存在
    const { data: conflictData, error } = await fetchCheckFile(query);
    if (!error) {
      if (conflictData.exist) {
        window.$dialog?.warning({
          title: '提示',
          content: `文件已存在,是否覆盖？`,
          // 使用action渲染函数提供额外的按钮
          action: () => {
            return h('div', { style: 'display: flex; justify-content: center; gap: 8px;' }, [
              h(
                NButton,
                {
                  size: 'small',
                  onClick: () => handleSmartMerge(files, conflictData.conflicts || [])
                },
                { default: () => '智能合并' }
              ),
              h(
                NButton,
                {
                  size: 'small',
                  onClick: () => handleRenameAndUpload(files, conflictData.conflicts || [])
                },
                { default: () => '重命名上传' }
              ),
              h(
                NButton,
                {
                  size: 'small',
                  onClick: () => {
                    hanldeUploadCancel();
                  }
                },
                { default: () => '取消' }
              )
            ]);
          }
        });
      } else {
        handleUploadBefore(files);
      }
    }
  } catch (error) {
    window.$message?.error(`校验文件是否存在时出现错误：${error}`);
  }
};

// 关闭上传框的方法
const closePanel = () => {
  if (process.value === -10 || process.value === 100 || fileListLength.value === 0) {
    isPanelShow.value = false;
  } else {
    window.$dialog?.warning({
      title: '提示',
      content: '文件正在上传中，是否关闭上传面板？',
      positiveText: '确定',
      negativeText: '取消',
      onPositiveClick: () => {
        isPanelShow.value = false;
      }
    });
  }
};

// 打开上传框的方法
const openPanelShow = () => {
  if (isPanelShow.value) return;
  isPanelShow.value = true;
};

// 初始化上传器
const initUploader = () => {
  nextTick(() => {
    if (uploaderRef.value) {
      window.$uploader = uploaderRef.value.uploader;
    }
  });
};

defineExpose({ handleFileUpload, handleFolderUpload, openPanelShow });

onMounted(() => {
  initUploader();
});
</script>

<template>
  <div class="pos-fixed bottom-15px right-15px z-1002">
    <uploader
      v-if="showUploader"
      ref="uploaderRef"
      :options="options"
      :auto-start="false"
      :file-status-text="statusText"
      class="w-720px"
      @files-added="handleFilesAdded"
    >
      <uploader-unsupport>您的浏览器不支持上传组件</uploader-unsupport>

      <uploader-drop
        v-show="dragover && enableDragUpload"
        class="pos-fixed left-0 top-0 size-full bg-[#ffffff99] text-center"
      >
        <span class="pos-relative top-48% text-34px text-[#616161] font-700">上传文件到当前目录下</span>
      </uploader-drop>

      <uploader-btn id="global-uploader-btn" ref="uploadBtnRef" :attrs="attrs">选择文件</uploader-btn>
      <uploader-btn id="folder-uploader-btn" ref="folderBtnRef" :directory="true">选择文件夹</uploader-btn>
      <uploader-list v-show="isPanelShow">
        <template #default="props">
          <div
            class="pos-fixed bottom-[4%] right-[2%] m-auto h-300px w-720px overflow-hidden border-1 border-[#e2e2e2] rounded-7px border-solid bg-[length:100%_100%] bg-white shadow-[rgba(0,0,0,0.2)] transition-all duration-500 ease-in-out"
          >
            <div class="h-[2.8rem] flex border-b-1 border-primary border-solid p-[0px,10px]">
              <h2 class="ml-[3%] text-18px/[2.8rem]">传输列表</h2>
              <div class="flex-[1] text-align-right">
                <NButton text class="ml-0 px-5px py-16px">
                  <template #icon>
                    <icon-ep:position />
                  </template>
                </NButton>
                <NButton text class="ml-0 mr-10px px-5px py-16px" @click="closePanel">
                  <template #icon>
                    <icon-ep:circle-close />
                  </template>
                </NButton>
              </div>
            </div>
            <ul class="pos-relative m-0 max-h-300px overflow-x-hidden overflow-y-auto bg-white p-0">
              <li v-for="file in props.fileList" :key="file.id" class="bg-white">
                <uploader-file :class="'file_' + file.id" :file="file" :list="true" />
              </li>
              <div
                v-if="!props.fileList.length"
                class="pos-relative left-50% top-50% mt-100px transform-translate-x-[-50%] translate-y-[-50%] text-center text-18px"
              >
                <icon-lineicons:empty-file />
                暂无待上传文件
              </div>
            </ul>
          </div>
        </template>
      </uploader-list>
    </uploader>
  </div>
</template>

<style scoped>
/* 隐藏上传按钮 */
#global-uploader-btn {
  position: absolute;
  clip: rect(0, 0, 0, 0);
}

/* 隐藏上传按钮 */
#folder-uploader-btn {
  position: absolute;
  clip: rect(0, 0, 0, 0);
}
</style>
