<script setup lang="ts">
import { onMounted, onUnmounted, useTemplateRef } from 'vue';
import { useI18n } from 'vue-i18n';
import { SCard } from '@vean/ui';
import Player from 'xgplayer';
import 'xgplayer/dist/index.min.css';

/**
 * 视频播放器演示（P4-01）。
 *
 * xgplayer 的样式是独立 CSS 文件，必须显式引入；播放器实例要 `destroy()`，
 * 否则离开页面后 video 元素与事件监听会留在 DOM 里。
 */
defineOptions({ name: 'PluginVideo' });

const { t } = useI18n();

const domRef = useTemplateRef<HTMLElement>('domRef');

const VIDEO_URL = 'https://lf9-cdn-tos.bytecdntp.com/cdn/expire-1-M/byted-player-videos/1.0.0/xgplayer-demo.mp4';

let player: Player | null = null;

onMounted(() => {
  if (!domRef.value) {
    return;
  }

  player = new Player({
    el: domRef.value,
    url: VIDEO_URL,
    playbackRate: [0.5, 0.75, 1, 1.5, 2]
  });
});

onUnmounted(() => {
  player?.destroy();
  player = null;
});
</script>

<template>
  <div class="flex flex-col gap-4">
    <SCard :title="t('plugin.video')">
      <div ref="domRef" class="w-full overflow-hidden rounded-md" />
    </SCard>
  </div>
</template>
