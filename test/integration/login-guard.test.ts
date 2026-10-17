/**
 * 登录失败计数 + 验证码升级（审计 1.6）。
 *
 * `pwdLoginSchema` 曾把 `captchaId` / `captchaCode` 都设为可选，且服务端没有任何失败
 * 计数 —— 在线爆破只需不断 POST `/api/auth/login`，没有任何门槛。现在同一用户名连续
 * 失败 `LOGIN_ATTEMPT_LIMIT` 次后，无验证码的登录直接返回 `4102`。
 *
 * 这里用真实 HTTP 验证门槛确实生效、且成功登录会把计数清零（否则正常用户会被永久
 * 卡在验证码状态）。计数落在 `useKV` 内存里，用例之间用独立用户名避免互相污染。
 */
import { describe, expect, it } from 'vitest';
import { api } from '../shared/api-client';

/** 与 `src/services/login-guard.service.ts` 的 `LOGIN_ATTEMPT_LIMIT` 对齐 */
const LIMIT = 5;

type LoginEnvelope = { code: string; message: string };

/** 打一次错误密码，返回业务码 */
async function failOnce(userName: string): Promise<string> {
  const { body } = await api<LoginEnvelope>('POST', '/api/auth/login', {
    body: { userName, password: 'definitely-not-the-password', grantType: 'pwd' }
  });

  return body.code;
}

describe('登录失败限制', () => {
  it(`连续失败 ${LIMIT} 次后拒绝无验证码的登录，返回 4102`, async () => {
    const userName = `it_lock_${Date.now().toString(36)}`;

    // 前 LIMIT 次是普通密码错误（2009），逐次累加计数
    for (let attempt = 0; attempt < LIMIT; attempt += 1) {
      expect(await failOnce(userName)).toBe('2009');
    }

    // 第 LIMIT+1 次：即使给对密码也不放行 —— 必须先过图形验证码
    const { body } = await api<LoginEnvelope>('POST', '/api/auth/login', {
      body: { userName, password: '123456', grantType: 'pwd' }
    });

    expect(body.code).toBe('4102');
  }, 30_000);

  it('不存在的用户名同样累加计数（不泄露账号是否存在）', async () => {
    const userName = `it_ghost_${Date.now().toString(36)}`;

    for (let attempt = 0; attempt < LIMIT; attempt += 1) {
      expect(await failOnce(userName)).toBe('2009');
    }

    const { body } = await api<LoginEnvelope>('POST', '/api/auth/login', {
      body: { userName, password: '123456', grantType: 'pwd' }
    });

    // 与真实账号表现一致：2009 → 4102，不暴露「用户不存在」
    expect(body.code).toBe('4102');
  }, 30_000);

  it('成功登录会清零失败计数', async () => {
    const userName = 'admin';

    // 制造两次失败（不到门槛）
    expect(await failOnce(userName)).toBe('2009');
    expect(await failOnce(userName)).toBe('2009');

    const { body } = await api<LoginEnvelope>('POST', '/api/auth/login', {
      body: { userName, password: '123456', grantType: 'pwd' }
    });

    expect(body.code).toBe('0000');

    // 清零后重新可以从头累加：再失败一次仍然是普通密码错误而不是 4102
    expect(await failOnce(userName)).toBe('2009');
  }, 30_000);
});
