import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import Intl from 'ember-intl/services/intl';

export default class ApplicationRoute extends Route {
  @service intl!: Intl;

  beforeModel(): void | Promise<any> {
    this.intl.setLocale('de-de');
  }
}
