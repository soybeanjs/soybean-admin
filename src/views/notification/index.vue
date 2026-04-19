<script setup lang="ts">
import { computed, h, onMounted, ref, watch } from 'vue';
import {
  NButton,
  NDataTable,
  NEmpty,
  NInput,
  NPopconfirm,
  NSelect,
  NSpace,
  NTag,
  type DataTableColumns,
  useDialog,
  useMessage
} from 'naive-ui';
import { useNotificationStore } from '@/store/modules/notification';
import dayjs from 'dayjs';

defineOptions({
  name: 'NotificationPage'
});

const notificationStore = useNotificationStore();
const dialog = useDialog();
const message = useMessage();

const activeFilterType = ref<Notification.NotificationType | 'all'>('all');
const activeFilterStatus = ref<Notification.NotificationStatus | 'all'>('all');
const searchKeyword = ref('');
const isLoadingMore = ref(false);

const filteredNotifications = computed(() => {
  const filter: Notification.NotificationFilter = {};

  if (activeFilterType.value !== 'all') {
    filter.type = activeFilterType.value;
  }
  if (activeFilterStatus.value !== 'all') {
    filter.status = activeFilterStatus.value;
  }
  if (searchKeyword.value.trim()) {
    filter.keyword = searchKeyword.value.trim();
  }

  return notificationStore.getNotificationsByFilter(filter);
});

const displayedNotifications = computed(() => {
  const { current, pageSize } = notificationStore.pagination;
  const end = current * pageSize;
  return filteredNotifications.value.slice(0, end);
});

const hasMore = computed(() => {
  const { current, pageSize } = notificationStore.pagination;
  return current * pageSize < filteredNotifications.value.length;
});

const pagination = computed(() => ({
  page: notificationStore.pagination.current,
  pageSize: notificationStore.pagination.pageSize,
  itemCount: filteredNotifications.value.length,
  showSizePicker: false,
  showQuickJumper: false,
  prefix: () => `共 ${filteredNotifications.value.length} 条消息`
}));

function formatTime(time: string) {
  return dayjs(time).format('YYYY-MM-DD HH:mm');
}

function formatRelativeTime(time: string) {
  const now = dayjs();
  const target = dayjs(time);
  const diffMinutes = now.diff(target, 'minute');
  const diffHours = now.diff(target, 'hour');
  const diffDays = now.diff(target, 'day');

  if (diffMinutes < 1) {
    return '刚刚';
  }
  if (diffMinutes < 60) {
    return `${diffMinutes}分钟前`;
  }
  if (diffHours < 24) {
    return `${diffHours}小时前`;
  }
  if (diffDays < 7) {
    return `${diffDays}天前`;
  }
  return formatTime(time);
}

function getLevelType(level: Notification.NotificationLevel) {
  const typeMap: Record<Notification.NotificationLevel, 'default' | 'primary' | 'info' | 'success' | 'warning' | 'error'> = {
    info: 'info',
    success: 'success',
    warning: 'warning',
    error: 'error'
  };
  return typeMap[level];
}

function getLevelText(level: Notification.NotificationLevel) {
  const textMap: Record<Notification.NotificationLevel, string> = {
    info: '信息',
    success: '成功',
    warning: '警告',
    error: '错误'
  };
  return textMap[level];
}

function handleMarkAsRead(notification: Notification.NotificationItem) {
  if (notification.status === 'unread') {
    notificationStore.markAsRead(notification.id);
    message.success('已标记为已读');
  }
}

function handleMarkAllAsRead() {
  const type = activeFilterType.value === 'all' ? undefined : activeFilterType.value;
  notificationStore.markAllAsRead(type);
  message.success('已全部标记为已读');
}

function handleDelete(notification: Notification.NotificationItem) {
  notificationStore.deleteNotification(notification.id);
  message.success('删除成功');
}

function handleClearAll() {
  const type = activeFilterType.value === 'all' ? undefined : activeFilterType.value;
  const typeText = type === 'system' ? '系统通知' : type === 'todo' ? '我的待办' : '全部';

  dialog.warning({
    title: '确认清空',
    content: `确定要清空所有${typeText}消息吗？此操作不可恢复。`,
    positiveText: '确定',
    negativeText: '取消',
    positiveButtonProps: {
      type: 'error'
    },
    onPositiveClick: () => {
      notificationStore.clearAllNotifications(type);
      message.success('已清空');
    }
  });
}

function handlePageChange(page: number) {
  notificationStore.pagination.current = page;
}

function resetFilters() {
  activeFilterType.value = 'all';
  activeFilterStatus.value = 'all';
  searchKeyword.value = '';
  notificationStore.resetPagination();
}

