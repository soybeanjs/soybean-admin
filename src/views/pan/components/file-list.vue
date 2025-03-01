<script setup lang="tsx">
import { type DataTableColumn, NButton, NPopover, NTag } from 'naive-ui';
import type { ComputedRef } from 'vue';
import { computed, nextTick, ref } from 'vue';
import { useSvgIcon } from '@/hooks/common/icon';
import { useThemeStore } from '@/store/modules/theme';
import FileImage from './file-image.vue';

defineOptions({
  name: 'FileList'
});

interface Props {
  data?: App.Global.FileItem[];
  selectedFileIds?: string[];
  isBatchMode?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  data: () => [], // 文件数据
  selectedFileIds: () => [],
  isBatchMode: false // 是否是批量模式
});

const emit = defineEmits<{
  (e: 'click', record: App.Global.FileItem): void;
  (e: 'select', record: App.Global.FileItem): void;
}>();

const themeStore = useThemeStore();
const { SvgIconVNode } = useSvgIcon();

const showDropdown = ref(false);
const activeItemId = ref('');
const xRef = ref(0);
const yRef = ref(0);

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

// 点击弹出框以外
const onClickoutside = () => {
  showDropdown.value = false;
};

const fileColumns: ComputedRef<DataTableColumn[]> = computed(() => {
  const columns: DataTableColumn[] = [
    {
      title: '名称',
      key: 'name',
      render: row => {
        return (
          <section
            class="flex-y-center cursor-pointer"
            onContextmenu={e => handleContextMenu(e, row as App.Global.FileItem)}
          >
            <div class="mr-10px h-30px w-30px">
              <FileImage data={row as App.Global.FileItem} />
            </div>
            <span>{row.name}</span>
          </section>
        );
      }
    },
    {
      title: '文件大小（kb）',
      key: 'size',
      width: 150,
      align: 'center'
    },
    {
      title: '扩展名',
      key: 'extendName',
      width: 100,
      align: 'center',
      render: row => {
        // 条件判断
        if (!row.extendName) return null;
        return (
          <NTag
            size={'small'}
            bordered={false}
            color={{
              color: themeStore.darkMode ? 'rgba(142, 81, 218, 0.2)' : 'rgb(245, 232, 255)',
              textColor: themeStore.darkMode ? 'rgb(142, 81, 218)' : 'rgb(114, 46, 209)'
            }}
          >
            {row.extendName}
          </NTag>
        );
      }
    },
    {
      title: '修改时间',
      key: 'updateTime',
      width: 200,
      align: 'center'
    },
    {
      title: '操作',
      key: 'action',
      width: 120,
      align: 'center',
      render: () => {
        return (
          <NPopover trigger={'click'} placement={'bottom'}>
            {{
              trigger: () => (
                <NButton text={true} size={'small'}>
                  {{
                    icon: SvgIconVNode({ icon: 'icon-park-outline:more' })
                  }}
                </NButton>
              )
            }}
          </NPopover>
        );
      }
    }
  ];

  // 如果 isBatchMode 为 true，添加选择列
  if (props.isBatchMode) {
    columns.unshift({
      type: 'selection'
    });
  }

  return columns;
});

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

const rowProps = (row: App.Global.FileItem) => {
  return {
    onClick: () => {
      emit('click', row);
    },
    onSelect: () => {
      emit('select', row);
    }
  };
};
</script>

<template>
  <div>
    <NDataTable
      :row-key="row => row.id"
      :columns="fileColumns"
      :data="props.data"
      :bordered="false"
      :checked-row-keys="selectedFileIds"
      :scroll-x="750"
      :row-props="rowProps"
      class="sm:h-full"
    />
    <NDropdown
      placement="bottom-start"
      trigger="manual"
      :x="xRef"
      :y="yRef"
      :options="FileDropdownOptions"
      :show="showDropdown"
      :on-clickoutside="onClickoutside"
    />
  </div>
</template>

<style scoped></style>
