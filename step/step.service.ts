import { computed, inject, Injectable } from '@angular/core';
import { FormStepperService } from '../form-stepper.service';

@Injectable()
export class StepService {
  private readonly service = inject(FormStepperService);

  step = computed(() => this.service.formStepper()?.steps[this.service.index()] ?? null);
  classNames = computed(() => this.service.formStepper()?.config.classNames?.step);
  form = computed(() => this.service.stepsForm()?.[this.service.index()] ?? null);

  onSubmit() {
    const form = this.form();
    if (form === null) return;

    const values = form.getRawValue() as Record<string, string>;
    this.service.updateValues(values);
    this.service.next();
  }
}
