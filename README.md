# ngx-form-stepper

[🇫🇷 Lire la version française](README.fr.md)

**ngx-form-stepper** is an Angular library to create multi-step forms with field-level validations, **extremely typed**.

It prevents creating invalid states **at development time**, not at runtime.

Intended for Angular developers who want robust, typed, and maintainable forms without complex configuration.

## Why?

- Simple multi-step forms declaration
- Quick per-field validation setup
- Impossible to associate a wrong `validator` to an `Input`
- Values always consistent with their type
- Unique return keys required
- **No `as const` needed**

## Installation

```bash
npm install ngx-form-stepper
```

Feedback and suggestions are very welcome.

Please feel free to open an issue or a discussion. Any feedback helps improve the library.

## Quick example

```typescript
step1 = new Step([
  new Input(InputType.Text, null, 'firstName', 'First name', [required('First name is required')]),
  new Input(InputType.Text, null, 'lastName', 'Last name', [required('Last name is required')]),
]);

step2 = new Step([
  new Input(InputType.Email, null, 'email', 'E-mail', [
    required('E-mail is required'),
    email('E-mail is invalid'),
  ]),
  new Input(InputType.Password, null, 'password', 'Password', [
    required('Password is required'),
    strongPassword('Password is too weak'),
  ]),
]);

signupForm = new FormStepper([step1, step2], {
  title: 'Sign in',
  buttonText: { next: 'Next', previous: 'Previous', final: 'Sign up' },
});

onComplete() {
  console.log(signupForm.values);
}
```

```html
<app-form-stepper [formStepper]="signupForm" (completed)="onComplete()" />
```

## Input

Each `Input` type only accepts compatible `validators`.

Examples :

- `email` ❌ forbidden on `number`
- `minLength` ❌ forbidden on `checkbox`
- `confirm` ❌ forbidden on `select`

And only default values that are compatible.

Examples :

- `string` ❌ forbidden on `number`
- `number` ❌ forbidden on `checkbox`
- `string | number` ❌ forbidden on `select`

Return key must be camelCase.

Duplicating a `validator` is impossible.

```typescript
export class Input<
  T extends InputType,
  D extends InputDefaultValue<T>,
  K extends string,
  V extends ValidatorTuple<ValidatorsNamesOfType<T>>
> {
  readonly defaultValue: D;

  constructor(
    readonly type: T,
    defaultValue: D,
    readonly returnKey: IsCamelCase<K> extends true ? K : never,
    readonly label: string,
    readonly validators?: HasDuplicateValidators<V> extends true ? never : V
  ) {
    this.defaultValue = (
      type === InputType.Checkbox ? (defaultValue === null ? false : defaultValue) : defaultValue
    ) as D;
  }
}

export enum InputType {
  Text = 'text',
  Password = 'password',
  Email = 'email',
  Number = 'number',
  Tel = 'tel',
  Checkbox = 'checkbox',
  Date = 'date',
  Select = 'select',
}
```

## Validator

A `validator` is a function that can be passed to an `Input`. It takes different arguments like conditional values or error text.

```typescript
export function minLength(min: number, errorText: string): Validator<'minLength'> {
  const name: StandardValidatorNameFn<'minLength'> = (params: { key: string }) =>
    `${params.key}-minLength`;

  const fn = (params: { key: string }) => (control: AbstractControl<string>) => {
    const customName: StandardValidatorName<'minLength'> = `${params.key}-minLength`;

    return control.value.length < min ? { [customName]: true } : null;
  };

  return {
    kind: 'minLength',
    name,
    fn,
    errorText,
  };
}

export type ValidatorsNames =
  | 'required'
  | 'check'
  | 'confirm'
  | 'minLength'
  | 'maxLength'
  | 'min'
  | 'max'
  | 'integer'
  | 'pattern'
  | 'strongPassword'
  | 'email'
  | 'phone'
  | 'minDate'
  | 'maxDate';

export type ValidatorsNamesOfType<T extends InputType> = T extends InputType.Text
  ? 'required' | 'confirm' | 'minLength' | 'maxLength' | 'pattern'
  : T extends InputType.Password
  ? 'required' | 'confirm' | 'strongPassword' | 'pattern'
  : T extends InputType.Email
  ? 'required' | 'confirm' | 'email'
  : T extends InputType.Number
  ? 'required' | 'confirm' | 'min' | 'max' | 'integer'
  : T extends InputType.Tel
  ? 'required' | 'confirm' | 'phone'
  : T extends InputType.Checkbox
  ? 'check'
  : T extends InputType.Date
  ? 'required' | 'confirm' | 'minDate' | 'maxDate'
  : T extends InputType.Select
  ? 'required'
  : never;
```

## Reusing typed validators

**ngx-form-stepper** allows you to factor them while keeping strict typing based on the `Input` type.

```typescript
const reqVal: Validator<'required'> = required('Le champ est requis');
```

Then you can create groups of `validators` compatible only with a given `Input` type :

```typescript
const emailValidators: ValidatorTuple<ValidatorsNamesOfType<InputType.Email>> = [
  reqVal,
  email("L'email n'est pas valide"),
];
```

What is impossible (and intentional)

