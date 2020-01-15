'use strict';

const fs = require('fs');

module.exports = {
  description: 'A boilerplate for Ember apps, tailored for use in kaliber5',

  normalizeEntityName() {},

  // locals(options) {
  //   // Return custom template variables here.
  //   return {
  //     foo: options.entity.options.foo
  //   };
  // }

  async afterInstall(/* options */) {
    await this.addAddonsToProject({
      packages: [
        {name: 'ember-bootstrap'},
        {name: 'ember-cli-dotenv'},
        {name: 'ember-cli-flash'},
        {name: 'ember-cli-mirage'},
        {name: 'ember-cli-sass'},
        {name: 'ember-cli-typescript'},
        {name: 'ember-cli-typescript-blueprints'},
        {name: 'ember-cli-yadda'},
        {name: 'ember-cli-yadda-opinionated', target: 'kaliber5/ember-cli-yadda-opinionated'},
        {name: 'ember-composable-helpers'},
        {name: 'ember-concurrency'},
        {name: 'ember-concurrency-decorators'},
        {name: 'ember-concurrency-test-waiter'},
        {name: 'ember-css-modules'},
        {name: 'ember-css-modules-sass'},
        {name: 'ember-intl'},
        {name: 'ember-math-helpers'},
        {name: 'ember-svg-jar'},
        {name: 'ember-truth-helpers'},
        {name: 'ember-window-mock'},
      ]
    });

    await this.addPackagesToProject([
      {name: '@types/chai'},
      {name: '@types/chai-as-promised'},
      {name: '@types/chai-dom'},
      {name: '@types/ember'},
      {name: '@types/ember-data'},
      {name: '@types/ember-qunit'},
      {name: '@types/ember-test-helpers'},
      {name: '@types/ember-testing-helpers'},
      {name: '@types/ember__test-helpers'},
      {name: '@types/faker'},
      {name: '@types/lodash'},
      {name: '@types/qunit'},
      {name: '@types/rsvp'},
      {name: '@types/sinon'},
      {name: '@types/sinon-chai'},
      {name: '@typescript-eslint/eslint-plugin'},
      {name: '@typescript-eslint/parser'},
      {name: 'bootstrap'},
      {name: 'chai'},
      {name: 'chai-as-promised'},
      {name: 'chai-dom'},
      {name: 'cross-env'},
      {name: 'eslint'},
      {name: 'eslint-config-prettier'},
      {name: 'eslint-config-standard'},
      {name: 'eslint-import-resolver-typescript'},
      {name: 'eslint-plugin-import'},
      {name: 'eslint-plugin-json'},
      {name: 'eslint-plugin-prettier'},
      {name: 'eslint-plugin-promise'},
      {name: 'eslint-plugin-standard'},
      {name: 'faker'},
      {name: 'husky'},
      {name: 'lint-staged'},
      {name: 'lodash'},
      {name: 'prettier'},
      {name: 'sass'},
      {name: 'sinon'},
      {name: 'sinon-chai'},
      {name: 'typescript'},
      {name: 'yadda'},
    ]);

    await this.removePackagesFromProject([
      {name: 'ember-welcome-page'},
    ]);

    this._modifyPackageJson();
    await this._modifyRouter();
    this._removeFiles();
  },

  // https://github.com/typed-ember/ember-cli-typescript/blob/v3.1.2/ts/blueprints/ember-cli-typescript/index.js#L188-L216
  _modifyPackageJson() {
    const pkgPath = `${this.project.root}/package.json`;

    let pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf-8'));

    pkg.volta = {
      node: '12.14.1',
      yarn: '1.21.1',
    };

    pkg.scripts['lint:hbs'] = 'ember-template-lint .';
    pkg.scripts['lint:ts'] = 'tsc --noEmit';
    pkg.scripts['lint:eslint'] = 'eslint . --ext .js,.ts';
    pkg.scripts['lint:js'] = 'yarn lint:ts && yarn lint:eslint';
    pkg.scripts['lint'] = 'yarn lint:js && yarn lint:hbs';
    pkg.scripts['lint-staged'] = 'lint-staged';
    pkg.scripts['start'] = 'ember serve';
    pkg.scripts['test'] = 'ember test';
    pkg.scripts['test:ci'] = 'mkdir -p test-results && ember test > test-results/ember.xml --silent -r xunit';
    pkg.scripts['dev-prod'] = 'cross-env DOTENV=dev-self ember s --proxy http://api.blutimes-prod.kaliber5.de';
    pkg.scripts['dev-staging'] = 'cross-env DOTENV=dev-self ember s --proxy http://api.blutimes-staging.kaliber5.d';

    pkg.husky = {
      hooks: {
        'pre-commit': 'lint-staged',
      },
    };

    fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + '\n');
    this.ui.writeLine('Modified package.json');
  },


  async _modifyRouter() {
    const route = "  this.route('not-found', { path: '/*wildcard' });";

    await this.insertIntoFile('app/router.js', route, {
      after: 'Router.map(function() {\n'
    });

    this.ui.writeLine('Added not-found route to app/router.js');
  },

  _removeFiles() {
    [
      ['.eslintrc.js', '.eslintrc.yml'],
      ['app/styles/app.css', 'app.scss'],
      ['tests/acceptance/steps/steps.js', 'steps.ts'],
    ].forEach(([filename, replacement]) => {
      const fullName = `${this.project.root}/${filename}`;

      if (fs.existsSyn(fullName)) {
        fs.unlinkSync();

        let message = `Removed ${filename}`;

        if (replacement) {
          message = `${message} (substituted with ${replacement})`;
        }

        this.ui.writeLine(message);
      }
    });
  },


};