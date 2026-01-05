import { Component, effect, ElementRef, inject, input as ngInput, viewChild } from '@angular/core';
import { InputService } from './input.service';
import { CommonModule } from '@angular/common';
import { Input } from './input.utils';
import { ControlContainer, FormGroupDirective, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-input',
  templateUrl: './input.component.html',
  imports: [CommonModule, ReactiveFormsModule],
  providers: [InputService],
  viewProviders: [
    {
      provide: ControlContainer,
      useExisting: FormGroupDirective,
    },
  ],
})
export class InputComponent {
  private readonly service = inject(InputService);

  key = ngInput.required<Input<any, any, string, any>['returnKey']>();
  inputElement = viewChild<ElementRef<HTMLInputElement>>('input');

  confirmKey = this.service.confirmKey;
  classNames = this.service.classNames;
  input = this.service.input;
  confirmValidator = this.service.confirmValidator;
  othersValidators = this.service.othersValidators;
  form = this.service.form;
  control = this.service.control;
  confirmControl = this.service.confirmControl;
  inputContainerCn = this.service.inputContainerCn;
  isRequired = this.service.isRequired;
  selectItems = this.service.selectItems;

  constructor() {
    effect(() => this.service.setKey(this.key()));
    effect(() => {
      const inputElement = this.inputElement();
      if (inputElement === undefined) return;

      this.service.setInputElement(inputElement.nativeElement);
    });
    effect(() => this.service.firstVerifyCheckbox());
  }

  handleClick() {
    this.service.verifyCheckbox();
  }
}
