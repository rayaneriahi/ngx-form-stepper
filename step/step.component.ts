import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { StepService } from './step.service';
import { ButtonComponent } from '../button/button.component';
import { InputComponent } from '../input/input.component';

@Component({
  selector: 'app-step',
  templateUrl: './step.component.html',
  imports: [CommonModule, ReactiveFormsModule, ButtonComponent, InputComponent],
  providers: [StepService],
})
export class StepComponent {
  private readonly service = inject(StepService);

  step = this.service.step;
  classNames = this.service.classNames;
  form = this.service.form;

  onSubmit() {
    const form = this.form();
    if (form === null) return;

    form.invalid ? form.markAllAsTouched() : this.service.onSubmit();
  }
}
