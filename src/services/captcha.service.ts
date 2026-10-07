import { useKV } from 'ubean/server';
import { AppError } from '@/shared/error';

/**
 * 图形验证码服务（P2-08，v3 §4.6）。
 *
 * 答案存在 `@ubean/server` 的 KV 存储里（`useKV('captcha')`，dev 内存 driver，
 * 演进换 Redis driver 与 token 黑名单同路），TTL 5 分钟、**一次性消费**：
 * 校验过即删除，避免同一验证码被重放。
 *
 * 图像是自绘 SVG（无第三方图形库依赖）：4 个去易混字符（无 `0/O/1/I`）
 * + 随机旋转/字号/颜色 + 干扰线，以 base64 data URL 返回，前端直接塞 `<img src>`。
 */

/** 验证码有效期（秒） */
export const CAPTCHA_TTL_SECONDS = 300;

/** 字符数 */
export const CAPTCHA_LENGTH = 4;

/** 去易混字符表（去掉 0/O/1/I/l） */
const CAPTCHA_ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';

const SVG_WIDTH = 120;
const SVG_HEIGHT = 40;

function captchaStore() {
  return useKV<string>('captcha', { prefix: 'captcha:' });
}

function randomInt(max: number): number {
  return Math.floor(Math.random() * max);
}

/** 生成随机验证码文本 */
export function generateCaptchaCode(length: number = CAPTCHA_LENGTH): string {
  let code = '';

  for (let index = 0; index < length; index += 1) {
    code += CAPTCHA_ALPHABET[randomInt(CAPTCHA_ALPHABET.length)];
  }

  return code;
}

/** 把验证码文本渲染成 SVG 字符串（随机扰动 + 干扰线） */
export function renderCaptchaSvg(code: string): string {
  const glyphs = [...code]
    .map((char, index) => {
      const x = 14 + index * 26;
      const y = 28 + randomInt(7) - 3;
      const rotate = randomInt(50) - 25;
      const size = 22 + randomInt(7);
      const color = `hsl(${randomInt(360)} 65% 38%)`;

      return `<text x="${x}" y="${y}" fill="${color}" font-size="${size}" font-family="Menlo, Consolas, monospace" font-weight="700" transform="rotate(${rotate} ${x} ${y})">${char}</text>`;
    })
    .join('');

  const lines = Array.from({ length: 5 }, () => {
    const x1 = randomInt(SVG_WIDTH);
    const y1 = randomInt(SVG_HEIGHT);
    const x2 = randomInt(SVG_WIDTH);
    const y2 = randomInt(SVG_HEIGHT);

    return `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="hsl(${randomInt(360)} 60% 62%)" stroke-width="1" />`;
  }).join('');

  const dots = Array.from({ length: 24 }, () => {
    return `<circle cx="${randomInt(SVG_WIDTH)}" cy="${randomInt(SVG_HEIGHT)}" r="1" fill="hsl(${randomInt(360)} 50% 55%)" />`;
  }).join('');

  return [
    `<svg xmlns="http://www.w3.org/2000/svg" width="${SVG_WIDTH}" height="${SVG_HEIGHT}" viewBox="0 0 ${SVG_WIDTH} ${SVG_HEIGHT}" role="img" aria-label="图形验证码">`,
    `<rect width="100%" height="100%" fill="#f4f6f8" />`,
    lines,
    dots,
    glyphs,
    `</svg>`
  ].join('');
}

export type CaptchaResult = { captchaId: string; img: string };

/** 生成验证码：落 KV + 返回 `{ captchaId, img }`（img 为 data URL） */
export async function createCaptcha(): Promise<CaptchaResult> {
  const code = generateCaptchaCode();
  const captchaId = crypto.randomUUID();

  await captchaStore().set(captchaId, code, CAPTCHA_TTL_SECONDS);

  const img = `data:image/svg+xml;base64,${Buffer.from(renderCaptchaSvg(code), 'utf-8').toString('base64')}`;

  return { captchaId, img };
}

/**
 * 校验验证码（大小写不敏感）并**一次性消费**。
 *
 * @throws AppError `CAPTCHA_EXPIRED` 不存在/已用/已过期；`CAPTCHA_INVALID` 不匹配
 */
export async function verifyCaptcha(captchaId: string, captchaCode: string): Promise<void> {
  const expected = await captchaStore().get(captchaId);

  if (!expected) {
    throw new AppError('CAPTCHA_EXPIRED', '验证码已过期，请重新获取');
  }

  await captchaStore().remove(captchaId);

  if (expected.toLowerCase() !== captchaCode.trim().toLowerCase()) {
    throw new AppError('CAPTCHA_INVALID', '验证码错误');
  }
}
