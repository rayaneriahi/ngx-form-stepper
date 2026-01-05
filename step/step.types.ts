import {
  InputDefaultValue,
  InputTuple,
  InputType,
  InputValue,
  ValidatorsNamesOfType,
} from '../input/input.types';
import { Input } from '../input/input.utils';
import { ValidatorTuple } from '../validator/validator.types';
import { Step } from './step.utils';

export type StepValues<T extends InputTuple> = T extends [infer First, ...infer Rest]
  ? First extends Input<infer T, infer D, infer K, infer V>
    ? Rest extends InputTuple
      ? { [K2 in K]: InputValue<T, D> } & StepValues<Rest>
      : { [K2 in K]: InputValue<T, D> }
    : never
  : never;

export type ReturnKeys<T extends InputTuple> = T[number]['returnKey'];

export type HasDuplicateReturnKeys<T extends InputTuple> = T extends [infer First, ...infer Rest]
  ? First extends Input<
      InputType,
      InputDefaultValue<InputType>,
      infer Key,
      ValidatorTuple<ValidatorsNamesOfType<InputType>>
    >
    ? Rest extends InputTuple
      ? Key extends ReturnKeys<Rest>
        ? true
        : HasDuplicateReturnKeys<Rest>
      : false
    : never
  : never;

export type StepConfig = Readonly<{
  title: string;
}>;

export type StepTuple = [Step<InputTuple>, ...Step<InputTuple>[]];

export type MultiStepTuple = [Step<InputTuple>, Step<InputTuple>, ...Step<InputTuple>[]];
