import { computed, inject, Injectable } from '@angular/core';
import { FormStepperService } from '../form-stepper.service';
import { MultiStepButtonText, SingleStepButtonText } from './button.types';
import { MultiStepClassNames, SingleStepClassNames } from '../form-stepper.types';

@Injectable()
export class ButtonService {
  private readonly service = inject(FormStepperService);

  private text = computed(() => this.service.formStepper()?.config.buttonText ?? null);
  private classNames = computed(() => this.service.formStepper()?.config.classNames?.button);
  form = computed(() => this.service.stepsForm()?.[this.service.index()] ?? null);

  view = computed(() => {
    const type = this.service.formStepper()?.steps.length === 1 ? 'single' : 'multi';
    const text = this.text();
    const classNames = this.classNames();

    if (type === null || text === null) return null;

    if (type === 'single') {
      return {
        kind: 'single' as const,
        text: text as SingleStepButtonText | null,
        classNames: classNames as SingleStepClassNames['button'] | undefined,
      };
    }

    return {
      kind: 'multi' as const,
      text: text as MultiStepButtonText | null,
      classNames: classNames as MultiStepClassNames['button'] | undefined,
    };
  });

  stepPosition = computed(() => {
    const fs = this.service.formStepper();
    if (fs === null) return null;

    const length = fs.steps.length - 1;
    const index = this.service.index();

    return index === 0
      ? ('first' as const)
      : index === length
        ? ('last' as const)
        : ('middle' as const);
  });

  previous() {
    this.service.previous();
  }
}
