'use strict';

const EmberApp = require('ember-cli/lib/broccoli/ember-app');
const fingerprintExtensions = require('broccoli-asset-rev/lib/default-options').extensions;

module.exports = function (defaults) {
  const app = new EmberApp(defaults, {
    'ember-bootstrap': {
      bootstrapVersion: 4,
      importBootstrapFont: false,
      importBootstrapCSS: false,
      whitelist: ['bs-alert', 'bs-button', 'bs-modal'],
    },

    'ember-composable-helpers': {
      only: [],
    },

    'ember-math-helpers': {
      only: [],
    },

    cssModules: {
      extension: 'module.scss',
      intermediateOutputPath: 'app/styles/_modules.scss',
    },

    fingerprint: {
      extensions: fingerprintExtensions.concat(['svg']),
      fingerprintAssetMap: true,
      generateAssetMap: true,
      prepend: '/',
    },

    svgJar: {
      strategy: 'inline',
      sourceDirs: ['public/assets/icons'],
      optimizer: {
        plugins: [
          {
            inlineStyles: {
              onlyMatchedOnce: false, // this is needed to inline all styles, and remove the error prone <style>
            },
          },
          {
            convertColors: {
              currentColor: true, // convert colors to currentColor. Remove if not wanted, e.g. multicolor icons
            },
          },
        ],
      },
    },

    'ember-cli-favicon': {
      faviconsConfig: {
        appName: '<%= appName %>',
        appShortName: '<%= appShortName %>',
        appDescription: '<%= description %>',
        developerName: 'kaliber5 GmbH',
        developerURL: 'https://www.kaliber5.de',
        lang: '<%= lang %>',
        background: '#fff', // Background colour for flattened icons. `string`
        theme_color: '#fff', // Theme color user for example in Android's task switcher. `string`
      },
    },
  });

  // Use `app.import` to add additional libraries to the generated
  // output files.
  //
  // If you need to use different assets in different
  // environments, specify an object as the first parameter. That
  // object's keys should be the environment name and the values
  // should be the asset to use in that environment.
  //
  // If the library that you are including contains AMD or ES6
  // modules that you would like to import into your application
  // please specify an object with the list of modules as keys
  // along with the exports of each module as its value.

  return app.toTree();
};
