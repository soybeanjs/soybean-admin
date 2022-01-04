declare namespace Util {
  /** convert a union to an intersection: X | Y | Z ==> X & Y & Z */
  type UnionToIntersection<T> = (T extends any ? (args: T) => any : never) extends (args: infer R) => any ? R : never;

  /** returns true if the type is a union otherwise false */
  type IsUnion<T> = [T] extends [UnionToIntersection<T>] ? false : true;

  type LastInUnion<T> = UnionToIntersection<T extends any ? (arg: T) => any : never> extends (arg: infer R) => any
    ? R
    : never;

  type UnionToTuple<T, U = T> = [T] extends [never]
    ? []
    : [LastInUnion<T>, ...UnionToTuple<Exclude<U, LastInUnion<T>>>];
}
