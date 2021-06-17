import { badRequest } from '@/presentation/helpers/http-helper'
import { Controller, HttpRequest, HttpResponse } from '@/presentation/interfaces'
import { ThumbnailValidator } from '@/presentation/interfaces/thumbnail-validator'

export class CreateThumbnailController implements Controller {
  constructor (private readonly thumbnailValidator: ThumbnailValidator) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    const { body } = httpRequest

    const bucket = body.Records[0].s3.bucket.name
    const key = body.Records[0].s3.object.key
    
    const isValid = await this.thumbnailValidator.isValid(bucket, key)
    if (!isValid) {
      return badRequest(new Error('Error on validation'))
    }
    return null
  }
}
