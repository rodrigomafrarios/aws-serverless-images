import 'source-map-support/register'
import type { ValidatedEventAPIGatewayProxyEvent } from '@/libs/apiGateway'
import { middyfy } from '@/libs/lambda'
import schema from '@/main/lambdas/upload-image/schema'
import { imageAdapt } from '@/main/adapters/image-adapter'
import { lambdaAdapt } from '@/main/adapters/lambda-adapter'
import { makeUploadImageController } from '@/main/factories/controllers/image/upload-image-controller-factory'

const uploadImage: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (event) => {
  const controller = makeUploadImageController()
  const httpRequest = imageAdapt(event.body.file)
  const httpResponse = lambdaAdapt(controller)(httpRequest)
  return httpResponse
}

export const main = middyfy(uploadImage)
