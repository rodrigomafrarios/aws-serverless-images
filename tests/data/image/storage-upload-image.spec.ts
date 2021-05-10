import { UploadImageRepository } from '@/data/interfaces/storage/image/upload-image-repository'
import { StorageUploadImage } from '@/data/usecases/image/storage-upload-image'
import { S3ImageParams } from '@/domain/models/image'
import { AWSError } from 'aws-sdk'
import { PutObjectOutput } from 'aws-sdk/clients/s3'

type SutTypes = {
  sut: StorageUploadImage
  uploadImageRepositoryStub: UploadImageRepository
}

const mockUploadImageRepository = (): UploadImageRepository => {
  class UploadImageRepositoryStub implements UploadImageRepository {
    async upload (image: any): Promise<PutObjectOutput | AWSError> {
      return null
    }
  }
  return new UploadImageRepositoryStub()
}

const mockS3ImageParams = (): S3ImageParams => ({
  Bucket: process.env.IMAGE_BUCKET,
  Key: 'teste.png',
  ContentType: 'image/png',
  ContentEncoding: 'base64',
  Body: 'buffer'
})

const makeSut = (): SutTypes => {
  const uploadImageRepositoryStub = mockUploadImageRepository()
  const sut = new StorageUploadImage(uploadImageRepositoryStub)
  return {
    sut,
    uploadImageRepositoryStub
  }
}

describe('StorageUploadImage - Usecase', () => {
  test('Should call UploadImageRepository with correct values', async () => {
    const { sut, uploadImageRepositoryStub } = makeSut()
    const uploadImageSpy = jest.spyOn(uploadImageRepositoryStub, 'upload')
    await sut.upload(mockS3ImageParams())
    expect(uploadImageSpy).toHaveBeenCalledWith(mockS3ImageParams())
  })

  test('Should throw if UploadImageRepository throws', async () => {
    const { sut, uploadImageRepositoryStub } = makeSut()
    jest.spyOn(uploadImageRepositoryStub, 'upload').mockImplementationOnce(() => {
      throw new Error()
    })
    const promise = sut.upload(mockS3ImageParams())
    await expect(promise).rejects.toThrow()
  })
})
