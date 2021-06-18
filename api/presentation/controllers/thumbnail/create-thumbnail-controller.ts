import { CreateThumbnail } from '@/domain/usecases/thumbnail/create-thumbnail'
import { created, serverError } from '@/presentation/helpers/http-helper'
import { Controller, HttpRequest, HttpResponse } from '@/presentation/interfaces'

export class CreateThumbnailController implements Controller {
  constructor (
    private readonly createThumbnail: CreateThumbnail
  ) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const { body } = httpRequest

      const bucket = body.Records[0].s3.bucket.name
      const key = body.Records[0].s3.object.key
      
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
