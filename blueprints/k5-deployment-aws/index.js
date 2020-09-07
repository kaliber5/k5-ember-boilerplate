'use strict';

const fs = require('fs');

module.exports = {
  description: '',

  normalizeEntityName() {},

  // locals(options) {
  // },

  async beforeInstall(options, locals) {
    await this._customizeDeploymentWorkflow(locals);
    await this._installDependencies();
  },

  async afterInstall(/* options */) {
    this._modifyPackageJson();
    this.ui.writeInfoLine(
      'Deployment has been set up. See the docs for next steps: https://github.com/kaliber5/k5-ember-boilerplate/blob/master/README.md#deployment-on-server-using-aws-cloudfronts3'
    );
  },

  async _customizeDeploymentWorkflow(locals) {
    const environments = ['production', 'staging', 'preview'];

    for (const env of environments) {
      const answers = await this._queryDeployment(env);

      for (let key in answers) {
        locals[`${key}_${env}`] = answers[key];
      }
    }

    locals.regexEscapedPreviewHost = locals.host_staging.replace(
      /[-\/\\^$*+?.()|[\]{}]/g,
      '\\$&'
    );
  },

  async _queryDeployment(environment) {
    this.ui.writeInfoLine(`Setting up ${environment} environment...`);

    const prefix = `[${environment}]`;
    return this.ui.prompt([
      {
        type: 'input',
        name: 'host',
        message: 'What is the domain?',
        default: `${
          environment !== 'production' ? environment + '.' : ''
        }${this.project.name()}.de`,
        prefix,
        validate(host) {
          try {
            new URL(`http://${host}`);
            return true;
          } catch (e) {
            return e.message;
          }
        },
      },
      {
        type: 'input',
        name: 'aws_cfcert',
        message:
          'Enter the ARN for the existing SSL certificate (must be in us-east-1!)',
        prefix,
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
          } catch (e) {
            return e.message;
          }
        },
      },
    ]);
  },

  async _installDependencies() {
    this.ui.writeInfoLine('Installing deployment dependencies...');

    await this.addAddonsToProject({
      packages: [
        { name: 'ember-cli-deploy' },
        { name: 'ember-cli-deploy-build' },
        { name: 'ember-cli-deploy-cloudformation' },
        { name: 'ember-cli-deploy-compress' },
        { name: 'ember-cli-deploy-revision-data' },
        { name: 'ember-cli-deploy-display-revisions' },
        { name: 'ember-cli-deploy-manifest' },
        { name: 'ember-cli-deploy-s3' },
        { name: 'ember-cli-deploy-s3-index' },
      ],
    });
  },

  _modifyPackageJson() {
    const pkgPath = `${this.project.root}/package.json`;

    let pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf-8'));
    pkg.scripts.deploy = 'ember deploy';

    fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + '\n');
    this.ui.writeLine('Modified package.json');
  },
};
