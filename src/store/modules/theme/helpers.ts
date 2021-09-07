import { brightenColor, darkenColor } from '@/utils';

export function getHoverAndPressedColor(color: string) {
  return {
    hover: brightenColor(color),
    pressed: darkenColor(color)
  };
}
