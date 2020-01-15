import { Server } from 'ember-cli-mirage';

export interface TestContext {
  owner: any;
  server: Server;
}
