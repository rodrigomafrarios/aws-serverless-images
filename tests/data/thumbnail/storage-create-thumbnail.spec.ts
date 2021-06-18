import { CreateThumbnail } from '@/domain/usecases/thumbnail/create-thumbnail'
import {
  StorageCreateThumbnail
} from '@/data/usecases/thumbnail/storage-create-thumbnail'
import { 
  GetObjectOutput,
  GetObjectRequest,
  PutObjectOutput,
  PutObjectRequest
} from 'aws-sdk/clients/s3'
import { 
  LoadImageRepository 
} from '@/data/interfaces/storage/image/load-image-repository'
import { S3ThumbnailParams } from '@/domain/models/thumbnail'
import MockDate from 'mockdate'
import { FormatImage } from '@/data/interfaces/format'
import { 
  CreateThumbnailRepository 
} from '@/data/interfaces/storage/thumbnail/create-thumbnail-repository'
import { AWSError } from 'aws-sdk'
import { S3ImageParams } from '@/domain/models/image'

type SutTypes = {
  sut: CreateThumbnail
  loadImageRepositoryStub: LoadImageRepository
  createThumbnailRepositoryStub: CreateThumbnailRepository
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

const mockCreateThumbnailRepositoryStub = (): CreateThumbnailRepository => {
  class CreateThumbnailRepositoryStub implements CreateThumbnailRepository {
    create (params: PutObjectRequest): Promise<PutObjectOutput | AWSError> {
      return null
    }
  }
  return new CreateThumbnailRepositoryStub()
}

const mockFormatImageAdapter = () => {
  class FormatImageStub implements FormatImage {
    createThumbnail (base64: string): Promise<string> {
      return Promise.resolve('any-base-64')
    }
  }

  return new FormatImageStub()
}

const mockS3ThumbnailParams = (): S3ImageParams => ({
  Bucket: process.env.THUMBNAIL_BUCKET,
  Key: `thumbnail-${new Date().getTime()}.png`,
  ContentType: 'image/png',
  ContentEncoding: 'base64',
  Body: 'any-base-64'
})

const makeSut = (): SutTypes => {
  const loadImageRepositoryStub = mockLoadImageRepository()
  const createThumbnailRepositoryStub = mockCreateThumbnailRepositoryStub()
  const formatImageStub = mockFormatImageAdapter()
  const sut = new StorageCreateThumbnail(loadImageRepositoryStub, formatImageStub, createThumbnailRepositoryStub)
  return {
    sut,
    loadImageRepositoryStub,
    createThumbnailRepositoryStub,
    formatImageStub
  }
}

describe('StorageCreateThumbnail - Usecase', () => {
  
  beforeAll(() => {
    process.env.THUMBNAIL_BUCKET = 'test-thumbnails'
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

  test('Should throw if LoadImageRepository throws', async () => {
    const { sut, loadImageRepositoryStub } = makeSut()
    jest.spyOn(loadImageRepositoryStub, 'loadByKey')
    .mockImplementationOnce(() => {
      throw new Error()
    })
    const promise = sut.create(mockCreateThumbnailParams())
    await expect(promise).rejects.toThrow()
  })

  test('Should call FormatImage with base64 string', async () => {
    const { sut, formatImageStub } = makeSut()
    const formatImageSpy = jest.spyOn(formatImageStub, 'createThumbnail')
    await sut.create(mockCreateThumbnailParams())
    const { Body } = mockLoadByKeyResponse()
    const base64 = Body.toString('base64')
    expect(formatImageSpy).toHaveBeenCalledWith(base64)
  })

  test('Should throw if FormatImage throws', async () => {
    const { sut, formatImageStub } = makeSut()
    jest.spyOn(formatImageStub, 'createThumbnail')
    .mockImplementationOnce(() => {
      throw new Error()
    })
    const promise = sut.create(mockCreateThumbnailParams())
    await expect(promise).rejects.toThrow()
  })

  test('Should call CreateThumbnailRepository with correct values', async () => {
    const { sut, createThumbnailRepositoryStub } = makeSut()
    const createThumbnailSpy = jest.spyOn(createThumbnailRepositoryStub, 'create')
    await sut.create(mockCreateThumbnailParams())
    expect(createThumbnailSpy).toHaveBeenCalledWith(mockS3ThumbnailParams())
  })

  test('Should throw if CreateThumbnailRepository throws', async () => {
    const { sut, createThumbnailRepositoryStub } = makeSut()
    jest.spyOn(createThumbnailRepositoryStub, 'create').mockImplementationOnce(() => {
      throw new Error()
    })
    const promise = sut.create(mockCreateThumbnailParams())
    await expect(promise).rejects.toThrow()
  })
})
