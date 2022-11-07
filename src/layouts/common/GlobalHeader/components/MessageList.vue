<template>
  <n-scrollbar class="max-h-360px">
    <n-list>
      <n-list-item
        v-for="(item, index) in list"
        :key="item.id"
        class="hover:bg-[#f6f6f6] dark:hover:bg-dark cursor-pointer"
        @click="handleRead(index)"
      >
        <n-thing class="px-15px" :class="{ 'opacity-30': item.isRead }">
          <template #avatar>
            <n-avatar v-if="item.avatar" :src="item.avatar" />
            <svg-icon v-else class="text-34px text-primary" :icon="item.icon" :local-icon="item.svgIcon" />
          </template>
          <template #header>
            <n-ellipsis :line-clamp="1">
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
            <n-ellipsis v-if="item.description" :line-clamp="2">
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
defineOptions({ name: 'MessageList' });

interface Props {
  list?: App.MessageList[];
}

withDefaults(defineProps<Props>(), {
  list: () => []
});

interface Emits {
  (e: 'read', val: number): void;
}

const emit = defineEmits<Emits>();

function handleRead(index: number) {
  emit('read', index);
}
</script>
