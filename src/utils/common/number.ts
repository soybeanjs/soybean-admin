/**
 * 获取指定整数范围内的随机整数
 * @param start - 开始范围
 * @param end - 结束范围
 */
export function getRandomInterger(end: number, start: number = 0) {
  const range = end - start;
  const random = Math.floor(Math.random() * range + start);
  return random;
}
