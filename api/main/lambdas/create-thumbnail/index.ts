/* eslint-disable no-template-curly-in-string */
import { handlerPath } from '@/libs/handlerResolver'

export default {
  handler: `${handlerPath(__dirname)}/main.handler`,
  role: '${ssm:${self:custom.stage}-create-thumbnail-iam-role}',
  environment: {
    THUMBNAIL_BUCKET: '${ssm:${self:custom.stage}-create-thumbnail-bucket}'
  },
  events: [{
    s3: {
      bucket: '${ssm:${self:custom.stage}-upload-image-bucket}',
      event: 's3:ObjectCreated:Put',
      existing: true
    }
  }]
}
