import { computed, inject, Injectable, signal } from '@angular/core';
import { FormStepperService } from '../form-stepper.service';
import { InputType } from './input.types';
import { Select } from './select/select.utils';
import { SelectItemTuple } from './select/select.types';

@Injectable()
export class InputService {
  private readonly service = inject(FormStepperService);

  key = signal<string | null>(null);
  confirmKey = computed(() => {
    const key = this.key();
    if (key === null) return null;

    return this.service.getConfirmReturnKey(key);
  });
  classNames = computed(() => this.service.formStepper()?.config.classNames?.input);
  input = computed(
    () =>
      this.service
        .formStepper()
        ?.steps[this.service.index()]?.inputs.find((input) => input.returnKey === this.key()) ??
      null,
  );
  confirmValidator = computed(
    () => this.input()?.validators?.find((v) => v.kind === 'confirm') ?? null,
  );
  othersValidators = computed(
    () => this.input()?.validators?.filter((v) => v.kind !== 'confirm') ?? null,
  );

  form = computed(() => this.service.stepsForm()?.[this.service.index()] ?? null);
  control = computed(() => {
    const key = this.key();
    if (key === null) return null;

    return this.form()?.get(key) ?? null;
  });
  confirmControl = computed(() => {
    const confirmKey = this.confirmKey();
    if (confirmKey === null) return null;

    return this.form()?.get(confirmKey) ?? null;
  });

  inputContainerCn = computed(
    () => this.service.formStepper()?.config.classNames?.step?.inputContainer,
  );

  isRequired = computed(() => {
    const othersValidators = this.othersValidators();
    if (othersValidators === null) return false;

    return othersValidators.some((v) => v.kind === 'required');
  });

  selectItems = computed(() => {
    const input = this.input();
    if (input === null || input.type !== InputType.Select) return null;

    return (input.defaultValue as Select<SelectItemTuple, any>).items;
  });

  private inputElement = signal<HTMLInputElement | null>(null);

  private currentValue: null | boolean = null;
  private isCheckbox = false;

  setKey(key: string) {
    this.key.set(key);
  }

  setInputElement(element: HTMLInputElement) {
    this.inputElement.set(element);
  }

  verifyCheckbox() {
    const control = this.control();
    const element = this.inputElement();
    if (control === null || element === null || !this.isCheckbox) return;

    this.currentValue = !this.currentValue;
    element.checked = this.currentValue;

    control.setValue(this.currentValue);
  }

  firstVerifyCheckbox() {
    const input = this.input();
    const element = this.inputElement();
    const control = this.control();
    if (input === null || element === null || control === null || input.type !== InputType.Checkbox)
      return;

    this.isCheckbox = true;
    this.currentValue =
      (input.defaultValue as boolean | null) === null
        ? false
        : (input.defaultValue as boolean | null) === false
          ? false
          : true;

    element.checked = this.currentValue;
  }
}
