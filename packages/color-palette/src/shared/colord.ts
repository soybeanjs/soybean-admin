import { colord, extend } from 'colord';
import type { HslColor } from 'colord';
import labPlugin from 'colord/plugins/lab';

extend([labPlugin]);

export function isValidColor(color: string) {
  return colord(color).isValid();
}

export function getHex(color: string) {
  return colord(color).toHex();
}

export function getRgb(color: string) {
  return colord(color).toRgb();
}

export function getHsl(color: string) {
  return colord(color).toHsl();
}

export function getDeltaE(color1: string, color2: string) {
  return colord(color1).delta(color2);
}

export function transformHslToHex(color: HslColor) {
  return colord(color).toHex();
}
