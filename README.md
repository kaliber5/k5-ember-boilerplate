k5-ember-boilerplate
==============================================================================

A boilerplate for Ember apps, tailored for use in kaliber5



Usage
------------------------------------------------------------------------------

0. Get fresh versions of Node and Yarn installed on your machine.

    Ideally, use [Volta](https://volta.sh/).

1. Create a new Ember app:

    ```
    npm cache clean --force
    npx ember-cli new <app-name> --yarn
    ```

2. Configure our private npm registry.

    Put this into `.yarnrc`:

    ```
    "@kaliber5:registry" "https://npm.kaliber5.de"
    ```

3. Install the addon:

    ```
    cd <app-name>
    ember i @kaliber5/k5-ember-boilerplate
    ```

4. The addon will apply code changes, producing a number of conflicts. Resolve them one by one by answering Yes in the terminal, **until it starts installing dependencies**. Keep an eye for that.

5. As it's installing dependencies, it will apply code changes from blueprints of installed addons. **Reject them one by one**.

6. Run `yarn lint:eslint --fix`, then fix any remaining errors by hand.

    You are encouraged to create a PR to this repo, so that you don't have to fix them by hand again.

7. Commit changes.

    Don't forget to `git add -A`.



Things not covered by this addon
------------------------------------------------------------------------------

1. Install Volta on your machine: https://volta.sh/

    Then lock Node && Yarn versions in `package.json`:

    ```js
    "volta": {
      "node": "12.10.0",
      "yarn": "1.17.3"
    }
    ```

    Exact version numbers should match the ones used by your CI.

2. Set up scripts and git hooks:

    ```js
    "scripts": {
      "build": "ember build",
      "lint:hbs": "ember-template-lint .",
      "lint:ts": "tsc --noEmit",
      "lint:eslint": "eslint . --ext .js,.ts",
      "lint:js": "yarn lint:ts && yarn lint:eslint",
      "lint": "yarn lint:js && yarn lint:hbs",
      "lint-staged": "lint-staged",
      "start": "ember serve",
      "test": "ember test",
      "test:ci": "mkdir -p test-results && ember test > test-results/ember.xml --silent -r xunit",
      "dev-prod": "cross-env DOTENV=dev-self ember s --proxy http://api.blutimes-prod.kaliber5.de",
      "dev-staging": "cross-env DOTENV=dev-self ember s --proxy http://api.blutimes-staging.kaliber5.de"
    },
    "husky": {
      "hooks": {
        "pre-commit": "lint-staged"
      }
    },
    ```



Contributing
------------------------------------------------------------------------------

See the [Contributing](CONTRIBUTING.md) guide for details.



License
------------------------------------------------------------------------------

This project is licensed under the [MIT License](LICENSE.md).
