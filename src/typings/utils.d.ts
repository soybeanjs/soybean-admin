declare namespace TypeUtil {
  type Noop = (...args: any) => any;

  type GetFunArgs<F extends Noop> = F extends (...args: infer P) => any ? P : never;

  type GetFunReturn<F extends Noop> = F extends (...args: any) => infer R ? R : never;
}
