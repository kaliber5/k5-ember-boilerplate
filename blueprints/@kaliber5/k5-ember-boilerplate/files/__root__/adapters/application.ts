import DS from 'ember-data';
import config from '<%= dasherizedPackageName %>/config/environment';

export default class Application extends DS.JSONAPIAdapter {
  namespace = config.apiNamespace;
  host = config.apiHost;
}

// DO NOT DELETE: this is how TypeScript knows how to look up your adapters.
declare module 'ember-data/types/registries/adapter' {
  export default interface AdapterRegistry {
    application: Application;
  }
}
