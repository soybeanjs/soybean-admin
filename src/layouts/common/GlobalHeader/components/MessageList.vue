<template>
  <n-scrollbar class="max-h-360px">
    <n-list>
      <n-list-item
        v-for="item in list"
        :key="item.id"
        class="cursor-pointer hover:bg-[#f6f6f6] dark:hover:bg-dark"
        @click="handleRead(item)"
      >
        <n-thing class="px-15px" :class="{ 'opacity-30': item.isRead }">
          <template #avatar>
            <n-avatar v-if="item.avatar" :src="item.avatar" />
            <svg-icon v-else-if="item.svgIcon" class="text-34px text-primary" :icon="item.svgIcon" />
            <Icon v-else-if="item.icon" class="text-34px text-primary" :icon="item.icon" />
          </template>
          <template #header>
            <n-ellipsis :line-clamp="titleRows" :tooltip="{ placement: 'top' }">
              {{ item.title }}
              <template #tooltip>
                {{ item.title }}
              </template>
            </n-ellipsis>
          </template>
          <template v-if="item.tagTitle" #header-extra>
            <n-tag v-bind="item.tagProps" size="small">{{ item.tagTitle }}</n-tag>
          </template>
          <template #description>
            <n-ellipsis v-if="item.description" :line-clamp="descRows">
              {{ item.description }}
            </n-ellipsis>
            <p>{{ item.date }}</p>
          </template>
        </n-thing>
      </n-list-item>
    </n-list>
  </n-scrollbar>
</template>
<script lang="ts" setup>
import { Icon } from '@iconify/vue';

interface Props {
  list?: Message.List[];
  titleRows?: number;
  descRows?: number;
}

withDefaults(defineProps<Props>(), {
  list: () => [],
  titleRows: 1,
  descRows: 2
});

function handleRead(item: Message.List) {
  // eslint-disable-next-line no-param-reassign
  item.isRead = true;
}
</script>
