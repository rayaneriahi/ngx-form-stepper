# ngx-form-stepper

**ngx-form-stepper** est une librairie Angular pour créer des formulaires à étapes avec validations par champ, **extrêmement typée**.

Elle empêche la création d’états invalides **au moment du développement**, pas à l’exécution.

Destinée aux développeurs Angular qui veulent des formulaires robustes, typés et maintenables sans configuration complexe.

## Pourquoi ?

- Formulaires multi-étapes simples à déclarer
- Validation par champ rapide à mettre en place
- Impossible d’associer un mauvais `validator` à un `Input`
- Valeurs toujours cohérentes avec leur type
- Clés de retour uniques obligatoires
- **Aucun `as const` requis**

## Installation

```bash
npm install ngx-form-stepper
```

Les retours et suggestions sont les bienvenus.

N’hésitez pas à ouvrir une issue ou une discussion. Tout retour aide à améliorer la librairie.

## Exemple rapide

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

Chaque type d’`Input` accepte uniquement les valeurs par défaut compatibles.

```typescript
export type InputDefaultValue<T extends InputType> = T extends InputType.Text
  ? string | null
  : T extends InputType.Password
  ? string | null
  : T extends InputType.Email
  ? string | null
  : T extends InputType.Number
  ? number | null
  : T extends InputType.Tel
  ? string | null
  : T extends InputType.Checkbox
  ? boolean | null
  : T extends InputType.Date
  ? Date | null
  : T extends InputType.Select
  ? Select<SelectItemTuple, number | null>
  : never;
```

## Validator

Un `validator` est une fonction qu’on peut passer à un `Input`. Elle prend différents arguments comme la valeur conditionnelle ou le texte de l’erreur.

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
```

Chaque type d’`Input` accepte uniquement les `validators` compatibles.

```typescript
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

## Réutilisation de validators typés

**ngx-form-stepper** permet de les factoriser tout en conservant un typage strict basé sur le type d’`Input`.

```typescript
const reqVal: Validator<'required'> = required('Le champ est requis');
```

Puis de créer des groupes de `validators` compatibles uniquement avec un type d’`Input` donné :

```typescript
const emailValidators: ValidatorTuple<ValidatorsNamesOfType<InputType.Email>> = [
  reqVal,
  email("L'email n'est pas valide"),
];
```

Ce qui est impossible (et volontaire)

```typescript
// ❌ Erreur de compilation
const badValidators: ValidatorTuple<ValidatorsNamesOfType<InputType.Number>> = [
  email('Invalid email'),
];
```

Cette erreur est détectée à la compilation, avant même d’exécuter l’application.

## Select

Tuple d'un ou plusieurs `SelectItem`.

Le `currentIndex` doit obligatoirement être un index valide du tuple ou null.

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

Impossible d'assigner un `currentIndex` invalide.

```typescript
// ❌ Erreur de compilation
invalid = new Input(
  InputType.Select,
  new Select(
    [
      { label: 'Male', value: 'male' },
      { label: 'Female', value: 'female' },
    ],
    5
  ),
  'gender',
  'Gender'
);
```

## Step

Impossible de dupliquer la clé de retour d’un `Input`.

Tuple d’un ou plusieurs `Inputs`.

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

Duplication de `returnKey` interdite (et volontaire)

```typescript
// ❌ Erreur de compilation
new Step([
  new Input(InputType.Text, null, 'name', 'First name'),
  new Input(InputType.Text, null, 'name', 'Last name'),
]);
```

## FormStepper

Impossible de dupliquer la clé de retour d’un `Input` entre deux `Steps`.

Objet de configuration qui dépend du nombre de `Steps`.

Tuple d’une ou plusieurs `Steps`.

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

Un `RedirectItem[]` est un tableau de string ou d’objet `RedirectUrl`, une sorte de mini langage TS permettant de créer des textes avec lien cliquable.

```typescript
actionText = ['You already have an account ?', { url: '/signin', urlText: 'Sign in' }];

export type RedirectUrl = Readonly<{ url: string; urlText: string }>;

export type RedirectText = string;

export type RedirectItem = RedirectText | RedirectUrl;
```

## ButtonText

La propriété `buttonText` du `FormStepper` dépend du nombre de `Steps`.

```typescript
export type SingleStepButtonText = string;

export type MultiStepButtonText = Readonly<{
  final: string;
  previous: string;
  next: string;
}>;
```

## ClassNames

Pour ajouter vos propres styles sur un `FormStepper`, je vous conseille de créer un fichier de style séparé et d'y ajouter vos classes. Vous devrez ensuite importer le fichier créé dans le fichier global de styles de l'app.

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

La propriété `classNames` du `FormStepper` dépend du nombre de `Steps`.

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

## En résumé

- Les erreurs courantes sont impossibles
- Les types guident l’implémentation
- Le formulaire final est toujours cohérent
- Le compilateur devient un allié
