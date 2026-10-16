import { describe, expect, it, beforeAll, afterAll } from 'vitest';
import type { Browser, Page } from 'playwright';
import { BASE_URL } from '../shared/api-client';

/** 覆盖（这些能力在 node/jsdom 下测不到）： 详见 docs/v3-notes.md N-406。 */

let browser: Browser | null = null;

async function launch(): Promise<Browser | null> {
  try {
    const { chromium } = await import('playwright');

    return await chromium.launch({ headless: true });
  } catch {
    return null;
  }
}

beforeAll(async () => {
  browser = await launch();
});

afterAll(async () => {
  await browser?.close();
});

/** 页面读取：卡死（无限重定向）时 15s 超时而不是永久挂起 */
async function gotoAndRead(page: Page, path: string): Promise<{ title: string; body: string }> {
  await gotoApp(page, path);

  const read = page.evaluate(() => ({
    title: document.title,
    body: document.body.innerText.replace(/\s+/g, ' ')
  }));

  const timeout = new Promise<never>((_, reject) => {
    setTimeout(() => reject(new Error(`页面 ${path} 15s 内未响应（渲染进程可能忙循环）`)), 15_000);
  });

  return Promise.race([read, timeout]);
}

/** 必须等：ubean 是 SSR，首屏 HTML 里的 `<input>` 在客户端水合前**没有** 详见 docs/v3-notes.md N-407。 */
async function gotoApp(page: Page, path: string): Promise<void> {
  await page.goto(`${BASE_URL}${path}`, { waitUntil: 'networkidle', timeout: 15_000 });
  await page.waitForTimeout(300);
}

/** 登录并等待跳转完成 */
async function login(page: Page, userName: string, password: string): Promise<void> {
  await gotoApp(page, '/login');
  await page.locator('input[autocomplete="username"]').fill(userName);
  await page.locator('input[autocomplete="current-password"]').fill(password);
  await page.locator('button[type="submit"]').click();
  await page.waitForFunction(() => location.pathname !== '/login', undefined, { timeout: 15_000 });
}

describe.skipIf(!process.env.PW_E2E)('真实浏览器（P4-02 §5.9）', () => {
  it('公开页在未登录状态可渲染（无限重定向的回归保护）', async () => {
    const page = await browser!.newPage();

    try {
      const { title, body } = await gotoAndRead(page, '/login');

      expect(title).toContain('SoybeanAdmin');
      expect(body).toContain('登录');
    } finally {
      await page.close();
    }
  });

  it('登录成功弹 notification，并落 token / 页签', async () => {
    const page = await browser!.newPage();

    try {
      await login(page, 'admin', '123456');
      // notification 会自行消失，先抓 DOM
      const body = await page.evaluate(() => document.body.innerText.replace(/\s+/g, ' '));
      expect(body).toContain('登录成功');

      const stored = await page.evaluate(() => ({
        token: localStorage.getItem('@soybean/token'),
        tabs: localStorage.getItem('@soybean/tabs')
      }));

      expect(stored.token).toBeTruthy();
      // 不断言解析后的形状（那是 `as` 断言的入口）；页签列表里出现 Login 即可
      expect(stored.tabs).toContain('"value":"Login"');
    } finally {
      await page.close();
    }
  });

  it('页签与登录态跨刷新恢复，主题设置生产缓存生效', async () => {
    const page = await browser!.newPage();

    try {
      await login(page, 'admin', '123456');
      await page.goto(`${BASE_URL}/about`, { waitUntil: 'networkidle' });
      await page.waitForTimeout(600);

      const before = await page.evaluate(() => JSON.parse(localStorage.getItem('@soybean/tabs') ?? '[]').length);
      expect(before).toBeGreaterThanOrEqual(2);

      // 写主题设置 → 刷新 → <html> filter 应生效
      await page.evaluate(() => {
        const key = '@soybean/theme-settings';
        const current = JSON.parse(localStorage.getItem(key) ?? '{}');

        localStorage.setItem(key, JSON.stringify({ ...current, grayscale: true }));
      });

      await page.reload({ waitUntil: 'networkidle' });
      await page.waitForTimeout(800);

      const after = await page.evaluate(() => ({
        path: location.pathname,
        tabs: JSON.parse(localStorage.getItem('@soybean/tabs') ?? '[]').length,
        filter: document.documentElement.style.filter
      }));

      expect(after.path).toBe('/about');
      expect(after.tabs).toBeGreaterThanOrEqual(2);
      expect(after.filter).toContain('grayscale');
    } finally {
      await page.close();
    }
  });

  it('登出清空页签（跨用户不留痕）', async () => {
    const page = await browser!.newPage();

    try {
      await login(page, 'admin', '123456');
      await page.goto(`${BASE_URL}/about`, { waitUntil: 'networkidle' });
      await page.waitForTimeout(600);

      // 传字符串而不是箭头函数：Vite 会把箭头函数里的 `import()` 重写成
      // `__vite_ssr_dynamic_import__`（浏览器里不存在）。字符串原样求值，
      // 走浏览器原生 dynamic import。
      await page.evaluate(
        `(async () => {
          const { useAuthStore } = await import('/src/store/modules/auth/index.ts');

          await useAuthStore().logout();
        })()`
      );

      await page.waitForFunction(() => location.pathname === '/login', undefined, { timeout: 15_000 });

      const after = await page.evaluate(() => ({
        token: localStorage.getItem('@soybean/token'),
        tabs: localStorage.getItem('@soybean/tabs')
      }));

      expect(after.token).toBeNull();
      // 登出后只剩 Login 一个页签（字符串比对，见上一条用例的说明）
      expect(after.tabs).toContain('"value":"Login"');
      expect(after.tabs).not.toContain('"value":"AboutIndex"');
    } finally {
      await page.close();
    }
  });

  it('业务失败只提示一条后端文案（去重 + 不叠英文兜底）', async () => {
    const page = await browser!.newPage();

    try {
      await gotoApp(page, '/login');
      await page.locator('input[autocomplete="username"]').fill('admin');
      await page.locator('input[autocomplete="current-password"]').fill('wrong-password');
      await page.locator('button[type="submit"]').click();
      await page.waitForTimeout(2500);

      const body = await page.evaluate(() => document.body.innerText.replace(/\s+/g, ' '));

      expect(body).toContain('用户名或密码错误');
      expect(body).not.toContain('isBackendSuccess');
    } finally {
      await page.close();
    }
  });
});
