import type { AWS } from '@serverless/typescript'

import { uploadImage, createThumbnail } from '@/main/lambdas'

const serverlessConfiguration: AWS = {
  service: 's3-thumbnail-generator',
  frameworkVersion: '2',
  plugins: [
    'serverless-plugin-typescript',
    'serverless-offline',
    'serverless-plugin-existing-s3'
  ],
  provider: {
    name: 'aws',
    runtime: 'nodejs14.x',
    profile: 'dev',
    stage: 'dev',
    region: 'us-east-1',
    apiGateway: {
      minimumCompressionSize: 1024,
      shouldStartNameWithService: true
    },
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1'
    },
    lambdaHashingVersion: '20201221'
  },
  custom: {
    stage: "${opt:stage, self:provider.stage}"
  },
  // import the function via paths
  functions: { uploadImage, createThumbnail }
}

module.exports = serverlessConfiguration
