import { Component, effect, inject, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RedirectService } from './redirect.service';
import { RouterLink } from '@angular/router';
import { RedirectItem, RedirectKey } from './redirect.types';

@Component({
  selector: 'app-redirect',
  templateUrl: './redirect.component.html',
  imports: [CommonModule, RouterLink],
  providers: [RedirectService],
})
export class RedirectComponent {
  private readonly service = inject(RedirectService);

  key = input.required<RedirectKey>();
  classNames = this.service.classNames;
  redirectItems = this.service.redirectItems;

  constructor() {
    effect(() => this.service.key.set(this.key()));
  }

  isUrl(item: RedirectItem) {
    return this.service.isUrl(item);
  }

  isText(item: RedirectItem) {
    return this.service.isText(item);
  }
}
