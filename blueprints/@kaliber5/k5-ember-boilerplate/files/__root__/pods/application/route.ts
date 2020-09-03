import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import Intl from 'ember-intl/services/intl';

export default class ApplicationRoute extends Route {
  @service intl!: Intl;

  beforeModel(): void | Promise<unknown> {
    this.intl.setLocale('de-de');
  }

  afterModel(): void {
    // Remove static spinner in index.html after app has booted
    if (typeof document !== 'undefined') {
      const loader = document.getElementById('app-loading');
      loader?.parentElement?.removeChild(loader);
    }
  }
}
