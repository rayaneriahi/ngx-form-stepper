import { MultiStepButtonText, SingleStepButtonText } from './button/button.types';
import {
  InputDefaultValue,
  InputTuple,
  InputType,
  ValidatorsNamesOfType,
} from './input/input.types';
import { Input } from './input/input.utils';
import { RedirectItem } from './redirect/redirect.types';
import { ReturnKeys, StepTuple, StepValues } from './step/step.types';
import { Step } from './step/step.utils';
import { ValidatorTuple } from './validator/validator.types';

export type SingleStepClassNames = DeepPartial<{
  container: string;
  title: string;
  actionText: {
    container: string;
    text: string;
    url: string;
  };
  step: {
    container: string;
    title: string;
    form: string;
    inputContainer: string;
  };
  input: {
    container: string;
    label: string;
    required: string;
    input: string;
    errorContainer: string;
    error: string;
  };
  button: {
    container: string;
    button: string;
    disabled: string;
  };
  footerText: {
    container: string;
    text: string;
    url: string;
  };
}>;

export type MultiStepClassNames = DeepPartial<{
  container: string;
  title: string;
  actionText: {
    container: string;
    text: string;
    url: string;
  };
  step: {
    container: string;
    title: string;
    form: string;
    inputContainer: string;
  };
  input: {
    container: string;
    label: string;
    required: string;
    input: string;
    errorContainer: string;
    error: string;
  };
  button: {
    container: string;
    button: string;
    disabled: string;
    first: string;
    final: string;
    previous: string;
    next: string;
  };
  footerText: {
    container: string;
    text: string;
    url: string;
  };
}>;

export type SingleStepConfig = Readonly<{
  title?: string;
  actionText?: RedirectItem[];
  buttonText: SingleStepButtonText;
  footerText?: RedirectItem[];
  classNames?: SingleStepClassNames;
}>;

export type MultiStepConfig = Readonly<{
  title?: string;
  actionText?: RedirectItem[];
  buttonText: MultiStepButtonText;
  footerText?: RedirectItem[];
  classNames?: MultiStepClassNames;
}>;

export type FormStepperValues<T extends StepTuple> = T extends [infer First, ...infer Rest]
  ? First extends Step<infer Inputs>
    ? Rest extends StepTuple
      ? StepValues<Inputs> & FormStepperValues<Rest>
      : StepValues<Inputs>
    : never
  : never;

type _FSReturnKeys<T extends StepTuple> = T extends [infer First, ...infer Rest]
  ? First extends Step<infer Inputs>
    ? Rest extends StepTuple
      ? ReturnKeys<Inputs> | _FSReturnKeys<Rest>
      : ReturnKeys<Inputs>
    : never
  : never;

type _HasDuplicateReturnKeys<T extends InputTuple, RestSteps extends StepTuple> = T extends [
  infer First,
  ...infer Rest,
]
  ? First extends Input<
      InputType,
      InputDefaultValue<InputType>,
      infer Key,
      ValidatorTuple<ValidatorsNamesOfType<InputType>>
    >
    ? Rest extends InputTuple
      ? Key extends _FSReturnKeys<RestSteps>
        ? true
        : _HasDuplicateReturnKeys<Rest, RestSteps>
      : Key extends _FSReturnKeys<RestSteps>
        ? true
        : HasDuplicateReturnKeys<RestSteps>
    : never
  : never;

export type HasDuplicateReturnKeys<T extends StepTuple> = T extends [infer First, ...infer Rest]
  ? First extends Step<infer Inputs>
    ? Rest extends StepTuple
      ? _HasDuplicateReturnKeys<Inputs, Rest>
      : false
    : never
  : never;
