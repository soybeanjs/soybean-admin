import { defineStore } from 'pinia';
import { ref } from 'vue';
import { SetupStoreId } from '@/enum';
import { localStg } from '@/utils/storage';

export const usePanStore = defineStore(SetupStoreId.Pan, () => {
  const fileShowMode = ref<UnionKey.FileListMode>(localStg.get('fileShowMode') || 'grid');
  const currentPath = ref<string>();

  // 切换文件列表视图的方法
  const toggleFileShowMode = (mode: UnionKey.FileListMode) => {
    fileShowMode.value = mode;
    localStg.set('fileShowMode', mode);
  };

  // 初始化路径
  const initPathFromRoute = (pathStr?: string) => {
    if (!pathStr) {
      /** 从缓存中拿路径 */
      const cachePath = localStg.get('currentPath');
      if (cachePath) {
        currentPath.value = cachePath;
        return;
      }
      currentPath.value = undefined;
      return;
    }
    currentPath.value = pathStr;
    localStg.set('currentPath', pathStr);
  };

  return {
    currentPath,
    initPathFromRoute,
    fileShowMode,
    toggleFileShowMode
  };
});
