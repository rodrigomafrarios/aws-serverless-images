import { UploadImage } from '@/domain/usecases/image/upload-image'
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
    this.imageValidator.isValid(body.image)
    await this.uploadImage.upload(body.image)
    return null
  }
}
