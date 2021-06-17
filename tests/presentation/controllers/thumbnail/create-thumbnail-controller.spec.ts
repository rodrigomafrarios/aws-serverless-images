import { 
  CreateThumbnailController
} from '@/presentation/controllers/thumbnail/create-thumbnail-controller'
import {
  ThumbnailValidator
} from '@/presentation/interfaces/thumbnail-validator'
import { badRequest } from '@/presentation/helpers/http-helper'
import {
  mockCreateThumbnail,
  mockHttpRequest,
  mockS3PutEvent,
  mockValidatorStub
} from '@/tests/presentation/mocks/thumbnail/create-thumbnail-mock'
import { CreateThumbnail } from '@/domain/usecases/thumbnail/create-thumbnail'

type SutTypes = {
  sut: CreateThumbnailController
  thumbnailValidator: ThumbnailValidator
  createThumbnail: CreateThumbnail
}

const makeSut = (): SutTypes => {
  const thumbnailValidator = mockValidatorStub()
  const createThumbnail = mockCreateThumbnail()
  const sut = new CreateThumbnailController(thumbnailValidator, createThumbnail)
  return {
    sut,
    thumbnailValidator,
    createThumbnail
  }
}

describe('CreateThumbnailController', () => {

  beforeAll(() => {
    process.env.IMAGE_BUCKET = 'test-upload-image-bucket'
  })

  test('Should call Validation with correct values', async () => {
    const { sut, thumbnailValidator } = makeSut()
    const thumbnailValidatorSpy = jest.spyOn(thumbnailValidator, 'isValid')
    await sut.handle(mockHttpRequest())

    const { Records } = mockS3PutEvent()
    const bucket = Records[0].s3.bucket.name
    const key = Records[0].s3.object.key

    expect(thumbnailValidatorSpy).toHaveBeenCalledWith(bucket, key)
  })

  test('Should return 400 if validation fails', async () => {
    const { sut, thumbnailValidator } = makeSut()
    jest.spyOn(thumbnailValidator, 'isValid').mockResolvedValueOnce(false)
    const httpResponse = await sut.handle(mockHttpRequest())

    expect(httpResponse).toEqual(badRequest(new Error('Error on validation')))
  })

  test('Should call createThumbnail with correct values', async () => {
    const { sut, createThumbnail } = makeSut()

    const createThumbnailSpy = jest.spyOn(createThumbnail, 'create')
    await sut.handle(mockHttpRequest())

    const { Records } = mockS3PutEvent()
    const bucket = Records[0].s3.bucket.name
    const key = Records[0].s3.object.key

    expect(createThumbnailSpy).toHaveBeenCalledWith({
      Bucket: bucket,
      Key: key
    })
  })
})
