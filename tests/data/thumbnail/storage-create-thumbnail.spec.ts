import { CreateThumbnail } from '@/domain/usecases/thumbnail/create-thumbnail'
import {
  StorageCreateThumbnail
} from '@/data/usecases/thumbnail/storage-create-thumbnail'
import { 
  GetObjectOutput,
  GetObjectRequest
} from 'aws-sdk/clients/s3'
import { AWSError } from 'aws-sdk'
import { 
  LoadImageRepository 
} from '@/data/interfaces/storage/image/load-image-repository'
import { S3ThumbnailParams } from '@/domain/models/thumbnail'
import MockDate from 'mockdate'

type SutTypes = {
  sut: CreateThumbnail
  loadImageRepository: LoadImageRepository
}

const mockLoadImageRepository = (): LoadImageRepository => {
  class LoadImageRepositoryStub implements LoadImageRepository {
    loadByKey (params: GetObjectRequest): Promise<GetObjectOutput | AWSError> {
      return null
    }
  }
  return new LoadImageRepositoryStub()
}

const makeSut = (): SutTypes => {
  const loadImageRepository = mockLoadImageRepository()
  const sut = new StorageCreateThumbnail(loadImageRepository)
  return {
    sut,
    loadImageRepository
  }
}

const mockCreateThumbnailParams = (): S3ThumbnailParams => {
  const fileName = `thumbnail-${new Date().getTime()}`
  return {
    Bucket: 'test-upload-image-bucket',
    Key: fileName
  }
}

describe('StorageCreateThumbnail - Usecase', () => {
  
  beforeAll(() => {
    MockDate.set(new Date())
  })
  
  afterAll(() => {
    MockDate.reset()
  })

  test('Should call LoadImageRepository with correct values', async () => {
    const { sut, loadImageRepository } = makeSut()
    const loadImageSpy = jest.spyOn(loadImageRepository, 'loadByKey')
    await sut.create(mockCreateThumbnailParams())
    expect(loadImageSpy).toHaveBeenCalledWith(mockCreateThumbnailParams())
  })
})
