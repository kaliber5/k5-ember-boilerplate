import { isPresent } from '@ember/utils';
import { underscore } from '@ember/string';
import DS from 'ember-data';

const ErrorMapping = [
  [DS.UnauthorizedError, 'unauthorized'],
  [DS.ForbiddenError, 'forbidden'],
  [DS.NotFoundError, 'not_found'],
  [DS.ServerError, 'server_error'],
];

export function errorTranslationKey(intl: any, error: any, keyPrefix = 'exceptions'): string | void {
  const rawMessage = isPresent(error.message) ? error.message : String(error);
  let key = `${keyPrefix}.${rawMessage}`;

  // try translation of error.message
  if (intl.exists(key)) {
    return key;
  }

  // check if error is an ember-data error with a known mapping
  if (error instanceof DS.AdapterError) {
    const found = ErrorMapping.find(([klass]) => error instanceof (klass as any));
    if (found) {
      key = `${keyPrefix}.${found[1]}`;
      if (intl.exists(key)) {
        return key;
      }
    }
  }

  // try translation of error.messageKey
  if (isPresent(error.messageKey)) {
    key = `${keyPrefix}.${error.messageKey}`;
    if (intl.exists(key)) {
      return key;
    }
  }

  // try translation of error.description
  if (typeof error.description === 'string') {
    key = `${keyPrefix}.${underscore(error.description.toLowerCase())}`;
    if (intl.exists(key)) {
      return key;
    }
  }
}

export default function translateError(intl: any, error: any, keyPrefix = 'exceptions'): string {
  const key = errorTranslationKey(intl, error, keyPrefix);

  if (key) {
    return intl.t(key);
  }

  const rawMessage = isPresent(error.message) ? error.message : String(error);
  return rawMessage;
}
