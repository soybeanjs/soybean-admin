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

/**
 * 点头像开下拉、按文案点中一项。
 * 必须走**真实 UI 点击**：`@select` 的第 1 个参数是 menu item 对象而不是裸 value，
 * 曾经漏出过「handler 收 `unknown` 与裸串比较、恒为假、静默无反应」的 bug —— 直调 store 的用例盖不住。
 */
async function selectUserMenuItem(page: Page, label: string): Promise<void> {
  await page.locator('header [class*="cursor-pointer"]').last().click();
  await page.locator('[role="menuitem"]', { hasText: label }).first().click();
}

/**
 * 从右上角头像下拉菜单登出，并等真实跳转。
 * 登出前有二次确认（`dialog.warning`），按文案点掉 —— 用例在 UI 层多覆盖一次那个对话框。
 */
async function logoutViaMenu(page: Page): Promise<void> {
  await page.waitForTimeout(600);
  await selectUserMenuItem(page, '退出登录');
  await page.locator('button', { hasText: '确认' }).last().click();
  await page.waitForFunction(() => location.pathname === '/login', undefined, { timeout: 15_000 });
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
      // 不断言解析后的形状（那是 `as` 断言的入口）；页签列表里出现工作台即可。
      // 登录页是 `layout: 'blank'`（见 `src/pages/(builtin)/login/index.vue` 的 `definePage`），
      // `isTabbableRoute()` 把 blank 一律排除，所以**不会**有 "Login" 这个页签。
      expect(stored.tabs).toContain('"value":"Index"');
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
      await gotoApp(page, '/about');

      await logoutViaMenu(page);

      // 对话节点「确认」后再次进头像菜单 → 「退出登录」，取消后应**留在原页且 token 不变**
      await login(page, 'admin', '123456');
      await selectUserMenuItem(page, '退出登录');
      await page.locator('button', { hasText: '取消' }).last().click();
      await page.waitForTimeout(500);

      expect(await page.evaluate(() => location.pathname)).not.toBe('/login');
      expect(await page.evaluate(() => localStorage.getItem('@soybean/token'))).not.toBeNull();

      await logoutViaMenu(page);

      const after = await page.evaluate(() => ({
        token: localStorage.getItem('@soybean/token'),
        tabs: localStorage.getItem('@soybean/tabs')
      }));

      expect(after.token).toBeNull();
      // 登出后页签被清空，且不含登出前访问过的 About（同样不会有 Login，理由见上一条用例）
      expect(JSON.parse(after.tabs ?? '[]')).toHaveLength(0);
      expect(after.tabs).not.toContain('AboutIndex');
    } finally {
      await page.close();
    }
  });

  it('右上角头像下拉「个人资料」跳用户中心', async () => {
    const page = await browser!.newPage();

    try {
      await login(page, 'admin', '123456');
      await selectUserMenuItem(page, '个人资料');
      await page.waitForFunction(() => location.pathname === '/user-center/profile', undefined, {
        timeout: 15_000
      });

      expect(await page.evaluate(() => location.pathname)).toBe('/user-center/profile');
    } finally {
      await page.close();
    }
  });

  it('语言下拉切到 English 后 cookie / html lang / 文案同时生效', async () => {
    const page = await browser!.newPage();

    try {
      await login(page, 'admin', '123456');

      await page.getByRole('button', { name: '语言' }).click();
      await page.locator('[role="menuitem"]', { hasText: 'English' }).first().click();

      // 侧栏菜单文案来自 vue-i18n（不是 Vean 组件包），它比 cookie / html lang 晚一拍生效，
      // 所以等文案而不是等 `lang`。
      await page.waitForFunction(() => document.body.innerText.includes('Dashboard'), undefined, {
        timeout: 15_000
      });

      const after = await page.evaluate(() => ({
        lang: document.documentElement.lang,
        cookie: document.cookie,
        body: document.body.innerText.replace(/\s+/g, ' ')
      }));

      expect(after.lang).toBe('en');
      expect(after.cookie).toContain('ubean_locale=en');
      expect(after.body).toContain('Dashboard');
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
