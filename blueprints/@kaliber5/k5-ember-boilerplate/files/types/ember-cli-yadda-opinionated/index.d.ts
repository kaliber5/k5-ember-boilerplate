// some very rudimentary type definitions to make TS happy

declare module 'ember-cli-yadda-opinionated/test-support' {
  import * as yadda from 'yadda';

  // eslint-disable-next-line @typescript-eslint/ban-types
  type StepDefinition = Record<string, Function>;

  export function setLabel(label: string, selector: string): void;
  export function hasLabel(label: string): boolean;
  export function getLabel(label: string): string;
  export function deleteLabel(label: string): void;
  export function clearLabels(): void;

  // eslint-disable-next-line @typescript-eslint/ban-types
  export function composeSteps(libraryFactory: Function, ...steps: StepDefinition[]): unknown;
  export function setupDictionary(dictionary: yadda.Dictionary): yadda.Dictionary;
  export const opinionatedSteps: StepDefinition;
}
declare module 'ember-cli-yadda-opinionated/test-support/steps/power-select';
declare module 'ember-cli-yadda-opinionated/test-support/steps/power-date-picker';
