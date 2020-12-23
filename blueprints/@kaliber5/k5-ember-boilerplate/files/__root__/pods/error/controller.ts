import Controller from '@ember/controller';

export default class Error_Controller extends Controller {
  get error(): Error {
    return this.model as Error;
  }
}

// DO NOT DELETE: this is how TypeScript knows how to look up your controllers.
declare module '@ember/controller' {
  interface Registry {
    error: Error_Controller;
  }
}
