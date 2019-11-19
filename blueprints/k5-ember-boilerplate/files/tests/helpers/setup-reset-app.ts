import { reset as resetWindowMock } from 'ember-window-mock';
import { restoreOriginalTestAdapterException } from '../acceptance/steps/_error-handling';

// @ts-ignore
import { overrideConfig } from 'ember-cli-yadda-opinionated/test-support/-private/config';

export default function setupResetApplicationTestState(hooks: NestedHooks): void {
  hooks.beforeEach(function() {
    // reset state of mocked window
    resetWindowMock();

    // clear local storage before each acceptance test
    window.localStorage.clear();

    // Remove error handler ignore
    restoreOriginalTestAdapterException();
  });
}
