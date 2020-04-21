'use strict';

const fs = require('fs');

module.exports = {
  description: '',

  normalizeEntityName() {
  },

  // locals(options) {
  // },

  async beforeInstall(options, locals) {
    await this._customizeDeploymentWorkflow(locals);
    await this._installDependencies();
  },

  async afterInstall(/* options */) {
    this._modifyPackageJson();
    this.ui.writeInfoLine('Deployment has been set up. See the docs for next steps: https://github.com/kaliber5/k5-ember-boilerplate/blob/master/README.md#deployment-on-server-using-ssh');
  },

  async _customizeDeploymentWorkflow(locals) {
    const environments = ['production', 'staging'];

    for (const env of environments) {
      const answers = await this._queryDeployment(env);

      for (let key in answers) {
        locals[`${key}_${env}`] = answers[key];
      }
    }

    locals.regexEscapedPreviewHost = locals.host_staging.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
  },

  async _queryDeployment(environment) {
    this.ui.writeInfoLine(`Setting up ${environment} environment...`);

    const prefix = `[${environment}]`;
    return this.ui.prompt(
      [
        {
          type: 'input',
          name: 'host',
          message: 'What is the domain?',
          default: `${environment !== 'production' ? environment + '.' : ''}${this.project.name()}.de`,
          prefix,
          validate(host) {
            try {
              new URL(`http://${host}`);
              return true;
            } catch(e) {
              return e.message;
            }
          }
        },
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
          default(answers) {
            return `https://api.${answers.host}`;
          },
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
        { name: 'ember-cli-deploy-revision-data' },
        { name: 'ember-cli-deploy-display-revisions' },
      ]
    });
  },

  _modifyPackageJson() {
    const pkgPath = `${this.project.root}/package.json`;

    let pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf-8'));
    pkg.scripts.deploy = 'ember deploy';

    fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + '\n');
    this.ui.writeLine('Modified package.json');
  }
};
