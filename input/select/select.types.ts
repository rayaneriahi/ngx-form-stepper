export type SelectItem = {
  label: string;
  value: string;
};

export type SelectItemTuple = [SelectItem, ...SelectItem[]];

type _SelectIndex<T extends SelectItemTuple> = {
  [I in keyof T]: I extends `${infer K extends number}` ? K : never;
}[number];

export type HasIndex<T extends SelectItemTuple, I extends number | null> = I extends null
  ? true
  : I extends _SelectIndex<T>
    ? true
    : false;
