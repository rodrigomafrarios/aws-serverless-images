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
import { FormatImage } from '@/data/interfaces/format'

type SutTypes = {
  sut: CreateThumbnail
  loadImageRepositoryStub: LoadImageRepository
  formatImageStub: FormatImage
}

const mockCreateThumbnailParams = (): S3ThumbnailParams => {
  const fileName = `thumbnail-${new Date().getTime()}`
  return {
    Bucket: 'test-upload-image-bucket',
    Key: fileName
  }
}

const mockLoadByKeyResponse = (): GetObjectOutput => {
  return {
    Body: 'any-buffer'
  }
}

const mockLoadImageRepository = (): LoadImageRepository => {
  class LoadImageRepositoryStub implements LoadImageRepository {
    async loadByKey (params: GetObjectRequest): Promise<GetObjectOutput> {
      return Promise.resolve(mockLoadByKeyResponse())
    }
  }
  return new LoadImageRepositoryStub()
}

const mockFormatImageAdapter = () => {
  class FormatImageStub implements FormatImage {
    createThumbnail (base64: string): Promise<string> {
      return Promise.resolve('any-base-64')
    }
  }

  return new FormatImageStub()
}

const makeSut = (): SutTypes => {
  const loadImageRepositoryStub = mockLoadImageRepository()
  const formatImageStub = mockFormatImageAdapter()
  const sut = new StorageCreateThumbnail(loadImageRepositoryStub, formatImageStub)
  return {
    sut,
    loadImageRepositoryStub,
    formatImageStub
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
    const { sut, loadImageRepositoryStub } = makeSut()
    const loadImageSpy = jest.spyOn(loadImageRepositoryStub, 'loadByKey')
    await sut.create(mockCreateThumbnailParams())
    expect(loadImageSpy).toHaveBeenCalledWith(mockCreateThumbnailParams())
  })

  test('Should call FormatImage with base64 string', async () => {
    const { sut, formatImageStub } = makeSut()
    const formatImageSpy = jest.spyOn(formatImageStub, 'createThumbnail')
    await sut.create(mockCreateThumbnailParams())
    const { Body } = mockLoadByKeyResponse()
    const base64 = Body.toString('base64')
    expect(formatImageSpy).toHaveBeenCalledWith(base64)
  })
})
