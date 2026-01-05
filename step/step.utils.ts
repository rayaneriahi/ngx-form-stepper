import { InputTuple } from '../input/input.types';
import { HasDuplicateReturnKeys, StepConfig } from './step.types';

export class Step<T extends InputTuple> {
  constructor(
    readonly inputs: HasDuplicateReturnKeys<T> extends true ? never : T,
    readonly config?: StepConfig,
  ) {}
}
