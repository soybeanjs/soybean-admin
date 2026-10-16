/** 水印内容派生的纯逻辑（P2-12） 详见 docs/v3-notes.md N-191。 */

/** 参与派生的水印配置（`ThemeSettings.watermark` 的结构子集） */
export interface WatermarkContentSource {
  visible: boolean;
  text: string;
  enableUserName: boolean;
  enableTime: boolean;
  timeFormat: string;
}

/** 三个条件缺一，水印内容就是静态的，挂定时器纯属浪费： 详见 docs/v3-notes.md N-192。 */
export function shouldRunWatermarkTimer(source: WatermarkContentSource): boolean {
  return source.visible && source.enableTime && source.timeFormat !== '';
}

/** 按「用户名 → 时间 → 文本」优先级派生水印文案。 */
export function resolveWatermarkContent(source: WatermarkContentSource, userName: string, timeText: string): string {
  if (!source.visible) return '';
  if (source.enableUserName && userName !== '') return userName;
  if (source.enableTime && timeText !== '') return timeText;
  return source.text;
}
