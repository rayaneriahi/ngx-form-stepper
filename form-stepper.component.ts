import { Component, effect, inject, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormStepperService } from './form-stepper.service';
import { StepComponent } from './step/step.component';
import { FormStepper } from './form-stepper.utils';
import { StepTuple } from './step/step.types';
import { RedirectComponent } from './redirect/redirect.component';

@Component({
  selector: 'app-form-stepper',
  templateUrl: './form-stepper.component.html',
  imports: [CommonModule, StepComponent, RedirectComponent],
  providers: [FormStepperService],
})
export class FormStepperComponent {
  private readonly service = inject(FormStepperService);
  formStepper = input.required<FormStepper<StepTuple>>();
  completed = output();

  constructor() {
    effect(() => {
      this.service.setFormStepper(this.formStepper());
    });

    effect(() => {
      if (this.service.completed()) {
        this.completed.emit();
      }
    });
  }
}
