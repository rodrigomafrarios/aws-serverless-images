import * as S3 from 'aws-sdk/clients/s3'
import * as AWS from 'aws-sdk'
import * as AWSMock from 'aws-sdk-mock'
import { ImageS3Repository } from '@/infra/storage/s3/image-s3-repository'
import { S3ClientFactory } from '@/infra/aws/aws-config-factory'
import MockDate from 'mockdate'

type SutTypes = {
  sut: ImageS3Repository
  client: S3
}

const s3ParamsMock = (): S3.Types.PutObjectRequest => ({
  Body: 'any-buffer',
  Bucket: 'any-bucket',
  Key: 'any-image.png',
  ContentType: 'image/png',
  ContentEncoding: 'base64'
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
  beforeAll(async () => {
    MockDate.set(new Date())
  })
  afterAll(async () => {
    MockDate.reset()
  })
  beforeEach(() => {
    AWSMock.restore('S3')
  })
  describe('upload()', () => {
    test('Should call S3 PutObject with correct values', async () => {
      try {
        const { sut, client } = makeSut()
        const clientSpy = jest.spyOn(client, 'putObject')
        await sut.upload(s3ParamsMock())
        expect(clientSpy).toHaveBeenCalledWith(s3ParamsMock())
      } catch (error) {
        console.log(error)
      }
    })

    test('Should throw if S3 PutObject throws', async () => {
      const { sut, client } = makeSut()
      jest.spyOn(client, 'putObject').mockImplementationOnce(() => {
        throw new Error()
      })
      const promise = sut.upload({
        Body: '',
        Bucket: '',
        Key: ''
      })

      await expect(promise).rejects.toThrow()
    })
  })

  describe('loadByKey()', () => {
    test('Should call getObject with correct values', async () => {
      try {
        const { sut, client } = makeSut()
        const clientSpy = jest.spyOn(client, 'getObject')
        const { Key, Bucket } = s3ParamsMock()
        await sut.loadByKey({
          Bucket,
          Key
        })
        expect(clientSpy).toHaveBeenCalledWith({
          Bucket,
          Key
        })
      } catch (error) {
        console.log(error)
      }
    })
  })
})
