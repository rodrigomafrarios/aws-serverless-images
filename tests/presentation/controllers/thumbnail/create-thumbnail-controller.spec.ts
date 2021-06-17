import { S3CreateEvent } from 'aws-lambda'
import { CreateThumbnailController } from '@/presentation/controllers/thumbnail/create-thumbnail-controller'
import { ThumbnailValidator } from '@/presentation/interfaces/thumbnail-validator'
import { HttpRequest } from '@/presentation/interfaces'
import { badRequest } from '@/presentation/helpers/http-helper'

type SutTypes = {
  sut: CreateThumbnailController
  thumbnailValidator: ThumbnailValidator
}

const mockS3PutEvent = (): S3CreateEvent => {
  return {
    Records: [{
        eventVersion: '2.1',
        eventSource: 'aws:s3',
        awsRegion: 'us-east-1',
        eventTime: '2021-06-17T13:08:02.868Z',
        eventName: 'ObjectCreated:Put',
        userIdentity: {
          principalId: 'any-principal-id'
        },
        requestParameters: {
          sourceIPAddress: 'any-source-ip-address'
        },
        responseElements: {
          'x-amz-request-id': 'any-request-id',
          'x-amz-id-2': 'any-id-2'
        },
        s3: {
          s3SchemaVersion: 'any-version',
          configurationId: 'any-configuration-id',
          bucket: {
            name: 'test-upload-image-bucket',
            ownerIdentity: {
              principalId: 'any-principal-id'
            },
            arn: 'any-arn'
          },
          object: {
            key: 'any-file',
            size: 500,
            eTag: 'any-tag',
            sequencer: 'any-sequencer'
          }
        }
      }
    ]
  }
}

const mockHttpRequest = (): HttpRequest => {
  return {
    body: mockS3PutEvent()
  }
}

const mockValidatorStub = (): ThumbnailValidator => {
  class ThumbnailValidatorStub implements ThumbnailValidator {
    async isValid (bucket: string, key: string): Promise<boolean> {
      return Promise.resolve(true)
    }
  }
  return new ThumbnailValidatorStub()
}

const makeSut = (): SutTypes => {
  const thumbnailValidator = mockValidatorStub()
  const sut = new CreateThumbnailController(thumbnailValidator)
  return {
    sut,
    thumbnailValidator
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
})
