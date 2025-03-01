<script setup lang="ts">
import { computed } from 'vue';

defineOptions({
  name: 'FileImage'
});
interface Props {
  data: App.Global.FileItem;
}

interface FileExtendNameIconMap {
  [key: string]: string;
}

/** 文件类型图标 Map 映射 */
const FileIcon: FileExtendNameIconMap = {
  mp3: 'file-music',
  mp4: 'file-video',
  dir: 'file-dir',
  ppt: 'file-ppt',
  doc: 'file-wps',
  docx: 'file-wps',
  xls: 'file-excel',
  xlsx: 'file-excel',
  txt: 'file-txt',
  rar: 'file-rar',
  zip: 'file-zip',
  html: 'file-html2',
  css: 'file-css2',
  md: 'file-markdown',
  js: 'file-js2',
  py: 'file-python',
  other: 'file-other' // 未知文件
};

const props = withDefaults(defineProps<Props>(), {});
/** 图片类型 */
const ImageTypes = ['jpg', 'png', 'gif', 'jpeg'];

// 是否是图片类型文件
const isImage = computed(() => {
  if (!props.data || props.data.isDir) {
    return false; // 文件夹不可能是图片
  }
  const extendName = props.data.extendName?.toLowerCase() || '';
  return ImageTypes.includes(extendName);
});

// 获取文件图标，如果是图片就显示图片
const getFileImg = computed<string>(() => {
  const extendName = props.data.extendName.toLowerCase();
  if (props.data?.isDir) {
    return FileIcon.dir;
  }
  if (ImageTypes.includes(extendName)) {
    return props.data.src;
  }
  if (!Object.keys(FileIcon).includes(extendName)) {
    return FileIcon.other;
  }
  return FileIcon[extendName];
});
</script>

<template>
  <img v-if="isImage" class="h-full w-auto object-cover transition-all duration-300" :src="props.data.src" />
  <SvgIcon v-else :local-icon="getFileImg" class="h-full w-auto object-cover transition-all duration-300" />
</template>

<style scoped></style>
