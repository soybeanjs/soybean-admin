import { defineStore } from 'pinia';
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { SetupStoreId } from '@/enum';
import { localStg } from '@/utils/storage';

export const usePanStore = defineStore(SetupStoreId.Pan, () => {
  const fileShowMode = ref<UnionKey.FileListMode>(localStg.get('fileShowMode') || 'grid');
  const currentPath = ref<string[]>([]);

  // 切换文件列表视图的方法
  const toggleFileShowMode = (mode: UnionKey.FileListMode) => {
    fileShowMode.value = mode;
    localStg.set('fileShowMode', mode);
  };

  // 初始化路径
  const initPathFromRoute = (pathStr?: string) => {
    if (!pathStr) {
      currentPath.value = [];
      return;
    }
    const pathArr = pathStr.split('/');
    pathArr.shift();
    currentPath.value = pathArr;
  };

  // 带路由更新的导航方法
  const navigateTo = async (path: string[]) => {
    const router = useRouter();
    currentPath.value = path;

    // 更新路由（使用 replace 避免产生多余历史记录）
    await router.replace({ query: { path: path.length ? `/${path.join('/')}` : undefined } });
  };

  // 进入文件夹方法
  const enterFolder = async (folderName: string) => {
    await navigateTo([...currentPath.value, folderName]);
  };

  // 返回上级方法
  const backToParent = async () => {
    if (currentPath.value.length > 0) {
      await navigateTo(currentPath.value.slice(0, -1));
    }
  };

  return {
    currentPath,
    initPathFromRoute,
    navigateTo,
    enterFolder,
    backToParent,
    fileShowMode,
    toggleFileShowMode
  };
});