```typescript
// ❌ Compilation error
const badValidators: ValidatorTuple<ValidatorsNamesOfType<InputType.Number>> = [
  email('Invalid email'),
];
```

This error is detected at compile time, even before running the application.

## Select

Tuple of one or more `SelectItem`.

`currentIndex` must be a valid index of the tuple or null.

```typescript
select = new Input(
  InputType.Select,
  new Select(
    [
      { label: 'Male', value: 'male' },
      { label: 'Female', value: 'female' },
    ],
    0
  ),
  'gender',
  'Gender'
);

export class Select<T extends SelectItemTuple, I extends number | null> {
  current: SelectItem | null;

  constructor(readonly items: T, readonly currentIndex: HasIndex<T, I> extends true ? I : never) {
    this.current = currentIndex === null ? null : this.items[currentIndex];
  }
}

export type SelectItem = {
  label: string;
  value: string;
};
```

## Step

Impossible to duplicate an `Input` return key.

Tuple of one or more `Inputs`.

```typescript
export class Step<T extends InputTuple> {
  constructor(
    readonly inputs: HasDuplicateReturnKeys<T> extends true ? never : T,
    readonly config?: StepConfig
  ) {}
}

export type StepConfig = Readonly<{
  title: string;
}>;
```

Duplication of `returnKey` is forbidden (and intentional)

```typescript
// ❌ Compilation error
new Step([
  new Input(InputType.Text, null, 'name', 'First name'),
  new Input(InputType.Text, null, 'name', 'Last name'),
]);
```

## FormStepper

Impossible to duplicate an `Input` return key between two `Steps`.

Configuration object depending on the number of `Steps`.

Tuple of one or more `Steps`.

```typescript
export class FormStepper<T extends StepTuple> {
  readonly values: FormStepperValues<T>;

  constructor(
    readonly steps: HasDuplicateReturnKeys<T> extends true ? never : T,
    readonly config: T extends MultiStepTuple ? MultiStepConfig : SingleStepConfig
  ) {
    this.values = Object.fromEntries(
      steps.flatMap((step) => step.inputs.map((input) => [input.returnKey, input.defaultValue]))
    ) as FormStepperValues<T>;
  }
}

export type SingleStepConfig = Readonly<{
  title?: string;
  actionText?: RedirectItem[];
  buttonText: SingleStepButtonText;
  footerText?: RedirectItem[];
  classNames?: SingleStepClassNames;
}>;

export type MultiStepConfig = Readonly<{
  title?: string;
  actionText?: RedirectItem[];
  buttonText: MultiStepButtonText;
  footerText?: RedirectItem[];
  classNames?: MultiStepClassNames;
}>;
```

## RedirectItem[]

A `RedirectItem[]` is an array of strings or `RedirectUrl` objects, a kind of mini TS language to create texts with clickable links.

```typescript
actionText = ['You already have an account ?', { url: '/signin', urlText: 'Sign in' }];

export type RedirectUrl = Readonly<{ url: string; urlText: string }>;

export type RedirectText = string;

export type RedirectItem = RedirectText | RedirectUrl;
```

## ButtonText

`buttonText` property of `FormStepper` depends on the number of `Steps`.

```typescript
export type SingleStepButtonText = string;

export type MultiStepButtonText = Readonly<{
  final: string;
  previous: string;
  next: string;
}>;
```

## ClassNames

To add your own styles to a `FormStepper`, I recommend creating a separate style file and adding your classes there. You should then import the created file into the global styles file of your app.

```typescript
classNames: SingleStepClassNames = {
  title: 'fs-title',
  input: {
    error: 'fs-input-error',
  },
};

form = new FormStepper([this.step], {
  buttonText: 'Submit',
  classNames: this.classNames,
});
```

```css
/* app/fs.css */

.fs-title {
  color: blue;
}

.fs-input-error {
  color: red;
}
```

```css
/* styles.css */

@import 'app/fs.css';
```

`classNames` property of `FormStepper` also depends on the number of `Steps`.

```typescript
export type SingleStepClassNames = DeepPartial<{
  container: string;
  title: string;
  actionText: {
    container: string;
    text: string;
    url: string;
  };
  step: {
    container: string;
    title: string;
    form: string;
    inputContainer: string;
  };
  input: {
    container: string;
    label: string;
    required: string;
    input: string;
    errorContainer: string;
    error: string;
  };
  button: {
    container: string;
    button: string;
    disabled: string;
  };
  footerText: {
    container: string;
    text: string;
    url: string;
  };
}>;

export type MultiStepClassNames = DeepPartial<{
  container: string;
  title: string;
  actionText: {
    container: string;
    text: string;
    url: string;
  };
  step: {
    container: string;
    title: string;
    form: string;
    inputContainer: string;
  };
  input: {
    container: string;
    label: string;
    required: string;
    input: string;
    errorContainer: string;
    error: string;
  };
  button: {
    container: string;
    button: string;
    disabled: string;
    first: string;
    final: string;
    previous: string;
    next: string;
  };
  footerText: {
    container: string;
    text: string;
    url: string;
  };
}>;
```

## In summary

- Common errors are impossible
- Types guide the implementation
- The final form is always consistent
- The compiler becomes an ally
