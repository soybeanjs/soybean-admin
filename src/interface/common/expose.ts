import type { Ref } from 'vue';
import BScroll from '@better-scroll/core';

/** BetterScroll暴露出的数据的类型 */
export interface ExposeBetterScroll {
  bsInstance: Ref<BScroll>;
}
