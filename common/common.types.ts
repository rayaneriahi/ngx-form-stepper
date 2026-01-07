type _AuthLetter =
  | 'A'
  | 'B'
  | 'C'
  | 'D'
  | 'E'
  | 'F'
  | 'G'
  | 'H'
  | 'I'
  | 'J'
  | 'K'
  | 'L'
  | 'M'
  | 'N'
  | 'O'
  | 'P'
  | 'Q'
  | 'R'
  | 'S'
  | 'T'
  | 'U'
  | 'V'
  | 'W'
  | 'X'
  | 'Y'
  | 'Z';

type _AuthNumber = '0' | '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9';

export type IsCamelCase<S extends string> = S extends ''
  ? false
  : S extends `${infer First}${infer Rest}`
  ? Uppercase<First> extends _AuthLetter
    ? First extends Lowercase<First>
      ? _IsCamelCase<Rest>
      : false
    : false
  : never;

type _IsCamelCase<S extends string> = S extends `${infer First}${infer Rest}`
  ? Uppercase<First> extends _AuthLetter | _AuthNumber
    ? Rest extends ''
      ? true
      : _IsCamelCase<Rest>
    : false
  : never;

export type DeepPartial<T> = {
  [K in keyof T]?: T[K] extends object ? DeepPartial<T[K]> : T[K];
};
