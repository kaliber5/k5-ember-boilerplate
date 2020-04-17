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


Deployment
------------------------------------------------------------------------------

To setup your deployment configuration, depending on the hosting type you can run additional 
optional generators:

### Deployment on server using SSH 

This is for a deployment setup based on a classic on-premise LAMP server. It assumes a staging and production
environment, and also supports preview deployments for Pull Requests.

```bash
ember g k5:deployment:ssh
```

This will set up `ember-cli-deploy` and a deployment Github workflow. You will need the following information
at hand:
* domain
* SSH username
* SSH server
* SSH server path
* API host

#### Follow-up steps

##### Set up DNS

If not done already, setup the DNS records for your production and staging domains. Also set up the wildcard subdomains
(e.g. `*.staging.example.com`) for PR previews, as a `CNAME` record of your normal staging domain. 

##### Set up domains on server

If not done already, setup the virtual hosts on your Apache server. The staging and production domains should point to the
`current` symlink (`serverpath/current` where `severpath` is the path entered when running the generator). 
Also set up a wildcard (`*`) subdomain, but this one should not point to `current` but its parent directory
(so the `serverpath` above).

##### Set up SSH keys

```bash
ssh-keygen -t rsa -b 4096 -m pem -f deploy_key        # generate SSH key
ssh-copy-id -i ./deploy_key.pub user@your.server.com  # copy public key to server 
```

##### Set up PR preview rewrite rules

Copy the generated `MOVE_TO_SERVER.htaccess` as `.htaccess` to your server, where the releases are deployed to (`serverpath`).
E.g. like this:

```bash
scp -i ./deploy_key ./MOVE_TO_SERVER.htaccess user@your.server.com:/var/www/user/htdocs/frontend/.htaccess
```

Afterwards delete the file form your project.

##### Set up Github secrets

Then copy the contents of the `deploy_key` file (your secret key) and use this to
create the `DEPLOY_SSH_KEY_STAGING` and `DEPLOY_SSH_KEY_PRODUCTION` secrets in the Github repo.

Afterwards delete both key files, as they allow anybody direct access to the server. From now on only Github Actions
will be responsible for deployments. 

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


Contributing
------------------------------------------------------------------------------

See the [Contributing](CONTRIBUTING.md) guide for details.



License
------------------------------------------------------------------------------

This project is licensed under the [MIT License](LICENSE.md).
