/* eslint-disable no-template-curly-in-string */
import schema from '../../lambdas/upload-image/schema'
import { handlerPath } from '@/libs/handlerResolver'

export default {
  role: '${ssm:${self:custom.stage}-upload-image-iam-role}',
  environment: {
    IMAGE_BUCKET: '${ssm:${self:custom.stage}-upload-image-bucket}'
  },
  handler: `${handlerPath(__dirname)}/main.handler`,
  events: [
    {
      http: {
        method: 'post',
        path: 'image/create',
        authorizer: {
          arn: '${ssm:${self:custom.stage}-authorizer-arn}'
        },
        request: {
          schema: {
            'application/json': schema
          }
        }
      }
    }
  ]
}
