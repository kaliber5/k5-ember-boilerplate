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
    "@kaliber5:registry" "https://npm.pkg.github.com"
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



Working with styles
------------------------------------------------------------------------------

This boilerplate uses [ember-css-modules](https://github.com/salsify/ember-css-modules) restricted to a compound file extension `.module.scss`.

This is because otherwise `ember-css-modules` treats all `.scss` files as modules, making it impossible to work with Sass partials in a conventional way. If you keep using partials wihtout resolving the problem, you will end up with duplicate CSS, likely without even realizing it.

This is the expected file structure of your app's components and pages:

```
app/
    components/
        my-component.hbs
        my-component.module.scss
        my-component.ts
        
    pods/
        my-route/
            controller.ts
            route.ts
            styles.module.scss
            template.hbs
```



Deployment
------------------------------------------------------------------------------

To setup your deployment configuration, depending on the hosting type you can run additional 
optional generators:



### Deployment on server using AWS CloudFront/S3

This is a deployment setup pushing assets to S3, with CloudFront CDN in front, using CloudFormation for provisioning
of the infrastructure. It assumes a staging and production environment, and also supports preview deployments for 
Pull Requests.

```bash
ember g k5-deployment-aws
```

This will set up `ember-cli-deploy` and a deployment Github workflow. You will need the following information
at hand for every deployment environment:
* domain
* ARN for the SSL certificate
* API host

Note: the SSL certificate must have been created prior to this, and it must be on the `us-east-1` region to be usable 
for CloudFront. You can use a single certificate for all environments, with all the required (wildcard) domains added, 
e.g. `example.com`, `*.example.com`, `*.staging.example.com` and `*.preview.example.com`.



#### Follow-up steps

##### Set up Github secrets

Add the secrets `AWS_ACCESS_KEY_ID` and `AWS_SECRET_ACCESS_KEY` with the AWS access key generated for a suitable
deployment user created in the IAM service on the AWS console, with enough privileges to create all the resources
defined in the CloudFormation template. 



##### Set up CNAME records

After initial deployment for any of the three environments, so after the CLoudFront distribution has been created by 
CloudFormation, a DNS `CNAME` record must be created to point the domain to the CloudFront URL. This assumes the domain
is *not* hosted on AWS (Route 53), otherwise the creation of these records could also be automated using the CloudFront
template, by defining an additional resource like this.

```yaml
  Route53Record:
    Type: 'AWS::Route53::RecordSetGroup'
    Properties:
      HostedZoneId: !Ref HostedZoneId # inject this as a parameter, or replace with a static value
      RecordSets:
      - Name: !Join ['.', ['*', !Ref DomainName]]
        Type: A
        AliasTarget:
          # Magic AWS number:  For CloudFront, use Z2FDTNDATAQYW2.
          HostedZoneId: Z2FDTNDATAQYW2
          DNSName: !GetAtt 'AssetsCDN.DomainName'
```



### Deployment on server using SSH 

This is for a deployment setup based on a classic on-premise LAMP server. It assumes a staging and production
environment, and also supports preview deployments for Pull Requests.

```bash
ember g k5-deployment-ssh
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
(e.g. `*.preview.example.com`) for PR previews, as a `CNAME` record of your normal staging domain. 



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

Copy the public key to all server environments (production, staging).

##### Set up PR preview rewrite rules

Copy the generated `MOVE_TO_SERVER.htaccess` as `.htaccess` to your server, where the releases are deployed to (`serverpath`).
E.g. like this:

```bash
scp -i ./deploy_key ./MOVE_TO_SERVER.htaccess user@your.server.com:/var/www/user/htdocs/frontend/.htaccess
```

Afterwards delete the file form your project.



##### Set up Github secrets

Then copy the contents of the `deploy_key` file (your secret key) and use this to
create the `DEPLOY_SSH_KEY` secrets in the Github repo.

Afterwards delete both key files, as they allow anybody direct access to the server. From now on only Github Actions
will be responsible for deployments. 



### Running Lighthouse performance audit after deployment

> Note: this requires a running deployment setup using Github `deployment` events

Run Lighthouse CI after each successful deployment, and uploads results to https://lhci.kaliber5.de.

```bash
ember g k5-deployment-lhci
```



#### Follow-up steps

#### Create a new project on the Lighthouse Server

```bash
npx @lhci/cli wizard --basicAuth.username kaliber5 --basicAuth.password <password>
```

Enter the data in the interactive CLI session as required. Save the tokens. 



##### Set up Github secrets

Add the build token you received from the previous command as a `LHCI_SERVER_TOKEN` secret to the Github repository.



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
