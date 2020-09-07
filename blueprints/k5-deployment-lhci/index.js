'use strict';

module.exports = {
  description: '',

  normalizeEntityName() {},

  async afterInstall(/* options */) {
    this.ui.writeInfoLine(
      'LHCI has been set up. See the docs for next steps: https://github.com/kaliber5/k5-ember-boilerplate/blob/master/README.md#running-lighthouse-performance-audit-after-deployment'
    );
  },

};
