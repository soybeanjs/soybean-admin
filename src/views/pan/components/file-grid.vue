<script setup lang="ts">
import { nextTick, ref } from 'vue';
import { useSvgIcon } from '@/hooks/common/icon';
import { fetchDeleteFile } from '@/service/api/pan';
import FileImage from './file-image.vue';

defineOptions({
  name: 'FileGrid'
});

interface Props {
  data?: App.Global.FileItem[];
  selectedFileIds?: string[];
  isBatchMode?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  data: () => [], // 文件数据
  selectedFileIds: () => [], // 批量模式下选中的文件id数组
  isBatchMode: false // 是否是批量模式
});

const emit = defineEmits<{
  (e: 'click', record: App.Global.FileItem): void;
  (e: 'select', record: App.Global.FileItem): void;
  (e: 'refresh'): void;
}>();

const showDropdown = ref(false);
const activeItemId = ref('');
const xRef = ref(0);
const yRef = ref(0);

const { SvgIconVNode } = useSvgIcon();

// 右键菜单的选项
const FileDropdownOptions = [
  {
    label: '下载',
    key: 'download',
    icon: SvgIconVNode({ icon: 'ic:baseline-file-download', fontSize: 18 })
  },
  {
    label: '分享',
    key: 'share',
    icon: SvgIconVNode({ icon: 'ic:baseline-share', fontSize: 18 })
  },
  {
    label: '删除',
    key: 'delete',
    icon: SvgIconVNode({ icon: 'ic:baseline-delete-forever', fontSize: 18 })
  },
  {
    type: 'divider',
    key: 'd1'
  },
  {
    label: '重命名',
    key: 'rename',
    icon: SvgIconVNode({ icon: 'ic:round-drive-file-rename-outline', fontSize: 18 })
  },
  {
    label: '移动到',
    key: 'move',
    icon: SvgIconVNode({ icon: 'ic:round-move-down', fontSize: 18 })
  },
  {
    label: '复制到',
    key: 'copy',
    icon: SvgIconVNode({ icon: 'ic:round-content-copy', fontSize: 18 })
  }
];

// 文件名称带后缀
const getFileName = (item: App.Global.FileItem) => {
  return `${item.name}${item.extendName ? `.${item.extendName}` : ''}`;
};

// 点击文件
const handleClickFile = (item: App.Global.FileItem) => {
  emit('click', item);
};

// 选中文件
const handleCheckFile = (item: App.Global.FileItem) => {
  emit('select', item);
};

// 点击弹出框以外
const onClickoutside = () => {
  showDropdown.value = false;
};

const handleContextMenu = (e: MouseEvent, item: App.Global.FileItem) => {
  e.preventDefault();
  showDropdown.value = false;
  nextTick().then(() => {
    showDropdown.value = true;
    xRef.value = e.clientX;
    yRef.value = e.clientY;
    activeItemId.value = item.id;
  });
};

// 右键选中触发的函数
const handleSelect = async (key: string) => {
  if (key === 'delete') {
    // 执行删除操作
    window.$dialog?.error({
      title: '删除文件',
      content: '确定要删除该文件吗？',
      positiveText: '确定',
      negativeText: '取消',
      maskClosable: false,
      onMaskClick: () => {
        window.$message?.info('点击了遮罩层,不能关闭窗口，请点击确定或者取消');
      },
      onPositiveClick: async () => {
        const { error } = await fetchDeleteFile(activeItemId.value);
        if (!error) {
          // window.$message?.success(`${res.msg}`);
          window.$message?.success('删除成功');
          emit('refresh');
        }
      }
    });
  } else {
    window.$message?.success(`点击了${key}`);
  }
};
</script>

<template>
  <div class="mt-12px flex-1 overflow-hidden">
    <NGrid cols="4 s:4 m:5 l:7 xl:8 2xl:9" x-gap="12" y-gap="12" item-responsive responsive="screen">
      <NGridItem v-for="item in props.data" :key="item.id">
        <div class="pos-relative size-full flex-center hover:bg-primary-100" @click.stop="handleClickFile(item)">
          <section
            class="pos-relative z-1 h-full max-w-100px w-76% flex-col-center overflow-hidden"
            @contextmenu="e => handleContextMenu(e, item)"
          >
            <div
              class="mt-15px h-60px w-full flex-x-center transform-gpu cursor-pointer overflow-hidden transition-transform duration-200 ease-in-out active:scale-90 hover:scale-110"
            >
              <FileImage :data="item"></FileImage>
            </div>
            <p class="mt-8px w-full overflow-hidden text-ellipsis whitespace-nowrap px-0 py-5px text-center text-12px">
              {{ getFileName(item) }}
            </p>
          </section>
          <!--勾选模式-->
          <section
            v-show="props.isBatchMode"
            class="absolute inset-0 z-9 cursor-pointer"
            :class="{
              'bg-[rgba(0,0,0,0.1)]': !props.selectedFileIds.includes(item.id),
              'bg-none': props.selectedFileIds.includes(item.id)
            }"
          >
            <NCheckbox
              :model-value="props.selectedFileIds.includes(item.id)"
              class="absolute left-1 top-1 pl-0"
              @change="handleCheckFile(item)"
            />
          </section>
        </div>
      </NGridItem>
    </NGrid>
    <NDropdown
      placement="bottom-start"
      trigger="manual"
      :x="xRef"
      :y="yRef"
      :options="FileDropdownOptions"
      :show="showDropdown"
      :on-clickoutside="onClickoutside"
      @select="handleSelect"
    />
  </div>
</template>

<style scoped></style>
