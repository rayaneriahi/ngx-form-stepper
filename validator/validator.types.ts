import { ValidatorFn } from '@angular/forms';

export type ValidatorsNames =
  | 'required'
  | 'check'
  | 'confirm'
  | 'minLength'
  | 'maxLength'
  | 'min'
  | 'max'
  | 'integer'
  | 'pattern'
  | 'strongPassword'
  | 'email'
  | 'phone'
  | 'minDate'
  | 'maxDate';

export type StandardValidatorName<N extends ValidatorsNames> = `${string}-${N}`;

export type StandardValidatorNameFn<N extends ValidatorsNames> = (params: {
  key: string;
}) => StandardValidatorName<N>;

type StandardValidatorFn = (params: { key: string }) => ValidatorFn;

type StandardValidator<N extends ValidatorsNames> = Readonly<{
  kind: N;
  name: StandardValidatorNameFn<N>;
  fn: StandardValidatorFn;
  errorText: string;
}>;

export type ConfirmValidatorName = `${string}-confirm`;

export type ConfirmValidatorNameFn = (params: { key: string }) => ConfirmValidatorName;

type ConfirmValidatorFn = (params: { key: string; confirmKey: string }) => ValidatorFn;

type ConfirmValidator = Readonly<{
  kind: 'confirm';
  name: ConfirmValidatorNameFn;
  fn: ConfirmValidatorFn;
  confirmLabel: string;
  errorText: string;
}>;

export type Validator<N extends ValidatorsNames> = N extends 'confirm'
  ? ConfirmValidator
  : StandardValidator<N>;

export type ValidatorsKinds<V extends ValidatorTuple<ValidatorsNames>> = V[number]['kind'];

export type ValidatorTuple<N extends ValidatorsNames> = [Validator<N>, ...Validator<N>[]];
