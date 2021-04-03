import { UploadImage } from "@/domain/usecases/image/upload-image"
import { S3 } from "aws-sdk"
import { UploadImageController } from "@/presentation/controllers/image/upload-image-controller"

type SutTypes = {
  sut: UploadImageController,
  uploadImageStub: UploadImage
}

const uploadImageMock = (): UploadImage => {
  class UploadImageStub implements UploadImage {
    async upload (params: S3.PutObjectRequest): Promise<any> {
      return null
    }
  }
  return new UploadImageStub()
}

const makeSut = (): SutTypes => {
  const uploadImageStub = uploadImageMock()
  const sut = new UploadImageController(uploadImageStub)
  return {
    sut,
    uploadImageStub
  }
}

describe('Controller - UploadImage', () => {
  test('Should call UploadImage with correct values', async () => {
    const { sut, uploadImageStub } = makeSut()
    const image = {
      path: './tests/presentation/mocks/image.png'
    }
    const uploadImageSpy = jest.spyOn(uploadImageStub, 'upload')
    await sut.handle(image)
    expect(uploadImageSpy).toHaveBeenCalledWith(image)
  })
})
