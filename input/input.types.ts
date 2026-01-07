import {
  Validator,
  ValidatorTuple,
  ValidatorsKinds,
  ValidatorsNames,
} from '../validator/validator.types';
import { Input } from './input.utils';
import { SelectItemTuple } from './select/select.types';
import { Select } from './select/select.utils';

export enum InputType {
  Text = 'text',
  Password = 'password',
  Email = 'email',
  Number = 'number',
  Tel = 'tel',
  Checkbox = 'checkbox',
  Date = 'date',
  Select = 'select',
}

export type InputDefaultValue<T extends InputType> = T extends InputType.Text
  ? string | null
  : T extends InputType.Password
  ? string | null
  : T extends InputType.Email
  ? string | null
  : T extends InputType.Number
  ? number | null
  : T extends InputType.Tel
  ? string | null
  : T extends InputType.Checkbox
  ? boolean | null
  : T extends InputType.Date
  ? Date | null
  : T extends InputType.Select
  ? Select<SelectItemTuple, number | null>
  : never;

export type InputValue<
  T extends InputType,
  D extends InputDefaultValue<T>
> = T extends InputType.Text
  ? D extends null
    ? string | null
    : string
  : T extends InputType.Password
  ? string | null
  : T extends InputType.Email
  ? string | null
  : T extends InputType.Number
  ? number | null
  : T extends InputType.Tel
  ? string | null
  : T extends InputType.Checkbox
  ? boolean
  : T extends InputType.Date
  ? Date | null
  : T extends InputType.Select
  ? Select<SelectItemTuple, number | null>
  : never;

export type ValidatorsNamesOfType<T extends InputType> = T extends InputType.Text
  ? 'required' | 'confirm' | 'minLength' | 'maxLength' | 'pattern'
  : T extends InputType.Password
  ? 'required' | 'confirm' | 'strongPassword' | 'pattern'
  : T extends InputType.Email
  ? 'required' | 'confirm' | 'email'
  : T extends InputType.Number
  ? 'required' | 'confirm' | 'min' | 'max' | 'integer'
  : T extends InputType.Tel
  ? 'required' | 'confirm' | 'phone'
  : T extends InputType.Checkbox
  ? 'check'
  : T extends InputType.Date
  ? 'required' | 'confirm' | 'minDate' | 'maxDate'
  : T extends InputType.Select
  ? 'required'
  : never;

export type HasDuplicateValidators<V extends ValidatorTuple<ValidatorsNames>> = V extends [
  infer First,
  ...infer Rest
]
  ? First extends Validator<ValidatorsNames>
    ? Rest extends ValidatorTuple<ValidatorsNames>
      ? First['kind'] extends ValidatorsKinds<Rest>
        ? true
        : HasDuplicateValidators<Rest>
      : false
    : never
  : never;

export type InputTuple = [
  Input<
    InputType,
    InputDefaultValue<InputType>,
    string,
    ValidatorTuple<ValidatorsNamesOfType<InputType>>
  >,
  ...Input<
    InputType,
    InputDefaultValue<InputType>,
    string,
    ValidatorTuple<ValidatorsNamesOfType<InputType>>
  >[]
];
