import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonService } from './button.service';

@Component({
  selector: 'app-button',
  templateUrl: './button.component.html',
  imports: [CommonModule],
  providers: [ButtonService],
})
export class ButtonComponent {
  private readonly service = inject(ButtonService);

  form = this.service.form;
  view = this.service.view;
  stepPosition = this.service.stepPosition;

  previous() {
    this.service.previous();
  }
}
