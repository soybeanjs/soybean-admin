// @vitest-environment jsdom
import { beforeEach, describe, expect, it, vi } from 'vitest';

/** 请求层两条「隐形能力」的回归（P4-02，v3 §5.9） 详见 docs/v3-notes.md N-419。 */
const toastError = vi.fn();

vi.mock('@vean/ui', () => ({ toast: { error: toastError } }));

/** 造一个 JSON 响应（envelope 结构由后端保证） */
function json(body: unknown): Response {
  return new Response(JSON.stringify(body), { status: 200, headers: { 'content-type': 'application/json' } });
}

const SUCCESS_LOGIN = {
  code: '0000',
  message: '成功',
  data: {
    token: 'new-token',
    refreshToken: 'new-refresh',
    user: { id: '1', username: 'admin', roles: ['super'] }
  }
};

const BAD_CREDENTIALS = { code: '2009', message: '用户名或密码错误', data: null };
const EXPIRED_TOKEN = { code: '2001', message: '令牌已过期', data: null };

beforeEach(() => {
  vi.resetModules();
  vi.unstubAllGlobals();
  toastError.mockClear();
  localStorage.clear();
});

describe('错误提示去重', () => {
  it('相同文案 3s 内只弹一次', async () => {
    vi.stubGlobal('fetch', async () => json(BAD_CREDENTIALS));

    const { createApiClients } = await import('@/request/factory');
    const client = createApiClients('');

    await client.request.get('/api/auth/login').catch(() => undefined);
    await client.request.get('/api/auth/login').catch(() => undefined);
    await new Promise(resolve => setTimeout(resolve, 20));

    expect(toastError).toHaveBeenCalledTimes(1);
    expect(toastError).toHaveBeenCalledWith('用户名或密码错误');
  });

  it('一次业务失败只弹一条（不会因 BackendError 再补一条英文兜底）', async () => {
    vi.stubGlobal('fetch', async () => json(BAD_CREDENTIALS));

    const { createApiClients } = await import('@/request/factory');
    const client = createApiClients('');

    await client.request.get('/api/auth/login').catch(() => undefined);
    await new Promise(resolve => setTimeout(resolve, 20));

    expect(toastError).toHaveBeenCalledTimes(1);
    // 英文兜底文案出现即说明 onError 没有跳过 BackendError
    expect(toastError.mock.calls.flat().join(' ')).not.toContain('isBackendSuccess');
  });

  it('不同文案不去重（每类错误都要让用户看到）', async () => {
    let call = 0;
    vi.stubGlobal('fetch', async () => {
      call += 1;

      return json(call === 1 ? BAD_CREDENTIALS : { code: '2009', message: '账号已锁定', data: null });
    });

    const { createApiClients } = await import('@/request/factory');
    const client = createApiClients('');

    await client.request.get('/api/auth/login').catch(() => undefined);
    await client.request.get('/api/auth/login').catch(() => undefined);
    await new Promise(resolve => setTimeout(resolve, 20));

    expect(toastError).toHaveBeenCalledTimes(2);
  });
});

describe('刷新令牌单飞', () => {
  it('并发过期只发一次 refresh，且两个请求都被重放成成功', async () => {
    localStorage.setItem('@soybean/refreshToken', 'stale-refresh');

    const urls: string[] = [];
    let expired = true;

    vi.stubGlobal('fetch', async (input: string | URL | Request) => {
      const url = String(input);
      urls.push(url);

      if (url.includes('/auth/refresh-token')) {
        expired = false;

        return json(SUCCESS_LOGIN);
      }

      // 刷新成功前，业务接口一律返回过期码
      return json(expired ? EXPIRED_TOKEN : { code: '0000', message: '成功', data: { ok: true } });
    });

    const { createApiClients } = await import('@/request/factory');
    const client = createApiClients('');

    const results = await Promise.all([
      client.request.get('/api/a').catch(() => undefined),
      client.request.get('/api/b').catch(() => undefined)
    ]);

    const refreshCalls = urls.filter(url => url.includes('/auth/refresh-token'));

    expect(refreshCalls).toHaveLength(1);
    expect(results).toEqual([{ ok: true }, { ok: true }]);
    // 新凭据已落盘，后续请求带的是新 token
    expect(localStorage.getItem('@soybean/token')).toBe('new-token');
    expect(localStorage.getItem('@soybean/refreshToken')).toBe('new-refresh');
  });

  it('没有 refreshToken 时不发刷新请求，直接走登出', async () => {
    const urls: string[] = [];
    vi.stubGlobal('fetch', async (input: string | URL | Request) => {
      urls.push(String(input));

      return json(EXPIRED_TOKEN);
    });

    const logoutRequests: boolean[] = [];
    const { setLogoutHandler } = await import('@/utils/auth');
    setLogoutHandler(silent => logoutRequests.push(silent));

    const { createApiClients } = await import('@/request/factory');
    const client = createApiClients('');

    await client.request.get('/api/a').catch(() => undefined);

    expect(urls.filter(url => url.includes('/auth/refresh-token'))).toHaveLength(0);
    expect(logoutRequests).toEqual([true]);
  });
});
