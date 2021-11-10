<template>
  <div>
    <n-card title="视频播放器插件" class="h-full shadow-sm rounded-16px">
      <div ref="domRef"></div>
    </n-card>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { NCard } from 'naive-ui';
import Player from 'xgplayer';

const domRef = ref<HTMLElement | null>(null);

function renderXgPlayer() {
  const url = 'https://lf9-cdn-tos.bytecdntp.com/cdn/expire-1-M/byted-player-videos/1.0.0/xgplayer-demo.mp4';
  const player = new Player({
    el: domRef.value!,
    url,
    playbackRate: [0.5, 0.75, 1, 1.5, 2]
  });
  return player;
}

onMounted(() => {
  renderXgPlayer();
});
</script>
<style scoped></style>
