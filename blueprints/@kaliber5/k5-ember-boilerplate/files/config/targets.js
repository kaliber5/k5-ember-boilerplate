'use strict';

const browsers = [
  'last 2 Chrome versions',
  'last 2 Firefox versions',
  'last 2 Safari versions',
  // Intentionally not using `last 2 versions` for iOS, as Safari on iOS is not an "evergreen" browser, in that is
  // coupled to the iOS version, which does ot auto-update, and there is not always an upgrade path. So we cannot assume
  // people can/will update frequently, and dropping support for an older version (by using `last x versions`) could
  // break the app for users unexpectedly (when our `caniuse-lite` dependency is updated and we get new browser data,
  // which makes `last x versions` pick new versions)
  'iOS 13',
];

module.exports = {
  browsers,
};
