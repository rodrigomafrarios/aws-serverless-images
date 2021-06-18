import { 
  UploadImageRepository 
} from "@/data/interfaces/storage/image/upload-image-repository"
import { AWSError } from "aws-sdk"
import { PutObjectOutput } from "aws-sdk/clients/s3"

export const mockUploadImageRepositoryStub = (): UploadImageRepository => {
  class UploadImageRepositoryStub implements UploadImageRepository {
    async upload (image: any): Promise<PutObjectOutput | AWSError> {
      return null
    }
  }
  return new UploadImageRepositoryStub()
}
