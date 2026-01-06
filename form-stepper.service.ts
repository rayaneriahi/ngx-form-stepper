import { Injectable, signal } from "@angular/core";
import { FormControl, FormGroup, ValidatorFn } from "@angular/forms";
import { FormStepper } from "./form-stepper.utils";
import { MultiStepTuple, StepTuple } from "./step/step.types";
import { InputType } from "./input/input.types";
import { Select } from "./input/select/select.utils";
import { SelectItemTuple } from "./input/select/select.types";

@Injectable()
export class FormStepperService {
  readonly formStepper = signal<FormStepper<StepTuple | MultiStepTuple> | null>(
    null
  );
  stepsForm = signal<Record<string, FormGroup> | null>(null);
  index = signal(0);
  completed = signal<boolean>(false);

  setFormStepper(formStepper: FormStepper<StepTuple>) {
    this.formStepper.update(() => formStepper);
    this.setStepsForm();
  }

  private dateToInputFormat(date: Date): `${number}-${string}-${string}` {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const day = date.getDate().toString().padStart(2, "0");

    return `${year}-${month}-${day}`;
  }

  setStepsForm() {
    const steps = this.formStepper()?.steps ?? null;
    if (steps === null) return;

    const forms = Object.fromEntries(
      steps.map((step, index) => {
        const validators = step.inputs.flatMap((i) => {
          const cv = i.validators
            ? i.validators.find((v) => v.kind === "confirm") ?? null
            : null;

          if (cv === null) return [];

          return cv.fn({
            key: i.returnKey,
            confirmKey: this.getConfirmReturnKey(i.returnKey),
          });
        });

        return [
          index,
          new FormGroup(
            Object.fromEntries(
              step.inputs.flatMap((input) => {
                const confirm = input.validators
                  ? input.validators.find((v) => v.kind === "confirm") ?? null
                  : null;

                const other = input.validators
                  ? input.validators.filter((v) => v.kind !== "confirm")
                  : [];

                const validators: ValidatorFn[] = [];

                other.forEach((v) => {
                  validators.push(v.fn({ key: input.returnKey }));
                });

                const defaultValue =
                  input.defaultValue === null
                    ? input.type === InputType.Checkbox
                      ? "false"
                      : ""
                    : input.type === InputType.Number
                    ? Number.isNaN(input.defaultValue)
                      ? ""
                      : `${input.defaultValue}`
                    : input.type === InputType.Checkbox
                    ? `${input.defaultValue}`
                    : input.type === InputType.Date
                    ? this.dateToInputFormat(input.defaultValue as Date)
                    : input.type === InputType.Select
                    ? (
                        input.defaultValue as Select<
                          SelectItemTuple,
                          number | null
                        >
                      ).current === null
                      ? ""
                      : (
                          input.defaultValue as Select<
                            SelectItemTuple,
                            number | null
                          >
                        ).current!.value
                    : (input.defaultValue as Exclude<
                        typeof input.defaultValue,
                        | boolean
                        | number
                        | Date
                        | Select<SelectItemTuple, number | null>
                      >);

                const controls = [
                  [
                    input.returnKey,
                    new FormControl<string>(defaultValue, validators),
                  ],
                ];

                if (confirm !== null) {
                  controls.push([
                    this.getConfirmReturnKey(input.returnKey),
                    new FormControl<string>(defaultValue),
                  ]);
                }

                return controls;
              })
            ),
            { validators }
          ),
        ];
      })
    );

    this.stepsForm.update(() => forms);
  }

  getConfirmReturnKey(returnKey: string) {
    return `confirm-${returnKey}`;
  }

  updateValues(values: Record<string, string>) {
    const fs = this.formStepper();
    const step = this.formStepper()?.steps[this.index()] ?? null;
    if (fs === null || step === null) return;

    Object.entries(values).forEach(([key, value]) => {
      const type = step.inputs.find((input) => input.returnKey === key)?.type;

      if (type === undefined) return;

      fs.values[key] =
        type === InputType.Checkbox
          ? value === "true"
          : value === ""
          ? null
          : type === InputType.Number
          ? Number.isNaN(Number(value))
            ? null
            : Number(value)
          : type === InputType.Tel
          ? value.replace(/\s|-/g, "")
          : type === InputType.Date
          ? new Date(value)
          : value;
    });

    step.inputs.forEach((input) => {
      const confirm = input.validators
        ? input.validators.find((v) => v.kind === "confirm") ?? null
        : null;

      if (confirm !== null) {
        const confirmKey = this.getConfirmReturnKey(input.returnKey);
        delete fs.values[confirmKey];
      }
    });
  }

  next() {
    const index = this.index();
    const length = this.formStepper()?.steps.length ?? null;
    if (length === null) return;

    if (index < length - 1) {
      this.index.update((index) => index + 1);
    } else {
      this.complete();
    }
  }

  previous() {
    const index = this.index();
    if (index > 0) {
      this.index.update((index) => index - 1);
    }
  }

  complete() {
    this.completed.update(() => true);
  }
}
