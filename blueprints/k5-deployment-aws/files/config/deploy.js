/* eslint-env node */
'use strict';

module.exports = function (deployTarget) {
  const ENV = {
    build: {
      environment: 'production',
    },
    pipeline: {
      // This setting runs the ember-cli-deploy activation hooks on every deploy
      // which is necessary in order to run ember-cli-deploy-cloudfront.
      // To disable CloudFront invalidation, remove this setting or change it to `false`.
      // To disable ember-cli-deploy-cloudfront for only a particular environment, add
      // `ENV.pipeline.activateOnDeploy = false` to an environment conditional below.
      activateOnDeploy: true,
      disabled: {
        // The preview environment has separate S3 folders (see s3.prefix below) for each deployment, which have their own
        // caching identity. Thus we don't need to invalidate the CloudFront cache.
        cloudfront: deployTarget === 'preview',
      },
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
      prefix(context) {
        return deployTarget === 'preview' ? context.revisionData.revisionKey : '';
      },
      region: process.env.AWS_REGION,
      filePattern: '**/*.{js,css,png,gif,ico,jpg,map,xml,txt,svg,swf,eot,ttf,woff,woff2,otf,wasm,json,html,mp4,webm,ogv}',
    },
    cloudfront: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      distribution(context) {
        return context.cloudformation.outputs.CloudFrontDistribution;
      },
      region: process.env.AWS_REGION,
      // we need to invalidate all files as not all are fingerprinted
      objectPaths: ['/*'],
      // wait for invalidation, to make sure our Lighthouse audits sees the new deployment
      waitForInvalidation: true,
    },
    'revision-data': {
      type: 'git-commit',
    },
    compress: {
      filePattern: '**/*.{html,js,css,json,ico,map,xml,txt,svg,eot,ttf,woff,woff2,appcache,webmanifest}',
    },
  };

  // Note: if you need to build some configuration asynchronously, you can return
  // a promise that resolves with the ENV object instead of returning the
  // ENV object synchronously.
  return ENV;
};
