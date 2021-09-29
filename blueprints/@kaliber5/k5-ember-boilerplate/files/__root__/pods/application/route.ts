import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import Intl from 'ember-intl/services/intl';
import { isTesting, macroCondition } from '@embroider/macros';

export default class ApplicationRoute extends Route {
  @service intl!: Intl;

  queryParams = {
    locale: { refreshModel: true },
  };

  model({ locale = macroCondition(isTesting()) ? 'en-us' : 'de-de' }: { locale: string }): void {
    this.intl.setLocale(locale);
  }

  afterModel(): void {
    // Remove static spinner in index.html after app has booted
    if (typeof document !== 'undefined') {
      const loader = document.getElementById('app-loading');
      loader?.parentElement?.removeChild(loader);
    }
  }
}
