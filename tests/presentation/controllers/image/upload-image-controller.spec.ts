import { S3ImageParams } from '@/domain/models/image'
import { UploadImage } from '@/domain/usecases/image/upload-image'
import { UploadImageController } from '@/presentation/controllers/image/upload-image-controller'
import { badRequest } from '@/presentation/helpers/http-helper'
import { ImageValidator } from '@/presentation/interfaces/image-validator'

type SutTypes = {
  sut: UploadImageController
  imageValidatorStub: ImageValidator
  uploadImageStub: UploadImage
}

const fileValidatorMock = () => {
  class FileValidatorStub implements ImageValidator {
    isValid (image: any): boolean {
      return true
    }
  }
  return new FileValidatorStub()
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
  const imageValidatorStub = fileValidatorMock()
  const sut = new UploadImageController(uploadImageStub, imageValidatorStub)
  return {
    sut,
    imageValidatorStub,
    uploadImageStub
  }
}

describe('Controller - UploadImage', () => {
  test('Should call Validation with correct value', async () => {
    const { sut, imageValidatorStub } = makeSut()
    const { body } = httpRequestMock()
    const imageValidatorSpy = jest.spyOn(imageValidatorStub, 'isValid')
    await sut.handle(httpRequestMock())
    expect(imageValidatorSpy).toHaveBeenCalledWith(body.image)
  })

  test('Should return 400 if validation fails', async () => {
    const { sut, imageValidatorStub } = makeSut()
    jest.spyOn(imageValidatorStub, 'isValid').mockImplementationOnce(() => {
      return false
    })
    const httpResponse = await sut.handle(httpRequestMock())
    expect(httpResponse).toEqual(badRequest(new Error('Image is no valid')))
  })

  test('Should call UploadImage with correct values', async () => {
    const { sut, uploadImageStub } = makeSut()
    const { body } = httpRequestMock()
    const uploadImageSpy = jest.spyOn(uploadImageStub, 'upload')
    await sut.handle(httpRequestMock())
    expect(uploadImageSpy).toHaveBeenCalledWith(body.image)
  })
})
