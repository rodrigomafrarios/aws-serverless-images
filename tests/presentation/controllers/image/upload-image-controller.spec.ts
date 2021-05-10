import { S3ImageParams } from '@/domain/models/image'
import { UploadImage } from '@/domain/usecases/image/upload-image'
import { UploadImageController } from '@/presentation/controllers/image/upload-image-controller'
import { badRequest, noContent, serverError } from '@/presentation/helpers/http-helper'
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
      return Promise.resolve()
    }
  }
  return new UploadImageStub()
}

const httpRequestMock = () => ({
  body: {
    image: {
      Bucket: 'test-images',
      Key: './tests/presentation/mocks/image.png',
      Body: 'content'
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
    const { image } = body
    const imageValidatorSpy = jest.spyOn(imageValidatorStub, 'isValid')
    await sut.handle(httpRequestMock())
    expect(imageValidatorSpy).toHaveBeenCalledWith(image.Body)
  })

  test('Should return 400 if validation fails', async () => {
    const { sut, imageValidatorStub } = makeSut()
    jest.spyOn(imageValidatorStub, 'isValid').mockImplementationOnce(() => {
      return false
    })
    const httpResponse = await sut.handle(httpRequestMock())
    expect(httpResponse).toEqual(badRequest(new Error('Image is not valid')))
  })

  test('Should call UploadImage with correct values', async () => {
    const { sut, uploadImageStub } = makeSut()
    const { body } = httpRequestMock()
    const uploadImageSpy = jest.spyOn(uploadImageStub, 'upload')
    await sut.handle(httpRequestMock())
    expect(uploadImageSpy).toHaveBeenCalledWith(body.image)
  })

  test('Should return 500 if UploadImage throws', async () => {
    const { sut, uploadImageStub } = makeSut()
    jest.spyOn(uploadImageStub, 'upload').mockImplementationOnce(() => {
      throw new Error()
    })
    const httpResponse = await sut.handle(httpRequestMock())
    expect(httpResponse).toEqual(serverError(new Error()))
  })

  test('Should return 204 on success', async () => {
    const { sut } = makeSut()
    const httpResponse = await sut.handle(httpRequestMock())
    expect(httpResponse).toEqual(noContent())
  })
})
