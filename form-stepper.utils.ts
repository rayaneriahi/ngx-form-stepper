import {
  FormStepperValues,
  HasDuplicateReturnKeys,
  MultiStepConfig,
  SingleStepConfig,
} from './form-stepper.types';
import { MultiStepTuple, StepTuple } from './step/step.types';

export class FormStepper<T extends StepTuple> {
  readonly values: FormStepperValues<T>;

  constructor(
    readonly steps: HasDuplicateReturnKeys<T> extends true ? never : T,
    readonly config: T extends MultiStepTuple ? MultiStepConfig : SingleStepConfig,
  ) {
    this.values = Object.fromEntries(
      steps.flatMap((step) => step.inputs.map((input) => [input.returnKey, input.defaultValue])),
    ) as FormStepperValues<T>;
  }
}
