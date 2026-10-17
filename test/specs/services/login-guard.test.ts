import { beforeEach, describe, expect, it } from 'vitest';
import {
  LOGIN_ATTEMPT_LIMIT,
  LOGIN_ATTEMPT_WINDOW_SECONDS,
  clearLoginFailures,
  getLoginFailures,
  recordLoginFailure,
  requiresCaptcha
} from '@/services/login-guard.service';

/** 计数落在 `useKV` 内存驱动上，用例之间用不同用户名隔离（与生产一致：按用户名计数） */
describe('login-guard', () => {
  const user = 'unit_login_guard';

  beforeEach(async () => {
    await clearLoginFailures(user);
  });

  it('未失败过时计数为 0 且不需要验证码', async () => {
    expect(await getLoginFailures(user)).toBe(0);
    expect(await requiresCaptcha(user)).toBe(false);
  });

  it('每次失败累加，达到阈值后要求验证码', async () => {
    for (let attempt = 1; attempt <= LOGIN_ATTEMPT_LIMIT; attempt += 1) {
      expect(await recordLoginFailure(user)).toBe(attempt);
    }

    expect(await getLoginFailures(user)).toBe(LOGIN_ATTEMPT_LIMIT);
    expect(await requiresCaptcha(user)).toBe(true);
  });

  it('未达阈值时不要求验证码', async () => {
    for (let attempt = 1; attempt < LOGIN_ATTEMPT_LIMIT; attempt += 1) {
      await recordLoginFailure(user);
    }

    expect(await requiresCaptcha(user)).toBe(false);
  });

  it('清零后回到初始状态', async () => {
    for (let attempt = 0; attempt < LOGIN_ATTEMPT_LIMIT; attempt += 1) {
      await recordLoginFailure(user);
    }
    expect(await requiresCaptcha(user)).toBe(true);

    await clearLoginFailures(user);

    expect(await getLoginFailures(user)).toBe(0);
    expect(await requiresCaptcha(user)).toBe(false);
  });

  it('不同用户名互不影响', async () => {
    for (let attempt = 0; attempt < LOGIN_ATTEMPT_LIMIT; attempt += 1) {
      await recordLoginFailure(user);
    }

    const other = 'unit_login_guard_other';
    await clearLoginFailures(other);

    expect(await requiresCaptcha(user)).toBe(true);
    expect(await requiresCaptcha(other)).toBe(false);
  });

  it('窗口是 15 分钟，超过常见的爆破节奏（避免打一枪就被放行）', () => {
    expect(LOGIN_ATTEMPT_WINDOW_SECONDS).toBe(900);
  });
});
