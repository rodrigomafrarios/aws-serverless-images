import S3 from 'aws-sdk/clients/s3'
import * as AWS from 'aws-sdk'
import * as AWSMock from 'aws-sdk-mock'
import fs from 'fs'
import path from 'path'
import { ImageS3Repository } from '@/infra/storage/s3/image-s3-repository'
import { S3ClientFactory } from '@/infra/aws/aws-config-factory'

type SutTypes = {
  sut: ImageS3Repository
  client: S3
}

const s3ParamsMock = (): S3.Types.PutObjectRequest => ({
  Body: Buffer.from(fs.readFileSync(path.resolve(__dirname + '../../../../presentation/mocks/image.png'))),
  Bucket: 'any-bucket',
  Key: 'any-image.png'
})

const makeSut = (): SutTypes => {
  const client = S3ClientFactory({
    apiVersion: '2006-03-01',
    Bucket: 'any-Bucket'
  })
  const sut = new ImageS3Repository(client)
  return {
    sut,
    client
  }
}

AWSMock.setSDKInstance(AWS)

describe('Image S3 Repository', () => {
  beforeEach(() => {
    AWSMock.restore('S3')
  })
  describe('upload()', () => {
    test('Should call S3 PutObject with correct values', async () => {
      const { sut, client } = makeSut()
      const clientSpy = jest.spyOn(client, 'putObject')
      await sut.upload(s3ParamsMock())
      expect(clientSpy).toHaveBeenCalledWith(s3ParamsMock())
    })
  })
})
