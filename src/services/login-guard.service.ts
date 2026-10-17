import { useKV } from 'ubean/server';

/**
 * 登录失败计数（审计 1.6）。
 *
 * 代价很低、收益很直接的防护：同一个用户名连续失败 N 次后，后续登录**必须**带图形
 * 验证码。迁移前 `pwdLoginSchema` 把 `captchaId` / `captchaCode` 都设成可选，且没有任何
 * 失败计数 —— 在线暴力破解只需不断发 `POST /api/auth/login`，服务端不设任何门槛。
 *
 * 计数按用户名而不是按 IP：弱密码爆破通常打固定账号，而校园网 / 公司出口 NAT 下按 IP
 * 计数会误伤整栋楼。`useKV` 带 TTL，窗口过了自动清零，不需要定时任务。
 */

/** 触发验证码要求的失败次数 */
export const LOGIN_ATTEMPT_LIMIT = 5;

/** 计数窗口（秒）。15 分钟：够覆盖一次人工重试，又不至于让攻击者长期占坑 */
export const LOGIN_ATTEMPT_WINDOW_SECONDS = 900;

function attemptStore() {
  return useKV<number>('login-attempt', { prefix: 'login-attempt:' });
}

/** 当前窗口内的失败次数（0 表示没有记录） */
export async function getLoginFailures(username: string): Promise<number> {
  const value = await attemptStore().get(username);

  return typeof value === 'number' && value > 0 ? value : 0;
}

/** 记一次失败，返回累计次数 */
export async function recordLoginFailure(username: string): Promise<number> {
  const next = (await getLoginFailures(username)) + 1;

  await attemptStore().set(username, next, LOGIN_ATTEMPT_WINDOW_SECONDS);

  return next;
}

/** 登录成功 / 密码重置后清零 */
export async function clearLoginFailures(username: string): Promise<void> {
  await attemptStore().remove(username);
}

/** 是否已经进入「必须带验证码」状态 */
export async function requiresCaptcha(username: string): Promise<boolean> {
  return (await getLoginFailures(username)) >= LOGIN_ATTEMPT_LIMIT;
}
