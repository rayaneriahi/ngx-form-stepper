import { IsCamelCase } from '../common/common.types';
import { ValidatorTuple } from '../validator/validator.types';
import {
  HasDuplicateValidators,
  InputDefaultValue,
  InputType,
  ValidatorsNamesOfType,
} from './input.types';

export class Input<
  T extends InputType,
  D extends InputDefaultValue<T>,
  K extends string,
  V extends ValidatorTuple<ValidatorsNamesOfType<T>>
> {
  readonly defaultValue: D;

  constructor(
    readonly type: T,
    defaultValue: D,
    readonly returnKey: IsCamelCase<K> extends true ? K : never,
    readonly label: string,
    readonly validators?: HasDuplicateValidators<V> extends true ? never : V
  ) {
    this.defaultValue = (
      type === InputType.Checkbox ? (defaultValue === null ? false : defaultValue) : defaultValue
    ) as D;
  }
}
