import { FormStepper } from '../form-stepper.utils';
import { StepTuple } from '../step/step.types';

export type RedirectUrl = Readonly<{ url: string; urlText: string }>;

export type RedirectText = string;

export type RedirectItem = RedirectText | RedirectUrl;

export type RedirectKey = Exclude<
  {
    [K in keyof FormStepper<StepTuple>['config']]: FormStepper<StepTuple>['config'][K] extends
      | RedirectItem[]
      | undefined
      ? K
      : never;
  }[keyof FormStepper<StepTuple>['config']],
  undefined
>;
