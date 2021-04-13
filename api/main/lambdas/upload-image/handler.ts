import { makeUploadImageController } from '@/main/factories/controllers/image/upload-image-controller-factory'
import 'source-map-support/register'

import type { ValidatedEventAPIGatewayProxyEvent } from '@/libs/apiGateway'
import { formatJSONResponse } from '@/libs/apiGateway'
import { middyfy } from '@/libs/lambda'

import schema from '@/main/lambdas/schema'

const uploadImage: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (event) => {
  makeUploadImageController()
  return formatJSONResponse({
    message: 'Hello, welcome to the exciting Serverless world!',
    event
  })
}

export const main = middyfy(uploadImage)
