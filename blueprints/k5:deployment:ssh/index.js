'use strict';

const replace = require('replace-in-file');

module.exports = {
  description: '',

  normalizeEntityName() {
  },

  // locals(options) {
  // },

  async beforeInstall(/* options */) {
    await this._installDependencies();
  },

  async afterInstall(/* options */) {
    await this._customizeDeploymentWorkflow();
  },

  async _customizeDeploymentWorkflow() {
    const environments = ['production', 'staging'];

    for (const env of environments) {
      const answers = await this._queryDeployment(env);

      await replace({
        files: '.github/workflows/deploy.yml',
        from: new RegExp(`###([a-z_]+)_${env}###`, 'g'),
        to: (match, p1) => answers[p1] || match,
      });
    }
  },

  async _queryDeployment(environment) {
    this.ui.writeInfoLine(`Setting up ${environment} environment...`);

    const prefix = `[${environment}]`;
    return this.ui.prompt(
      [
        {
          type: 'input',
          name: 'ssh_user',
          message: 'What is the SSH user?',
          prefix,
        },
        {
          type: 'input',
          name: 'ssh_host',
          message: 'What is the SSH hostname?',
          default: 'www2.kaliber5.de',
          prefix,
        },
        {
          type: 'input',
          name: 'ssh_path',
          message: 'What is the file path on the server?',
          prefix,
          default(answers) {
            return `/var/www/${answers.ssh_user}/htdocs/frontend`;
          },
        },
        {
          type: 'input',
          name: 'api_host',
          message: 'What is the API host?',
          default: `https://api.${environment !== 'production' ? environment + '.' : ''}${this.project.name()}.de`,
          prefix,
          validate(host) {
            try {
              new URL(host);
              return true;
            } catch(e) {
              return e.message;
            }
          }
        },
      ]
    );
  },

  async _installDependencies() {
    this.ui.writeInfoLine('Installing deployment dependencies...');

    await this.addAddonsToProject({
      packages: [
        { name: 'ember-cli-deploy' },
        { name: 'ember-cli-deploy-build' },
        { name: 'ember-cli-deploy-simply-ssh' },
      ]
    });
  }
};
