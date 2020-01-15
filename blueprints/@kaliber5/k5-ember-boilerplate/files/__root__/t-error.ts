import Helper from '@ember/component/helper';
import translateError from '<%= dasherizedPackageName %>/utils/t-error';
import { inject as service } from '@ember/service';

export default class TranslateError extends Helper {
  @service
  intl: any;

  compute([error]: any[]): string | null {
    return error ? translateError(this.intl, error) : null;
  }
}
