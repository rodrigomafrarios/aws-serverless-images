import { UploadImage } from '@/domain/usecases/image/upload-image'
import { Controller } from '@/presentation/interfaces/controller'
import { HttpRequest, HttpResponse } from '@/presentation/interfaces/http'

export class UploadImageController implements Controller {
  constructor (private readonly uploadImage: UploadImage) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    const { body } = httpRequest
    await this.uploadImage.upload(body.image)
    return null
  }
}
