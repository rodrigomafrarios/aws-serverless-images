import { Controller, HttpRequest, HttpResponse } from '@/presentation/interfaces'
import { ThumbnailValidator } from '@/presentation/interfaces/thumbnail-validator'

export class CreateThumbnailController implements Controller {
  constructor (private readonly thumbnailValidator: ThumbnailValidator) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    const { body } = httpRequest
    
    this.thumbnailValidator.isValid(body.Records[0].s3.bucket.name, body.Records[0].s3.object.key)
    return null
  }
}
