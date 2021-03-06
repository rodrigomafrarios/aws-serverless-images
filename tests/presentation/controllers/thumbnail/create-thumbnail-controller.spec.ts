import { 
  CreateThumbnailController
} from '@/presentation/controllers/thumbnail/create-thumbnail-controller'
import {
  created,
  serverError
} from '@/presentation/helpers/http-helper'
import {
  mockCreateThumbnail,
  mockHttpRequest,
  mockS3PutEvent,
  mockValidatorStub
} from '@/tests/presentation/mocks/thumbnail/create-thumbnail-mock'
import { CreateThumbnail } from '@/domain/usecases/thumbnail/create-thumbnail'

type SutTypes = {
  sut: CreateThumbnailController
  createThumbnail: CreateThumbnail
}

const makeSut = (): SutTypes => {
  const thumbnailValidator = mockValidatorStub()
  const createThumbnail = mockCreateThumbnail()
  const sut = new CreateThumbnailController(createThumbnail)
  return {
    sut,
    createThumbnail
  }
}

describe('CreateThumbnailController', () => {

  beforeAll(() => {
    process.env.IMAGE_BUCKET = 'test-upload-image-bucket'
  })

  test('Should call createThumbnail with correct values', async () => {
    const { sut, createThumbnail } = makeSut()

    const createThumbnailSpy = jest.spyOn(createThumbnail, 'create')
    await sut.handle(mockHttpRequest())

    const { body } = mockHttpRequest()
    const bucket = body.Records[0].s3.bucket.name
    const key = body.Records[0].s3.object.key

    expect(createThumbnailSpy).toHaveBeenCalledWith({
      Bucket: bucket,
      Key: key
    })
  })

  test('Should return 500 if createThumbnail throws', async () => {
    const { sut, createThumbnail } = makeSut()

    jest.spyOn(createThumbnail, 'create').mockRejectedValueOnce(new Error())
    const httpResponse = await sut.handle(mockHttpRequest())

    expect(httpResponse).toEqual(serverError(new Error()))
  })

  test('Should return 201 on success', async () => {
    const { sut } = makeSut()
    const httpResponse = await sut.handle(mockHttpRequest())
    expect(httpResponse).toEqual(created())
  })
})
