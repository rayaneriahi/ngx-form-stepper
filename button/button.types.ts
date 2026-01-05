export type SingleStepButtonText = string;

export type MultiStepButtonText = Readonly<{
  final: string;
  previous: string;
  next: string;
}>;
