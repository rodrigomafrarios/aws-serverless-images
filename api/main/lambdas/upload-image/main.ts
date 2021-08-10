import 'module-alias/register'
import 'source-map-support/register'
import type { ValidatedEventAPIGatewayProxyEvent } from '@/libs/apiGateway'
import { middyfy } from '@/libs/lambda'
import schema from '../../lambdas/upload-image/schema'
import { imageAdapt } from '../../adapters/image-adapter'
import { lambdaAdapt } from '../../adapters/lambda-adapter'
import { makeUploadImageController } from '../../factories/controllers/image/upload-image-controller-factory'

const uploadImage: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (event) => {
  const controller = makeUploadImageController()
  const httpRequest = imageAdapt(event.body.file)
  const httpResponse = lambdaAdapt(controller)(httpRequest)
  return httpResponse
}

export const handler = middyfy(uploadImage)
