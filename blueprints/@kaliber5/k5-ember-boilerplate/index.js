'use strict';

const fs = require('fs');
const EmberRouterGenerator = require('ember-router-generator');

module.exports = {
  description: 'A boilerplate for Ember apps, tailored for use in kaliber5',

  normalizeEntityName() {},

  // locals(options) {
  //   // Return custom template variables here.
  //   return {
  //     foo: options.entity.options.foo
  //   };
  // }

  async beforeInstall(options, locals) {
    await this._customize(locals);
  },

  async afterInstall(/* options */) {
    await this.addAddonsToProject({
      packages: [
        { name: '@embroider/macros' },
        { name: 'ember-bootstrap' },
        { name: 'ember-cli-dotenv' },
        { name: 'ember-cli-favicon' },
        { name: 'ember-cli-flash' },
        { name: 'ember-cli-mirage' },
        { name: 'ember-cli-sass' },
        { name: 'ember-cli-typescript' },
        { name: 'ember-cli-yadda' },
        {
          name: 'ember-cli-yadda-opinionated',
          target: 'kaliber5/ember-cli-yadda-opinionated',
        },
        { name: 'ember-composable-helpers' },
        { name: 'ember-concurrency' },
        { name: 'ember-concurrency-decorators' },
        { name: 'ember-concurrency-async' },
        { name: 'ember-concurrency-ts' },
        { name: 'ember-concurrency-test-waiter' },
        { name: 'ember-css-modules', target: '~1.3.0-beta.1' },
        { name: 'ember-css-modules-sass' },
        { name: 'ember-intl' },
        { name: 'ember-loading' },
        { name: 'ember-math-helpers' },
        { name: 'ember-svg-jar' },
        { name: 'ember-truth-helpers' },
        { name: 'ember-window-mock' },
        { name: '@ember/test-waiters' },
      ],
    });

    await this.addPackagesToProject([
      { name: '@types/chai' },
      { name: '@types/chai-as-promised' },
      { name: '@types/chai-dom' },
      { name: '@types/ember' },
      { name: '@types/ember-data' },
      { name: '@types/ember-data__adapter' },
      { name: '@types/ember-data__model' },
      { name: '@types/ember-data__serializer' },
      { name: '@types/ember-data__store' },
      { name: '@types/ember-qunit' },
      { name: '@types/ember-resolver' },
      { name: '@types/ember-test-helpers' },
      { name: '@types/ember-testing-helpers' },
      { name: '@types/ember__test-helpers' },
      { name: '@types/faker' },
      { name: '@types/lodash' },
      { name: '@types/qunit' },
      { name: '@types/rsvp' },
      { name: '@types/sinon' },
      { name: '@types/sinon-chai' },
      { name: '@types/yadda' },
      { name: '@typescript-eslint/eslint-plugin' },
      { name: '@typescript-eslint/parser' },
      { name: 'chai' },
      { name: 'chai-as-promised' },
      { name: 'chai-dom' },
      { name: 'cross-env' },
      { name: 'eslint' },
      { name: 'eslint-config-prettier' },
      { name: 'eslint-config-standard' },
      { name: 'eslint-import-resolver-typescript' },
      { name: 'eslint-plugin-import' },
      { name: 'eslint-plugin-json' },
      { name: 'eslint-plugin-prettier' },
      { name: 'eslint-plugin-promise' },
      { name: 'eslint-plugin-standard' },
      { name: 'faker' },
      { name: 'husky' },
      { name: 'lint-staged' },
      { name: 'lodash' },
      { name: 'prettier' },
      { name: 'sass' },
      { name: 'sinon' },
      { name: 'sinon-chai' },
      { name: 'typescript' },
      { name: 'yadda' },
    ]);

    await this.removePackagesFromProject([{ name: 'ember-welcome-page' }]);

    this._modifyPackageJson();
    await this._modifyRouter();
    this._removeFiles();
  },

  // https://github.com/typed-ember/ember-cli-typescript/blob/v3.1.2/ts/blueprints/ember-cli-typescript/index.js#L188-L216
  _modifyPackageJson() {
    const pkgPath = `${this.project.root}/package.json`;

    let pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf-8'));

    pkg.volta = {
      node: '12.18.2',
      yarn: '1.22.4',
    };

    pkg.scripts['lint:ts'] = 'tsc --noEmit';
    pkg.scripts['lint-staged'] = 'lint-staged';

    // re-enable when we have a way to set the correct API URLs here
    // see https://github.com/kaliber5/k5-ember-boilerplate/issues/120
    // pkg.scripts['dev-prod'] = 'cross-env DOTENV=dev-self ember s --proxy http://api.blutimes-prod.kaliber5.de';
    // pkg.scripts['dev-staging'] = 'cross-env DOTENV=dev-self ember s --proxy http://api.blutimes-staging.kaliber5.d';

    pkg.husky = {
      hooks: {
        'pre-commit': 'lint-staged',
      },
    };

    fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + '\n');
    this.ui.writeLine('Modified package.json');
  },

  async _modifyRouter() {
    const routerPath = 'app/router.js';
    const source = fs.readFileSync(routerPath, 'utf-8');
    const routes = new EmberRouterGenerator(source);
    const newRoutes = routes.add('not-found', { path: '/*wildcard' });

    fs.writeFileSync(routerPath, newRoutes.code());

    this.ui.writeLine('Added not-found route to app/router.js');
  },

  _removeFiles() {
    [
      ['app/styles/app.css', 'app.scss'],
      ['app/templates/application.hbs', 'app/pods/application/template.hbs'],
      ['tests/acceptance/steps/steps.js', 'steps.ts'],
      ['.travis.yml'],
      ['tests/integration/steps/steps.js'],
      ['tests/unit/steps/steps.js'],
    ].forEach(([filename, replacement]) => {
      const fullName = `${this.project.root}/${filename}`;

      if (fs.existsSync(fullName)) {
        fs.unlinkSync(fullName);

        let message = `Removed ${filename}`;

        if (replacement) {
          message = `${message} (substituted with ${replacement})`;
        }

        this.ui.writeLine(message);
      }
    });
  },

  async _customize(locals) {
    const answers = await this._queryMetaData();
    Object.assign(locals, answers);
  },

  async _queryMetaData() {
    this.ui.writeInfoLine(`Please answer the following questions...`);

    return this.ui.prompt(
      [
        {
          type: 'input',
          name: 'appName',
          message: 'What is the app\'s full name?',
        },
        {
          type: 'input',
          name: 'appShortName',
          message: 'What is the app\'s short name?',
          default(answers) {
            return answers.appName;
          },
        },
        {
          type: 'input',
          name: 'description',
          message: 'What is the app\'s description?',
        },
        {
          type: 'input',
          name: 'lang',
          message: 'What is the primary language?',
          default: 'de-DE',
        },
      ]
    );
  },


};
