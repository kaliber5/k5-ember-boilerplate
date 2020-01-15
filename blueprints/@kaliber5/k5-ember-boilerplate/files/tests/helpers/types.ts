import { Server } from 'ember-cli-mirage';

export interface TestContext {
  owner: any; // eslint-disable-line @typescript-eslint/no-explicit-any
  server: Server;
}
