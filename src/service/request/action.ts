import type {ErrorCodeHandle} from '~/packages/axios';

export const actionIdempotent = createAction({
  async handle(response, instance) {
    return response;
  }
});

export const action2 = createAction({
  async handle(response, instance) {
    return null;
  }
});

function createAction(options?: Partial<ErrorCodeHandle>) {
  const opts: ErrorCodeHandle<any> = {
    handle: async () => {
    }
  };

  Object.assign(opts, options);

  return opts;
}
