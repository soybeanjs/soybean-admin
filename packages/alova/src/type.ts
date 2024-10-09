import type { AlovaGenerics, AlovaOptions, AlovaRequestAdapter, Method, ResponseCompleteHandler } from 'alova';

export type CustomAlovaConfig<AG extends AlovaGenerics> = Omit<
  AlovaOptions<AG>,
  'statesHook' | 'beforeRequest' | 'responded' | 'requestAdapter'
> & {
  /** request adapter. all request of alova will be sent by it. */
  requestAdapter?: AlovaRequestAdapter<AG['RequestConfig'], AG['Response'], AG['ResponseHeader']>;
};

export interface RequestOptions<AG extends AlovaGenerics> {
  /**
   * The hook before request
   *
   * For example: You can add header token in this hook
   *
   * @param method alova Method Instance
   */
  onRequest?: AlovaOptions<AG>['beforeRequest'];
  /**
   * The hook to check backend response is success or not
   *
   * @param response alova response
   */
  isBackendSuccess: (response: AG['Response']) => Promise<boolean>;

  /** The config to refresh token */
  tokenRefresher?: {
    /** detect the token is expired */
    isExpired(response: AG['Response'], Method: Method<AG>): Promise<boolean> | boolean;
    /** refresh token handler */
    handler(response: AG['Response'], Method: Method<AG>): Promise<void>;
  };

  /** The hook after backend request complete */
  onComplete?: ResponseCompleteHandler<AG>;

  /**
   * The hook to handle error
   *
   * For example: You can show error message in this hook
   *
   * @param error
   */
  onError?: (error: any, response: AG['Response'] | null, methodInstance: Method<AG>) => any | Promise<any>;
  /**
   * transform backend response when the responseType is json
   *
   * @param response alova response
   */
  transformBackendResponse: (response: AG['Response']) => any;
}
