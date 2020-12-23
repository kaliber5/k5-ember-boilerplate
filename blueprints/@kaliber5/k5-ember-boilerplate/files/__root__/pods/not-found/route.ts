import Route from '@ember/routing/route';
import NotFoundError from '<%= dasherizedPackageName %>/utils/errors/not-found';

export default class NotFoundRoute extends Route {
  beforeModel(): void {
    throw new NotFoundError();
  }
}
