import { makeUploadImageController } from '@/main/factories/controllers/image/upload-image-controller-factory'
import 'source-map-support/register'

import type { ValidatedEventAPIGatewayProxyEvent } from '@/libs/apiGateway'
import { middyfy } from '@/libs/lambda'
import schema from '@/main/lambdas/upload-image/schema'
import { imageAdapt } from '@/main/adapters/image-adapter'
import { lambdaAdapt } from '@/main/adapters/lambda-adapter'

const uploadImage: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (event) => {
  const controller = makeUploadImageController()
  const { buffer, type, fileName } = imageAdapt(event.body.file)
  const httpResponse = lambdaAdapt(controller)({
    image: {
      Bucket: process.env.IMAGE_BUCKET,
      Key: `${fileName}.${type}`,
      ContentType: `image/${type}`,
      ContentEncoding: 'base64',
      Body: buffer
    }
  })

  return httpResponse
}

export const main = middyfy(uploadImage)
