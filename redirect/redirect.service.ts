import { computed, inject, Injectable, signal } from '@angular/core';
import { FormStepperService } from '../form-stepper.service';
import { RedirectItem, RedirectKey, RedirectText, RedirectUrl } from './redirect.types';

@Injectable()
export class RedirectService {
  private readonly service = inject(FormStepperService);

  key = signal<RedirectKey | null>(null);
  classNames = computed(() => {
    const key = this.key();
    if (key === null) return null;

    return this.service.formStepper()?.config.classNames?.[key];
  });
  redirectItems = computed(() => {
    const key = this.key();
    if (key === null) return null;

    return this.service.formStepper()?.config[key] ?? null;
  });

  isUrl(item: RedirectItem): item is RedirectUrl {
    return typeof item === 'object' && 'url' in item && 'urlText' in item;
  }

  isText(item: RedirectItem): item is RedirectText {
    return typeof item === 'string';
  }
}
