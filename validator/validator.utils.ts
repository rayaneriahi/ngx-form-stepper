import { AbstractControl } from '@angular/forms';
import {
  ConfirmValidatorName,
  ConfirmValidatorNameFn,
  StandardValidatorName,
  StandardValidatorNameFn,
  Validator,
} from './validator.types';

export function required(errorText: string): Validator<'required'> {
  const name: StandardValidatorNameFn<'required'> = (params: { key: string }) =>
    `${params.key}-required`;

  const fn = (params: { key: string }) => (control: AbstractControl<string>) => {
    const customName: StandardValidatorName<'required'> = `${params.key}-required`;

    return control.value.length > 0 ? null : { [customName]: true };
  };

  return {
    kind: 'required',
    name,
    fn,
    errorText,
  };
}

export function check(errorText: string): Validator<'check'> {
  const name: StandardValidatorNameFn<'check'> = (params: { key: string }) => `${params.key}-check`;

  const fn = (params: { key: string }) => (control: AbstractControl<string | boolean>) => {
    const customName: StandardValidatorName<'check'> = `${params.key}-check`;
    const parsed = control.value === 'true';

    return typeof control.value === 'string' ? (parsed ? null : { [customName]: true }) : null;
  };

  return {
    kind: 'check',
    name,
    fn,
    errorText,
  };
}

export function confirm(confirmLabel: string, errorText: string): Validator<'confirm'> {
  const name: ConfirmValidatorNameFn = (params: { key: string }) => `${params.key}-confirm`;

  const fn =
    (params: { key: string; confirmKey: string }) => (control: AbstractControl<string>) => {
      const customName: ConfirmValidatorName = `${params.key}-confirm`;

      return control.get(params.key)?.value !== control.get(params.confirmKey)?.value
        ? { [customName]: true }
        : null;
    };

  return {
    kind: 'confirm',
    name,
    fn,
    errorText,
    confirmLabel,
  };
}

export function minLength(min: number, errorText: string): Validator<'minLength'> {
  const name: StandardValidatorNameFn<'minLength'> = (params: { key: string }) =>
    `${params.key}-minLength`;

  const fn = (params: { key: string }) => (control: AbstractControl<string>) => {
    const customName: StandardValidatorName<'minLength'> = `${params.key}-minLength`;

    return control.value.length < min ? { [customName]: true } : null;
  };

  return {
    kind: 'minLength',
    name,
    fn,
    errorText,
  };
}

export function maxLength(max: number, errorText: string): Validator<'maxLength'> {
  const name: StandardValidatorNameFn<'maxLength'> = (params: { key: string }) =>
    `${params.key}-maxLength`;

  const fn = (params: { key: string }) => (control: AbstractControl<string>) => {
    const customName: StandardValidatorName<'maxLength'> = `${params.key}-maxLength`;

    return control.value.length > max ? { [customName]: true } : null;
  };

  return {
    kind: 'maxLength',
    name,
    fn,
    errorText,
  };
}

export function min(min: number, errorText: string): Validator<'min'> {
  const name: StandardValidatorNameFn<'min'> = (params: { key: string }) => `${params.key}-min`;

  const fn = (params: { key: string }) => (control: AbstractControl<string>) => {
    const customName: StandardValidatorName<'min'> = `${params.key}-min`;
    const parsed = Number(control.value);

    return Number.isNaN(parsed)
      ? { [customName]: true }
      : parsed < min
        ? { [customName]: true }
        : null;
  };

  return {
    kind: 'min',
    name,
    fn,
    errorText,
  };
}

export function max(max: number, errorText: string): Validator<'max'> {
  const name: StandardValidatorNameFn<'max'> = (params: { key: string }) => `${params.key}-max`;

  const fn = (params: { key: string }) => (control: AbstractControl<string>) => {
    const customName: StandardValidatorName<'max'> = `${params.key}-max`;
    const parsed = Number(control.value);

    return Number.isNaN(parsed)
      ? { [customName]: true }
      : parsed > max
        ? { [customName]: true }
        : null;
  };

  return {
    kind: 'max',
    name,
    fn,
    errorText,
  };
}

