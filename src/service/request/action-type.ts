import type {ErrorCodeHandle} from '~/packages/axios';
import {actionIdempotent} from '@/service/request/action';

export const codeActions: Map<Api.ErrorCode.Code, ErrorCodeHandle> = new Map([
  ['1', actionIdempotent],
  ['2', actionIdempotent]
]);
