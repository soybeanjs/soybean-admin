/**
 * 水印内容派生的纯逻辑（P2-12）。
 *
 * 优先级与 v2 一致：**用户名 → 实时时间 → 自定义文本**，命中即返回。
 * 定时器只在「水印可见 且 开启时间」时创建，其余情形省掉一个 interval。
 *
 * 时间格式化用 `@vueuse/core` 的 `useDateFormat`（dayjs token 语法），
 * 因此这里只需要维护「是否该跑定时器」这一层判断，本文件保持零依赖纯函数。
 */

/** 参与派生的水印配置（`ThemeSettings.watermark` 的结构子集） */
export interface WatermarkContentSource {
  visible: boolean;
  text: string;
  enableUserName: boolean;
  enableTime: boolean;
  timeFormat: string;
}

/**
 * 是否需要一个会随时间推进的水印。
 *
 * 三个条件缺一，水印内容就是静态的，挂定时器纯属浪费：
 * 不可见（不渲染）、没开时间（内容不变）、时间格式为空（派生不出内容）。
 */
export function shouldRunWatermarkTimer(source: WatermarkContentSource): boolean {
  return source.visible && source.enableTime && source.timeFormat !== '';
}

/**
 * 按「用户名 → 时间 → 文本」优先级派生水印文案。
 *
 * @param source 水印配置
 * @param userName 当前登录用户名（未登录传空串）
 * @param timeText 已格式化的当前时间（`useDateFormat` 的结果；不格式化时传空串）
 * @returns 渲染到水印上的文本，空串表示不渲染
 */
export function resolveWatermarkContent(source: WatermarkContentSource, userName: string, timeText: string): string {
  if (!source.visible) return '';
  if (source.enableUserName && userName !== '') return userName;
  if (source.enableTime && timeText !== '') return timeText;
  return source.text;
}
