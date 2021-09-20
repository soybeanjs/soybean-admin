<template>
  <div
    class="border-2px rounded-6px cursor-pointer hover:border-primary"
    :class="[checked ? 'border-primary' : 'border-transparent']"
  >
    <n-tooltip :placement="activeConfig.placement" trigger="hover">
      <template #trigger>
        <div class="nav-type relative w-56px h-48px bg-[#fff] rounded-4px overflow-hidden">
          <div class="absolute-lt bg-[#273352]" :class="`${activeConfig.menuClass}`"></div>
          <div class="absolute-rb bg-[#f0f2f5]" :class="`${activeConfig.mainClass}`"></div>
        </div>
      </template>
      <span>{{ EnumNavMode[mode] }}</span>
    </n-tooltip>
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue';
import type { PropType } from 'vue';
import { NTooltip } from 'naive-ui';
import type { FollowerPlacement } from 'vueuc';
import { EnumNavMode } from '@/enum';
import type { NavMode } from '@/interface';

const props = defineProps({
  mode: {
    type: String as PropType<NavMode>,
    default: 'vertical'
  },
  checked: {
    type: Boolean,
    default: false
  }
});

const config = new Map<NavMode, { placement: FollowerPlacement; menuClass: string; mainClass: string }>([
  ['vertical', { placement: 'bottom-start', menuClass: 'w-1/3 h-full', mainClass: 'w-2/3 h-3/4' }],
  ['vertical-mix', { placement: 'bottom', menuClass: 'w-1/4 h-full', mainClass: 'w-2/3 h-3/4' }],
  ['horizontal', { placement: 'bottom', menuClass: 'w-full h-1/4', mainClass: 'w-full h-3/4' }],
  ['horizontal-mix', { placement: 'bottom-end', menuClass: 'w-full h-1/4', mainClass: 'w-2/3 h-3/4' }]
]);

const activeConfig = computed(() => config.get(props.mode)!);
</script>
<style scoped>
.nav-type {
  box-shadow: 0 1px 2.5px rgba(0, 0, 0, 0.18);
}
</style>
