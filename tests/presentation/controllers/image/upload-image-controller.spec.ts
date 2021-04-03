import { S3ImageParams } from '@/domain/models/image'
import { UploadImage } from '@/domain/usecases/image/upload-image'
import { UploadImageController } from '@/presentation/controllers/image/upload-image-controller'

type SutTypes = {
  sut: UploadImageController,
  uploadImageStub: UploadImage
}

const uploadImageMock = (): UploadImage => {
  class UploadImageStub implements UploadImage {
    async upload (params: S3ImageParams): Promise<any> {
      return null
    }
  }
  return new UploadImageStub()
}

const httpRequestMock = () => ({
  body: {
    image: {
      bucket: 'test-images',
      key: './tests/presentation/mocks/image.png',
      body: 'content'
    }
  }
})

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
    const { body } = httpRequestMock()
    const uploadImageSpy = jest.spyOn(uploadImageStub, 'upload')
    await sut.handle(httpRequestMock())
    expect(uploadImageSpy).toHaveBeenCalledWith(body.image)
  })
})
