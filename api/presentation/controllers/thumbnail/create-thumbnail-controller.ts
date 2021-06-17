import { CreateThumbnail } from '@/domain/usecases/thumbnail/create-thumbnail'
import { badRequest, created, serverError } from '@/presentation/helpers/http-helper'
import { Controller, HttpRequest, HttpResponse } from '@/presentation/interfaces'
import { ThumbnailValidator } from '@/presentation/interfaces/thumbnail-validator'

export class CreateThumbnailController implements Controller {
  constructor (
    private readonly thumbnailValidator: ThumbnailValidator,
    private readonly createThumbnail: CreateThumbnail
  ) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const { body } = httpRequest

      const bucket = body.Records[0].s3.bucket.name
      const key = body.Records[0].s3.object.key
      
      const isValid = await this.thumbnailValidator.isValid(bucket, key)
      if (!isValid) {
        return badRequest(new Error('Error on validation'))
      }
  
      await this.createThumbnail.create({
        Bucket: bucket,
        Key: key
      })

      return created()
    } catch (error) {
      return serverError(error)
    }
  }
}
