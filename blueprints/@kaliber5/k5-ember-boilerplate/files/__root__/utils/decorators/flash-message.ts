import { assert } from '@ember/debug';
import { getOwner } from '@ember/application';
import ApplicationInstance from '@ember/application/instance';
import FlashMessageService from 'ember-cli-flash/services/flash-messages';
import Intl from 'ember-intl/services/intl';
import translateError from '../t-error';
import { run } from '@ember/runloop';

function translateIfAvailable(intl: Intl, key: string): string | undefined {
  try {
    return intl.lookup(key);
  } catch (e) {
    return undefined;
  }
}

export default function flashMessage(messageSuccess: string, messageError?: string): MethodDecorator {
  return function (_target: unknown, _propertyKey: string, desc: PropertyDescriptor): void {
    assert('flashMessage decorator can only be applied to methods.', typeof desc.value === 'function');

    // eslint-disable-next-line @typescript-eslint/ban-types
    const orig = desc.value as Function;

    desc.value = async function (...args: unknown[]): Promise<unknown> {
      const owner = getOwner(this) as ApplicationInstance;
      assert('Target for flashMessage decorator must have an owner', !!owner);
      const flashMessages = owner.lookup('service:flash-messages') as FlashMessageService;
      assert('No flashMessage service found.', !!flashMessages);
      const intl = owner.lookup('service:intl') as Intl;
      assert('No intl service found.', !!intl);

      try {
        const result = (await orig.apply(this, args)) as unknown;
        flashMessages.success(translateIfAvailable(intl, messageSuccess) ?? messageSuccess);
        return result;
      } catch (e) {
        const m = (messageError && translateIfAvailable(intl, messageError)) ?? translateError(intl, e);
        if (m) {
          flashMessages.danger(m);
        }
        throw e;
      }
    };
  };
}

export function errorMessage(messageError?: string, rethrow = true): MethodDecorator {
  return function (_target: unknown, _propertyKey: string, desc: PropertyDescriptor): void {
    assert('flashMessage decorator can only be applied to methods.', typeof desc.value === 'function');

    // eslint-disable-next-line @typescript-eslint/ban-types
    const orig = desc.value as Function;

    desc.value = async function (...args: unknown[]): Promise<unknown> {
      const owner = getOwner(this) as ApplicationInstance;
      assert('Target for flashMessage decorator must have an owner', !!owner);
      const flashMessages = owner.lookup('service:flash-messages') as FlashMessageService;
      assert('No flashMessage service found.', !!flashMessages);
      const intl = owner.lookup('service:intl') as Intl;
      assert('No intl service found.', !!intl);

      try {
        return (await orig.apply(this, args)) as unknown;
      } catch (e) {
        const m =
          (messageError && translateIfAvailable(intl, messageError)) ??
          translateError(intl, e) ??
          intl.t('errors.generic');

        flashMessages.danger(m);

        if (rethrow) {
          run(() => {
            throw e;
          });
        }

        return undefined;
      }
    };
  };
}