export function integer(errorText: string): Validator<'integer'> {
  const name: StandardValidatorNameFn<'integer'> = (params: { key: string }) =>
    `${params.key}-integer`;

  const fn = (params: { key: string }) => (control: AbstractControl<string>) => {
    const customName: StandardValidatorName<'integer'> = `${params.key}-integer`;
    const parsed = Number(control.value);

    return Number.isNaN(parsed)
      ? { [customName]: true }
      : Number.isInteger(parsed)
        ? null
        : { [customName]: true };
  };

  return {
    kind: 'integer',
    name,
    fn,
    errorText,
  };
}

export function pattern(pattern: RegExp, errorText: string): Validator<'pattern'> {
  const name: StandardValidatorNameFn<'pattern'> = (params: { key: string }) =>
    `${params.key}-pattern`;

  const fn = (params: { key: string }) => (control: AbstractControl<string>) => {
    const customName: StandardValidatorName<'pattern'> = `${params.key}-pattern`;

    return pattern.test(control.value) ? null : { [customName]: true };
  };

  return {
    kind: 'pattern',
    name,
    fn,
    errorText,
  };
}

export function strongPassword(errorText: string): Validator<'strongPassword'> {
  const name: StandardValidatorNameFn<'strongPassword'> = (params: { key: string }) =>
    `${params.key}-strongPassword`;

  const fn = (params: { key: string }) => (control: AbstractControl<string>) => {
    const customName: StandardValidatorName<'strongPassword'> = `${params.key}-strongPassword`;
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_\-+=]).{8,}$/;

    return regex.test(control.value) ? null : { [customName]: true };
  };

  return {
    kind: 'strongPassword',
    name,
    fn,
    errorText,
  };
}

export function email(errorText: string): Validator<'email'> {
  const name: StandardValidatorNameFn<'email'> = (params: { key: string }) => `${params.key}-email`;

  const fn = (params: { key: string }) => (control: AbstractControl<string>) => {
    const customName: StandardValidatorName<'email'> = `${params.key}-email`;
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    return regex.test(control.value) ? null : { [customName]: true };
  };

  return {
    kind: 'email',
    name,
    fn,
    errorText,
  };
}

export function phone(errorText: string): Validator<'phone'> {
  const name: StandardValidatorNameFn<'phone'> = (params: { key: string }) => `${params.key}-phone`;

  const fn = (params: { key: string }) => (control: AbstractControl<string>) => {
    const customName: StandardValidatorName<'phone'> = `${params.key}-phone`;
    const regex = /^\+?[0-9]{7,15}$/;
    const cleared = control.value.replace(/\s|-/g, '');

    return regex.test(cleared) ? null : { [customName]: true };
  };

  return {
    kind: 'phone',
    name,
    fn,
    errorText,
  };
}

export function minDate(min: Date, errorText: string): Validator<'minDate'> {
  const name: StandardValidatorNameFn<'minDate'> = (params: { key: string }) =>
    `${params.key}-minDate`;

  const fn = (params: { key: string }) => (control: AbstractControl<string>) => {
    const customName: StandardValidatorName<'minDate'> = `${params.key}-minDate`;
    const parsed = new Date(control.value);

    return parsed.getTime() < min.getTime() ? { [customName]: true } : null;
  };

  return {
    kind: 'minDate',
    name,
    fn,
    errorText,
  };
}

export function maxDate(max: Date, errorText: string): Validator<'maxDate'> {
  const name: StandardValidatorNameFn<'maxDate'> = (params: { key: string }) =>
    `${params.key}-maxDate`;

  const fn = (params: { key: string }) => (control: AbstractControl<string>) => {
    const customName: StandardValidatorName<'maxDate'> = `${params.key}-maxDate`;
    const parsed = new Date(control.value);

    return parsed.getTime() > max.getTime() ? { [customName]: true } : null;
  };

  return {
    kind: 'maxDate',
    name,
    fn,
    errorText,
  };
}
