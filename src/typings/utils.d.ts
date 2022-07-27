declare namespace TypeUtil {
  type Noop = (...args: any) => any;

  type UnionInclude<T, K extends keyof T> = K extends keyof T ? true : false;

  type GetFunArgs<F extends Noop> = F extends (...args: infer P) => any ? P : never;

  type GetFunReturn<F extends Noop> = F extends (...args: any) => infer R ? R : never;

  type FirstOfArray<T extends any[]> = T extends [infer First, ...infer _Rest] ? First : never;

  type LastOfArray<T extends any[]> = T extends [...infer _Rest, infer Last] ? Last : never;

  type ArrayToUnion<T extends any[]> = T extends [infer First, ...infer Rest]
    ? First extends any
      ? Rest extends any[]
        ? FirstOfArray<[First]> | ArrayToUnion<Rest>
        : [First]
      : never
    : never;
}
