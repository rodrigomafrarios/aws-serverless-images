import { UploadImage } from "@/domain/usecases/image/upload-image";

export class UploadImageController{
  constructor (private readonly uploadImage: UploadImage) {}

  async handle (image: any): Promise<any> {
    await this.uploadImage.upload(image)
    return null
  }
}
