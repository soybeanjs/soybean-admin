import { type CSSProperties, type VNode, type VNodeChild } from 'vue';
import type { SelectGroupOption } from 'naive-ui';

type UpdatedSelectBaseOption<
  V = boolean | string | number,
  L = boolean | string | ((option: UpdatedSelectBaseOption<V>, selected: boolean) => VNodeChild)
> = {
  value?: V;
  label?: L;
  class?: string;
  style?: string | CSSProperties;
  disabled?: boolean;
  render?: (info: { node: VNode; option: UpdatedSelectBaseOption<V>; selected: boolean }) => VNodeChild;
  [k: string]: unknown;
};

type UpdatedSelectMixedOption = UpdatedSelectBaseOption | SelectGroupOption | any;
export type SelectMixedOption = UpdatedSelectMixedOption;
