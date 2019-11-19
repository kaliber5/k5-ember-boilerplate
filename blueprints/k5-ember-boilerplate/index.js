'use strict';

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
        {name: 'ember-cli-dotenv'},
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
      {name: '@types/ember'},
      {name: '@types/ember-data'},
      {name: '@types/ember-qunit'},
      {name: '@types/ember-test-helpers'},
      {name: '@types/ember-testing-helpers'},
      {name: '@types/ember__test-helpers'},
      {name: '@types/faker'},
      {name: '@types/lodash'},
      {name: '@types/qunit'},
      {name: '@types/qunit-dom'},
      {name: '@types/rsvp'},
      {name: '@types/sinon'},
      {name: '@typescript-eslint/eslint-plugin'},
      {name: '@typescript-eslint/parser'},
      {name: 'bootstrap'},
      {name: 'cross-env'},
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
      {name: 'typescript'},
      {name: 'yadda'},
    ]);

    await this.removePackagesFromProject([
      {name: 'ember-welcome-page'},
    ]);
  }
};
