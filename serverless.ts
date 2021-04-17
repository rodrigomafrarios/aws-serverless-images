import type { AWS } from '@serverless/typescript'

import { uploadImage } from '@/main/lambdas'

const serverlessConfiguration: AWS = {
  service: 's3-thumbnail-generator',
  frameworkVersion: '2',
  custom: {
    webpack: {
      webpackConfig: './webpack.config.js',
      includeModules: true
    }
  },
  plugins: ['serverless-plugin-typescript', 'serverless-offline'],
  provider: {
    name: 'aws',
    runtime: 'nodejs14.x',
    profile: 'dev',
    apiGateway: {
      minimumCompressionSize: 1024,
      shouldStartNameWithService: true
    },
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
      IMAGE_BUCKET: 'uploaded-images-dev'
    },
    lambdaHashingVersion: '20201221'
  },
  // import the function via paths
  functions: { uploadImage }
}

module.exports = serverlessConfiguration
