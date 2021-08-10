import { StorageCreateThumbnail } from '@/data/usecases/thumbnail/storage-create-thumbnail'
import { CreateThumbnail } from '@/domain/usecases/thumbnail/create-thumbnail'
import { S3ClientFactory } from '@/infra/aws/aws-config-factory'
import { ImageS3Repository } from '@/infra/storage/s3/image-s3-repository'
import { FormatImageAdapter } from '../../../main/adapters/format-image-adapter'

export const makeStorageCreateThumbnail = (): CreateThumbnail => {
  const client = S3ClientFactory({
    apiVersion: '2006-03-01'
  })

  const formatImageAdapter = new FormatImageAdapter()
  const imageS3Repository = new ImageS3Repository(client)
  return new StorageCreateThumbnail(imageS3Repository, formatImageAdapter, imageS3Repository)
}
