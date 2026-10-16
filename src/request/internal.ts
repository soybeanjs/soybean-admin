import { createInternalAdapter } from 'ubean/server';
import { createRequest } from '@soybeanjs/fetch';
import { createTypedClient } from '@soybeanjs/fetch/openapi';
import type { PathsRemovedPrefix, TypedClient } from '@soybeanjs/fetch/openapi';
import type { paths } from '~ubean/openapi';

/** 服务端内部直调（零网络开销，走 Hono `app.request()`） 详见 docs/v3-notes.md N-242。 */
export function createServerApi(
  context: Parameters<typeof createInternalAdapter>[0]
): TypedClient<PathsRemovedPrefix<paths, '/api'>> {
  const request = createRequest({ adapter: createInternalAdapter(context) });

  return createTypedClient<paths, '/api'>(request, '/api');
}
