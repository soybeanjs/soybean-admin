import type { DataTableColumn } from 'naive-ui';

type UnionColumn<T> = T extends DataTableColumn[] ? TypeUtil.ArrayToUnion<T> : never;

type ColumnKey = 'key';

type InterfaceArray = {
  [key: string]: unknown;
};

type ColumnKeyData = {
  key: unknown;
};

type ExcludeArrayByKey<T extends InterfaceArray[]> = T extends [infer First, ...infer Rest]
  ? First extends ColumnKeyData
    ? Rest extends InterfaceArray[]
      ? [First, ...ExcludeArrayByKey<Rest>]
      : [First]
    : Rest extends InterfaceArray[]
    ? ExcludeArrayByKey<Rest>
    : []
  : [];

type GetUnionColumnKey<T extends InterfaceArray[]> = ColumnKey extends keyof UnionColumn<T>
  ? UnionColumn<T>[ColumnKey]
  : never;

export const columns: DataTableColumn[] = [
  {
    type: 'selection'
  },
  {
    title: 'Name',
    key: 'name',
    align: 'center'
  },
  {
    title: 'Age',
    key: 'age'
  },
  {
    title: 'Address',
    key: 'address'
  }
];

export type UnionColumnKey = GetUnionColumnKey<
  ExcludeArrayByKey<
    [
      {
        type: 'selection';
      },
      {
        title: 'Name';
        key: 'name';
        align: 'center';
      },
      {
        title: 'Age';
        key: 'age';
      },
      {
        title: 'Address';
        key: 'address';
      }
    ]
  >
>;
