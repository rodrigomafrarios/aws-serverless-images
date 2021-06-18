import { handlerPath } from '@/libs/handlerResolver'

export default {
  handler: `${handlerPath(__dirname)}/main.handler`,
  events: [{
    s3: {
      bucket: "${ssm:${self:custom.stage}-upload-image-bucket}",
      event: "s3:ObjectCreated:Put",
      existing: true
    }
  }]
}
