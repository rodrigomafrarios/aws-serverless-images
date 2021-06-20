import { CreateThumbnail } from '@/domain/usecases/thumbnail/create-thumbnail'
import {
  StorageCreateThumbnail
} from '@/data/usecases/thumbnail/storage-create-thumbnail'
import { 
  GetObjectOutput,
  GetObjectRequest
} from 'aws-sdk/clients/s3'
import { 
  LoadImageRepository 
} from '@/data/interfaces/storage/image/load-image-repository'
import { S3ThumbnailParams } from '@/domain/models/thumbnail'
import MockDate from 'mockdate'
import { FormatImage } from '@/data/interfaces/format'
import { S3ImageParams } from '@/domain/models/image'
import { 
  UploadImageRepository
} from '@/data/interfaces/storage/image/upload-image-repository'
import { mockUploadImageRepositoryStub } from '../mocks/image-mocks'

type SutTypes = {
  sut: CreateThumbnail
  loadImageRepositoryStub: LoadImageRepository
  uploadImageRepositoryStub: UploadImageRepository
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

const mockLoadImageRepositoryStub = (): LoadImageRepository => {
  class LoadImageRepositoryStub implements LoadImageRepository {
    async loadByKey (params: GetObjectRequest): Promise<GetObjectOutput> {
      return Promise.resolve(mockLoadByKeyResponse())
    }
  }
  return new LoadImageRepositoryStub()
}

const mockFormatImageAdapter = () => {
  class FormatImageStub implements FormatImage {
    createThumbnail (base64: string): Promise<Buffer> {
      const buffer = Buffer.from('any-string')
      return Promise.resolve(buffer)
    }
  }

  return new FormatImageStub()
}

const mockS3ThumbnailParams = (): S3ImageParams => ({
  Bucket: process.env.THUMBNAIL_BUCKET,
  Key: `thumbnail-${new Date().getTime()}.jpeg`,
  ContentType: 'image/jpeg',
  ContentEncoding: 'base64',
  Body: Buffer.from('any-string')
})

const makeSut = (): SutTypes => {
  const loadImageRepositoryStub = mockLoadImageRepositoryStub()
  const uploadImageRepositoryStub = mockUploadImageRepositoryStub()
  const formatImageStub = mockFormatImageAdapter()
  const sut = new StorageCreateThumbnail(loadImageRepositoryStub, formatImageStub, uploadImageRepositoryStub)
  return {
    sut,
    loadImageRepositoryStub,
    uploadImageRepositoryStub,
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

  test('Should call UploadImageRepository with correct values', async () => {
    const { sut, uploadImageRepositoryStub } = makeSut()
    const uploadImageSpy = jest.spyOn(uploadImageRepositoryStub, 'upload')
    await sut.create(mockCreateThumbnailParams())
    expect(uploadImageSpy).toHaveBeenCalledWith(mockS3ThumbnailParams())
  })

  test('Should throw if UploadImageRepository throws', async () => {
    const { sut, uploadImageRepositoryStub } = makeSut()
    jest.spyOn(uploadImageRepositoryStub, 'upload').mockImplementationOnce(() => {
      throw new Error()
    })
    const promise = sut.create(mockCreateThumbnailParams())
    await expect(promise).rejects.toThrow()
  })
})
