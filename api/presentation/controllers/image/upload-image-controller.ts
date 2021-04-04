import { UploadImage } from '@/domain/usecases/image/upload-image'
import { badRequest } from '@/presentation/helpers/http-helper'
import { Controller } from '@/presentation/interfaces/controller'
import { HttpRequest, HttpResponse } from '@/presentation/interfaces/http'
import { ImageValidator } from '@/presentation/interfaces/image-validator'

export class UploadImageController implements Controller {
  constructor (
    private readonly uploadImage: UploadImage,
    private readonly imageValidator: ImageValidator
    ) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    const { body } = httpRequest
    const isValid = this.imageValidator.isValid(body.image)
    if (!isValid) {
      return badRequest(new Error('Image is no valid'))
    }
    await this.uploadImage.upload(body.image)
    return null
  }
}
