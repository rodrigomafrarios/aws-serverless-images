import 'module-alias/register'
import 'source-map-support/register'

import { middyfy } from '@/libs/lambda'
import { 
  makeCreateThumbnailController
} from '@/main/factories/controllers/thumbnail/create-thumbnail-controller-factory'
import { lambdaAdapt } from '@/main/adapters/lambda-adapter'
import { S3Event } from 'aws-lambda'

const createThumbnail = async (event: S3Event) => {
  const controller = makeCreateThumbnailController()
  const httpResponse = lambdaAdapt(controller)(event)
  return httpResponse
}

export const handler = middyfy(createThumbnail)
