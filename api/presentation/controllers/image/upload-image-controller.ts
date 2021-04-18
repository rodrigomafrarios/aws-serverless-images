import { UploadImage } from '@/domain/usecases/image/upload-image'
import { badRequest, noContent, serverError } from '@/presentation/helpers/http-helper'
import { Controller } from '@/presentation/interfaces/controller'
import { HttpRequest, HttpResponse } from '@/presentation/interfaces/http'
import { ImageValidator } from '@/presentation/interfaces/image-validator'

export class UploadImageController implements Controller {
  constructor (
    private readonly uploadImage: UploadImage,
    private readonly imageValidator: ImageValidator
    ) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const { body } = httpRequest
      const { image } = body
      const isValid = await this.imageValidator.isValid(image.Body)
      if (!isValid) {
        return badRequest(new Error('Image is not valid'))
      }
      await this.uploadImage.upload(image)
      return noContent()
    } catch (error) {
      return serverError(error)
    }
  }
}
