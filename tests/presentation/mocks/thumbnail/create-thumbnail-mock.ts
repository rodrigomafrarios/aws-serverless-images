import { S3ThumbnailParams } from '@/domain/models/thumbnail'
import { CreateThumbnail } from '@/domain/usecases/thumbnail/create-thumbnail'
import { HttpRequest } from '@/presentation/interfaces/http'
import { ThumbnailValidator } from '@/presentation/interfaces/thumbnail-validator'
import { S3CreateEvent } from 'aws-lambda'

export const mockS3PutEvent = (): S3CreateEvent => {
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

export const mockHttpRequest = (): HttpRequest => {
  return {
    body: mockS3PutEvent()
  }
}

export const mockValidatorStub = (): ThumbnailValidator => {
  class ThumbnailValidatorStub implements ThumbnailValidator {
    async isValid (bucket: string, key: string): Promise<boolean> {
      return Promise.resolve(true)
    }
  }
  return new ThumbnailValidatorStub()
}

export const mockCreateThumbnail = (): CreateThumbnail => {
  class CreateThumbnailStub implements CreateThumbnail {
    async create (s3ThumbnailParams: S3ThumbnailParams): Promise<void> {
      return null
    }
  }
  return new CreateThumbnailStub()
}
