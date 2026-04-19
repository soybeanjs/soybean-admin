<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue';
import { NEmpty, useDialog, useMessage } from 'naive-ui';
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
  dialog.warning({
    title: '确认删除',
    content: '确定要删除这条消息吗？',
    positiveText: '删除',
    negativeText: '取消',
    positiveButtonProps: {
      type: 'error'
    },
    onPositiveClick: () => {
      notificationStore.deleteNotification(notification.id);
      message.success('删除成功');
    }
  });
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

function handleLoadMore() {
  if (isLoadingMore.value || !hasMore.value) return;

  isLoadingMore.value = true;

  setTimeout(() => {
    notificationStore.loadMore();
    isLoadingMore.value = false;
  }, 300);
}

function resetFilters() {
  activeFilterType.value = 'all';
  activeFilterStatus.value = 'all';
  searchKeyword.value = '';
  notificationStore.resetPagination();
}

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
        <div class="flex items-center gap-12px">
          <NTag type="info" size="large" round>
            未读: {{ notificationStore.unreadCount }}
          </NTag>
          <NTag v-if="notificationStore.systemUnreadCount > 0" type="warning" size="large" round>
            系统通知: {{ notificationStore.systemUnreadCount }}
          </NTag>
          <NTag v-if="notificationStore.todoUnreadCount > 0" type="error" size="large" round>
            我的待办: {{ notificationStore.todoUnreadCount }}
          </NTag>
        </div>
      </div>

      <div class="flex items-center justify-between gap-16px">
        <div class="flex items-center gap-12px">
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
        </div>

        <div class="flex items-center gap-8px">
          <NButton quaternary @click="handleMarkAllAsRead">
            <SvgIcon icon="ph:check-circle" class="mr-4px" />
            全部已读
          </NButton>
          <NButton quaternary type="error" @click="handleClearAll">
            <SvgIcon icon="ph:trash-simple" class="mr-4px" />
            清空
          </NButton>
        </div>
      </div>
    </div>

    <div class="flex-1 overflow-hidden flex flex-col">
      <div
        v-if="filteredNotifications.length > 0"
        class="flex-1 overflow-y-auto pr-8px"
        @scroll="(e: Event) => {
          const target = e.target as HTMLElement;
          const bottom = target.scrollHeight - target.scrollTop <= target.clientHeight + 50;
          if (bottom && hasMore && !isLoadingMore) {
            handleLoadMore();
          }
        }"
      >
        <div class="flex flex-col gap-12px">
          <div
            v-for="item in displayedNotifications"
            :key="item.id"
            class="p-16px rounded-lg transition-all"
            :class="{
              'bg-[var(--n-color-info-hover)]': item.status === 'unread',
              'bg-[var(--n-color-base)]': item.status === 'read',
              'hover:bg-[var(--n-color-hover)]': true
            }"
          >
            <div class="flex items-start gap-12px">
              <div class="flex-shrink-0 mt-4px">
                <div
                  v-if="item.status === 'unread'"
                  class="w-8px h-8px rounded-full bg-primary-color"
                />
                <div v-else class="w-8px h-8px" />
              </div>

              <div class="flex-1 min-w-0">
                <div class="flex items-start justify-between gap-12px">
                  <div class="flex-1 min-w-0">
                    <div class="flex items-center gap-8px mb-4px">
                      <NTag
                        :type="item.type === 'system' ? 'info' : 'warning'"
                        size="small"
                        :bordered="false"
                      >
                        {{ item.type === 'system' ? '系统通知' : '我的待办' }}
                      </NTag>
                      <NTag :type="getLevelType(item.level)" size="small" :bordered="false">
                        {{ getLevelText(item.level) }}
                      </NTag>
                      <span
                        class="text-15px truncate"
                        :class="{
                          'font-medium': item.status === 'unread'
                        }"
                      >
                        {{ item.title }}
                      </span>
                    </div>
                    <p class="text-sm text-[var(--n-text-color-2)] line-clamp-2">
                      {{ item.content }}
                    </p>
                    <div class="mt-8px flex items-center gap-16px text-xs text-[var(--n-text-color-3)]">
                      <span>{{ formatRelativeTime(item.createdAt) }}</span>
                      <span v-if="item.readAt">已读时间: {{ formatTime(item.readAt) }}</span>
                    </div>
                  </div>

                  <div class="flex-shrink-0 flex items-center gap-8px">
                    <NButton
                      v-if="item.status === 'unread'"
                      quaternary
                      size="small"
                      @click="handleMarkAsRead(item)"
                    >
                      标记已读
                    </NButton>
                    <NPopconfirm
                      placement="top"
                      :positive-text="'删除'"
                      :negative-text="'取消'"
                      positive-button-props="{ type: 'error' }"
                      @positive-click="handleDelete(item)"
                    >
                      <template #trigger>
                        <NButton quaternary size="small" type="error">
                          删除
                        </NButton>
                      </template>
                      确定要删除这条消息吗？
                    </NPopconfirm>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div
            v-if="hasMore"
            class="flex-center py-16px"
          >
            <NButton
              :loading="isLoadingMore"
              quaternary
              @click="handleLoadMore"
            >
              {{ isLoadingMore ? '加载中...' : '加载更多' }}
            </NButton>
          </div>

          <div
            v-if="!hasMore && displayedNotifications.length > 0"
            class="flex-center py-16px text-xs text-[var(--n-text-color-3)]"
          >
            已加载全部 {{ displayedNotifications.length }} 条消息
          </div>
        </div>
      </div>

      <div v-else class="flex-1 flex flex-col items-center justify-center">
        <NEmpty description="暂无消息">
          <template #icon>
            <SvgIcon icon="ph:bell-slash" class="text-64px text-[var(--n-text-color-3)]" />
          </template>
          <NButton quaternary size="large" @click="resetFilters">
            重置筛选条件
          </NButton>
        </NEmpty>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
