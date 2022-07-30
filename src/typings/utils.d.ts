declare namespace TypeUtil {
  type Noop = (...args: any) => any;

  type UnionInclude<T, K extends keyof T> = K extends keyof T ? true : false;

  type GetFunArgs<F extends Noop> = F extends (...args: infer P) => any ? P : never;

  type GetFunReturn<F extends Noop> = F extends (...args: any) => infer R ? R : never;

  type Writable<T> = { [K in keyof T]: T[K] };

  type FirstOfArray<T extends any[]> = T extends [infer First, ...infer _Rest] ? First : never;

  type LastOfArray<T extends any[]> = T extends [...infer _Rest, infer Last] ? Last : never;
}
