/* eslint-env node */
'use strict';

module.exports = function (deployTarget) {
  let ENV = {
    build: {
      environment: 'production',
    },
    pipeline: {
      // This setting runs the ember-cli-deploy activation hooks on every deploy
      // which is necessary in order to run ember-cli-deploy-cloudfront.
      // To disable CloudFront invalidation, remove this setting or change it to `false`.
      // To disable ember-cli-deploy-cloudfront for only a particular environment, add
      // `ENV.pipeline.activateOnDeploy = false` to an environment conditional below.
      activateOnDeploy: deployTarget !== 'preview',
    },
    cloudformation: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      region: process.env.AWS_REGION,
      stackName: `${require('../package.json').name}-${deployTarget}`,
      templateBody: 'file://cfn.yaml',
      capabilities: ['CAPABILITY_IAM'],
      parameters: {
        EnvironmentName: deployTarget,
        DomainName: process.env.CFN_DOMAINNAME,
        CFCertificate: process.env.CFN_CFCERTIFICATE,
      },
    },
    s3: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      bucket(context) {
        return context.cloudformation.outputs.AssetsBucket;
      },
      region: process.env.AWS_REGION,
      filePattern: '**/*.{js,css,png,gif,ico,jpg,map,xml,txt,svg,swf,eot,ttf,woff,woff2,otf,wasm,json}',
    },
    's3-index': {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      bucket(context) {
        return context.cloudformation.outputs.AssetsBucket;
      },
      region: process.env.AWS_REGION,
      filePattern: 'index.html',
    },
    cloudfront: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      distribution(context) {
        return context.cloudformation.outputs.CloudFrontDistribution;
      },
    },
    'revision-data': {
      type: 'git-commit',
    },
  };

  // Note: if you need to build some configuration asynchronously, you can return
  // a promise that resolves with the ENV object instead of returning the
  // ENV object synchronously.
  return ENV;
};
