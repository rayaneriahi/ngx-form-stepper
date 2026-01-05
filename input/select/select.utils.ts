import { HasIndex, SelectItem, SelectItemTuple } from './select.types';

export class Select<T extends SelectItemTuple, I extends number | null> {
  current: SelectItem | null;

  constructor(
    readonly items: T,
    readonly currentIndex: HasIndex<T, I> extends true ? I : never,
  ) {
    this.current = currentIndex === null ? null : this.items[currentIndex];
  }
}
