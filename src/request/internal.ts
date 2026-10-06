import { createInternalAdapter } from 'ubean/server';
import { createRequest } from '@soybeanjs/fetch';
import { createTypedClient } from '@soybeanjs/fetch/openapi';
import type { paths } from '~ubean/openapi';

/**
 * 服务端内部直调（零网络开销，走 Hono `app.request()`）。
 *
 * 用途：cron 任务、Server Action、seed 脚本等**服务端进程内**要调自己的 API
 * 的场景 —— 不必走 loopback HTTP。
 */
export function createServerApi(context: Parameters<typeof createInternalAdapter>[0]) {
  const request = createRequest({ adapter: createInternalAdapter(context) });

  return createTypedClient<paths, '/api'>(request, '/api');
}
