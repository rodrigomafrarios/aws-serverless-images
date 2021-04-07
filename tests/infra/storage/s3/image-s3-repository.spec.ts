import * as AWS from 'aws-sdk'
import S3 from 'aws-sdk/clients/s3'
import fs from 'fs'
import path from 'path'
import { ImageS3Repository } from '@/infra/storage/s3/image-s3-repository'
import { S3Service } from '@/services/s3'

type SutTypes = {
  sut: ImageS3Repository
  storageServiceStub: S3Service
}

const s3ParamsMock = (): S3.Types.PutObjectRequest => ({
  Body: Buffer.from(fs.readFileSync(path.resolve(__dirname + '../../../../presentation/mocks/image.png'))),
  Bucket: 'any-bucket',
  Key: 'any-image.png'
})

const s3ClientFactory = (config: S3.Types.ClientConfiguration) => {
  return new AWS.S3(config)
}

const s3ServiceStub = (): S3Service => {
  class S3ServiceStub implements S3Service {
    async put (s3Params: S3.Types.PutObjectRequest): Promise<any> {
      const client = s3ClientFactory({ apiVersion: '2012-08-10' })
      const results = await client.putObject(s3ParamsMock())
      return results
    }
  }
  return new S3ServiceStub()
}

const makeSut = (): SutTypes => {
  const storageServiceStub = s3ServiceStub()
  const sut = new ImageS3Repository(storageServiceStub)
  return {
    sut,
    storageServiceStub
  }
}

describe('Image S3 Repository', () => {
  describe('upload()', () => {
    test('Should call S3Service with correct values', async () => {
      const { sut, storageServiceStub } = makeSut()
      const storageServiceSpy = jest.spyOn(storageServiceStub, 'put')
      await sut.upload(s3ParamsMock())
      expect(storageServiceSpy).toHaveBeenCalledWith(s3ParamsMock())
    })
  })
})