const columns = computed<DataTableColumns<Notification.NotificationItem>>(() => [
  {
    title: '消息类型',
    key: 'type',
    width: 120,
    render: (row) => {
      return h(NTag, {
        type: row.type === 'system' ? 'info' : 'warning',
        size: 'small',
        bordered: false
      }, { default: () => (row.type === 'system' ? '系统通知' : '我的待办') });
    }
  },
  {
    title: '级别',
    key: 'level',
    width: 100,
    render: (row) => {
      return h(NTag, {
        type: getLevelType(row.level),
        size: 'small',
        bordered: false
      }, { default: () => getLevelText(row.level) });
    }
  },
  {
    title: '状态',
    key: 'status',
    width: 100,
    render: (row) => {
      return h(NTag, {
        type: row.status === 'unread' ? 'error' : 'success',
        size: 'small',
        bordered: false
      }, { default: () => (row.status === 'unread' ? '未读' : '已读') });
    }
  },
  {
    title: '标题',
    key: 'title',
    ellipsis: {
      tooltip: true
    },
    render: (row) => {
      return h(
        'span',
        {
          class: {
            'font-medium': row.status === 'unread'
          }
        },
        { default: () => row.title }
      );
    }
  },
  {
    title: '内容',
    key: 'content',
    width: 250,
    ellipsis: {
      tooltip: true
    }
  },
  {
    title: '时间',
    key: 'createdAt',
    width: 160,
    render: (row) => {
      return h('span', { class: 'text-xs text-[var(--n-text-color-3)]' }, { default: () => formatRelativeTime(row.createdAt) });
    }
  },
  {
    title: '操作',
    key: 'actions',
    width: 180,
    fixed: 'right',
    render: (row) => {
      const buttons = [];

      if (row.status === 'unread') {
        buttons.push(
          h(
            NButton,
            {
              size: 'small',
              quaternary: true,
              onClick: () => handleMarkAsRead(row)
            },
            { default: () => '标记已读' }
          )
        );
      }

      buttons.push(
        h(
          NPopconfirm,
          {
            placement: 'top',
            positiveText: '删除',
            negativeText: '取消',
            positiveButtonProps: { type: 'error' },
            onPositiveClick: () => handleDelete(row)
          },
          {
            trigger: () =>
              h(
                NButton,
                {
                  size: 'small',
                  quaternary: true,
                  type: 'error'
                },
                { default: () => '删除' }
              ),
            default: () => '确定要删除这条消息吗？'
          }
        )
      );

      return h(NSpace, { size: 'small' }, { default: () => buttons });
    }
  }
]);

watch(
  [activeFilterType, activeFilterStatus, searchKeyword],
  () => {
    notificationStore.resetPagination();
  }
);

onMounted(() => {
  notificationStore.resetPagination();
});
</script>

<template>
  <div class="h-full flex flex-col">
    <div class="flex flex-col gap-16px mb-16px">
      <div class="flex items-center justify-between">
        <h1 class="text-20px font-medium">消息中心</h1>
        <NSpace>
          <NTag type="info" size="large" round>
            未读: {{ notificationStore.unreadCount }}
          </NTag>
          <NTag v-if="notificationStore.systemUnreadCount > 0" type="warning" size="large" round>
            系统通知: {{ notificationStore.systemUnreadCount }}
          </NTag>
          <NTag v-if="notificationStore.todoUnreadCount > 0" type="error" size="large" round>
            我的待办: {{ notificationStore.todoUnreadCount }}
          </NTag>
        </NSpace>
      </div>

      <div class="flex items-center justify-between gap-16px">
        <NSpace>
          <NInput
            v-model:value="searchKeyword"
            placeholder="搜索消息标题或内容..."
            clearable
            style="width: 280px"
          >
            <template #prefix>
              <SvgIcon icon="ph:magnifying-glass" />
            </template>
          </NInput>

          <NSelect
            v-model:value="activeFilterType"
            :options="[
              { label: '全部类型', value: 'all' },
              { label: '系统通知', value: 'system' },
              { label: '我的待办', value: 'todo' }
            ]"
            style="width: 140px"
          />

          <NSelect
            v-model:value="activeFilterStatus"
            :options="[
              { label: '全部状态', value: 'all' },
              { label: '未读', value: 'unread' },
              { label: '已读', value: 'read' }
            ]"
            style="width: 120px"
          />

          <NButton @click="resetFilters">
            <SvgIcon icon="ph:arrow-counter-clockwise" class="mr-4px" />
            重置
          </NButton>
        </NSpace>

        <NSpace>
          <NButton quaternary @click="handleMarkAllAsRead">
            <SvgIcon icon="ph:check-circle" class="mr-4px" />
            全部已读
          </NButton>
          <NButton quaternary type="error" @click="handleClearAll">
            <SvgIcon icon="ph:trash-simple" class="mr-4px" />
            清空
          </NButton>
        </NSpace>
      </div>
    </div>

    <div class="flex-1 overflow-hidden">
      <NDataTable
        :columns="columns"
        :data="displayedNotifications"
        :bordered="false"
        :single-line="false"
        :pagination="pagination"
        :scroll-x="1000"
        @update:page="handlePageChange"
      >
        <template #empty>
          <NEmpty description="暂无消息">
            <template #icon>
              <SvgIcon icon="ph:bell-slash" class="text-48px text-[var(--n-text-color-3)]" />
            </template>
            <NButton quaternary @click="resetFilters">
              重置筛选条件
            </NButton>
          </NEmpty>
        </template>
      </NDataTable>
    </div>
  </div>
</template>

<style scoped></style>
