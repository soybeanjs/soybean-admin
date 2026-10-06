/**
 * UUID v7 生成器（P1-08：所有表主键为 UUID v7 字符串）。
 *
 * 单调序列保证同一毫秒内不重复且趋势递增（对 SQLite/PG 的 B-tree 插入友好）。
 * 格式：`xxxxxxxx-xxxx-7xxx-8xxx-xxxxxxxxxxxx`（版本 7 + 变体位）。
 */

let lastTimestamp = 0;
let sequence = 0;

function randomHex(byteLength: number): string {
  const bytes = new Uint8Array(byteLength);
  crypto.getRandomValues(bytes);

  return Array.from(bytes, byte => byte.toString(16).padStart(2, '0')).join('');
}

export function createUuidV7(): string {
  const timestamp = Date.now();

  if (timestamp === lastTimestamp) {
    sequence = (sequence + 1) & 0x0fff;
  } else {
    lastTimestamp = timestamp;
    sequence = 0;
  }

  const timestampHex = timestamp.toString(16).padStart(12, '0');
  const randomValue = randomHex(8);
  const sequenceHex = sequence.toString(16).padStart(3, '0');
  const variantHex = ((Number.parseInt(randomValue[0], 16) & 0x3) | 0x8).toString(16);

  return `${timestampHex.slice(0, 8)}-${timestampHex.slice(8, 12)}-7${sequenceHex}-${variantHex}${randomValue.slice(1, 4)}-${randomValue.slice(4, 16)}`;
}
